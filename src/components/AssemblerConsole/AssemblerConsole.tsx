import React from "react";
import "./styles.css";

interface Props {
    outputType: string;
    outputMessage: string;
}

const AssemblerConsole: React.FC<Props> = ({outputType, outputMessage}) => {

    const renderOutput = () => {
        switch (outputType) {
            case "SUCCESS":
                return (
                    <span className="success">Success</span>
                )
            case "NOTASSEMBLED":
                return (
                    <span className="default">Not assembled</span>
                )
            default:
                return (
                    <span>Unknown Result</span>
                )
        }
    }

    return (
        <div style={{color: "#777"}}>Result:{" "}
            {renderOutput()}
        </div>
    );
}

export default AssemblerConsole;