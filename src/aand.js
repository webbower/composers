// ([a -> Boolean]) -> a -> Boolean
const aand = (...preds) => x => preds.every(pred => pred(x));

export default aand;
