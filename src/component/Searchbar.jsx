

import React, { Component } from 'react';
import './../css/styles.css';

class SearchBar extends Component{

    https = 'https://';
    http= 'http://';

    constructor(props){
        super(props);
        this.state = { protocol: this.https, url:'www.google.com'}
        this.handleProtoChange = this.handleProtoChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.onSubmit = this.props.onSubmit;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleProtoChange(event) {
        this.setState({protocol:event.target.value});
    }

    handleUrlChange(event){
        var text = event.target.value;
        if(text.startsWith(this.https)){
            this.setState({protocol:this.https, url:text.substring(8)})
        }else if(text.startsWith(this.http)){
            this.setState({protocol:this.http, url:text.substring(7)})
        }else{
            this.setState({url:text});
        }
    }

    handleSubmit(){
        this.onSubmit(this.state.protocol, this.state.url);
    }

    render(){
        return(
            <div className="container padlr0">
                <div className="row col-sm-xs col-md-12 col-lg-12 col-sm-12 padlr0 mrglr0 txt-center">
                    <div className="col-sm-2 col-md-2 col-lg-2 col-sm-2 padlr0 padtb10">
                        <select className="select-menu wid-100-per" value={this.state.protocol} onChange={this.handleProtoChange}>
                            <option value={this.https}>{this.https}</option>
                            <option value={this.http}>{this.http}</option>
                        </select>   
                    </div>
                    <div className="col-sm-9 col-md-9 col-lg-9 col-sm-9 padtb10">
                        <input type="text" className="form-control input-lg" value={this.state.url} 
                                onChange={this.handleUrlChange}/>
                    </div>
                    <div className="col-sm-1 col-md-1 col-lg-1 col-sm-1 padtb10 txt-center padlr0">
                        <button type="button" className="wid-100-per btn btn-primary" onClick={this.handleSubmit}>GO</button>
                    </div>
                    
                </div>
               
            </div>
        );
    }
}

export default SearchBar;