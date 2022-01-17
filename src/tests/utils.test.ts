import {splitWhitespace, splitBar} from "../utils";

describe("Utils", () => {
    describe("Split whitespace", () => {
        test("Split 2 words w/ one space", () => {
            expect(splitWhitespace('hello world')).toStrictEqual(['hello', 'world']);
        })
        test("Split 2 words, many spaces", () => {
            expect(splitWhitespace('hello     world ')).toStrictEqual(['hello', 'world']);
        })
        test("Split many words, many spaces", () => {
            expect(splitWhitespace('hello     world      what   are you     doing    ?')).toStrictEqual(['hello', 'world', 'what', 'are', 'you', 'doing', '?']);
        })
    });
    describe("Split bar", () => {
        test("Split 2 words w/ one bar", () => {
            expect(splitBar('hello|world')).toStrictEqual(["hello", "world"]);
        })
        test("Split many words, many bars", () => {
            expect(splitBar('hello|world|what|are|you|doing|?')).toStrictEqual(['hello', 'world', 'what', 'are', 'you', 'doing', '?']);
        })
    })
});
