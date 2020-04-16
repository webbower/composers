import test from 'tape';
import aand from '../src/aand';
import { spy } from './utils';

test('aand()', t => {
    t.test('should return a function', tt => {
        const actual = typeof aand(() => true);
        const expected = 'function';
        tt.strictEqual(actual, expected);
        tt.end();
    });

    t.test('should return the expected result when given an argument', tt => {
        const isString = x => typeof x === 'string';
        const isEmailFormat = x => /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9\._-]+\.[a-z]{2,}$/.test(x);

        {
            const actual = aand(isString, isEmailFormat)('foo');
            const expected = false;
            tt.strictEqual(actual, expected, 'should fail second predicate (email format)');
        }

        {
            const actual = aand(isString, isEmailFormat)('foo@bar.com');
            const expected = true;
            tt.strictEqual(actual, expected, 'should pass string and email format checks');
        }
        tt.end();
    });


    t.test('should stop evaluating predicates after the failed one', tt => {
        const isString = spy(x => typeof x === 'string');
        const isEmailFormat = spy(x => /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9\._-]+\.[a-z]{2,}$/.test(x));
        aand(isString, isEmailFormat)(1);

        {
            const actual = isEmailFormat.callCount;
            const expected = 0;
            tt.strictEqual(actual, expected, 'should only call first predicate');
        }

        tt.end();
    });

    t.test('should allow earlier compositions to be composable', tt => {
        const isString = x => typeof x === 'string';
        const isEmailFormat = x => /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9\._-]+\.[a-z]{2,}$/.test(x);
        const isEmail = aand(isString, isEmailFormat);

        const isDomainEmail = domain => aand(isEmail, x => x.split('@')[1] === domain);
        const isExampleDotComEmail = isDomainEmail('example.com');

        {
            const actual = isExampleDotComEmail('bob@example.com');
            const expected = true;
            tt.strictEqual(actual, expected, 'should pass predicate check with example.com domain');
        }

        {
            const actual = isExampleDotComEmail('bob@gmail.com');
            const expected = false;
            tt.strictEqual(actual, expected, 'should fail predicate check with gmail.com domain');
        }

        tt.end();
    });
});
