function greedyAlgorithm(targets, maxBombAmount, maxDistance, distancesMatrix) {
    const srgs = [];
    targets = [...targets];
    // let counter = 0;
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
        // console.log("Fff")
        // counter++;
        // if (counter > targets.length) {
        //     break;
        // }
    }
    return srgs;
}
