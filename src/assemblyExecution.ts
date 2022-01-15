import RegisterObject from "./Types/RegisterType";
import {initialMemoryAddress} from './constants/MemoryAddresses';

export const getFakeValueFromMemory = (memoryAddress: number, fakeMemoryArr: number[]): number => {
  return fakeMemoryArr.find((curValue, index) => initialMemoryAddress + index === memoryAddress) as number;
}

export const getFakeRegisterValue = (registerName: string, fakeRegisters: RegisterObject[]): number => {
  registerName = registerName.toUpperCase();
  const registerObject: RegisterObject | undefined = fakeRegisters.find(curRegister => curRegister.name === registerName);
  if (registerObject) return registerObject.value;
  else {
    console.error("Register", registerName, "not found.")
    return -1;
  }
}

export const getUpdatedMemoryLocationFakeState = (memoryAddress: number, newVal: number, fakeMemoryLocations: number[]): number[] => {
  return fakeMemoryLocations.map((val, index) =>
      initialMemoryAddress + index === memoryAddress ? newVal : val
  );
}

/**
 * A function that takes in a register transfer notation argument (e.g., [[MDR]]+2) and returns a packed expression of its three components.
 *  The name/memory location ('MDR'), the expression that may follow it ('+2') and the amount of bracket pairs (2)
 * @param cell A register or memory location that may be enclosed by square brackets and may include an expression (e.g., [ACC] + 1)
 * @returns An array containing the name of the cell, the expression and the number of bracket pairs
 */
export const destructureRtnCell = (cell: string): [string, string, number] =>  {
  let cellName: string = "";
  let exprSuffix: string = ""
  let readContents: boolean = false;
  let bracketCount: number = 0;
  for (let i = 0; i < cell.length; i++) {
    const curChar = cell.charAt(i);
    if (readContents) {
      if (curChar === ']' || curChar === ' ') continue;
      exprSuffix += curChar;
    } else {
      if (curChar === '[') {
        bracketCount++;
      } else if (curChar === ']' || curChar === ' ') {
        readContents = true;
      } else {
        cellName += curChar;
      }
    }
  }
  return [cellName, exprSuffix, bracketCount];
}

export const evaluateExpressionValue = (cell: string, expr: string, registers: RegisterObject[]) => {
  let innerValue: number;
  if (!isNaN(+cell)) innerValue = Number(cell);
  else innerValue = getFakeRegisterValue(cell, registers);

  return Number(eval(innerValue + expr));
}
