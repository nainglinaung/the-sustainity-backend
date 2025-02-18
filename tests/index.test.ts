// filepath: /typescript-node-project/tests/index.test.ts

import { someFunction } from '../src/utils/index';

describe('Utility Functions', () => {
    test('someFunction should return expected result', () => {
        const result = someFunction('input');
        expect(result).toBe('expectedOutput');
    });
});