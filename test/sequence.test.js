import test from 'tape';
import sequence from '../src/sequence';
import { spy } from './utils';

test('sequence()', t => {
    t.test('should return a function', tt => {
        const actual = typeof sequence(() => {});
        const expected = 'function';
        tt.strictEqual(actual, expected);
        tt.end();
    });

    t.test('should return void when calling sequenced result', tt => {
        const actual = sequence(x => x)(1);
        const expected = undefined;
        tt.strictEqual(actual, expected);
        tt.end();
    });

    t.test('should call each function', tt => {
        const spy1 = spy();
        const spy2 = spy();
        sequence(spy1, spy2)(1);

        {
            const actual = spy1.callCount;
            const expected = 1;
            tt.strictEqual(actual, expected, 'should call the first function once');
        }

        {
            const actual = spy2.callCount;
            const expected = 1;
            tt.strictEqual(actual, expected, 'should call the second function once');
        }

        tt.end();
    });


    t.test('should call each function with the same argument', tt => {
        const spy1 = spy();
        const spy2 = spy();
        sequence(spy1, spy2)(1);

        {
            const actual = spy1.callArgs[0];
            const expected = [1];
            tt.deepEqual(actual, expected, 'should call the first function with 1');
        }

        {
            const actual = spy2.callArgs[0];
            const expected = [1];
            tt.deepEqual(actual, expected, 'should call the second function with 1');
        }

        tt.end();
    });

    t.test('should allow earlier compositions to be composable', tt => {
        const spy1 = spy();
        const spy2 = spy();
        const spy3 = spy();
        const seq1 = sequence(spy1, spy2);
        sequence(seq1, spy3)(1);

        {
            const actual = spy1.callCount;
            const expected = 1;
            tt.strictEqual(actual, expected, 'should call the first function once');
        }

        {
            const actual = spy2.callCount;
            const expected = 1;
            tt.strictEqual(actual, expected, 'should call the second function once');
        }

        {
            const actual = spy3.callCount;
            const expected = 1;
            tt.strictEqual(actual, expected, 'should call the third function once');
        }

        tt.end();
    });
});
