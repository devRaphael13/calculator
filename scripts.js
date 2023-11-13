const keypad = document.getElementsByClassName("keypad__key");
const question = document.getElementById("question");
const answer = document.getElementById("answer");

const signs = ["=", "+", "-", "x", "/", "%"];
const config = { characterData: true, subtree: true, childList: true };

const observer = new MutationObserver((mutations) => {
    let display = mutations[0].addedNodes[0]?.textContent.trimEnd();
    let ram = [];

    ram.push(...clean(display));
    ram = validateSign(ram);
    if (ram.length > 3) {
        let ans = calculate(...ram);
        let lastSign = ram[3];

        if (lastSign !== "=") updateQuestion(ans, lastSign);
        else updateQuestion(ans);
        showAnswer(ans);
    }
});

observer.observe(question, config);
// observer.disconnect()

function validateSign(ram) {
    if (signs.includes(ram[0]) && !["+", "-"].includes(ram[0]))
        updateQuestion("");

    ram.filter((element, i, array) => {
        if (signs.includes(array[i]) && signs.includes(array[i - 1])) {
            array.splice(i - 1, 1);
            updateQuestion(...array);
        }
    });
    return ram;
}
function updateQuestion(num, lastSign = null) {
    question.textContent = lastSign ? `${num} ${lastSign} ` : num;
}
function showAnswer(num) {
    answer.textContent = num;
}
function clean(display) {
    return display
        ? display
              .split(" ")
              .filter((element) => element !== "")
              .map((element) =>
                  signs.includes(element) ? element : Number.parseFloat(element)
              )
        : [];
}

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
            else {
                let space = e.target.dataset.number === "false" ? " " : "";
                question.textContent += space + e.target.textContent + space;
            }
        });
    }
}

function calculate(a, sign, b = null) {
    if (sign === "+" && b) return a + b;
    else if (sign === "-" && b) return a - b;
    else if (sign === "x" && b) return a * b;
    else if (sign === "/" && b) return b === 0 ? 0 : a / b;
    else if (sign === "%") return a / 100;
    else return 0;
}

function clear() {
    question.textContent = "";
    answer.textContent = "";
}

function del() {
    let arr = question.textContent.trimEnd().split("");
    arr.pop();
    question.textContent = arr.join("");
}
