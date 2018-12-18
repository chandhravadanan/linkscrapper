
import React, { Component } from 'react';
import SearchBar from './Searchbar';
import Viewer from './Urls';
import axios from 'axios';
import gif from './../images/ajax-loader.gif';

export default class Container extends Component{

    urlMatchRegex = /\s(href|accesskey|background|cite|classid|codebase|data|longdesc|profile|src|usemap|itemtype)=("|')([^"']+)/g
    
    constructor(props){
        super(props);
        this.protocol = '';
        this.url = '';
        this.state = {scrappedUrls: []};
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleProtoChange(protocol) {
        this.setState({protocol:protocol});
    }

    handleUrlChange(url){
        this.setState({url: url});
    }

    onSubmit(protocol, pathUri){
        this.protocol = protocol;
        this.url = pathUri;
        axios({
            url: 'https://cors.io?'+this.protocol+this.url,
            method: 'GET'
            })
            .then(response => {
                this.extractUrls(response.data);
            }) 
            .catch(err => {
                console.log(err);
                this.setState({scrappedUrls: []});
            }); 
        this.setState({loadSymbol : true, scrappedUrls:[]});
    }
    
    extractUrls(data){
        var urlSet = new Set();
        if(data && typeof data==='string'){
            var domainName = this.url.match('^[^/]+');
            var protoPrefix = this.protocol;
            var protocol = protoPrefix.match('^[^/]+');
            console.log(domainName);
            data.replace(this.urlMatchRegex, function(){
                if(arguments.length>3){
                    var url = arguments[3];
                    if(url.startsWith('//')){
                        url = protocol + url;
                    }else if(url.startsWith('/')){
                        url = protoPrefix + domainName + url;
                    }else if(!url.startsWith('http://') &&!url.startsWith('https://')){
                        url = protoPrefix + domainName + '/' + url;
                    }
                    urlSet.add(url);
                }
            });
        }
        this.setState({loadSymbol : false, scrappedUrls : urlSet});
    }

    checkAndIncludeLoading(){
        if(this.state.loadSymbol){
            return <img src={gif} alt='loading...'/>
        }   
    }

    render(){
        return (
            <div className='container'>
                <SearchBar onSubmit={this.onSubmit}/>
                <Viewer urls={this.state.scrappedUrls} />
                {this.checkAndIncludeLoading()}
            </div>
        );
    }
}