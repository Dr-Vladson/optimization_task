const SRGsByGreedy = greedyAlgorithm(targets, maxBombAmount, maxDistanceBeetweenTargets, distancesMatrix);
console.log(SRGsByGreedy);
console.log(SRGsByGreedy.length);

const SRGsByApprox = approxAlgorithm(targets, maxBombAmount, maxDistanceBeetweenTargets, distancesMatrix);
console.log(SRGsByApprox);
// console.log(SRGsByApprox.length);
