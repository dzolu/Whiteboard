import * as React from 'react';
import './styles/styles.scss'
import Whiteboard from "./components/whiteboard/Whiteboard";

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">White board </h1>
                </header>
                <Whiteboard fullScreen={true}/>
            </div>
        );
    }
}

export default App;
