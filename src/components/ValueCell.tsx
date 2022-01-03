import React from 'react';

interface Props{
  value: number;
}

const ValueCell: React.FC<Props> = (props) => {
  return (
      <div className="cell">
        {props.value}
      </div>
  );
};

export default ValueCell;
