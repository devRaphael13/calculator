const keypad = document.getElementsByClassName("keypad__key");
const question = document.getElementById("question");
const answer = document.getElementById("answer");

const signs = ["=", "+", "-", "x", "/", "%", "."];
const config = { characterData: true, subtree: true, childList: true };

document.addEventListener("DOMContentLoaded", () => operate());

// Listen to changes in the question element.
const observer = new MutationObserver((mutations) => {

    // Get display as a string
    let display = mutations[0].addedNodes[0]?.textContent.trimEnd();
    let ram = [];

    ram.push(...clean(display));

    // Check for abnormal sign usage
    ram = validateSign(ram);

    // Allow 2 operand calculation for percent
    if (ram.length > 1 && ram.slice(-1) == "%") {
        let ans = calculate(...ram);
        updateQuestion(ans);
        showAnswer(ans);
    }

    // Normal 3 operand calculation
    if (ram.length > 3) {
        let ans = calculate(...ram);
        let lastSign = ram[3];

        if (lastSign !== "=") updateQuestion(ans, lastSign);
        else updateQuestion(ans);
        showAnswer(ans);
    }
});

observer.observe(question, config);

function validateSign(ram) {
    const preSigns = ["+", "-"];

    // Refuse random signs in front
    if (signs.includes(ram[0]) && !preSigns.includes(ram[0]))
    updateQuestion("");

    // Allow operations with negative numbers
    else if (preSigns.includes(ram[0]) && ram[1]) {
        let [sign, num] = ram.splice(0, 2);
        ram.unshift(Number.parseFloat(`${sign}${num}`));
    }

    // Refuse 2 signs together
    ram.filter((element, i, array) => {
        if (signs.includes(array[i]) && signs.includes(array[i - 1])) {
            array.splice(i - 1, 1);
            updateQuestion(...array);
        }
    });
    
    let q = question.textContent.split(" ")
    let a = q.map((element) => removePoint(element)).join("")
    if (q.join("") !== a) updateQuestion(a)
    return ram;
}
function updateQuestion(num, lastSign = null) {
    question.textContent = lastSign
        ? `${num} ${lastSign} `
        : num === "E"
        ? ""
        : num;
}

function showAnswer(num) {
    answer.textContent = num;
}

function clean(display) {

    // Leave signs & convert the rest to numbers
    if (display) {
        display = display
            .split(" ")
            .filter((element) => element !== "")
            .map((element) =>
                signs.includes(element) ? element : Number.parseFloat(removePoint(element))
            );
    } else {
        display = [];
    }
    return display;
}

function removePoint(string) {
    // Remove unnecessary decimal points eg 123.333.2
    let arr = string.split(".");
    if (arr.length > 1) {
        let int = arr.splice(0, 1);
        return `${int}.${arr.join("")}`
    }
    return string
}

function calculate(a, sign, b = null) {
    const max = 999999999999;
    let ans;
    if (sign === "+" && b) ans = a + b;
    else if (sign === "-" && b) ans = a - b;
    else if (sign === "x" && b) ans = a * b;
    else if (sign === "/" && b) ans = b === 0 ? 0 : a / b;
    else if (sign === "%") ans = a / 100;
    else return (ans = 0);
    return ans < max ? Number.parseFloat(ans.toFixed(10)) : "E";
}

function operate() {
    readyKeypad();
}

function readyKeypad() {
    for (let key of keypad) {
        key.addEventListener("click", (e) => {
                if (e.target.textContent === "AC")
                    // Handle some modifying characters
                    clear();
                else if (e.target.textContent === "Del") del();
                else {
                    // format text on screen
                    let space = e.target.dataset.number === "true" || e.target.textContent === "." ? "" : " ";
                    question.textContent +=
                        space + e.target.textContent + space;
                }
        });
    }
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