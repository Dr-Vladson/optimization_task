function approxAlgorithm(targets, maxBombAmount, maxDistance) {
    targets = [...targets];
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        target.neighboursAmount = 0;
        for (let j = 0; j < targets.length; j++) {
            if (i !== j && distancesMatrix[target.index][targets[j].index] <= maxDistance) {
                target.neighboursAmount++;
            }
        }
    }
    
    targets.sort((a, b) => {
        const cond = a.neighboursAmount - b.neighboursAmount;
        if (cond !== 0) {
            return cond;
        }
        return b.bombAmount - a.bombAmount;
    });

    return greedyAlgorithm(targets, maxBombAmount, maxDistance);
}
