class App {
    constructor() {
        this.targetDevidedOnSRGBombsAmountQuotient = 0.75;
        this.coordZoneLenghtQuotient = 1 / 16;
        this.startModeChoice();
    }

    startModeChoice() {
        this.mode = confirm(
            "Підтвердіть для роботи з індивідуальною задачею, ІНАКШЕ буде ініційовано проведення експериментального дослідження алгоритмів"
        );
        // this.mode = true;
        if (this.mode) {
            this.title = createTitle(
                "1 - введення вручну даних ІЗ,\n 2 - генерація (випадковим чином) даних ІЗ,\n 3 - читання даних із файлу"
            );
            this.numInput = createNumInput(1, 3);
            this.okBtn = createButton();
            this.okBtnFunc = this.onIndividualTaskTypeChoose.bind(this);
            this.okBtn.addEventListener("click", this.okBtnFunc);
        } else {
            this.title = createTitle(
                `1 - Дослідження впливу відношення максимальної к-сті вибухівки у цілей до максимальної кількості вибухівки ДРГ
                 2 - Дослідження впливу кількості цілей ДРГ (розмірності задачі) на час роботи алгоритмів та
                    порівняння ефективності алгоритмів для різної кількості цілей ДРГ (розмірності задачі)`
            );
            this.numInput = createNumInput(1, 2);
            this.okBtn = createButton();
            this.okBtnFunc = this.onExperimentChoose.bind(this);
            this.okBtn.addEventListener("click", this.okBtnFunc);
        }
        //!!del
        // this.generateRandomData();
    }

    onExperimentChoose() {
        switch (this.numInput.value) {
            case "1":
                this.okBtn.removeEventListener("click", this.okBtnFunc);
                this.okBtnFunc = null;
                this.startBombAmountExperimentParamsChoice();
                break;
            case "2":
                this.okBtn.removeEventListener("click", this.okBtnFunc);
                this.okBtnFunc = null;
                this.startTargetsAmountExperimentParamsChoice();
                break;
            default:
                alert("Оберіть 1, 2, 3 чи 4");
                break;
        }
    }

    startTargetsAmountExperimentParamsChoice() {
        this.title.innerText = `Введіть параметри зміни розмірності задачі (кількість цілей ДРГ): від, крок і до`;
        this.numInput.min = 0;
        this.numInput.max = 1000;
        this.numInput.value = 0;
        this.numInput2 = createNumInput(0, 1000);
        this.numInput2.value = 5;
        this.numInput3 = createNumInput(0, 1000);
        this.numInput3.value = 100;
        // this.title2 = createTitle("Введіть кількість цілей ДРГ");
        // this.numInput4 = createNumInput(1, 1000);
        // this.numInput4.value = 100;
        this.title3 = createTitle("Введіть максимальну кількість вибухівки для однієї ДРГ");
        this.numInput5 = createNumInput(1, 100);
        this.numInput5.value = 100;
        this.title4 = createTitle("Введіть максимальну відстань між цілями для однієї ДРГ");
        this.numInput6 = createNumInput(1, 100);
        this.numInput6.value = 100;
        this.title5 = createTitle("Введіть кількість повторів на кожному кроці");
        this.numInput7 = createNumInput(1, 100);
        this.numInput7.value = 100;
        root.appendChild(this.okBtn);
        this.okBtn.innerText = "Розпочати експеримент";
        this.okBtnFunc = this.onTargetsAmountExperimentParamsChoice.bind(this);
        this.okBtn.addEventListener("click", this.okBtnFunc);
    }

    onTargetsAmountExperimentParamsChoice() {
        if (!this.checkInputValue(+this.numInput.value, 0, 1000)) {
            alert("Початкова розмірність має бути у межах від 0 до 1000");
        } else if (!this.checkInputValue(+this.numInput2.value, 0, 100) || +this.numInput2.value === 0) {
            alert("Розмірність кроку має бути у межах (0, 1000]");
        } else if (!this.checkInputValue(+this.numInput3.value, +this.numInput.value, 1000) || +this.numInput3.value === 0) {
            alert("Кінцева розмірність має бути у межах від початкової до 1000");
        } else if (!this.checkInputValue(+this.numInput5.value)) {
            alert("Максимальна кількість вибухівки має бути у межах від 1 до 100");
        } else if (!this.checkInputValue(+this.numInput6.value)) {
            alert("Максимальну відстань має бути у межах від 1 до 100");
        } else if (!this.checkInputValue(+this.numInput7.value)) {
            alert("Кількість повторів на кожному кроці має бути у межах від 1 до 100");
        } else {
            this.okBtn.removeEventListener("click", this.okBtnFunc);
            this.okBtnFunc = null;
            this.createTargetsAmountExperiment({
                startTargetsAmount: +this.numInput.value,
                stepTargetsAmount: +this.numInput2.value,
                endTargetsAmount: +this.numInput3.value,
                // targetsCount: +this.numInput4.value,
                maxBombAmount: +this.numInput5.value,
                maxDistanceBeetweenTargets: +this.numInput6.value,
                repeatsCount: +this.numInput7.value,
            });
            this.okBtn.remove();
            this.numInput.remove();
            this.numInput2.remove();
            this.numInput3.remove();
            this.numInput5.remove();
            this.numInput6.remove();
            this.numInput7.remove();
            this.title.remove();
            this.title3.remove();
            this.title4.remove();
            this.title5.remove();
            this.numInput =
                this.numInput2 =
                this.numInput3 =
                this.numInput5 =
                this.numInput6 =
                this.numInput7 =
                this.title =
                this.okBtn =
                this.title3 =
                this.title4 =
                this.title5 =
                    null;
        }
    }

    createTargetsAmountExperiment({
        startTargetsAmount,
        stepTargetsAmount,
        endTargetsAmount,
        maxBombAmount,
        maxDistanceBeetweenTargets,
        repeatsCount,
    }) {
        const totalData = {
            steps: [],
            greedyTimes: [],
            approxTimes: [],
            greedyResults: [],
            approxResults: [],
        };
        this.coordZoneLenghtQuotient = 1 / 16;
        maxBombAmount *= this.targetDevidedOnSRGBombsAmountQuotient;
        for (let targetsCount = startTargetsAmount; targetsCount <= endTargetsAmount; targetsCount += stepTargetsAmount) {
            const stepData = {
                greedyResultsSum: 0,
                approxResultsSum: 0,
                greedyTimesSum: 0,
                approxTimesSum: 0,
            };
            const coordZoneLength = targetsCount * maxDistanceBeetweenTargets * this.coordZoneLenghtQuotient;
            for (let j = 0; j < repeatsCount; j++) {
                const { targets, distanceMatrix } = this.generateRandomTargets({
                    maxBombAmount,
                    coordZoneLength,
                    targetsCount,
                });
                let greedyTime = performance.now();
                const srgsByGreedy = greedyAlgorithm(targets, maxBombAmount, maxDistanceBeetweenTargets, distanceMatrix);
                greedyTime = performance.now() - greedyTime;
                console.log("greedyTime", greedyTime);
                stepData.greedyTimesSum += greedyTime;
                stepData.greedyResultsSum += srgsByGreedy.length;

                let approxTime = performance.now();
                const srgsByApprox = approxAlgorithm(targets, maxBombAmount, maxDistanceBeetweenTargets, distanceMatrix);
                approxTime = performance.now() - approxTime;
                console.log("approxTime", approxTime);
                stepData.approxTimesSum += approxTime;
                stepData.approxResultsSum += srgsByApprox.length;
            }
            // console.log("stepData", stepData);
            const greedyAvgTime = stepData.greedyTimesSum / repeatsCount;
            const approxAvgTime = stepData.approxTimesSum / repeatsCount;
            const greedyAvgResult = stepData.greedyResultsSum / repeatsCount;
            const approxAvgResult = stepData.approxResultsSum / repeatsCount;
            totalData.steps.push(targetsCount);
            totalData.greedyTimes.push(greedyAvgTime);
            totalData.approxTimes.push(approxAvgTime);
            totalData.greedyResults.push(greedyAvgResult);
            totalData.approxResults.push(approxAvgResult);
        }
        console.log("experiment results", totalData);
        this.createGraph(
            {
                nameX: "Розмірність задачі (кількість цілей ДРГ)",
                nameY: "Середній час роботи алгоритму (мс)",
                canvasId: "chart1",
            },
            { data: totalData.steps },
            { name: "Жадібний", color: "red", data: totalData.greedyTimes },
            { name: "Наближений", color: "blue", data: totalData.approxTimes }
        );
        this.createGraph(
            {
                nameX: "Розмірність задачі (кількість цілей ДРГ)",
                nameY: "Середня кількість ДРГ (значення ЦФ)",
                canvasId: "chart2",
            },
            { data: totalData.steps },
            { name: "Жадібний", color: "red", data: totalData.greedyResults },
            { name: "Наближений", color: "blue", data: totalData.approxResults }
        );
    }

    startBombAmountExperimentParamsChoice() {
        this.title.innerText = `Введіть початковий відсоток, відсоток кроку, кінцевий відсоток максимальної 
            кількості вибухівки у цілі відносно максимальної кількості вибухівки ДРГ`;
        this.numInput.min = 0;
        this.numInput.max = 100;
        this.numInput.value = 0;
        this.numInput2 = createNumInput(0, 100);
        this.numInput2.value = 5;
        this.numInput3 = createNumInput(0, 100);
        this.numInput3.value = 100;
        this.title2 = createTitle("Введіть кількість цілей ДРГ");
        this.numInput4 = createNumInput(1, 1000);
        this.numInput4.value = 100;
        this.title3 = createTitle("Введіть максимальну кількість вибухівки для однієї ДРГ");
        this.numInput5 = createNumInput(1, 100);
        this.numInput5.value = 100;
        this.title4 = createTitle("Введіть максимальну відстань між цілями для однієї ДРГ");
        this.numInput6 = createNumInput(1, 100);
        this.numInput6.value = 100;
        this.title5 = createTitle("Введіть кількість повторів на кожному кроці");
        this.numInput7 = createNumInput(1, 100);
        this.numInput7.value = 100;
        root.appendChild(this.okBtn);
        this.okBtn.innerText = "Розпочати експеримент";
        this.okBtnFunc = this.onBombAmountExperimentParamsChoice.bind(this);
        this.okBtn.addEventListener("click", this.okBtnFunc);
    }

    onBombAmountExperimentParamsChoice() {
        if (!this.checkInputValue(+this.numInput.value, 0, 100)) {
            alert("Початковий відсоток має бути у межах від 0 до 100");
        } else if (!this.checkInputValue(+this.numInput2.value, 0, 100) || +this.numInput2.value === 0) {
            alert("Відсоток кроку має бути у межах (0, 100]");
        } else if (!this.checkInputValue(+this.numInput3.value, +this.numInput.value, 100) || +this.numInput3.value === 0) {
            alert("Кінцевий відсоток має бути у межах від початкового до 100");
        } else if (!this.checkInputValue(+this.numInput4.value, 1, 1000)) {
            alert("Кількість цілей ДРГ має бути у межах від 1 до 1000");
        } else if (!this.checkInputValue(+this.numInput5.value)) {
            alert("Максимальна кількість вибухівки має бути у межах від 1 до 100");
        } else if (!this.checkInputValue(+this.numInput6.value)) {
            alert("Максимальну відстань має бути у межах від 1 до 100");
        } else if (!this.checkInputValue(+this.numInput7.value)) {
            alert("Кількість повторів на кожному кроці має бути у межах від 1 до 100");
        } else {
            this.okBtn.removeEventListener("click", this.okBtnFunc);
            this.okBtnFunc = null;
            this.createBombAmountExperiment({
                startPercent: +this.numInput.value,
                stepPercent: +this.numInput2.value,
                endPercent: +this.numInput3.value,
                targetsCount: +this.numInput4.value,
                maxBombAmount: +this.numInput5.value,
                maxDistanceBeetweenTargets: +this.numInput6.value,
                repeatsCount: +this.numInput7.value,
            });
            this.okBtn.remove();
            this.numInput.remove();
            this.numInput2.remove();
            this.numInput3.remove();
            this.numInput4.remove();
            this.numInput5.remove();
            this.numInput6.remove();
            this.numInput7.remove();
            this.title.remove();
            this.title2.remove();
            this.title3.remove();
            this.title4.remove();
            this.title5.remove();
            this.numInput =
                this.numInput2 =
                this.numInput3 =
                this.numInput4 =
                this.numInput5 =
                this.numInput6 =
                this.numInput7 =
                this.title =
                this.okBtn =
                this.title2 =
                this.title3 =
                this.title4 =
                this.title5 =
                    null;
        }
    }

    createBombAmountExperiment({
        startPercent,
        stepPercent,
        endPercent,
        targetsCount,
        maxBombAmount,
        maxDistanceBeetweenTargets,
        repeatsCount,
    }) {
        const totalData = {
            steps: [],
            greedyTimes: [],
            approxTimes: [],
            greedyResults: [],
            approxResults: [],
        };
        this.coordZoneLenghtQuotient = 1 / 16;
        const coordZoneLength = targetsCount * maxDistanceBeetweenTargets * this.coordZoneLenghtQuotient;
        for (let i = startPercent; i <= endPercent; i += stepPercent) {
            const stepData = {
                greedyResultsSum: 0,
                approxResultsSum: 0,
                greedyTimesSum: 0,
                approxTimesSum: 0,
            };
            const targetMaxBombAmount = (maxBombAmount * i) / 100;
            for (let j = 0; j < repeatsCount; j++) {
                const { targets, distanceMatrix } = this.generateRandomTargets({
                    maxBombAmount: targetMaxBombAmount,
                    coordZoneLength,
                    targetsCount,
                });
                let greedyTime = performance.now();
                const srgsByGreedy = greedyAlgorithm(targets, maxBombAmount, maxDistanceBeetweenTargets, distanceMatrix);
                greedyTime = performance.now() - greedyTime;
                console.log("greedyTime", greedyTime);
                stepData.greedyTimesSum += greedyTime;
                stepData.greedyResultsSum += srgsByGreedy.length;

                let approxTime = performance.now();
                const srgsByApprox = approxAlgorithm(targets, maxBombAmount, maxDistanceBeetweenTargets, distanceMatrix);
                approxTime = performance.now() - approxTime;
                console.log("approxTime", approxTime);
                stepData.approxTimesSum += approxTime;
                stepData.approxResultsSum += srgsByApprox.length;
            }
            // console.log("stepData", stepData);
            const greedyAvgTime = stepData.greedyTimesSum / repeatsCount;
            const approxAvgTime = stepData.approxTimesSum / repeatsCount;
            const greedyAvgResult = stepData.greedyResultsSum / repeatsCount;
            const approxAvgResult = stepData.approxResultsSum / repeatsCount;
            totalData.steps.push(i);
            totalData.greedyTimes.push(greedyAvgTime);
            totalData.approxTimes.push(approxAvgTime);
            totalData.greedyResults.push(greedyAvgResult);
            totalData.approxResults.push(approxAvgResult);
        }
        console.log("experiment results", totalData);
        this.createGraph(
            {
                nameX: "Співвідношення максимальної к-ті вибухівки для цілей до максимальної к-сті для ДРГ, %",
                nameY: "Середній час роботи алгоритму (мс)",
                canvasId: "chart1",
            },
            { data: totalData.steps },
            { name: "Жадібний", color: "red", data: totalData.greedyTimes },
            { name: "Наближений", color: "blue", data: totalData.approxTimes }
        );
        this.createGraph(
            {
                nameX: "Співвідношення максимальної к-ті вибухівки для цілей до максимальної к-сті для ДРГ, %",
                nameY: "Середня кількість ДРГ (значення ЦФ)",
                canvasId: "chart2",
            },
            { data: totalData.steps },
            { name: "Жадібний", color: "red", data: totalData.greedyResults },
            { name: "Наближений", color: "blue", data: totalData.approxResults }
        );
    }

    createGraph(config, x, ...ys) {
        const datasets = [];
        for (let y of ys) {
            const dataPoints = [];
            for (let j = 0; j < x.data.length; j++) {
                dataPoints.push({ x: x.data[j], y: y.data[j] });
            }
            datasets.push({
                label: y.name,
                data: dataPoints,
                borderColor: y.color,
                fill: false,
                tension: 0.4,
            });
        }

        const ctx = document.getElementById(config.canvasId).getContext("2d");
        ctx.width = 400;
        ctx.height = 200;
        new Chart(ctx, {
            type: "line",
            data: {
                datasets,
            },
            options: {
                scales: {
                    x: {
                        type: "linear",
                        title: {
                            display: true,
                            text: config.nameX,
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: config.nameY,
                        },
                    },
                },
            },
        });

        // const ctx = document.getElementById("chart").getContext("2d");
        // const dataPoints = [
        //     { x: 1.1, y: 10 },
        //     { x: 2.3, y: 20 },
        //     { x: 3.5, y: 15 },
        //     { x: 4.75, y: 25 },
        //     { x: 5.9, y: 30 },
        // ];

        // console.log(this.chart);
        // this.chart = new Chart(ctx, {
        //     type: "line",
        //     data: {
        //         datasets: [{
        //             label: "Графік",
        //             data: dataPoints,
        //             borderColor: "red",
        //             fill: false,
        //             tension: 0.4,
        //         }],
        //     },
        //     options: {
        //         responsive: true,
        //         animation: {
        //             duration: 0,
        //         },
        //         scales: {
        //             x: {
        //                 type: "linear",
        //             },
        //         },
        //     },
        // });
    }

    generateRandomTargets({ targetsCount, maxBombAmount, coordZoneLength }) {
        const targets = [];
        Target.index = 0;
        for (let i = 0; i < targetsCount; i++) {
            const x = Math.floor(Math.random() * coordZoneLength) - coordZoneLength / 2;
            const y = Math.floor(Math.random() * coordZoneLength) - coordZoneLength / 2;
            const bombs = Math.floor(Math.random() * maxBombAmount) + 1;
            targets.push(new Target(bombs, x, y));
        }
        const distanceMatrix = createDistancesMatrix(targets);
        return { targets, distanceMatrix };
    }

    onIndividualTaskTypeChoose() {
        switch (this.numInput.value) {
            case "1":
                this.okBtn.removeEventListener("click", this.okBtnFunc);
                this.okBtnFunc = null;
                this.initManualInputRound1();
                break;
            case "2":
                this.okBtn.removeEventListener("click", this.okBtnFunc);
                this.okBtnFunc = null;
                this.generateRandomData();
                break;
            case "3":
                this.okBtn.removeEventListener("click", this.okBtnFunc);
                this.okBtnFunc = null;
                this.initFileChoiceRound();
                break;
            default:
                alert("Оберіть 1, 2 чи 3");
                break;
        }
    }

    initManualInputRound1() {
        this.title.innerText = "Введіть кількість цілей ДРГ";
        this.numInput.min = 1;
        this.numInput.max = 100;
        this.numInput.value = 1;
        this.title2 = createTitle("Введіть максимальну кількість вибухівки для одної ДРГ");
        this.numInput2 = createNumInput(1, 100);
        this.title3 = createTitle("Введіть максимальну відстань між цілями");
        this.numInput3 = createNumInput(1, 100);
        root.appendChild(this.okBtn);
        this.okBtnFunc = this.onManualInputRound1.bind(this);
        this.okBtn.addEventListener("click", this.okBtnFunc);
    }

    onManualInputRound1() {
        if (!this.checkInputValue(+this.numInput.value)) {
            alert("Кількість цілей ДРГ має бути у межах від 1 до 100");
        } else if (!this.checkInputValue(+this.numInput2.value)) {
            alert("Максимальна кількість вибухівки має бути у межах від 1 до 100");
        } else if (!this.checkInputValue(+this.numInput3.value)) {
            alert("Максимальну відстань має бути у межах від 1 до 100");
        } else {
            this.okBtn.removeEventListener("click", this.okBtnFunc);
            this.okBtnFunc = null;
            this.maxBombAmount = +this.numInput2.value;
            this.maxDistanceBeetweenTargets = +this.numInput3.value;
            this.initManualInputRound2();
        }
    }

    initManualInputRound2() {
        const targetsCount = +this.numInput.value;
        this.numInput.remove();
        this.title2.remove();
        this.numInput2.remove();
        this.title3.remove();
        this.numInput3.remove();
        this.numInput = this.title2 = this.numInput2 = this.title3 = this.numInput3 = null;
        this.title.innerText = "Введіть дані об'єктів ДРГ (координати x та y, кількість вибухівки)";
        this.targetInputsGroups = [];
        for (let i = 0; i < targetsCount; i++) {
            const inputsGroup = {};
            this.targetInputsGroups.push(inputsGroup);
            inputsGroup.x = createNumInput(-10000, 10000, "x");
            inputsGroup.y = createNumInput(-10000, 10000, "y");
            inputsGroup.bombs = createNumInput(1, this.maxBombAmount, "бомб к-сть");
            root.appendChild(document.createElement("br"));
        }
        root.appendChild(this.okBtn);
        this.okBtnFunc = this.onManualInputRound2.bind(this);
        this.okBtn.innerText = "Розв'язати задачу";
        this.okBtn.addEventListener("click", this.okBtnFunc);
    }

    onManualInputRound2() {
        this.targets = [];
        Target.index = 0;
        for (let { x, y, bombs } of this.targetInputsGroups) {
            if (!this.checkInputValue(+x.value, -10000, 10000)) {
                this.targets = null;
                alert("Координата x має бути у межах від -10000 до 10000");
                return;
            } else if (!this.checkInputValue(+y.value, -10000, 10000)) {
                this.targets = null;
                alert("Координата y має бути у межах від -10000 до 10000");
                return;
            } else if (!this.checkInputValue(+bombs.value, 1, this.maxBombAmount)) {
                this.targets = null;
                alert(`Кількість вибухівки має бути у межах від 1 до ${this.maxBombAmount} (максимальної заданої для однієї ДРГ)`);
                return;
            }
            this.targets.push(new Target(+bombs.value, +x.value, +y.value));
        }
        this.okBtn.removeEventListener("click", this.okBtnFunc);
        this.resolveTask();
    }

    resolveTask() {
        this.okBtn.remove();
        this.okBtn = null;
        this.resultP1 = document.createElement("p");
        resultContainer1.appendChild(this.resultP1);
        this.resultP2 = document.createElement("p");
        resultContainer2.appendChild(this.resultP2);
        this.distanceMatrix = createDistancesMatrix(this.targets);
        const srgsByGreedy = greedyAlgorithm(this.targets, this.maxBombAmount, this.maxDistanceBeetweenTargets, this.distanceMatrix);
        // const result2 = approxAlgorithm(this.targets, this.maxBombAmount, this.maxDistanceBeetweenTargets, this.distanceMatrix);
        let output1 = `Жадібний алгоритм\n Кількість ДРГ (Значення ЦФ) - ${srgsByGreedy.length}\n`;
        for (let i = 0; i < srgsByGreedy.length; i++) {
            const srg = srgsByGreedy[i];
            output1 += `- ДРГ ${i + 1}. Кількість вибухівки: ${srg.bombAmount}\n`;
            for (let j = 0; j < srg.targets.length; j++) {
                const target = srg.targets[j];
                output1 += `--- Ціль ${j + 1}: x = ${target.x}, y = ${target.y}, вибухівка = ${target.bombAmount};\n`;
            }
        }
        const srgsByApprox = approxAlgorithm(this.targets, this.maxBombAmount, this.maxDistanceBeetweenTargets, this.distanceMatrix);
        let output2 = `Наближений алгоритм\n Кількість ДРГ (Значення ЦФ) - ${srgsByApprox.length}\n`;
        for (let i = 0; i < srgsByApprox.length; i++) {
            const srg = srgsByApprox[i];
            output2 += `- ДРГ ${i + 1}. Кількість вибухівки: ${srg.bombAmount}\n`;
            for (let j = 0; j < srg.targets.length; j++) {
                const target = srg.targets[j];
                output2 += `--- Ціль ${j + 1}: x = ${target.x}, y = ${target.y}, вибухівка = ${target.bombAmount};\n`;
            }
        }
        this.resultP1.innerText = output1;
        this.resultP2.innerText = output2;
    }

    generateRandomData() {
        this.numInput.remove();
        this.numInput = null;
        this.maxBombAmount = Math.floor(Math.random() * 100) + 1;
        this.maxDistanceBeetweenTargets = Math.floor(Math.random() * 100) + 1;
        const targetsCount = Math.floor(Math.random() * 100) + 1;
        this.targets = [];
        Target.index = 0;
        let output = `-  Згенерована випадково умова задачі:
        Кількість вибухівки для одної ДРГ: ${this.maxBombAmount}
        Максимальна відстань між цілями: ${this.maxDistanceBeetweenTargets}
        Кількість цілей: ${targetsCount}\nЦілі: \n`;
        const coordZone = targetsCount * this.maxDistanceBeetweenTargets * this.coordZoneLenghtQuotient;
        for (let i = 0; i < targetsCount; i++) {
            const x = Math.floor(Math.random() * coordZone) - coordZone / 2;
            const y = Math.floor(Math.random() * coordZone) - coordZone / 2;
            const bombs = Math.floor(Math.random() * this.maxBombAmount * this.targetDevidedOnSRGBombsAmountQuotient) + 1;
            this.targets.push(new Target(bombs, x, y));
            output += `- Ціль ${i + 1}: x = ${x}, y = ${y}, кількість вибухівки = ${bombs}\n`;
        }
        this.title.innerText = output;
        this.okBtn.innerText = "Розв'язати задачу";
        this.okBtn.onclick = () => {
            this.okBtn.onclick = null;
            this.resolveTask();
        };
        //!!del
        // this.resolveTask();
    }

    initFileChoiceRound() {
        this.title2 = createTitle("Введіть максимальну кількість вибухівки для одної ДРГ");
        this.numInput2 = createNumInput(1, 100);
        this.title3 = createTitle("Введіть максимальну відстань між цілями");
        this.numInput3 = createNumInput(1, 100);
        this.title.innerText =
            "Виберіть txt файл з даними про цілі ДРГ (формат: x, y, кількість вибухівки)\n Приклад: \n 1, 2, 3\n 4, 5, 6\n 7, 8, 9\n";
        this.numInput.type = "file";
        this.numInput.accept = ".txt";
        root.appendChild(this.okBtn);
        this.okBtnFunc = this.onFileChoiceRound.bind(this);
        this.okBtn.addEventListener("click", this.okBtnFunc);
    }

    onFileChoiceRound() {
        if (!this.checkInputValue(+this.numInput2.value)) {
            alert("Максимальна кількість вибухівки має бути у межах від 1 до 100");
        } else if (!this.checkInputValue(+this.numInput3.value)) {
            alert("Максимальна відстань має бути у межах від 1 до 100");
        } else {
            const file = this.numInput.files[0];
            if (!file) {
                alert("Виберіть файл");
                return;
            }
            this.maxBombAmount = +this.numInput2.value;
            this.maxDistanceBeetweenTargets = +this.numInput3.value;
            this.targets = [];
            Target.index = 0;
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const rows = data.split("\n").map((row) => row.replace(/\r/g, ""));
                let output = `Кількість вибухівки для одної ДРГ: ${this.maxBombAmount}\nМаксимальна відстань між цілями: ${this.maxDistanceBeetweenTargets}\nКількість цілей: ${rows.length}\nЦілі: \n`;
                for (let i = 0; i < rows.length; i++) {
                    const [x, y, bombs] = rows[i].split(" ");
                    if (
                        !x ||
                        !y ||
                        !bombs ||
                        !this.checkInputValue(+x, -1000, 1000) ||
                        !this.checkInputValue(+y, -1000, 1000) ||
                        !this.checkInputValue(+bombs, 1, this.maxBombAmount)
                    ) {
                        alert("Дані файлу не відповідають формату або виходять за межі допустимих значень");
                        this.targets = null;
                        reader.onload = null;
                        return;
                    }
                    this.targets.push(new Target(Number(bombs), Number(x), Number(y)));
                    output += `- Ціль ${i + 1}: x = ${x}, y = ${y}, кількість вибухівки = ${bombs}\n`;
                }
                this.title.innerText = output;
                this.okBtn.removeEventListener("click", this.okBtnFunc);
                this.okBtnFunc = null;
                this.numInput.remove();
                this.title2.remove();
                this.numInput2.remove();
                this.title3.remove();
                this.numInput3.remove();
                this.numInput = this.title2 = this.numInput2 = this.title3 = this.numInput3 = null;
                this.okBtn.innerText = "Розв'язати задачу";
                this.okBtn.onclick = () => {
                    this.okBtn.onclick = null;
                    this.resolveTask();
                };
            };
            reader.readAsText(file);
        }
    }

    checkInputValue(value, min = 1, max = 100) {
        if (value >= min && value <= max) return true;
    }
}
const app = new App();
