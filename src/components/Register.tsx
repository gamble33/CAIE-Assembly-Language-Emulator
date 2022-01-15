import React, {FC, useEffect} from 'react';
import ValueCell from "./ValueCell";
import ReactTooltip from "react-tooltip";
import RegisterObject from "../Types/RegisterType";
import '../Registers.css';

interface Props {
  registerObj: RegisterObject;
}

const Register: FC<Props> = (props) => {
  return (
      <div style={{
          minWidth:"4vw",
          maxWidth:"4vw",
      }}>
        <div data-tip data-for={props.registerObj.name + "-register-description"} className="register-box grow">
          <div className="register">
            {props.registerObj.name}
          </div>
          <ValueCell value={props.registerObj.value}/>
        </div>

        <ReactTooltip id={props.registerObj.name + "-register-description"} place="bottom" className="tooltip">
          <span style={{textAlign: 'center'}}><strong>{props.registerObj.fullName}</strong></span>
          <p>{props.registerObj.description}</p>
          <hr className="divider"/>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
          }}>
            <span><strong>Value</strong></span>
            <span>Decimal: {props.registerObj.value}</span>
            <span>Hexadecimal: {props.registerObj.value.toString(16)}</span>
            <span>Binary: {props.registerObj.value.toString(2)}</span>
            <span>Unicode: {String.fromCharCode(props.registerObj.value)}</span>
          </div>
        </ReactTooltip>
      </div>
  )
      ;
};

export default Register;
