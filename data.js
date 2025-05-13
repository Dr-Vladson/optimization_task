const targets = [new Target(2, 1, 1), new Target(2, 2, 2), new Target(1.5, 0, 0), new Target(1.5, 1, 0), new Target(3, 3, 2)];

const maxBombAmount = 5;
const maxDistanceBeetweenTargets = 1.5;

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
const distancesMatrix = createDistancesMatrix(targets);
