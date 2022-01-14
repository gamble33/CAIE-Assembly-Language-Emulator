import {destructureRtnCell} from "../assemblyExecution";

// @ts-ignore
describe('Assembly Execution', () => {

    describe('Destructuring Rtn Cells', () => {
        test('Destructures cell name and one bracket pair', () => {
            expect(destructureRtnCell('[MDR]')).toStrictEqual(['MDR', '', 1]);
        })
        test('Destructures cell name and many bracket pair', () => {
            expect(destructureRtnCell('[[[[[[[MDR]]]]]]]')).toStrictEqual(['MDR', '', 7]);
        })
        test('Destructures cell name and expression', () => {
            expect(destructureRtnCell('ACC +1')).toStrictEqual(['ACC', '+1', 0]);
        })
        test('Destructures cell name, many bracket pairs and expression', () => {
            expect(destructureRtnCell('[[[[[[[[[[MAR]]]]]]]]]]*365')).toStrictEqual(['MAR', '*365', 10]);
        })
        test('Destructures empty string to array of empty strings and 0', () => {
            expect(destructureRtnCell('')).toStrictEqual(['', '', 0]);
        })
        test('Destructures name (that looks like expression) to name', () => {
            expect(destructureRtnCell('+1')).toStrictEqual(['+1', '', 0]);
        })
        test('Destructures many bracket pairs with no inner cell name/value', () => {
            expect(destructureRtnCell('[[[[[]]]]]')).toStrictEqual(['', '', 5]);
        })
        test('Destructures numbers with many bracket pairs and expression', () => {
            expect(destructureRtnCell('[[[[[4699593]]]]]/3')).toStrictEqual(['4699593', '/3', 5]);
        })
    })

});