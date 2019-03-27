
const http = require('http');
const https = require('https');
const puppeteer = require('puppeteer');

var browser, page;
var urlMatchRegex = /\s(href|accesskey|background|cite|classid|codebase|data|longdesc|profile|src|usemap|itemtype)=("|')([^"']+)/g 

async function  init() {
    browser = await puppeteer.launch(); 
}

init();

exports.scrapLinks = (socketConn) =>{
    var scrapper = new LinkScrapper(socketConn);    
    scrapper.handle();
}


function LinkScrapper(socketConn){
    this.socketConn = socketConn;
    this.protocol = '';
    this.url = '';
    this.completeUrl = '';
    this.domainName = '';
    this.isClosed = false;
    this.scrappedUrls = [];
    this.browserScrappingDone = false;
    this.reqScrappingDone = false;
}

LinkScrapper.prototype.handle = function() {
    var curObj = this
    this.socketConn.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + curObj.socketConn.remoteAddress + ' disconnected.');
        this.isClosed = true;
    });
    this.socketConn.on('message', function(message) {               
        var urlInfo = JSON.parse(message.utf8Data);
        curObj.protocol = urlInfo.protocol;
        curObj.url = urlInfo.url;
        curObj.completeUrl = urlInfo.protocol + '://' + urlInfo.url;
        curObj.domainName = urlInfo.url.match('^[^/]+');
        curObj.scrappedUrls = [];           
        curObj.scrap();
    }, this);
}

LinkScrapper.prototype.sendUrl = function(url){
    if(!this.isClosed && this.scrappedUrls.indexOf(url)<0){
        this.socketConn.sendUTF(url);
        this.scrappedUrls.push(url);
    }
}

LinkScrapper.prototype.scrap = function(){
    this.scrapUrlsFromContent();
    this.scrapOnloadResources();
}

LinkScrapper.prototype.checkAndFinishScrapping = function(){
    if(this.browserScrappingDone && this.reqScrappingDone){
        this.socketConn.close();
    }
}

LinkScrapper.prototype.scrapOnloadResources = async function() {
    if(!browser){
        this.browserScrappingDone = true;
        this.checkAndFinishScrapping();
        return;
    }
    var curObj = this;
    var page = await browser.newPage();
    page.on('request', function(request){
        if(request.url().startsWith('http')){
            curObj.sendUrl(request.url());  
        }
    })
    page.on('domcontentloaded', function(){
        curObj.browserScrappingDone = true;
        curObj.checkAndFinishScrapping();
    })
    var res = await page.goto(this.completeUrl);
    await page.close();
}

LinkScrapper.prototype.scrapUrlsFromContent = function(){
    var curObj = this;
    var requestMod = this.protocol==='http' ? http : https;
    var req = requestMod.get(this.completeUrl, function(res){
        var data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk)=>{
            data += chunk;
        })
        res.on('end', ()=>{
            curObj.parseWebContent(data);
            curObj.reqScrappingDone = true;
            curObj.checkAndFinishScrapping();
        })
    });
    req.on('error', ()=>{
        curObjs.reqScrappingDone = true;
        curObj.checkAndFinishScrapping();
    })
}

LinkScrapper.prototype.parseWebContent = function(content) {
    var curObj = this;
    var protoPrefix = this.protocol + '://';
    content.replace(urlMatchRegex, function(){
        if(arguments.length>3){ 
            var url = arguments[3];
            if(url.startsWith('//')){
                url = curObj.protocol + url;
            }else if(url.startsWith('/')){
                url = protoPrefix + curObj.domainName + url;
            }else if(!url.startsWith('http://') &&!url.startsWith('https://')){
                url = protoPrefix + curObj.domainName + '/' + url;
            }  
            curObj.sendUrl(url);
        }
    });
}