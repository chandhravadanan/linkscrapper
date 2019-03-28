
import React, { Component } from 'react';
import SearchBar from './Searchbar';
import Viewer from './Urls';
import { w3cwebsocket } from 'websocket';
import gif from './../images/ajax-loader.gif';

export default class Container extends Component{
    
    constructor(props){
        super(props);
        this.protocol = '';
        this.url = '';
        this.state = {scrappedUrls: []};
        this.onSubmit = this.onSubmit.bind(this);
        this.client = null; //new w3cwebsocket('ws://localhost:4000/linkscrapper', 'echo-protocol')
    }

    handleProtoChange(protocol) {
        this.setState({protocol:protocol});
    }

    handleUrlChange(url){
        this.setState({url: url});
    }

    communicateOverSocket(){
        if(this.client){
            this.client.close();
        }
        console.log('connecting to '+ window.location.hostname);
        this.client = new w3cwebsocket('ws://'+ window.location.hostname +'/linkscrapper', 'echo-protocol');
        this.client.onopen = function() {
            console.log('WebSocket Client Connected');
            if (this.client.readyState === this.client.OPEN) {
                this.client.send(JSON.stringify({protocol : this.protocol, url : this.url}));
            }
        }.bind(this);

        this.client.onclose = function(){
            console.log('socket closed')
            this.setState({loadSymbol : false})

            console.log(this.state);
        }.bind(this);

        this.client.onmessage = function(e) {
            if (typeof e.data === 'string') {
                var scrappedUrls = this.state.scrappedUrls;
                scrappedUrls.push(e.data)
                this.setState({loadSymbol : true, scrappedUrls: scrappedUrls})
            }
        }.bind(this);

    }

    onSubmit(protocol, pathUri){
        this.protocol = protocol;
        this.url = pathUri;
        this.communicateOverSocket();
        
        /*var socket = openSocket('http://localhost:4000')
        socket.emit('scrap-links', protocol, pathUri);
        socket.on('scrapped-links', function(scrappedUrl){
            console.log('recived')
            var scrappedUrls = curObj.state.scrappedUrls ? curObj.state.scrappedUrls : [];
            scrappedUrls.push(scrappedUrl);
            curObj.setState({loadSymbol : false, scrappedUrls:scrappedUrls})
        })
        /*
        axios({
            url: 'https://cors.io?'+this.protocol+this.url,
            method: 'GET'
            })
            .then(response => {
                this.extractUrls(response.data);
            }) 
            .catch(err => {
                console.log(err);
                this.setState({scrappedUrls: [], loadSymbol: false});
            }); 
        */
        this.setState({loadSymbol : true, scrappedUrls:[]});
    }

    checkAndIncludeLoading(){
        if(this.state.loadSymbol){
            return (
                <div className='container text-center mrgtop10per'>
                    <img src={gif} alt='loading...'/>
                </div>
            );
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