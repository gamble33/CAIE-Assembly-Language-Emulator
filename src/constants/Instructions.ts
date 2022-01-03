import {InstructionObj, operandType} from "../Types/InstructionType";

const Instructions: InstructionObj[] = [
    {
        opcode: "LDD",
        operand: operandType.ADDRESS,
        rtns: [
            "MAR <- CU",
            "MAR <- OPERAND",
            "MDR <- [[MAR]]",
            "ACC <- [MDR]",
        ],
        usage: "LDD <address>",
        description: "Direct or Absolute Addressing used to load contents of memory location into accumulator",
        opcodeNumber: 0,
    },
];

export default Instructions;
