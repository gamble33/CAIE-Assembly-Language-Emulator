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
        opcodeNumber: 17,
    },
    {
        opcode: "LDI",
        operand: operandType.ADDRESS,
        rtns: [
            "MAR <- CU",
            "MAR <- OPERAND",
            "MDR <- [[[MAR]]]",
            "ACC <- MDR"
        ],
        usage: "LDI <address>",
        description: "Indirect adressing to load contents into accumulator",
        opcodeNumber: 18,
    },
    {
        opcode: "STO",
        operand: operandType.ADDRESS,
        rtns: [
            "MDR <- ACC",
            "[OPERAND] <- MDR"
        ],
        usage: "STO <address>",
        description: "Stores contents of ACC into memory location specified",
        opcodeNumber: 19
    }
];

export default Instructions;
