# Composers

A small library of functional composition utilities.

## API

### `compose`

Your standard issue, right-to-left function composition combiner. Given any number of unary functions, `compose` returns a function that takes a single argument and passes it through the passed-in functions one at a time, passing the result of one function into the next function. The result will be a sequential application of all functions to the argument.

```js
compose: ([a -> b]) -> a -> b

const first = str => str[0];
const toUpper = str => str.toUpperCase();

const getInitial = compose(toUpper, first);

console.log(getInitial('bob smith')) // B
```

