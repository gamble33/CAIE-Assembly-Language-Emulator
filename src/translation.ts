import Instructions from "./constants/Instructions";
import {InstructionObj} from "./Types/InstructionType";
import {splitBar, splitWhitespace} from "./utils";

const COMMENT_CHAR = '#';
const fetchExecuteCycle: Array<Array<string>> = [
    [
        "MAR <- [PC]",
        "PC <- [PC]+1",
        "MDR <- [[MAR]]",
        "CIR <- [MDR]",
        "CU <- CIR",
    ],
    // [
    //     "PC <- CU",
    // ],
];

const filterComments = (code: string): string => {
    let filteredCommentsString: string = "";
    code.split(/\r?\n/).forEach(line => {
        if (line.substring(0, 1) !== COMMENT_CHAR && line.length > 0) {
            filteredCommentsString += " " + line;
        }
    })
    return filteredCommentsString.substring(1, filteredCommentsString.length);
};

const convertInstructionKeywords = (rtn: string, operand: string) => {
    let newRtn: string = rtn;
    newRtn = newRtn.replaceAll('OPERAND', operand);
    newRtn = newRtn.replaceAll('MEMORY', operand);
    return newRtn;
}

const checkCorrectInstructionUsage = (opcode: string, operand: string, instruction: InstructionObj): string => {
    const usageParts = splitWhitespace(instruction.usage);
    if (usageParts[1].charAt(0) === '<') return "";
    else if (!splitBar(usageParts[1]).includes(operand)){
        return `Incorrect usage ${opcode + ' ' + operand}, should be: ${instruction.usage}`;
    }
    return "";
}


const expandInstructionsToRTN = (codeArray: string[]): Array<string> | string => {
    let rtnArr: Array<string> = [];
    for (let i = 0; i < codeArray.length; i += 2) {
        const opcode: string = codeArray[i];
        const operand: string = codeArray[i + 1];
        const instruction: InstructionObj | undefined = Instructions.find(curInstruction => curInstruction.opcode === opcode);
        if (!instruction) return `${opcode} is not a valid instruction`;
        const usageErrorMessage = checkCorrectInstructionUsage(opcode, operand, instruction);
        if (usageErrorMessage) return usageErrorMessage;
        rtnArr.push(...fetchExecuteCycle[0]);
        rtnArr.push(...instruction.rtns.map(curRtn => {
                return convertInstructionKeywords(curRtn, operand);
            }
        ));
        // rtnArr.push(...fetchExecuteCycle[1]);
    }
    return rtnArr;
}


const translate = (code: string, twoPass: boolean): [string[], number[], string] => {
    if(code.length <= 0) return [[],[],"No code"];
    const filteredComments = filterComments(code);
    const codeArr = splitWhitespace(filteredComments);
    const registerTransferCommands = expandInstructionsToRTN(codeArr);
    if (typeof registerTransferCommands === 'string') return [[], [], registerTransferCommands];
    let instructionCodeArray: Array<number> = [];
    for (let i = 0; i < codeArr.length; i += 2) {
        instructionCodeArray.push(Instructions.find(
            curInstr => curInstr.opcode === codeArr[i]
        )!.opcodeNumber);
    }
    return [registerTransferCommands, instructionCodeArray, ""];
};

export default translate;
