const spy = (fn, ctx = null) => {
    const spied = function spied(...args) {
        spied.callCount += 1;
        spied.callArgs.push(args);
        if (fn) {
            return fn.apply(ctx, args);
        }
    };
    spied.callCount = 0;
    spied.callArgs = [];

    return spied;
};

export { spy };
