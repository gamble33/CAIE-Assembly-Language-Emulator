import React, {useEffect, useState} from "react";
import "./styles.css";

interface Props {
    outputType: string;
    outputMessage: string;
    currentRtn: string;
    clearConsole: boolean;
}

const AssemblerConsole: React.FC<Props> = ({outputType, outputMessage, currentRtn, clearConsole}) => {

    const [allRtns, setAllRtns] = useState<Array<string>>([]);
    const [consoleActive, setConsoleActive] = useState<boolean>(false);

    useEffect(() => setAllRtns(prevState => [currentRtn].concat(prevState)), [currentRtn]);
    useEffect(() => {
        if (clearConsole) setAllRtns([]);
    }, [clearConsole]);

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
        <div style={{color: "#777", display: "flex", flexDirection: "column"}}>

            <div style={{display: "flex", flexDirection: "row"}}>Result:{renderOutput()}</div>

            {allRtns ? <button
                style={{width: "30%"}}
                className="button grow"
                onClick={() => setConsoleActive(prevState => !prevState)}
            >Toggle Console Log
            </button>
            : ""}
            {consoleActive &&
            <div className="log">
                {allRtns.map((value, index) => (<div key={index}>{value}</div>))}
            </div>
            }
        </div>
    );
}

export default AssemblerConsole;