import React, {useCallback, useState} from 'react';
import Draft, {Editor, EditorState, RichUtils, getDefaultKeyBinding, DraftEditorCommand, ContentBlock} from "draft-js";
import 'draft-js/dist/Draft.css';
import Line from "./Line";
import "./styles.css";
import ReactTooltip from "react-tooltip";
import set = Reflect.set;

interface Props {
    onTranslate(code: string, twoPass: boolean): void;

    onExecute(): void;

    onStep(): void;

    onPlayToggle(onEndCallback: () => void, speed: number, playing: boolean): void;

    isCodeAssembled: boolean;

    allowCodeExecution: boolean;

}

const IDE: React.FC<Props> = ({onTranslate, onExecute, onStep, isCodeAssembled, allowCodeExecution, onPlayToggle}) => {

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const [allowStep, setAllowStep] = useState<boolean>(false);
    const [twoPassAssembler, setTwoPassAssembler] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
            return (
                <>
                    {!isPlaying && <button className={"button grow"} onClick={() => onStep()}>Step</button>}
                    <button className={"button grow"} onClick={() => {
                        onPlayToggle(() => {
                            setIsPlaying(false);
                        }, 1, !isPlaying);
                        setIsPlaying(prevState => !prevState);
                    }}>{isPlaying ? "Pause" : "Play"}</button>
                </>
            )
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
                                onTranslate(editorState.getCurrentContent().getPlainText(), twoPassAssembler);
                            }}>Assemble
                    </button>
                </div>
                <div data-tip data-for="set-two-pass-tooltip" className="option-item grow">
                    <label className="switch">
                        <input
                            type="checkbox"
                            id="set-two-pass"
                            name="set-two-pass"
                            checked={twoPassAssembler}
                            onChange={e => setTwoPassAssembler(e.target.checked)}
                        />
                        <span className="slider"/>
                    </label>
                </div>
                <ReactTooltip id="set-two-pass-tooltip" className="tooltip" place={"bottom"}>
                    <span>
                        {twoPassAssembler ?
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <strong>Two Pass Assembler</strong>
                                <span>
                                    An object program will be produced that can be stored,
                                    loaded and then executed at a further stage. This will make use of another program called a loader.
                                    This will make use of another program called a loader.
                                    Two pass assemblers will scan the code twice so they can replace
                                    labels in assembly code with memory addresses in machine code program.
                                </span>
                            </div>
                            :
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <strong>Single Pass Assembler</strong>
                                <span>
                                    Each line will be read, one at a time.
                                    Everything that is not required will be ignored. Such as comments (lines starting with '#')
                                    Opcodes will be directly converted into machine code
                                </span>
                            </div>
                        }
                            </span>
                </ReactTooltip>
                {isCodeAssembled && allowCodeExecution ?
                    <>
                        <div className="option-item grow">
                            <label>Allow step: <input type="checkbox" id="allow-step" name="allow-step"
                                                      checked={allowStep}
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
