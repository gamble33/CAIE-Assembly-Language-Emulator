export interface InstructionObj {
  opcode: string;
  operand: operandType;
  rtns: string[]; // Register Transfer Notation
  usage: string,
  description: string,
  opcodeNumber: number,
}

export enum operandType {
  ADDRESS,
  NUMBER,
  REGISTER
}
