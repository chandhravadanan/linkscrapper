

import React, { Component } from 'react';
import Info from './Info';
import Container from './Scrapper';

class App extends Component{

    render(){
        return (
            <div>
                <Info/>
                <Container/>
            </div>
        )
    }
}

export default App;