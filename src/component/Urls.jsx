
import React from 'react';

export default class Urls extends React.Component{

    iterateAndShowAllUrls(){
        console.log(this.props.urls);
        var allUrls = [];
        var id=1;
        this.props.urls.forEach(function(element) {
             allUrls.push(
             <div key={id} className='col-md-12 padlr0 box'>
                {id}. <a href={element} target='_blank' rel='noopener noreferrer'>{element}</a>
            </div>)
             id++;
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