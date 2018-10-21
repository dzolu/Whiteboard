import * as React from 'react';
import './styles/styles.scss'
import Whiteboard from "./components/whiteboard/Whiteboard";
import {Container} from "reactstrap";


class App extends React.Component<{}> {

    public render() {
        return (
            <Container>
                <Whiteboard/>
            </Container>
        );
    }
}

export default App;
