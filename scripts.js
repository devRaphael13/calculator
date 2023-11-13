const keypad = document.getElementsByClassName("keypad__key");
const question = document.getElementById("question");
const answer = document.getElementById("answer");

const signs = ["=", "+", "-", "x", "/"];
const config = { characterData: true, subtree: true, childList: true };

const observer = new MutationObserver((mutations) => {
    let display = mutations[0].addedNodes[0]?.textContent.trimEnd();
    let ram = [];

    ram.push(...clean(display));
    if (ram.length > 3) {
        let ans = calculate(...ram);
        let lastSign = ram[3];

        if (lastSign !== "=") {
            question.textContent = `${ans} ${lastSign} `
        }
        showAnswer(ans);
    }
});

observer.observe(question, config);
// observer.disconnect()

document.addEventListener("DOMContentLoaded", () => operate());

function operate() {
    readyKeypad();
}

function readyKeypad() {
    for (let key of keypad) {
        key.addEventListener("click", (e) => {
            // TODO sign,
            if (e.target.textContent === "AC") clear();
            else if (e.target.textContent === "Del") del();
            else if (e.target.textContent === "+/-") minusSign();
            else {
                let space = e.target.dataset.number === "false" ? " " : "";
                question.textContent += space + e.target.textContent + space;
            }
        });
    }
}
function showAnswer(num) {
    answer.textContent = num;
}
function clean(display) {
    return display
        ? display
              .split(" ")
              .map((element) =>
                  signs.includes(element) ? element : Number.parseFloat(element)
              )
        : [];
}

function calculate(a, sign, b) {
    if (sign === "+") return add(a, b);
    else if (sign === "-") return subtract(a, b);
    else if (sign === "x") return multiply(a, b);
    else if (sign === "/") return divide(a, b);
}

function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function divide(a, b) {
    return b === 0 ? 0 : a / b;
}
function multiply(a, b) {
    return a * b;
}
function clear() {
    question.textContent = "";
    answer.textContent = "";
}
function del() {
    let arr = question.textContent.trimEnd().split(" ");
    arr.pop();
    question.textContent = arr.join(" ");
}
function minusSign() {}
// function decimals(display) {check if there's a full stop before adding another};
