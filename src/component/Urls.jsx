
import React from 'react';

export default class Urls extends React.Component{

    iterateAndShowAllUrls(){
        console.log(this.props.urls);
        var allUrls = [];
        var id=0;
        this.props.urls.forEach(function(element) {
             allUrls.push(<div key={id++} className='col-md-12'>{element}</div>)
        }, this);
        return allUrls;
    }

    render(){
        return (
            <div className='row'>
                {this.iterateAndShowAllUrls()}
            </div>
        )
    }
}