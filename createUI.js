const root = document.querySelector("#root");
const resultContainer1 = document.querySelector("#result1");
const resultContainer2 = document.querySelector("#result2");

function createButton() {
    const button = document.createElement("button");
    button.innerText = "Продовжити";
    root.appendChild(button);
    return button;
}

function createNumInput(min, max, placeholder) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = min;
    input.max = max;
    if (placeholder) {
        input.placeholder = placeholder;
    } else {
        input.value = min;
    }
    root.appendChild(input);
    return input;
}

function createTitle(text) {
    const title = document.createElement("p");
    title.innerText = text;
    root.appendChild(title);
    return title;
}
