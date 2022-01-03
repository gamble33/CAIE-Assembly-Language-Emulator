import React, {useEffect, useRef, useState} from 'react';
import './AssemblyEmulator.css';
import './Registers.css';
import IDE from "./components/IDE";
import {filterComments, splitWhitespace} from "./translation";
import Register from "./components/Register";
import MemoryCell from "./components/MemoryCell";
import RegisterObject from "./Types/RegisterType";
import Registers from "./constants/Registers";
import Instructions from "./constants/Instructions";
import {InstructionObj} from "./Types/InstructionType";
import Units from "./constants/Units";
import ReactTooltip from "react-tooltip";
import {getFakeValueFromMemory, getFakeRegisterValue, getUpdatedMemoryLocationFakeState} from './assemblyExecution';
import {initialInstructionMemoryAddress, initialMemoryAddress, totalMemoryCells} from './constants/MemoryAddresses';
import RegisterContainer from "./components/RegisterContainer";
import MemoryTable from "./components/MemoryTable";


function AssemblyEmulator() {

  const [memoryArr, setMemoryArr] = useState<number[]>([]);
  const [registers, setRegisters] = useState<RegisterObject[]>([]);
  const [isAssembled, setIsAssembled] = useState<boolean>(false);
  const assemblyInstructions = useRef<Array<string>>([]);
  const currentInstructionIndex = useRef<number>(0);
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
    return memoryArr.find((curValue, index) => initialMemoryAddress + index === memoryAddress) as number;
  }


  useEffect(() => {

    // Initialize RegisterContainer
    resetRegisters();

    // Initialize Memory
    resetMemory();

  }, [])

  const onAssemble = (code: string) => {
    const filteredComments: string = filterComments(code, '#');
    assemblyInstructions.current = splitWhitespace(filteredComments);
    setIsAssembled(true);
    currentInstructionIndex.current = 0;
    currentRtnIndex.current = 0;
  }

  const handleStepClick = () => {
    const instrObj = Instructions.find(instr => instr.opcode === assemblyInstructions.current[currentInstructionIndex.current]) as InstructionObj;
    const [newRegisterArr, newMemoryArr] = step(
        instrObj,
        currentRtnIndex.current,
        assemblyInstructions.current[currentInstructionIndex.current + 1],
        registers,
        memoryArr
    );
    setRegisters(newRegisterArr);
    setMemoryArr(newMemoryArr);
    if (currentRtnIndex.current + 1 === instrObj.rtns.length) {
      currentRtnIndex.current = 0;
      currentInstructionIndex.current += 2;
    } else {
      currentRtnIndex.current++;
    }
  }

  const step = (instruction: InstructionObj, rtnIndex: number, operand: string, fakeRegisters: RegisterObject[], fakeMemory: number[]): [RegisterObject[], number[]] => {
    const curRtn = instruction.rtns[rtnIndex];

    const rtnParts = splitWhitespace(curRtn);
    const receivingRegister: string = rtnParts[0];
    let valueForRegister: number = -1;
    if (Units.find(value => value.name === rtnParts[0])) {
      // just animation needed (transfer is between unit & register/unit thus no data is being transferred)
      console.error('animation needed');
    }
    if (Units.find(value => value.name === rtnParts[2])) { // E.g., MAR <- CU
      if (rtnParts[2] === 'CU') {
        valueForRegister = parseInt(operand);
      }
    } else {
      const secondPart: string = rtnParts[2];
      let givingRegister: string = "";
      let bracketCount = 0;
      for (let i = 0; i < secondPart.length; i++) {
        const currentCharacter = secondPart.substring(i, i + 1)
        if (currentCharacter === '[') bracketCount++;
        else if (currentCharacter !== ']') givingRegister += currentCharacter;
        else break;
      }
      let innerValue: number = getFakeRegisterValue(givingRegister, fakeRegisters);
      bracketCount--;
      for (let i = 0; i < bracketCount; i++) {
        innerValue = getFakeValueFromMemory(innerValue, fakeMemory);
      }
      valueForRegister = innerValue;
    }
    fakeRegisters = getUpdatedRegisterFakeState(receivingRegister, valueForRegister, fakeRegisters);
    return [fakeRegisters, fakeMemory];
  }

  const fastExecute = () => {
    const instructions = assemblyInstructions.current;
    let fakeRegisters: RegisterObject[] = registers;
    let fakeMemory: number[] = memoryArr;
    for (let instructionIterator = 0; instructionIterator < instructions.length - 1; instructionIterator += 2) {
      const opcode = instructions[instructionIterator];
      const operand = instructions[instructionIterator + 1];
      const instruction: InstructionObj = Instructions.find(curInstruction => curInstruction.opcode === opcode) as InstructionObj;
      for (let iterator = 0; iterator < instruction.rtns.length; iterator++) {
        const [tmpFakeRegisters, tmpFakeMemory] = step(instruction, iterator, operand, fakeRegisters, fakeMemory);
        fakeRegisters = tmpFakeRegisters;
        fakeMemory = tmpFakeMemory;
      }
    }
    setMemoryArr(fakeMemory);
    setRegisters(fakeRegisters);
  }

  const renderInstructionMemory = () => {
    if (!isAssembled) return "";
    let arr = []
    for (let i = 0; i < assemblyInstructions.current.length / 2; i++) {
      const address = initialInstructionMemoryAddress + i;
      arr.push(
          <MemoryCell
              address={address}
              value={0}
              key={address}
          />);
    }
    return arr;
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
          <div className="memory-table">
            {/* Instruction Memory*/}
            {renderInstructionMemory()}
          </div>
          <RegisterContainer registers={registers}/>
          <br/>
          <MemoryTable memoryArr={memoryArr}/>
        </div>
      </div>
  );
}

export default AssemblyEmulator;
