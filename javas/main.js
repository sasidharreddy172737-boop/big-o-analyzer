//update 1500 count
const codebox = document.getElementById("box");
const upcount = document.getElementById("char-count");
codebox.addEventListener('input', function () {
    const le = codebox.value.length;
    upcount.textContent = `${le}/1500`
});
// clear the responce
const clear = document.getElementById("button2");
const timeshow = document.getElementById("time");
const spaceshow = document.getElementById("space");
const z = 0;
clear.addEventListener('click', function () {
    upcount.textContent = `${z}/1500`;
    codebox.value = "";
    timeshow.textContent = "-";
    spaceshow.textContent = "-";
});
// calculate button input taking
const cal = document.getElementById("button1");
cal.addEventListener('click', function () {
    const cod = codebox.value;
    if (cod.trim() == "") {
        alert('ENTER SOME TEXT OR CODE !!');
        return;
    }
    const result = analyze(cod);
    timeshow.textContent = result.time;
    spaceshow.textContent = result.space;

    // update the color based on complexity
    if (result.time.includes("O(1)")) {
        timeshow.style.color = "#00c853";
    }
    else if (result.time.includes("log n") && !result.time.includes("n log")) {
        timeshow.style.color = "#00e676";
    }
    else if (result.time === "O(n)") {
        timeshow.style.color = "#4fc3f7";
    }
    else if (result.time.includes("n log n")) {
        timeshow.style.color = "#ffd600";
    }
    else if (result.time.includes("n²")) {
        timeshow.style.color = "#ff6b00";
    }
    else if (result.time.includes("n³")) {
        timeshow.style.color = "#ff3d00";
    }
    else if (result.time.includes("2ⁿ") || result.time.includes("n!")) {
        timeshow.style.color = "#ff0000";
    }
    else {
        timeshow.style.color = "#00c853";
    }
});