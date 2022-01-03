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
