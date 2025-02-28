class Question {
    constructor(id, mark, body, correct_answer, course, level, choices) {
        this.id = id;
        this.mark = mark;
        this.body = body;
        this.correct_answer = correct_answer;
        this.course = course;
        this.level = level;
        this.choices = choices;
    }
}
class StudentAnswer {
    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
    }
}

let studentAnswers = [];
let Questions = [];
let CourseQuestions = [];
let currentQuestion = 0;
let time;
let flaggedQuestions = [];
let flagBtn = document.getElementById("flag-btn");
let flagIcon = flagBtn.querySelector("i");
async function loadQuestions() {
    try {
        let response = await fetch('./Assets/Data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        Questions = data.Questions.map(q => new Question(q.id, q.mark, q.body, q.correct_answer, q.course, q.level, q.choices));
        Questions = RandomizeArray(Questions);
        let selectedCourse = new URLSearchParams(window.location.search).get('course');
        let selectedLevel = new URLSearchParams(window.location.search).get('level');
        CourseQuestions = Questions.filter(question => question.course == selectedCourse && question.level == selectedLevel);
        showQuizInfo();
    } catch (error) {
        console.error(error);
    }
}
function showQuizInfo() {
    document.getElementById("Qnum").innerHTML = CourseQuestions.length + " questions";
    time = Math.floor(CourseQuestions.length/3);
    document.getElementById("timerShow").innerHTML = time + " Minutes ";
    document.getElementById("title").innerHTML = CourseQuestions[0].course + " Quiz";
}
function startQuiz() {
    document.getElementById("boxStart").style.display = "none";
    document.getElementById("box").style.display = "block";
    document.getElementById("flagBox").style.display = "block";
    startTimer();
    showQuestions();
}
function showQuestions() {
    if (currentQuestion < CourseQuestions.length - 1) {
        document.getElementById("next-btn").innerHTML = "Next Question";
    } else if (currentQuestion == CourseQuestions.length - 1) {
        document.getElementById("next-btn").innerHTML = "Submit";
    }

    document.getElementById("progress").innerHTML = `${currentQuestion + 1}/${CourseQuestions.length}`;

    if (flaggedQuestions.includes(currentQuestion)) {
        flagIcon.classList.add("fa-solid");
        flagIcon.classList.remove("fa-regular");
    }
    else {
        flagIcon.classList.add("fa-regular");
        flagIcon.classList.remove("fa-solid");
    }
    const { body, choices } = CourseQuestions[currentQuestion];
    document.getElementById("question").innerHTML = body;
    let choicesL = RandomizeArray(choices);
    let choicesDiv = document.getElementById("Choices");
    choicesDiv.innerHTML = "";
    choicesL.forEach((element, index) => {
        let choiceId = `choice${index}`;

        let choice = document.createElement("input");
        choice.type = "radio";
        choice.name = "answer";
        choice.id = choiceId;
        choice.value = element;

        let choiceLabel = document.createElement("label");
        choiceLabel.htmlFor = choiceId;
        choiceLabel.textContent = element;
        choiceLabel.classList.add("btn");

        choicesDiv.appendChild(choice);
        choicesDiv.appendChild(choiceLabel);
    });

    if (studentAnswers.some(sa => sa.question.id === CourseQuestions[currentQuestion].id)) {
        let studentAnswer = studentAnswers.find(sa => sa.question.id === CourseQuestions[currentQuestion].id);
        let selectedChoice = document.querySelector(`input[name="answer"][value="${studentAnswer.answer}"]`);
        if (selectedChoice) {
            selectedChoice.checked = true;
        }
    }

}
function RandomizeArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function storeAnswer() {
    let selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        let answer = selectedAnswer.value;
        let question = CourseQuestions[currentQuestion];
        let studentAnswer = new StudentAnswer(question, answer);
        studentAnswers.push(studentAnswer);
    }
}

function CalculateResults() {
    let correctAnswers = studentAnswers.filter(sa => sa.answer === sa.question.correct_answer).length;
    let scorePercentage = (correctAnswers / CourseQuestions.length) * 100;
    CounterProgress(scorePercentage);
    console.log(scorePercentage);
    let GradientColor = document.getElementById("GradientColor");
    if(scorePercentage>=50){
        GradientColor.innerHTML = `
        <stop offset="0%" stop-color="#a3f5b0" />
        <stop offset="100%" stop-color="#27ae60" />`;
    }
    else{
        GradientColor.innerHTML = `
        <stop offset="0%" stop-color="#ff9999" />
        <stop offset="100%" stop-color="#c0392b" />
    `;
    }
    console.log(scorePercentage);
    document.getElementById("number").innerText = `${Math.round(scorePercentage)}%`;
    document.getElementById("result").innerText =
        `You scored ${correctAnswers} out of ${CourseQuestions.length} correct answers`;
    if(scorePercentage>=50){
        document.getElementById("status").style.color = "green";
        document.getElementById("status").innerHTML = "Congratulations, you passed the exam!";
    }else{
        document.getElementById("status").style.color = "red";
        document.getElementById("status").innerHTML = "Unfortunately, you failed the exam!";
    }
}
function startTimer() {
    let timerElement = document.getElementById("timer");
    let totalTime = time * 60;

    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;
    timerElement.innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    let interval = setInterval(function () {
        if (totalTime > 0) {
            totalTime--;
            minutes = Math.floor(totalTime / 60);
            seconds = totalTime % 60;
            timerElement.innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        } else {
            alert("Time is up! The exam has ended.");
            clearInterval(interval);
            document.getElementById("box").style.display = "none";
            document.getElementById("flagBox").style.display = "none";
            CalculateResults();
            document.getElementById("scoreBox").style.display = "block";
            showResult();
        }
    }, 1000);
}
function toggleNav() {
    let nav = document.getElementById("flaggedNav");
    nav.style.left = (nav.style.left === "0px") ? "-250px" : "0px";
}
function showFlaggedQuestions() {
    let flaggedList = document.getElementById("flaggedList");
    flaggedList.innerHTML = "";

    flaggedQuestions.forEach(q => {
        let li = document.createElement("li");
        let link = document.createElement("a");

        link.textContent = "Q" + (q + 1);
        link.href = "#";
        link.addEventListener("click", function (event) {
            event.preventDefault();
            currentQuestion = q;
            showQuestions();
        });

        li.appendChild(link);
        flaggedList.appendChild(li);
    });
}
function showResult() {
    let progressNum = document.getElementById("number");
    let counter = 0;

    setInterval(() => {
        if (counter == 65) {
            clearInterval();
        } else {
            counter += 1;
            progressNum.innerHTML = counter + "%";
        }
    }, 30);
}

function CounterProgress(targetValue) {
    let currentValue = 0;
    let speed = 20;

    let progressInterval = setInterval(() => {
        if (currentValue >= targetValue) {
            clearInterval(progressInterval);
        } else {
            currentValue++;
            updateProgress(currentValue);
        }
    }, speed);
}
function updateProgress(score) {

    let circle = document.querySelector('circle');
    let circumference = 753.98;
    let offset = circumference - (score / 100) * circumference;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;
}

loadQuestions();

let startbtn = document.getElementById("startExam");
startbtn.addEventListener("click", startQuiz);

let nextbtn = document.getElementById("next-btn");
nextbtn.addEventListener("click", function () {
    if (currentQuestion == CourseQuestions.length - 1) {
        storeAnswer();
        document.getElementById("box").style.display = "none";
        document.getElementById("flagBox").style.display = "none";
        CalculateResults();
        document.getElementById("scoreBox").style.display = "block";
    } else if (currentQuestion < CourseQuestions.length) {
        storeAnswer();
        currentQuestion++;
        showQuestions();
    }
});
let prevoisbtn = document.getElementById("prevoius-btn");
prevoisbtn.addEventListener("click", function (e) {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestions();
    } else {
        e.preventDefault();
    }
});

flagBtn.addEventListener("click", function () {
    if (flaggedQuestions.includes(currentQuestion)) {
        flaggedQuestions = flaggedQuestions.filter(question => question !== currentQuestion);
        flagIcon.classList.remove("fa-solid");
        flagIcon.classList.add("fa-regular");
    }
    else {
        flaggedQuestions.push(currentQuestion);
        flagIcon.classList.remove("fa-regular");
        flagIcon.classList.add("fa-solid");
    }
    showFlaggedQuestions();
});

