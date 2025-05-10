const SRGsByGreedy = greedyAlgorithm(targets, maxBombAmount, maxDistanceBeetweenTargets);
console.log(SRGsByGreedy);
console.log(SRGsByGreedy.length);

const SRGsByApprox = approxAlgorithm(targets, maxBombAmount, maxDistanceBeetweenTargets);
console.log(SRGsByApprox);
// console.log(SRGsByApprox.length);
