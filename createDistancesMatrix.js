function createDistancesMatrix(targets) {
    const distancesMatrix = [];
    for (let i = 0; i < targets.length; i++) {
        distancesMatrix[i] = [];
        for (let j = 0; j < targets.length; j++) {
            if (i === j) {
                distancesMatrix[i][j] = 0;
            } else {
                distancesMatrix[i][j] = targets[i].getDistanceTo(targets[j]);
            }
        }
    }
    return distancesMatrix;
}
