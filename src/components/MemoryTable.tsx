import React, {FC} from "react";
import MemoryCell from "./MemoryCell";
import {initialMemoryAddress} from "../constants/MemoryAddresses";

interface Props {
  memoryArr: number[];
}

const MemoryTable: FC<Props> = ({memoryArr}) => {
  return (
      <div className="memory-table">
        {memoryArr.map(
            (value, index) =>
                <MemoryCell
                    key={initialMemoryAddress + index}
                    address={initialMemoryAddress + index}
                    value={value}
                />
        )}
      </div>
  );
};

export default MemoryTable;
