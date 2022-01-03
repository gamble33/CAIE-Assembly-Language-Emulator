import React, {useCallback, useState} from 'react';
import Draft, {Editor, EditorState, RichUtils, getDefaultKeyBinding, DraftEditorCommand, ContentBlock} from "draft-js";
import 'draft-js/dist/Draft.css';
import Line from "./Line";

interface Props {
  onTranslate(code: string): void;

  onExecute(): void;

  onStep(): void;

  isCodeAssembled: boolean;
}

const IDE: React.FC<Props> = ({onTranslate, onExecute, onStep, isCodeAssembled}) => {

  const [editorState, setEditorState] = useState(
      () => EditorState.createEmpty(),
  );
  const [allowStep, setAllowStep] = useState<boolean>(false);

  const mapKeyToEditorCommand = (e: any): string | null => {
    if (e.keyCode === 9 /* TAB */) {
      setEditorState(prevState => RichUtils.onTab(
          e,
          prevState,
          4, /* Max Depth */
      ));
      return 'tab';
    }
    return getDefaultKeyBinding(e);
  }

  const handleKeyCommand = (command: DraftEditorCommand) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  }

  const blockRendererFn = (contentBlock: ContentBlock) => ({
    component: Line,
  });

  const renderExecuteButton = () => {
    if (allowStep) {
      return <button className={"button grow"} onClick={() => onStep()}>Step</button>
    } else {
      return <button className={"button grow"} onClick={() => onExecute()}>Execute</button>
    }
  }

  const clearCode = () => {
    setEditorState(EditorState.createEmpty());
  }

  return (
      <div className="ide">
        <div className="options">
          <div className="option-item">
            <button className="button grow"
                    onClick={() => {
                      onTranslate(editorState.getCurrentContent().getPlainText());
                    }}>Assemble
            </button>
          </div>
          {isCodeAssembled ?
              <>
                <div className="option-item grow">
                  <label>Allow step: <input type="checkbox" id="allow-step" name="allow-step" checked={allowStep}
                                            onChange={e => setAllowStep(e.target.checked)}/></label>
                </div>
                <div className="option-item">
                  {renderExecuteButton()}
                </div>
              </>
            : ""
          }
          <div className={"option-item"}>
            {editorState.getCurrentContent().getPlainText().length > 0 ?
                <button onClick={() => clearCode()} className={"button grow"}>Clear</button> : ""}
          </div>
        </div>
        <div className="code-container">
          <Editor
              editorState={editorState}
              spellCheck={true}
              onChange={setEditorState}
              handleKeyCommand={handleKeyCommand}
              keyBindingFn={mapKeyToEditorCommand}
              blockRendererFn={blockRendererFn}
              placeholder={"    Write code here..."}
          />
        </div>
      </div>
  );
};

export default IDE;
