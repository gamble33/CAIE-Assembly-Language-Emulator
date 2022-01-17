import RegisterObject from "../Types/RegisterType";

const Registers: RegisterObject[] = [
    {
        name: "CIR",
        value: 5,
        fullName: "Current Instruction Register",
        description: "Stores the current instruction being decoded and executed",
    },
    {
        name: "IX",
        value: 0,
        fullName: "Index Register",
        description: "Used when carrying out index addressing operations",
    },
    {
        name: "MAR",
        value: 0,
        fullName: "Memory Address Register",
        description: "Stores the memory location (address) currently being read from or written to.",
    },
    {
        name: "MDR",
        value: 0,
        fullName: "Memory Data Register",
        description: "Stores data which has just been read from memory or data which is about to be written to memory. Can be thought of as a buffer, thus, it is frequently referred to as an MBR or Memory Buffer Register.",
    },
    {
        name: "PC",
        value: 0,
        fullName: "Program Counter",
        description: "Stores the memory location (address) of where the next instruction (to be executed) can be found and read.",
    },
    {
        name: "SR",
        value: 0,
        fullName: "Status Register",
        description: "Contain bits which can be set or cleared depending on the operation (e.g., the status register will indicate the occurrence of an overflow in a calculation).",
    },
    {
        name: "ACC",
        value: 0,
        fullName: "Accumulator",
        description: "Register used to, temporarily, store results of logic or arithmetic calculations.",
    }
];

export default Registers;
