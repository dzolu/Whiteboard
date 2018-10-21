import * as React from 'react';
import {RefObject} from 'react';
import Toolbox from "../toolbox/Toolbox";
import {IRectangle} from "./IRectangle";
import CanvasHelper from "../../services/CanvasHelper";
import {ICircle} from "./ICircle";
import {ITriangle} from "./ITriangle";
import {
    BRUSH,
    CIRCLE,
    ERASE,
    GRID_PLAIN,
    LINE,
    POINTER,
    RECTANGLE,
    TOOLBAR_HEIGHT,
    TRIANGLE
} from '../toolbox/constants';
import {ILine} from "./ILine";
import "./_whiteboard.scss";


interface IState {
    isDrawing: boolean;
    lastX: number;
    lastY: number;
    direction: boolean;
    controlDisplay: string;
    controlLeft: string;
    customColor: boolean;
    color: string;
    lineWidth: number;
    rectangle: IRectangle;
    circle: ICircle;
    triangle: ITriangle,
    line: ILine,
    currentTool: string,
    currentGrid: string
}

class Whiteboard extends React.Component<{}, IState> {
    canvas: RefObject<HTMLCanvasElement>;
    container: RefObject<HTMLDivElement>;

    constructor(props: {}) {
        super(props);
        this.state = {
            isDrawing: false,
            lastX: 0,
            lastY: 0,
            direction: true,
            controlDisplay: "none",
            controlLeft: "100%",
            customColor: false,
            color: "#000000",
            lineWidth: 10,
            rectangle: {
                hasStartPoint: false,
                startPointY: 0,
                startPointX: 0,
                height: 0,
                width: 0
            },
            circle: {
                hasStartPoint: false,
                startPointY: 0,
                startPointX: 0,
                radius: 0
            },
            triangle: {
                hasStartPoint: false,
                startPointY: 0,
                startPointX: 0,
                height: 0,
                width: 0
            },
            line: {
                hasStartPoint: false,
                startPointY: 0,
                startPointX: 0,
                angel: 0
            },
            currentTool: BRUSH,
            currentGrid: GRID_PLAIN
        };
        this.draw = this.draw.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.canvas = React.createRef();
        this.container = React.createRef();
    }

    ctx = () => {
        return this.canvas.current && this.canvas.current.getContext("2d") || new CanvasRenderingContext2D();
    };

    componentDidMount() {
        const canvas = this.canvas.current;
        document.addEventListener('paste', this.onPaste);
        if (canvas) {
            canvas.width = (this.container.current && this.container.current.clientWidth) || 1000;
            canvas.height = window.innerHeight - TOOLBAR_HEIGHT;
        }


    }

    componentWillMount() {
        document.removeEventListener('paste', this.onPaste);
    }

    draw(e: any) {
        const {isDrawing, currentTool} = this.state;
        if (isDrawing) {
            switch (currentTool) {
                case RECTANGLE:
                    return this.rectangle(e);
                case TRIANGLE:
                    return this.triangle(e);
                case CIRCLE:
                    return this.circle(e);
                case LINE:
                    return this.line(e);
                case BRUSH:
                    return this.drawing(e);
                case POINTER:
                    return;
                case ERASE:
                    return this.erase(e);
                default:
                    this.drawing(e)
            }
        }
    }

    drawing(e: any) {
        const {color, lastX, lastY, lineWidth} = this.state;
        const ctx = this.ctx();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        this.setState({
            lastX: e.nativeEvent.offsetX,
            lastY: e.nativeEvent.offsetY
        });
    }

    erase = (e: any) => {
        const {lineWidth} = this.state;
        const ctx = this.ctx();
        ctx.clearRect(e.nativeEvent.offsetX, e.nativeEvent.offsetY, lineWidth, lineWidth)
    };

    rectangle = (e: any) => {
        const {rectangle, color} = this.state;
        if (!rectangle.hasStartPoint) {
            this.setState((state: IState) => (
                {
                    rectangle: {
                        ...state.rectangle,
                        hasStartPoint: true,
                        startPointX: state.lastX,
                        startPointY: state.lastY
                    }
                }
            ));
            return;
        }
        const ctx = this.ctx();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.fillRect(rectangle.startPointX, rectangle.startPointY, e.nativeEvent.offsetX - rectangle.startPointX, e.nativeEvent.offsetY - rectangle.startPointY);
    };

    circle = (event: any) => {
        const {circle, color} = this.state;
        if (!circle.hasStartPoint) {
            this.setState((state: IState) => (
                {
                    circle: {
                        ...state.circle,
                        hasStartPoint: true,
                        startPointX: state.lastX,
                        startPointY: state.lastY
                    }
                }
            ));
            return;
        }
        const ctx = this.ctx();
        const pointOne = {x: circle.startPointX, y: circle.startPointY};
        const pointTwo = {x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY};
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(circle.startPointX, circle.startPointY, CanvasHelper.DistanseBetweenPoints(pointOne, pointTwo), 0, 2 * Math.PI);
        ctx.fill();
    };

    pickUpColor = (color: string) => {
        this.setState({
            color
        })
    };

    triangle = (e: any) => {
        const {triangle, color} = this.state;
        if (!triangle.hasStartPoint) {
            this.setState((state: IState) => (
                {
                    triangle: {
                        ...state.triangle,
                        hasStartPoint: true,
                        startPointX: state.lastX,
                        startPointY: state.lastY
                    }
                }
            ));
            return;
        }
        const ctx = this.ctx();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(triangle.startPointX, triangle.startPointY); // start at top left corner of canvas
        ctx.lineTo(triangle.startPointX + (e.nativeEvent.offsetX - triangle.startPointX), triangle.startPointY); // go 200px to right (x), straight line from 0 to 0
        ctx.lineTo(triangle.startPointX, triangle.startPointY + (e.nativeEvent.offsetY - triangle.startPointY)); // go to horizontal 100 (x) and vertical 200 (y)
        ctx.fill();
    };

    line = (e: any) => {
        const {line, color} = this.state;
        if (!line.hasStartPoint) {
            this.setState((state: IState) => (
                {
                    line: {
                        ...state.line,
                        hasStartPoint: true,
                        startPointX: state.lastX,
                        startPointY: state.lastY
                    }
                }
            ));
            return;
        }
        const ctx = this.ctx();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(line.startPointX, line.startPointY); // start at top left corner of canvas
        ctx.lineTo((line.startPointX + e.nativeEvent.offsetX - line.startPointX), line.startPointY); // go 200px to right (x), straight line from 0 to 0
        ctx.stroke();
    };

    handleInputChange(event: any) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        // @ts-ignore
        this.setState({
            [name]: value
        });
    }

    onMouseDown = (e: any) => {
        this.setState({
            isDrawing: true,
            lastX: e.nativeEvent.offsetX,
            lastY: e.nativeEvent.offsetY
        })
    };

    stopDrawing = () => {
        this.setState((state: IState) => ({
            isDrawing: false,
            rectangle: {...state.rectangle, hasStartPoint: false},
            circle: {...state.circle, hasStartPoint: false},
            triangle: {...state.triangle, hasStartPoint: false},
            line: {...state.line, hasStartPoint: false}
        }))
    };

    pickUpLineWidth = (width: number) => {
        this.setState({
            lineWidth: width
        })
    };

    pickUpTool = (toolName: string) => {
        this.setState({
            currentTool: toolName
        });
    };

    pickUpGrid = (gridName: string) => {
        this.setState({
            currentGrid: gridName
        })
    };

    onPaste = (e: any) => {
        if (e.clipboardData) {
            const items = e.clipboardData.items;
            if (!items) {
                return
            }
            for (const item of items) {
                if (item.type.indexOf("image") !== -1) {
                    const blob = item.getAsFile();
                    // @ts-ignore
                    const URLObj = window.URL || window.webkitURL;
                    const source = URLObj.createObjectURL(blob);
                    this.createImage(source);
                }
            }
            e.preventDefault();
        }
    };
    createImage = (source: any) => {
        const pastedImage = new Image();
        pastedImage.onload = () => {
            this.ctx().drawImage(pastedImage, 0, 0);
        };
        pastedImage.src = source;
    };

    render() {
        const {currentGrid, currentTool} = this.state;
        return (
            <div className={`whiteboard whiteboard--${currentGrid} whiteboard--${currentTool}`} ref={this.container}>
                <Toolbox
                    pickUpColor={this.pickUpColor}
                    pickUpLineWidth={this.pickUpLineWidth}
                    pickUpTool={this.pickUpTool}
                    pickUpGrid={this.pickUpGrid}
                />
                <canvas
                    onMouseMove={this.draw}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.stopDrawing}
                    onMouseOut={this.stopDrawing}
                    ref={this.canvas}

                />
            </div>
        )
    }
}

export default Whiteboard