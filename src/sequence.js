// ([a -> void]) -> a -> void
const sequence = (...fns) => x => fns.forEach(fn => fn(x));

export default sequence;
