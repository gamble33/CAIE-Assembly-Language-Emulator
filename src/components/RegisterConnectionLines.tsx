import React, {useState, useEffect} from "react";
import Xarrow, {Xwrapper} from "react-xarrows";
import {RegisterConnections} from "../constants/RegisterConnections";

const RegisterConnectionLines = () => {

  const [initialState, setInitialState] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setInitialState(true);
    }, 1);
  }, [])

  const renderArrows = () => {
    if (initialState) return (
        <Xwrapper>
          {RegisterConnections.map(connection =>
              <Xarrow
                  start={connection.reg1}
                  end={connection.reg2}
                  headSize={4}
                  tailSize={4}
                  strokeWidth={2}
                  showTail={connection.doubleSided}
                  animateDrawing={true}
                  key={connection.reg1+"-"+connection.reg2}
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
