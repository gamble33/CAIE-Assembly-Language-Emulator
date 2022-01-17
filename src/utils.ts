export const splitWhitespace = (code: string): Array<string> => {
    const splitCode = code.split(/\s+/);
    let arr = [];
    for(let i=0; i<splitCode.length; i++){
        if(!splitCode[i]) continue;
        arr.push(splitCode[i]);
    }
    return arr;
};

export const splitBar = (text: string): Array<string> => {
    let part: string = "";
    let arr: Array<string> = [];
    for(let i=0; i<text.length; i++){
        const ch = text.charAt(i);
        if(i === text.length-1){
            arr.push(part + ch);
            break;
        }
        if(ch === '|'){
            arr.push(part);
            part = "";
        } else {
            part += ch;
        }
    }
    return arr;
}