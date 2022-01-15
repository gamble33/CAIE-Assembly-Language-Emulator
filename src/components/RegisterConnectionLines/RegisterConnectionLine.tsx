import React, {useEffect, useState} from "react";
import Xarrow from "react-xarrows";
import {RegisterConnection} from "../../constants/RegisterConnections";
import "./styles.css";

interface Props {
    connection: RegisterConnection
    animated: boolean
}

const RegisterConnectionLine: React.FC<Props> = ({connection, animated}) => {

    return (
        <>
            <div className={animated ? "lineAnimation" : ""}>
                <Xarrow
                    start={connection.reg1}
                    end={connection.reg2}
                    headSize={4}
                    tailSize={4}
                    strokeWidth={2}
                    showTail={connection.doubleSided}
                    animateDrawing={true}
                    // color={animated ? 'red' : 'blue'}
                    key={connection.reg1 + "-" + connection.reg2}
                />
            </div>
        </>
    );
}

export default RegisterConnectionLine;