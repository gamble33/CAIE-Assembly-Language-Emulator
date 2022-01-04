import React, {useEffect, useRef, useState} from 'react';
import './AssemblyEmulator.css';
import IDE from "./components/IDE";
import RegisterObject from "./Types/RegisterType";
import Registers from "./constants/Registers";
import Units from "./constants/Units";
import ReactTooltip from "react-tooltip";
import {getFakeValueFromMemory, getFakeRegisterValue} from './assemblyExecution';
import {initialInstructionMemoryAddress, initialMemoryAddress, totalMemoryCells} from './constants/MemoryAddresses';
import RegisterContainer from "./components/RegisterContainer";
import MemoryTable from "./components/MemoryTable";
import translate from "./translation";
import {splitWhitespace} from "./utils";


function AssemblyEmulator() {

    const [memoryArr, setMemoryArr] = useState<number[]>([]);
    const [instrMemoryArr, setInstrMemoryArr] = useState<number[]>([]);
    const [registers, setRegisters] = useState<RegisterObject[]>([]);
    const [isAssembled, setIsAssembled] = useState<boolean>(false);
    const assemblyRtns = useRef<Array<string>>([]);
    const currentRtnIndex = useRef<number>(0);

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


    useEffect(() => {

        // Initialize RegisterContainer
        resetRegisters();

        // Initialize Memory
        resetMemory();

    }, [])

    const onAssemble = (code: string) => {
        const [rtns, instrCodeArr] = translate(code);
        setInstrMemoryArr(instrCodeArr);
        assemblyRtns.current = rtns;
        setIsAssembled(true);
        currentRtnIndex.current = 0;
    }

    const handleStepClick = () => {
        const [newRegisterArr, newMemoryArr] = step(
            assemblyRtns.current,
            currentRtnIndex.current,
            registers,
            memoryArr
        );
        setRegisters(newRegisterArr);
        setMemoryArr(newMemoryArr);
        currentRtnIndex.current++;
    }

    const step = (rtns: Array<string>, rtnIndex: number, fakeRegisters: RegisterObject[], fakeMemory: number[]): [RegisterObject[], number[]] => {
        const curRtn = rtns[rtnIndex];

        console.log("current RTN:", curRtn);

        const rtnParts = splitWhitespace(curRtn);
        const receivingRegister: string = rtnParts[0];
        let valueForRegister: number = -1;
        if (Units.find(value => value.name === rtnParts[0])) {
            // just animation needed (transfer is between unit & register/unit thus no data is being transferred)
            console.error('animation needed');
            return [fakeRegisters, fakeMemory];
        }
        if (Units.find(value => value.name === rtnParts[2])) { // E.g., MAR <- CU
            console.error('animation needed');
            return [fakeRegisters, fakeMemory];
        } else {
            const secondPart: string = rtnParts[2];
            let givingRegister: string = "";
            let bracketCount = 0;
            let exprSuffix: string = "";
            let readRegisterFlag: boolean = false;
            for (let i = 0; i < secondPart.length; i++) {
                const currentCharacter = secondPart.substring(i, i + 1)
                if (readRegisterFlag) {
                    if (currentCharacter === ']') continue;
                    exprSuffix += currentCharacter;
                } else if (currentCharacter === '[') bracketCount++;
                else if (currentCharacter !== ']') givingRegister += currentCharacter;
                else {
                    readRegisterFlag = true;
                }
            }
            let innerValue: number;
            if (!isNaN(+givingRegister)) innerValue = Number(givingRegister);
            else innerValue = getFakeRegisterValue(givingRegister, fakeRegisters);

            innerValue = Number(eval(innerValue + exprSuffix));

            bracketCount--;
            const retrieveValueFromMemoryFunc: any =
                innerValue < initialMemoryAddress || innerValue > initialMemoryAddress + totalMemoryCells
                    ? getValueFromInstructionMemory : getFakeValueFromMemory;
            for (let i = 0; i < bracketCount; i++) {
                innerValue = retrieveValueFromMemoryFunc(innerValue, fakeMemory);
            }
            console.log(instrMemoryArr);
            valueForRegister = innerValue;
        }
        fakeRegisters = getUpdatedRegisterFakeState(receivingRegister, valueForRegister, fakeRegisters);
        return [fakeRegisters, fakeMemory];
    }

    const fastExecute = () => {
        let fakeRegisters: RegisterObject[] = registers;
        let fakeMemory: number[] = memoryArr;
        for (let iterator = 0; iterator < assemblyRtns.current.length; iterator++) {
            const [tmpFakeRegisters, tmpFakeMemory] = step(assemblyRtns.current, iterator, fakeRegisters, fakeMemory);
            fakeRegisters = tmpFakeRegisters;
            fakeMemory = tmpFakeMemory;
        }

        setMemoryArr(fakeMemory);
        setRegisters(fakeRegisters);
    }

    return (
        <div className="App">
            <div className="left-container container">
                <IDE
                    onTranslate={onAssemble}
                    onExecute={fastExecute}
                    onStep={handleStepClick}
                    isCodeAssembled={isAssembled}
                />
            </div>
            <div className="right-container container">
                <div className="options">
                    <button data-tip data-for="reset-registers-memory" className="button grow" onClick={() => {
                        resetRegisters();
                        resetMemory();
                    }}>Reset
                    </button>
                    <ReactTooltip id="reset-registers-memory">
                        <span>Resets all memory locations and registers.</span>
                    </ReactTooltip>
                </div>
                <h2 className="hardware-heading">Registers & Units</h2>
                <div id="memory-text"><h2 className="hardware-heading">Memory</h2></div>
                <RegisterContainer registers={registers}/>
                <br/>

                {/* Instruction Memory*/}
                {instrMemoryArr.length > 0 ? <MemoryTable
                    memoryArr={instrMemoryArr}
                    initialMemoryAddr={initialInstructionMemoryAddress}/> : ""
                }

                <MemoryTable memoryArr={memoryArr} initialMemoryAddr={initialMemoryAddress}/>
            </div>
        </div>
    );
}

export default AssemblyEmulator;
