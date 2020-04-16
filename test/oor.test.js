import test from 'tape';
import oor from '../src/oor';
import { spy } from './utils';

test('oor()', t => {
    t.test('should return a function', tt => {
        const actual = typeof oor(() => true);
        const expected = 'function';
        tt.strictEqual(actual, expected);
        tt.end();
    });

    t.test('should return the expected result when given an argument', tt => {
        const isUndefined = x => x === undefined;
        const isNull = x => x === null;

        {
            const actual = oor(isUndefined, isNull)('foo');
            const expected = false;
            tt.strictEqual(actual, expected, 'should fail (string)');
        }

        {
            const actual = oor(isUndefined, isNull)(null);
            const expected = true;
            tt.strictEqual(actual, expected, 'should pass (null');
        }
        tt.end();
    });


    t.test('should stop evaluating predicates after the passed one', tt => {
        const isUndefined = spy(x => x === undefined);
        const isNull = spy(x => x === null);
        oor(isUndefined, isNull)(undefined);

        const actual = isNull.callCount;
        const expected = 0;
        tt.strictEqual(actual, expected);
        tt.end();
    });

    t.test('should allow earlier compositions to be composable', tt => {
        const isUndefined = x => x === undefined;
        const isNull = x => x === null;

        const isNil = oor(isUndefined, isNull);

        const isFalse = x => x === false;
        const isEmptyString = x => x === '';
        const isZero = x => x === 0;

        const isFalsey = oor(isNil, isFalse, isEmptyString, isZero);

        {
            const actual = isFalsey([]);
            const expected = false;
            tt.strictEqual(actual, expected, 'should not be falsey (array)');
        }

        {
            const actual = isFalsey(0);
            const expected = true;
            tt.strictEqual(actual, expected, 'should be falsey (zero)');
        }

        tt.end();
    });
});
