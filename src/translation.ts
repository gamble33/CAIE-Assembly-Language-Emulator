export const filterComments = (code: string, commentChar: string): string => {
  let filteredCommentsString: string = "";
  code.split(/\r?\n/).forEach(line => {
    if( line.substring(0,1) !== commentChar){
      filteredCommentsString += " " + line;
    }
  })
  return filteredCommentsString.substring(1,filteredCommentsString.length);
};

export const splitWhitespace = (code: string): Array<string> => {
  return code.split(/\s+/);
}
