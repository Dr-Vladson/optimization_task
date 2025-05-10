function greedyAlgorithm(targets, maxBombAmount, maxDistance) {
    const srgs = [];
    targets = [...targets];
    while (targets.length) {
        const srg = new SRG();
        srgs.push(srg);
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            if (
                srg.bombAmount + target.bombAmount <= maxBombAmount &&
                srg.targets.every((t) => distancesMatrix[t.index][target.index] <= maxDistance)
            ) {
                srg.targets.push(target);
                targets.splice(i, 1);
                i--;
                srg.bombAmount += target.bombAmount;
            }
        }
    }
    return srgs;
}
