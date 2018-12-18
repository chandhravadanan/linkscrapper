
import React from 'react';

export default class Urls extends React.Component{

    iterateAndShowAllUrls(){
        console.log(this.props.urls);
        var allUrls = [];
        var id=0;
        this.props.urls.forEach(function(element) {
             allUrls.push(<div key={id++} className='col-md-12 padlr0 box'><a href={element}>{element}</a></div>)
        }, this);
        return allUrls;
    }

    render(){
        return (
            <div className='container padlr0'>
                {this.iterateAndShowAllUrls()}
            </div>
        )
    }
}