import React, {FC} from 'react';
import Register from "./Register";
import Unit from "./Unit";
import RegisterObject from "../Types/RegisterType";
import RegisterConnectionLines from "./RegisterConnectionLines/RegisterConnectionLines";

interface Props {
  registers: RegisterObject[];
}

const RegisterContainer: FC<Props> = ({registers}) => {
  return (
      <div className="registers-container">
        {registers.map(
            (register) =>
                <div key={register.name} id={register.name} className={register.name}>
                  <Register
                      registerObj={register}
                  />
                </div>
        )}

        <div id="CU" className="CU"><Unit name="CU"/></div>
        <div id="ALU" className="ALU"><Unit name="ALU"/></div>
      </div>
  );
};

export default RegisterContainer;
