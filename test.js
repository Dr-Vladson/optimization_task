const targets = [new Target(2, 1, 1), new Target(2, 2, 2), new Target(1.5, 0, 0), new Target(1.5, 1, 0), new Target(3, 3, 2)];

const maxBombAmount = 5;
const maxDistanceBeetweenTargets = 1.5;
const distancesMatrix = createDistancesMatrix(targets);

const SRGsByGreedy = greedyAlgorithm(targets, maxBombAmount, maxDistanceBeetweenTargets, distancesMatrix);
console.log(SRGsByGreedy);
console.log(SRGsByGreedy.length);

const SRGsByApprox = approxAlgorithm(targets, maxBombAmount, maxDistanceBeetweenTargets, distancesMatrix);
console.log(SRGsByApprox);
console.log(SRGsByApprox.length);
