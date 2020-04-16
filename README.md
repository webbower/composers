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

### `pipe`

The same as `compose` but functions are applied left-to-right.

```js
pipe: ([a -> b]) -> a -> b

const first = str => str[0];
const toUpper = str => str.toUpperCase();

const getInitial = pipe(first, toUpper);

console.log(getInitial('bob smith')) // B
```

### `sequence`

Function composition for side-effects. The resulting function returns `void`. Each function receives the same argument passed in to the generated function. Very useful for composing DOM event handlers. Functions are processed left-to-right

```js
sequence: ([a -> void]) -> a -> void

const track = event => {
    const { eventName, eventId } = event.target.dataset;
    fetch('http://example.com/track', { method: 'POST', body: `eventName=${eventName}&eventId=${eventId}`});
};
const spaNavigate = event => {
    const { href } = event.target;
    history.push(href);
};

<a href="/foo" onClick={sequence(track, spaNavigate)} data-event-name="bar" data-event-id="1234">Foo</a>
```

### `aand`

Compose predicate functions into a predicate function that returns `true` if every passed-in predicate returns `true`. If just one returns `false`, the whole returned function returns `false` and no further passed-in predicates will be run. Predicate functions are processed left-to-right.

```js
aand: ([a -> Boolean]) -> a -> Boolean

const isString = x => typeof x === 'string';
const isEmail = aand(isString, x => /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9\._-]+\.[a-z]{2,}$/.test(x));

console.log(isEmail(1)) // false. Not a string
console.log(isEmail('bob')) // false. Not a a valid email format
console.log(isEmail('bob@smith.com')) // true

const isDomainEmail = domain => aand(isEmail, x => x.split('@')[1] === domain);
const isExampleDotComEmail = isDomainEmail('example.com');

console.log(isExampleDotComEmail(1)) // false. Not a string
console.log(isExampleDotComEmail('bob')) // false. Not a a valid email format
console.log(isExampleDotComEmail('bob@smith.com')) // false. Wrong domain
console.log(isExampleDotComEmail('bob@example.com')) // true
```

### A note on `compose` and `pipe`

Why have both `compose` and `pipe`? Primarily this is a matter of taste, depending on how you like to write you compositions. `compose` comes from functional programming languages where the right-to-left application is based on mathematical foundations. Additionally, its ordering looks very similar to the naive method of passing the result of one function to the next:

```js
// Naive composition
const getInitial = x => toUpper(first(x));

// Using `compose`
const getInitial = compose(toUpper, first);
```

`pipe` is helpful because, when using it to define a function, the left-to-right ordering aligns with cultures that are used to reading left-to-right.

```js
// Take the first character, then uppercase it
const getInitial = pipe(first, toUpper);

// A more complex example: split the string on whitespce, then take the first 2 entries, then apply `getInitial` to each entry, then join the entries with an empty string.
const getInitials = pipe(split(/\s+/), take(2), map(getInitial), join(''));
```

My rule of thumb for when to use each one is this:

`compose`: Because it looks cleaner (to me) than naively nesting functions, I use it when I need to create a one-off data transformation pipeline that will be assigned to a variable. The raw data starts on the far right and moves one function at a time to the left and is finally assigned to a variable at the far left.

```js
// assign to `initials` <- do join <- do map <- do take <- do split <- name
const initials = compose(join(''), map(getInitial), take(2), split(/\s+/))(name);
```

`pipe`: I use it when I'm defining reusable functions because most code is written to be read left-to-right, so this aligns more closely (for me) with my native English familiarity.

```js
// Split, then take, then map, then join
const getInitials = pipe(split(/\s+/), take(2), map(getInitial), join(''));
```
