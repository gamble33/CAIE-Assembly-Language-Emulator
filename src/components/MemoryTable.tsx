import React, {FC} from "react";
import MemoryCell from "./MemoryCell";

interface Props {
  memoryArr: number[];
  initialMemoryAddr: number;
}

const MemoryTable: FC<Props> = ({memoryArr, initialMemoryAddr}) => {
  return (
      <div className="memory-table">
        {memoryArr.map(
            (value, index) =>
                <MemoryCell
                    key={initialMemoryAddr + index}
                    address={initialMemoryAddr + index}
                    value={value}
                />
        )}
      </div>
  );
};

export default MemoryTable;
