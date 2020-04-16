// ([a -> Boolean]) -> a -> Boolean
const oor = (...preds) => x => preds.some(pred => pred(x));

export default oor;
