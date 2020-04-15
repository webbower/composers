// ([a -> b]) -> a -> b
const compose = (...fns) => x => fns.reduceRight((memo, fn) => fn(memo), x);

export default compose;
