import React from 'react';
import {EditorBlock, ContentState, ContentBlock} from 'draft-js';

interface Props{
  block: ContentBlock,
  contentState: ContentState
}

const Line: React.FC<Props> = (props) => {
  const blockKey = props.block.getKey();
  const lineNumber = props.contentState.getBlockMap().toArray().findIndex(item => item.getKey() === blockKey) + 1;
  return (
    <div className="line" data-line-number={lineNumber}>
      <div className="line-text">
        <EditorBlock {...props} />
      </div>
    </div>
  );
};

export default Line;
