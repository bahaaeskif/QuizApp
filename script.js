let spans = document.querySelector(".spans");
let countQues = document.querySelector(".count span");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countDownDiv = document.querySelector(".countdown");


let currentIndex = 0;
let rightAnswersCount = 0;
let duration = 20; //in seconds
let countDownInterveal; //global because u need to stop the timer from multiple place

async function getData(resourse) {
    let response = await fetch(resourse);

    if (response.status !== 200) {

        throw new Error("can't fetch data");
    }
    let data = await response.json();

    return data;
};



getData("/main.json").then((e) => {
    let num = e.length;
    createBullets(num);
    extractData(e[currentIndex], num);
    countDown(duration, num);

    submitButton.addEventListener("click", () => {
        clearInterval(countDownInterveal);
        countDown(duration, num);
        let rightAnswer = e[currentIndex]["right_answer"];
        currentIndex++;
        checkAnswers(rightAnswer, num);
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        extractData(e[currentIndex], num);
        handelBullets();
        showResults(num);
    });
});



function extractData(object, num) {
    if (currentIndex < num) {
        let question = document.createElement("h2");

        let questionText = document.createTextNode(object['title']);

        question.append(questionText);

        quizArea.append(question);

        for (let i = 1; i <= 4; i++) {
            let answer = object[`answer_${i}`];

            let div = document.createElement("div");
            div.classList.add("answer");

            let input = document.createElement("input");

            if (i === 1) {
                input.checked = true;
            }

            input.setAttribute("type", "radio");
            input.setAttribute("id", `ansewr_${i}`);
            input.setAttribute("data-ans", answer);
            input.setAttribute("name", `question`);

            let label = document.createElement("label");
            label.setAttribute("for", `ansewr_${i}`);
            let labelText = document.createTextNode(answer);

            label.append(labelText);
            div.append(input);
            div.append(label);
            answersArea.append(div);
        }
    }
}


function createBullets(num) {
    countQues.innerHTML = `${num}`;

    for (let i = 0; i < num; i++) {
        let span = document.createElement("span");
        spans.append(span)

        if (i === currentIndex) {
            span.classList.add("on")
        }
    }
}

function checkAnswers(rans, num) {
    let answers = document.getElementsByName("question");
    let chosenAnswer;
    for (let index = 0; index < answers.length; index++) {
        if (answers[index].checked) {
            chosenAnswer = answers[index].dataset.ans;
        }
    }
    if (rans === chosenAnswer) {
        rightAnswersCount++;
    }
}


function handelBullets() {
    let spans = document.querySelectorAll(".spans span");
    spans = Array.from(spans);
    spans.forEach((e, i) => {
        if (i === currentIndex) {
            e.classList.add("on");
        }
    });
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        spans.remove();

        if (rightAnswersCount > count / 2 && rightAnswersCount < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswersCount} From ${count}`;
        } else if (rightAnswersCount === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswersCount} From ${count}`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";
    }
}

function countDown(duration, num) {
    if (currentIndex < num) {
        let minutes, secounds;
        countDownInterveal = setInterval(() => {
            minutes = parseInt(duration / 60);
            secounds = parseInt(duration % 60);
            minutes < 10 ? minutes = `0${minutes}` : minutes = `${minutes}`;
            secounds < 10 ? secounds = `0${secounds}` : secounds = `${secounds}`;
            countDownDiv.innerHTML = `
        ${minutes}:${secounds}
        `
            if (--duration < 0) {
                clearInterval(countDownInterveal);
                submitButton.click();
            }
        }, 1000);
    }
}