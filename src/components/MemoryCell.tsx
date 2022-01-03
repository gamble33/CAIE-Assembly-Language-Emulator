import React, {FC} from "react";
import ValueCell from "./ValueCell";
import ReactTooltip from "react-tooltip";

interface Props {
  address: number;
  value: number;
}

const MemoryCell: FC<Props> = (props) => {
  return (
      <div className="memory-cell">
        <div data-tip data-for={props.address + "-memory-cell-tooltip"} className="grow">
          <div className="memory-address">
            {props.address}
          </div>
          <ValueCell value={props.value}/>


        </div>
        <ReactTooltip id={props.address + "-memory-cell-tooltip"} place="top">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            <span><strong>Address</strong></span>
            <span>Decimal: {props.address}</span>
            <span>Hexadecimal: {props.address.toString(16)}</span>
            <span>Binary: {props.address.toString(2)}</span>
            <hr className="divider"/>
            <span><strong>Value</strong></span>
            <span>Decimal: {props.value}</span>
            <span>Hexadecimal: {props.value.toString(16)}</span>
            <span>Binary: {props.value.toString(2)}</span>
            <span>Unicode: {String.fromCharCode(props.value)}</span>
          </div>
        </ReactTooltip>
      </div>

  )
      ;
};

export default MemoryCell;
