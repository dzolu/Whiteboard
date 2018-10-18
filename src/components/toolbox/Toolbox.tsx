import * as React from 'react';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button} from "reactstrap";
import './_toolbox.scss';
import {
    BLACK,
    BLUE,
    BRUSH,
    CIRCLE,
    ERASE,
    GREEN, GRID_DOTTED, GRID_LINED, GRID_PLAIN, GRID_SQUARE,
    LINE,
    POINTER,
    RECTANGLE,
    RED,
    TRIANGLE,
    WHITE,
    YELLOW
} from './constants';
import {dataAttr} from "../../../helpers";

interface IToolboxProps {
    name?: any;
    pickUpColor: (color: string) => void
    pickUpLineWidth: (width: number) => void,
    pickUpTool: (toolName: string) => void;
    pickUpGrid: (gridName: string) => void;
}

interface IToolboxState {
    dropdownGridOpen: boolean;
    dropdownShapesOpen: boolean;
    dropdownFontOpen: boolean;
    dropdownColorOpen: boolean;
    currentSize: number;
    currentColor: string;
    currentShape: string;
    currentGrid: string;
}

class Toolbox extends React.Component<IToolboxProps, IToolboxState> {
    state = {
        dropdownShapesOpen: false,
        dropdownGridOpen: false,
        dropdownFontOpen: false,
        dropdownColorOpen: false,
        currentSize: 10,
        currentColor: "black",
        currentShape: CIRCLE,
        currentGrid: GRID_PLAIN
    };
    toggleShapes = () => {
        this.setState(state => ({
            dropdownShapesOpen: !state.dropdownShapesOpen
        }))
    };
    toggleGrid = () => {
        this.setState(state => ({
            dropdownGridOpen: !state.dropdownGridOpen
        }))
    };
    toggleFont = () => {
        this.setState(state => ({
                dropdownFontOpen: !state.dropdownFontOpen
            })
        )
    };
    toggleColor = () => {
        this.setState(state => ({
            dropdownColorOpen: !state.dropdownColorOpen
        }))
    };
    pickUpColor = (e: any) => {
        const {pickUpColor} = this.props;
        const color = e.target.attributes["data-color"].textContent;
        const colorName = e.target.attributes["data-color-name"].textContent;
        pickUpColor(color);
        this.setState({
            currentColor: colorName
        })
    };

    pickLineWidth = (e: any) => {
        const {pickUpLineWidth} = this.props;
        const value = Number(dataAttr(e, "width"));
        pickUpLineWidth(value);
        this.setState({
            currentSize: value
        })
    };

    pickUpTool = (e: any) => {
        const {pickUpTool} = this.props;
        const value = dataAttr(e, "tool");
        if (value === RECTANGLE || value === TRIANGLE || value === LINE || value === CIRCLE) {
            this.setState({currentShape: value});
        }
        pickUpTool(value);
    };

    pickUpGrid = (e: any) => {
        const {pickUpGrid} = this.props;
        const value = dataAttr(e, "grid");
        pickUpGrid(value);
    };

    render() {
        const {dropdownShapesOpen, dropdownGridOpen, dropdownFontOpen, dropdownColorOpen, currentSize, currentColor, currentShape, currentGrid} = this.state;

        return (
            <div className="box d-flex align-items-center justify-content-center toolbox">
                <div className="d-flex">
                    <div className="border-right">
                        <Dropdown isOpen={dropdownGridOpen} toggle={this.toggleGrid}>
                            <DropdownToggle
                                style={{width: 60}}
                                className="bg-transparent color--black border-0 d-flex align-items-center justify-content-center"
                                caret={true}>
                                <span className={`icon icon--${currentGrid} d-flex align-items-center`}/>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={this.pickUpGrid}>
                                    <span data-grid={GRID_PLAIN} className="icon icon--plain"/>
                                    <p data-grid={GRID_PLAIN} className="font-size--8">Plain</p>
                                </DropdownItem>
                                <DropdownItem onClick={this.pickUpGrid}>
                                    <span data-grid={GRID_LINED} className="icon icon--lined"/>
                                    <p data-grid={GRID_LINED} className="font-size--8">Lined</p>
                                </DropdownItem>
                                <DropdownItem onClick={this.pickUpGrid}>
                                    <span data-grid={GRID_DOTTED} className="icon icon--dotted"/>
                                    <p data-grid={GRID_DOTTED} className="font-size--8">Dotted</p>
                                </DropdownItem>
                                <DropdownItem onClick={this.pickUpGrid}>
                                    <span data-grid={GRID_SQUARE} className="icon icon--grid"/>
                                    <p data-grid={GRID_SQUARE} className="font-size--8">Grid</p>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="border-right d-flex" style={{height: 29}}>
                        <div className="ml-2 mr-2">
                            <Button color="transparent" data-tool={POINTER} onClick={this.pickUpTool} className="p-0 tool--pointer">
                                <span data-tool={POINTER} className="icon icon--pointer d-flex align-items-center"/>
                            </Button>
                        </div>
                        <div className="ml-2 mr-2">
                            <Button color="transparent" onClick={this.pickUpTool} className="p-0 tool--brush">
                                <span data-tool={BRUSH} className="icon icon--brush"/>
                            </Button>
                        </div>
                        <div className="ml-2 mr-2">
                            <Button color="transparent" onClick={this.pickUpTool} className="p-0">
                                <span data-tool={ERASE} className="icon icon--erase d-flex align-items-center tool--erase"/>
                            </Button>
                        </div>
                        <Dropdown isOpen={dropdownShapesOpen} toggle={this.toggleShapes}>
                            <DropdownToggle
                                style={{width: 58}}
                                className="bg-transparent color--black border-0 d-flex align-items-center justify-content-center"
                                caret={true}>
                                <span className={`shape shape--${currentColor} shape--${currentShape} m-0`}/>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={this.pickUpTool}
                                              className="d-flex align-items-center justify-content-center">
                                    <span data-tool={CIRCLE} className={`shape shape--${currentColor} shape--circle`}/>
                                </DropdownItem>
                                <DropdownItem onClick={this.pickUpTool}
                                              className="d-flex align-items-center justify-content-center">
                                <span data-tool={RECTANGLE}
                                      className={`shape shape--${currentColor} shape--rectangle`}/>
                                </DropdownItem>
                                <DropdownItem onClick={this.pickUpTool}
                                              className="d-flex align-items-center justify-content-center">
                                    <span data-tool={TRIANGLE}
                                          className={`shape shape--${currentColor} shape--triangle`}/>
                                </DropdownItem>
                                <DropdownItem onClick={this.pickUpTool}
                                              className="d-flex align-items-center justify-content-center">
                                    <span data-tool={LINE} className={`shape shape--${currentColor} shape--line`}/>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="d-flex" style={{height: 29}}>
                        <Dropdown isOpen={dropdownFontOpen} toggle={this.toggleFont} className="ml-3">
                            <DropdownToggle style={{width: 60}}
                                            className="bg-transparent text-center color--black border-0 p-0 font-size--15"
                                            caret={true}>
                                <span>T {currentSize}</span>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem data-width={8} onClick={this.pickLineWidth}
                                              className="font-size--12">8px</DropdownItem>
                                <DropdownItem data-width={10} onClick={this.pickLineWidth}
                                              className="font-size--12">10px</DropdownItem>
                                <DropdownItem data-width={12} onClick={this.pickLineWidth}
                                              className="font-size--12">12px</DropdownItem>
                                <DropdownItem data-width={14} onClick={this.pickLineWidth}
                                              className="font-size--12">14px</DropdownItem>
                                <DropdownItem data-width={16} onClick={this.pickLineWidth}
                                              className="font-size--12">16px</DropdownItem>
                                <DropdownItem data-width={18} onClick={this.pickLineWidth}
                                              className="font-size--12">18px</DropdownItem>
                                <DropdownItem data-width={20} onClick={this.pickLineWidth}
                                              className="font-size--12">20px</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown isOpen={dropdownColorOpen} toggle={this.toggleColor} className="ml-3">
                            <DropdownToggle caret={true}
                                            className="justify-content-center d-flex bg-transparent border-0 align-items-center p-0 "
                                            style={{width: 50}}>
                                <p className="color--black bg-transparent m-0 font-size--15">A <span
                                    className={`toolbox__color-line toolbox__color-line--${currentColor} `}/></p>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={this.pickUpColor}>
                                    <span className="btn-color btn-color--black d-block" data-color={BLACK}
                                          data-color-name="black"/>
                                </DropdownItem>
                                <DropdownItem onClick={this.pickUpColor}>
                                    <span className="btn-color btn-color--blue" data-color={BLUE}
                                          data-color-name="blue"/>
                                </DropdownItem>
                                <DropdownItem onClick={this.pickUpColor}>
                                    <span className="btn-color btn-color--red" data-color={RED}
                                          data-color-name="red"/>
                                </DropdownItem>
                                <DropdownItem onClick={this.pickUpColor}>
                                    <span className="btn-color btn-color--yellow" data-color={YELLOW}
                                          data-color-name="yellow"/>
                                </DropdownItem>
                                <DropdownItem onClick={this.pickUpColor}>
                                    <span className="btn-color btn-color--green" data-color={GREEN}
                                          data-color-name="green"/>
                                </DropdownItem>
                                <DropdownItem onClick={this.pickUpColor}>
                                    <span className="btn-color btn-color--white" data-color={WHITE}
                                          data-color-name="white"/>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>

            </div>
        )
    }

}

export default Toolbox;