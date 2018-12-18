

import React, { Component } from 'react';
import './../css/styles.css';

class SearchBar extends Component{

    constructor(props){
        super(props);
        this.state = { protocol: 'https://', url:'www.google.com'}
        this.handleProtoChange = this.handleProtoChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.onSubmit = this.props.onSubmit;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleProtoChange(event) {
        this.setState({protocol:event.target.value});
    }

    handleUrlChange(event){
        this.setState({url: event.target.value});
    }

    handleSubmit(){
        this.onSubmit(this.state.protocol, this.state.url);
    }

    render(){
        return(
            <div className="container" /*style={{'margin-top' : '2%'}}*/ >
                <div className="row">
                    <div className="col-md-2 form-control">
                        <select value={this.state.protocol} onChange={this.handleProtoChange}>
                            <option value='https://'>https://</option>
                            <option value='http://'>http://</option>
                        </select>
                    </div>
                    <div className="col-md-8">
                        <input type="text" className="form-control input-lg" 
                                        placeholder="www.google.com" onChange={this.handleUrlChange}/>
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>GO</button>
                    </div>
                </div>
                {}
            </div>
        );
    }
}

export default SearchBar;