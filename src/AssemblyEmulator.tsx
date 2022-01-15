import React, {useEffect, useRef, useState} from 'react';
import './AssemblyEmulator.css';
import IDE from "./components/IDE/IDE";
import RegisterObject from "./Types/RegisterType";
import Registers from "./constants/Registers";
import Units from "./constants/Units";
import ReactTooltip from "react-tooltip";
import {
    getFakeValueFromMemory,
    destructureRtnCell,
    evaluateExpressionValue,
    getUpdatedMemoryLocationFakeState
} from './assemblyExecution';
import {initialInstructionMemoryAddress, initialMemoryAddress, totalMemoryCells} from './constants/MemoryAddresses';
import RegisterContainer from "./components/Registers/RegisterContainer";
import MemoryTable from "./components/MemoryTable";
import translate from "./translation";
import {splitWhitespace} from "./utils";
import RegisterConnectionLines from "./components/RegisterConnectionLines/RegisterConnectionLines";
import AssemblerConsole from "./components/AssemblerConsole/AssemblerConsole";
import useInterval from "./useInterval";

function AssemblyEmulator() {

    const [memoryArr, setMemoryArr] = useState<number[]>([]);
    const [instrMemoryArr, setInstrMemoryArr] = useState<number[]>([]);
    const [registers, setRegisters] = useState<RegisterObject[]>([]);
    const [isAssembled, setIsAssembled] = useState<boolean>(false);
    const [assemblyRtns, setAssemblyRtns] = useState<Array<string>>([]);
    const [currentRtnIndex, setCurrentRtnIndex] = useState<number>(0);
    const [assemblerResult, setAssemblerResult] = useState<[string, string]>(["", "NOTASSEMBLED"]);

    const isAutoStepActive = useRef<boolean>(false);
    const playSpeed = useRef<number>(1);
    const currentPlayEndCallback = useRef<() => void>();

    const [showArrows, setShowArrows] = useState<boolean>(true);
    const [clearConsole, setClearConsole] = useState<boolean>(false);

    const resetRegisters = () => {
        setRegisters(Registers);
    }

    const resetMemory = () => {
        let arr: Array<number> = [];
        for (let i = 0; i < totalMemoryCells; i++) {
            arr.push(Math.round(Math.random() * 1000));
        }
        setMemoryArr(arr);
    }

    const updateRegister = (registerName: string, newVal: number): void => {
        registerName = registerName.toUpperCase();
        setRegisters(prevState => prevState.map(curRegister => {
            return {
                ...curRegister,
                value: curRegister.name === registerName ? newVal : curRegister.value,
            };
        }));
    }

    const getUpdatedRegisterFakeState = (registerName: string, newVal: number, fakeRegisters: RegisterObject[]): RegisterObject[] => {
        registerName = registerName.toUpperCase();
        if (!fakeRegisters) fakeRegisters = registers;
        return fakeRegisters.map(curRegister => {
            return {
                ...curRegister,
                value: curRegister.name === registerName ? newVal : curRegister.value,
            };
        });
    }

    const updateMemoryLocation = (memoryAddress: number, newVal: number) => {
        setMemoryArr(prevState => prevState.map((val, index) =>
            initialMemoryAddress + index === memoryAddress ? newVal : val
        ));
    }

    const getRegisterValue = (registerName: string): number => {
        registerName = registerName.toUpperCase();
        const registerObject: RegisterObject | undefined = registers.find(curRegister => curRegister.name === registerName);
        if (registerObject) return registerObject.value;
        else {
            console.error("Register", registerName, "not found.")
            return -1;
        }
    }

    const getValueFromMemory = (memoryAddress: number): number => {
        return memoryArr.find((curValue, index) => initialMemoryAddress + index === memoryAddress)!;
    }

    const getValueFromInstructionMemory = (memoryAddress: number): number => {
        return instrMemoryArr.find((curValue, index) => initialInstructionMemoryAddress + index === memoryAddress)!;
    }

    const resetRtns = () => {
        setCurrentRtnIndex(0);
    }

    useEffect(() => {

        // Initialize RegisterContainer
        resetRegisters();

        // Initialize Memory
        resetMemory();

    }, []);


    const onAssemble = (code: string, twoPass: boolean) => {
        const [rtns, instrCodeArr, translateError] = translate(code);
        if (translateError) {
            setAssemblerResult([translateError, "ERROR"]);
            return;
        }
        setAssemblerResult([translateError, "SUCCESS"]);
        setInstrMemoryArr(instrCodeArr);
        setAssemblyRtns(rtns);
        setIsAssembled(true);
        setCurrentRtnIndex(0);
        resetUnitsAndExecutor();
    }

    const handleStepClick = () => {
        const [newRegisterArr, newMemoryArr] = step(
            assemblyRtns,
            currentRtnIndex,
            registers,
            memoryArr
        );
        setRegisters(newRegisterArr);
        setMemoryArr(newMemoryArr);
    }

    const innerTimerFunction = () => {
        console.log('hello');
    }

    useInterval(() => {
        if (currentRtnIndex >= assemblyRtns.length || !isAutoStepActive.current) {
            if(currentPlayEndCallback.current) currentPlayEndCallback.current!();
            return;
        }
        handleStepClick();
    }, 1000 / playSpeed.current);

    const handlePlay = (onEndCallback: () => void, speed: number, isPlaying: boolean) => {
        playSpeed.current = speed;
        currentPlayEndCallback.current = onEndCallback;
        if (isPlaying && !isAutoStepActive.current) {
            isAutoStepActive.current = true;
        } else if (isAutoStepActive.current) {
            isAutoStepActive.current = false;
        }
    }

    const resetUnitsAndExecutor = () => {
        resetRegisters();
        resetMemory();
        resetRtns();
        isAutoStepActive.current = false;
        setClearConsole(true);
        setTimeout(() => setClearConsole(false), 1);
    }

    const step = (rtns: Array<string>, rtnIndex: number, fakeRegisters: RegisterObject[], fakeMemory: number[]): [RegisterObject[], number[]] => {
        const curRtn = rtns[rtnIndex];

        const rtnParts = splitWhitespace(curRtn);
        const receivingCell: string = rtnParts[0];
        let valueForRegister: number = -1;
        if (Units.find(value => value.name === rtnParts[0])) {
            // just animation needed (transfer is between unit & register/unit thus no data is being transferred)
            // TODO: animation

            setCurrentRtnIndex(prevState => prevState + 1);
            return [fakeRegisters, fakeMemory];
        }
        if (Units.find(value => value.name === rtnParts[2])) { // E.g., MAR <- CU
            // TODO: Animation

            setCurrentRtnIndex(prevState => prevState + 1);
            return [fakeRegisters, fakeMemory];
        } else {

            /*
             Register or memory location that holds the value being transferred
             to the receiving cell (register/memory location)
             */
            const [givingCell, exprSuffix, bracketPairs] = destructureRtnCell(rtnParts[2]);

            let givingInnerValue = evaluateExpressionValue(givingCell, exprSuffix, fakeRegisters);

            let bracketCounter = bracketPairs - 1;
            const retrieveValueFromMemoryFunc: any =
                givingInnerValue < initialMemoryAddress || givingInnerValue > initialMemoryAddress + totalMemoryCells
                    ? getValueFromInstructionMemory : getFakeValueFromMemory;
            for (let i = 0; i < bracketCounter; i++) {
                givingInnerValue = retrieveValueFromMemoryFunc(givingInnerValue, fakeMemory);
            }
            valueForRegister = givingInnerValue;

        }
        let receivingCellIsRegister: boolean = false;
        Registers.forEach(register => {
            if (register.name === receivingCell) {
                receivingCellIsRegister = true;
                return;
            }
        })

        if (receivingCellIsRegister) {
            fakeRegisters = getUpdatedRegisterFakeState(receivingCell, valueForRegister, fakeRegisters);
        } else {
            fakeMemory = getUpdatedMemoryLocationFakeState(parseInt(receivingCell), valueForRegister, fakeMemory);
        }

        setCurrentRtnIndex(prevState => prevState + 1);
        return [fakeRegisters, fakeMemory];
    }

    const fastExecute = () => {
        let fakeRegisters: RegisterObject[] = registers;
        let fakeMemory: number[] = memoryArr;
        for (let iterator = 0; iterator < assemblyRtns.length; iterator++) {
            const [tmpFakeRegisters, tmpFakeMemory] = step(assemblyRtns, iterator, fakeRegisters, fakeMemory);
            fakeRegisters = tmpFakeRegisters;
            fakeMemory = tmpFakeMemory;
        }

        setMemoryArr(fakeMemory);
        setRegisters(fakeRegisters);
    }

    const getLastRtn = (): string => {
        const index = currentRtnIndex - 1;
        if (index < 0) return "";
        return assemblyRtns[index];
    }

    return (
        <div className="App">
            <div className="left-container container">
                <IDE
                    onTranslate={onAssemble}
                    onExecute={fastExecute}
                    onStep={handleStepClick}
                    isCodeAssembled={isAssembled}
                    allowCodeExecution={currentRtnIndex < assemblyRtns.length}
                    onPlayToggle={handlePlay}
                />

                <AssemblerConsole
                    outputMessage={assemblerResult[0]}
                    outputType={assemblerResult[1]}
                    currentRtn={getLastRtn()}
                    clearConsole={clearConsole}
                />
            </div>
            <div className="right-container container">
                <div className="options">
                    <button data-tip data-for="reset-registers-memory" className="button grow" onClick={() => {
                        resetUnitsAndExecutor();
                    }}>Reset
                    </button>
                    <ReactTooltip id="reset-registers-memory">
                        <span>Resets all memory locations and registers.</span>
                    </ReactTooltip>
                    <div className="option-item grow">
                        <label>Show arrows: <input type="checkbox" id="show-arrows" name="show-arrows"
                                                   checked={showArrows}
                                                   onChange={e => setShowArrows(e.target.checked)}/></label>
                    </div>
                </div>
                <h2 className="hardware-heading">Registers & Units</h2>
                <RegisterContainer registers={registers} currentRtn={getLastRtn()}/>
                <br/>
                <div id="memory-text"><h2 className="hardware-heading">Memory</h2></div>
                <div style={{position: "relative", left: "50%", top: 0, width: "1px"}} id="MEMORY"/>
                {/* Instruction Memory*/}
                {instrMemoryArr.length > 0 ? <MemoryTable
                    memoryArr={instrMemoryArr}
                    initialMemoryAddr={initialInstructionMemoryAddress}/> : ""
                }

                <MemoryTable memoryArr={memoryArr} initialMemoryAddr={initialMemoryAddress}/>
            </div>
            {showArrows && <RegisterConnectionLines currentRtn={getLastRtn()}/>}
        </div>
    );
}

export default AssemblyEmulator;
