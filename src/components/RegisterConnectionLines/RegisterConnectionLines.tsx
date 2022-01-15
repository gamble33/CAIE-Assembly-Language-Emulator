import React, {useState, useEffect} from "react";
import {Xwrapper} from "react-xarrows";
import {RegisterConnections} from "../../constants/RegisterConnections";
import RegisterConnectionLine from "./RegisterConnectionLine";
import {destructureRtnCell} from "../../assemblyExecution";
import {splitWhitespace} from "../../utils";

const animationLength = 200;

interface Props {
    currentRtn: string;
}

const RegisterConnectionLines: React.FC<Props> = ({currentRtn}) => {

    const [initialState, setInitialState] = useState<boolean>(false);
    const [animated, setAnimated] = useState<Map<string, boolean>>(() => {
        let connectionMap: Map<string, boolean> = new Map();
        RegisterConnections.forEach(connection => connectionMap.set(connection.reg1 + '-' + connection.reg2, false));
        return connectionMap;
    })

    useEffect(() => {
        setTimeout(() => {
            setInitialState(true);
        }, 1);
    }, [])

    useEffect(() => {
        if(!currentRtn) return;
        const rtnParts = splitWhitespace(currentRtn);
        const cell1  = destructureRtnCell(rtnParts[2])[0];
        const cell2 = destructureRtnCell(rtnParts[0])[0];
        animateConnection(cell1+'-'+cell2);
    }, [currentRtn]);

    const updateAnimatedMap = (connectionKey: string, newValue: boolean) =>
        setAnimated(prevState => {
            let newState = new Map();
            animated.forEach((oldValue, key) => newState.set(key, key === connectionKey ? newValue : oldValue));
            return newState;
        })


    const animateConnection = (connectionKey: string) => {
        updateAnimatedMap(connectionKey, true);
        setTimeout(() => updateAnimatedMap(connectionKey, false), animationLength);
    }

    const renderArrows = () => {
        if (initialState) return (
            <Xwrapper>
                {RegisterConnections.map(connection =>
                    <RegisterConnectionLine
                        key={connection.reg1 + '-' + connection.reg2}
                        connection={connection}
                        animated={animated.get(connection.reg1 + '-' + connection.reg2)!}
                    />
                )}
            </Xwrapper>
        );
        else {
            return "";
        }
    }

    return (
        <>
            {renderArrows()}
        </>
    )
}

export default RegisterConnectionLines;
