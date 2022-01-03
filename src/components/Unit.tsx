import React, { FC } from "react";

interface Props{
  name: string
}

const Unit: FC<Props> = (props) => {
  return(
      <div className="unit grow">
        {props.name}
      </div>
  );
};

export default Unit;
