import test from 'tape';
import compose from '../src/compose';

const identity = x => x;
const first = str => str[0];
const toUpper = str => str.toUpperCase();

test('compose()', t => {
    t.test('should return a function', tt => {
        const actual = typeof compose(identity);
        const expected = 'function';
        tt.strictEqual(actual, expected);
        tt.end();
    });

    t.test('should return the expected result when given an argument', tt => {
        {
            const actual = compose(identity)(1);
            const expected = 1;
            tt.strictEqual(actual, expected, 'should return same argument when only composing `identity`');
        }

        {
            const actual = compose(toUpper, first)('bob smith');
            const expected = 'B';
            tt.strictEqual(actual, expected, 'should return capitalized first character');
        }
        tt.end();
    });

    t.test('should allow earlier compositions to be composable', tt => {
        const getInitial = compose(toUpper, first);
        const join = glue => list => list.join(glue);
        const split = splitter => str => str.split(splitter);
        const map = fn => mappable => mappable.map(fn);
        const take = n => list => list.slice(0, n);

        const actual = compose(join(''), map(getInitial), take(2), split(/\s+/))('bob smith');
        const expected = 'BS';
        tt.strictEqual(actual, expected, 'should return capitalized initials');

        tt.end();
    });
});
