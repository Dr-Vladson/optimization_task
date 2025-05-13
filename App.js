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
        }
        //!!del
        // this.generateRandomData();
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
        let output2 = `Приблизний алгоритм\n Кількість ДРГ (Значення ЦФ) - ${srgsByApprox.length}\n`;
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
        let output = `Кількість вибухівки для одної ДРГ: ${this.maxBombAmount}\nМаксимальна відстань між цілями: ${this.maxDistanceBeetweenTargets}\nКількість цілей: ${targetsCount}\nЦілі: \n`;
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
                        !this.checkInputValue(+x) ||
                        !this.checkInputValue(+y) ||
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
new App();
