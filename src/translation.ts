import Instructions from "./constants/Instructions";
import {InstructionObj} from "./Types/InstructionType";
import {splitWhitespace} from "./utils";

const COMMENT_CHAR = '#';
const fetchExecuteCycle: Array<Array<string>> = [
    [
        "PC <- CU",
        "MAR <- [PC]",
        "MDR <- [[MAR]]",
        "CIR <- [MDR]",
        "CU <- CIR",
    ],
    [
        "PC <- CU",
        "PC <- [PC]+1",
    ],
];

const filterComments = (code: string): string => {
    let filteredCommentsString: string = "";
    code.split(/\r?\n/).forEach(line => {
        if (line.substring(0, 1) !== COMMENT_CHAR) {
            filteredCommentsString += " " + line;
        }
    })
    return filteredCommentsString.substring(1, filteredCommentsString.length);
};

const expandInstructionsToRTN = (codeArray: string[]): Array<string> => {
    let rtnArr: Array<string> = [];
    for (let i = 0; i < codeArray.length; i += 2) {
        const opcode: string = codeArray[i];
        const operand: string = codeArray[i + 1];
        const instruction: InstructionObj = Instructions.find(curInstruction => curInstruction.opcode === opcode)!;
        rtnArr.push(...fetchExecuteCycle[0]);
        rtnArr.push(...instruction.rtns.map(curRtn => {
                const curRtnArr = splitWhitespace(curRtn);
                return curRtnArr[2] === 'OPERAND' ?
                    curRtn.substring(0, curRtnArr[0]!.length + curRtnArr[1]!.length + 2) + operand :
                    curRtn;
            }
        ));
        rtnArr.push(...fetchExecuteCycle[1]);
    }
    return rtnArr;
}



const translate = (code: string): [string[], number[]] => {
    const filteredComments = filterComments(code);
    const codeArr = splitWhitespace(filteredComments);
    const registerTransferCommands = expandInstructionsToRTN(codeArr);
    let instructionCodeArray: Array<number> = [];
    for (let i = 0; i < codeArr.length; i += 2) {
        instructionCodeArray.push(Instructions.find(
            curInstr => curInstr.opcode === codeArr[i]
        )!.opcodeNumber);
    }
    return [registerTransferCommands, instructionCodeArray];
};

export default translate;
