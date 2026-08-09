/*====================================================
 DevOS Dashboard
 script.js - Part 1
====================================================*/

/* ==========================================
   Theme Toggle
========================================== */

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    const icon = themeBtn.querySelector("i");

    if (document.body.classList.contains("light-mode")) {

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

        localStorage.setItem("theme", "light");

    } else {

        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

        localStorage.setItem("theme", "dark");
    }

});

/* Load Saved Theme */

window.addEventListener("load", () => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

        themeBtn.querySelector("i").classList.remove("fa-moon");
        themeBtn.querySelector("i").classList.add("fa-sun");

    }

});


/* ==========================================
   Animated Counter
========================================== */

function animateCounter(id, target) {

    const element = document.getElementById(id);

    if (!element) return;

    let count = 0;

    const speed = Math.ceil(target / 60);

    const interval = setInterval(() => {

        count += speed;

        if (count >= target) {

            count = target;

            clearInterval(interval);

        }

        element.textContent = `${count} / 35`;

    }, 25);

}

animateCounter("leetcodeSolved", 35);


/* ==========================================
   Weekly Coding Chart
========================================== */

const chartCanvas = document.getElementById("codingChart");

if (chartCanvas) {

    new Chart(chartCanvas, {

        type: "line",

        data: {

            labels: [

                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"

            ],

            datasets: [

                {

                    label: "Coding Hours",

                    data: [

                        2,
                        4,
                        3,
                        5,
                        6,
                        7,
                        4

                    ],

                    borderColor: "#00C2FF",

                    backgroundColor: "rgba(0,194,255,0.15)",

                    borderWidth: 4,

                    pointRadius: 5,

                    pointHoverRadius: 8,

                    pointBackgroundColor: "#7C4DFF",

                    fill: true,

                    tension: 0.4

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    labels: {

                        color: "#ffffff",

                        font: {

                            size: 14

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#dddddd"

                    },

                    grid: {

                        color: "rgba(255,255,255,0.08)"

                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#dddddd"

                    },

                    grid: {

                        color: "rgba(255,255,255,0.08)"

                    }

                }

            }

        }

    });

}


/* ==========================================
   Notification Button
========================================== */

const bell = document.querySelector(".fa-bell");

if (bell) {

    bell.parentElement.addEventListener("click", () => {

        alert("🔔 No new notifications.");

    });

}


/* ==========================================
   Welcome Message
========================================== */

window.addEventListener("load", () => {

    console.log("🚀 DevOS Loaded Successfully");

});


/*====================================================
 DevOS Dashboard
 script.js - Part 2
 Pomodoro Timer
====================================================*/

/* ==========================================
   Pomodoro Timer
========================================== */

const timer = document.getElementById("timer");

const startBtn = document.getElementById("startBtn");

const pauseBtn = document.getElementById("pauseBtn");

const resetBtn = document.getElementById("resetBtn");

let minutes = 25;

let seconds = 0;

let timerInterval = null;

let isRunning = false;

/* Update Display */

function updateTimer() {

    const min = String(minutes).padStart(2, "0");

    const sec = String(seconds).padStart(2, "0");

    timer.textContent = `${min}:${sec}`;

}

/* Save Timer */

function saveTimer() {

    localStorage.setItem("pomodoroMinutes", minutes);

    localStorage.setItem("pomodoroSeconds", seconds);

}

/* Load Timer */

function loadTimer() {

    const savedMinutes = localStorage.getItem("pomodoroMinutes");

    const savedSeconds = localStorage.getItem("pomodoroSeconds");

    if (savedMinutes !== null) {

        minutes = Number(savedMinutes);

        seconds = Number(savedSeconds);

    }

    updateTimer();

}

loadTimer();

/* Start */

function startTimer() {

    if (isRunning) return;

    isRunning = true;

    timerInterval = setInterval(() => {

        if (seconds === 0) {

            if (minutes === 0) {

                clearInterval(timerInterval);

                isRunning = false;

                updateTimer();

                alert("🎉 Pomodoro Completed!");

                if ("Notification" in window &&
                    Notification.permission === "granted") {

                    new Notification("Pomodoro Finished!", {
                        body: "Time for a short break ☕"
                    });

                }

                return;

            }

            minutes--;

            seconds = 59;

        } else {

            seconds--;

        }

        updateTimer();

        saveTimer();

    }, 1000);

}

/* Pause */

function pauseTimer() {

    clearInterval(timerInterval);

    isRunning = false;

}

/* Reset */

function resetTimer() {

    clearInterval(timerInterval);

    isRunning = false;

    minutes = 25;

    seconds = 0;

    updateTimer();

    saveTimer();

}

/* Button Events */

startBtn.addEventListener("click", startTimer);

pauseBtn.addEventListener("click", pauseTimer);

resetBtn.addEventListener("click", resetTimer);

/* ==========================================
   Browser Notification Permission
========================================== */

if ("Notification" in window &&
    Notification.permission !== "granted") {

    Notification.requestPermission();

}

/* ==========================================
   Focus Session Counter
========================================== */

let focusSessions = Number(

    localStorage.getItem("focusSessions") || 0

);

function addFocusSession() {

    focusSessions++;

    localStorage.setItem("focusSessions", focusSessions);

    console.log(

        "Focus Sessions:",

        focusSessions

    );

}

/* Add Session when Timer Completes */

const originalAlert = window.alert;

window.alert = function(message) {

    if (message.includes("Pomodoro Completed")) {

        addFocusSession();

    }

    originalAlert(message);

};

/* ==========================================
   Auto Save Every Minute
========================================== */

setInterval(() => {

    saveTimer();

}, 60000);

/* ==========================================
   Keyboard Shortcuts
========================================== */

document.addEventListener("keydown", (e) => {

    if (e.code === "Space") {

        e.preventDefault();

        if (isRunning) {

            pauseTimer();

        } else {

            startTimer();

        }

    }

    if (e.key === "r" || e.key === "R") {

        resetTimer();

    }

});

/* ==========================================
   Console Message
========================================== */

console.log("⏱️ Pomodoro Ready");

/*====================================================
 DevOS Dashboard
 script.js - Part 3
====================================================*/

/* ==========================================
   Task Checkbox Save
========================================== */

const taskCheckboxes = document.querySelectorAll(".task-list input");

taskCheckboxes.forEach((checkbox, index) => {

    checkbox.checked =
        localStorage.getItem("task_" + index) === "true";

    checkbox.addEventListener("change", () => {

        localStorage.setItem(
            "task_" + index,
            checkbox.checked
        );

        updateTaskProgress();

    });

});

/* ==========================================
   Habit Tracker
========================================== */

const habitCheckboxes = document.querySelectorAll(".habit input");

habitCheckboxes.forEach((checkbox, index) => {

    checkbox.checked =
        localStorage.getItem("habit_" + index) === "true";

    checkbox.addEventListener("change", () => {

        localStorage.setItem(
            "habit_" + index,
            checkbox.checked
        );

    });

});

/* ==========================================
   Task Progress
========================================== */

function updateTaskProgress() {

    let completed = 0;

    taskCheckboxes.forEach(task => {

        if (task.checked) completed++;

    });

    const percent = Math.round(
        (completed / taskCheckboxes.length) * 100
    );

    console.log("Task Progress:", percent + "%");

}

updateTaskProgress();

/* ==========================================
   Calendar Interaction
========================================== */

const calendarDays =
    document.querySelectorAll(".calendar-grid div");

calendarDays.forEach(day => {

    day.addEventListener("click", () => {

        calendarDays.forEach(d =>
            d.classList.remove("active-day")
        );

        day.classList.add("active-day");

    });

});

/* ==========================================
   Card Hover Animation
========================================== */

const cards = document.querySelectorAll(".glass");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform =
            "translateY(-8px) scale(1.02)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "translateY(0px) scale(1)";

    });

});

/* ==========================================
   Greeting
========================================== */

const heroTitle = document.querySelector(".hero h1");

if (heroTitle) {

    const hour = new Date().getHours();

    let greeting = "Welcome Back 👋";

    if (hour < 12) {

        greeting = "Good Morning ☀️";

    } else if (hour < 17) {

        greeting = "Good Afternoon 🌤️";

    } else {

        greeting = "Good Evening 🌙";

    }

    heroTitle.textContent = greeting;

}

/* ==========================================
   Clock
========================================== */

const header = document.querySelector(".header");

if (header) {

    const time = document.createElement("span");

    time.id = "liveClock";

    time.style.marginLeft = "20px";
    time.style.fontWeight = "600";

    header.appendChild(time);

    function updateClock() {

        const now = new Date();

        time.textContent =
            now.toLocaleTimeString();

    }

    updateClock();

    setInterval(updateClock, 1000);

}

/* ==========================================
   Fake Notifications
========================================== */

const quotes = [

    "🚀 Keep Building.",
    "💡 Small Progress is Progress.",
    "🔥 Stay Consistent.",
    "🎯 Finish What You Started.",
    "💻 Code Every Day."

];

setInterval(() => {

    console.log(

        quotes[
            Math.floor(Math.random() * quotes.length)
        ]

    );

}, 10000);

/* ==========================================
   Dashboard Loaded
========================================== */

window.addEventListener("load", () => {

    console.log(
        "%cDevOS Dashboard Ready!",
        "color:#00C2FF;font-size:18px;font-weight:bold;"
    );

});

let tasks = JSON.parse(

localStorage.getItem("tasks")

) || [];

const taskInput =

document.getElementById("taskInput");

const taskList =

document.getElementById("taskList");

document

.getElementById("addTask")

.onclick = function(){

const text =

taskInput.value.trim();

if(text=="") return;

tasks.push({

title:text,

done:false

});

taskInput.value="";

saveTasks();

renderTasks();

}

function renderTasks(){

taskList.innerHTML="";

tasks.forEach((task,index)=>{

const li=document.createElement("li");

li.className="task-item";

li.innerHTML=`

<input type="checkbox"

${task.done?"checked":""}

onchange="toggleTask(${index})">

<span style="${task.done?

'text-decoration:line-through':''}">

${task.title}

</span>

<div class="task-actions">

<button onclick="editTask(${index})">

✏️

</button>

<button onclick="deleteTask(${index})">

🗑️

</button>

</div>

`;

taskList.appendChild(li);

});

}

function saveTasks(){

localStorage.setItem(

"tasks",

JSON.stringify(tasks)

);

}

function toggleTask(i){

tasks[i].done=!tasks[i].done;

saveTasks();

renderTasks();

}

function deleteTask(i){

tasks.splice(i,1);

saveTasks();

renderTasks();

}

function editTask(i){

let value=prompt(

"Edit Task",

tasks[i].title

);

if(value){

tasks[i].title=value;

saveTasks();

renderTasks();

}

}

renderTasks();

/* ======================================
   Habit Tracker
====================================== */

let habits = JSON.parse(

localStorage.getItem("habits")

) || [];

const habitInput =

document.getElementById("habitInput");

const habitList =

document.getElementById("habitList");

document

.getElementById("addHabit")

.onclick=function(){

const text=habitInput.value.trim();

if(text==="") return;

habits.push({

title:text,

done:false

});

habitInput.value="";

saveHabits();

renderHabits();

}

function renderHabits(){

habitList.innerHTML="";

habits.forEach((habit,index)=>{

const div=document.createElement("div");

div.className="habit-item";

div.innerHTML=`

<div class="habit-left">

<input type="checkbox"

${habit.done?"checked":""}

onchange="toggleHabit(${index})">

<span style="${habit.done?

'text-decoration:line-through':''}">

${habit.title}

</span>

</div>

<div class="habit-actions">

<button onclick="editHabit(${index})">

✏️

</button>

<button onclick="deleteHabit(${index})">

🗑️

</button>

</div>

`;

habitList.appendChild(div);

});

updateHabitStats();

}

function saveHabits(){

localStorage.setItem(

"habits",

JSON.stringify(habits)

);

}

function toggleHabit(i){

habits[i].done=!habits[i].done;

saveHabits();

renderHabits();

}

function deleteHabit(i){

habits.splice(i,1);

saveHabits();

renderHabits();

}

function editHabit(i){

const value=prompt(

"Edit Habit",

habits[i].title

);

if(value){

habits[i].title=value;

saveHabits();

renderHabits();

}

}

function updateHabitStats(){

let completed=

habits.filter(h=>h.done).length;

console.log(

`Habits ${completed}/${habits.length}`

);

}

renderHabits();

/*======================================
LeetCode Tracker
======================================*/

let easy =
Number(localStorage.getItem("easy")) || 0;

let medium =
Number(localStorage.getItem("medium")) || 0;

let hard =
Number(localStorage.getItem("hard")) || 0;

function updateLeetcode(){

const total =
easy + medium + hard;

document.getElementById("easyCount").textContent =
easy;

document.getElementById("mediumCount").textContent =
medium;

document.getElementById("hardCount").textContent =
hard;

document.getElementById("leetcodeTotal").textContent =
`${total} / 35 Problems`;

document.getElementById("leetcodeProgress")
.style.width =
(total/35)*100 + "%";

localStorage.setItem("easy",easy);

localStorage.setItem("medium",medium);

localStorage.setItem("hard",hard);

}

document.getElementById("easyBtn").onclick=()=>{

easy++;

updateLeetcode();

}

document.getElementById("mediumBtn").onclick=()=>{

medium++;

updateLeetcode();

}

document.getElementById("hardBtn").onclick=()=>{

hard++;

updateLeetcode();

}

document.getElementById("resetLeetcode").onclick=()=>{

if(confirm("Reset Weekly Progress?")){

easy=0;

medium=0;

hard=0;

updateLeetcode();

}

}

updateLeetcode();

/*==================================
100xDevs Tracker
==================================*/

let courseProgress = {

html:Number(localStorage.getItem("html"))||0,

css:Number(localStorage.getItem("css"))||0,

js:Number(localStorage.getItem("js"))||0,

backend:Number(localStorage.getItem("backend"))||0

};

function renderCourse(){

["html","css","js","backend"].forEach(course=>{

document.getElementById(course+"Bar").style.width=

courseProgress[course]+"%";

document.getElementById(course+"Percent").textContent=

courseProgress[course]+"%";

});

}

function changeProgress(course,value){

courseProgress[course]+=value;

if(courseProgress[course]>100)

courseProgress[course]=100;

if(courseProgress[course]<0)

courseProgress[course]=0;

localStorage.setItem(

course,

courseProgress[course]

);

renderCourse();

}

renderCourse();

/*========================================
AI Project Tracker
========================================*/

let milestones = JSON.parse(

localStorage.getItem("milestones")

) || [

{title:"Dataset Collection",done:true},

{title:"YOLO Training",done:true},

{title:"Person Detection",done:true},

{title:"Behavior Analysis",done:false},

{title:"Dashboard",done:false},

{title:"Alert System",done:false},

{title:"Deployment",done:false}

];

const milestoneList =

document.getElementById("milestoneList");

function renderMilestones(){

milestoneList.innerHTML="";

let completed=0;

milestones.forEach((m,index)=>{

if(m.done) completed++;

const div=document.createElement("div");

div.className="milestone";

div.innerHTML=`

<div>

<input type="checkbox"

${m.done?"checked":""}

onchange="toggleMilestone(${index})">

<span>

${m.title}

</span>

</div>

`;

milestoneList.appendChild(div);

});

let percent=Math.round(

completed/milestones.length*100

);

document.getElementById(

"projectBar"

).style.width=

percent+"%";

document.getElementById(

"projectPercent"

).textContent=

percent+"% Completed";

localStorage.setItem(

"milestones",

JSON.stringify(milestones)

);

}

function toggleMilestone(i){

milestones[i].done=

!milestones[i].done;

renderMilestones();

}

renderMilestones();


const notes =

document.getElementById("projectNotes");

const saveNotes =

document.getElementById("saveNotes");

notes.value=

localStorage.getItem(

"projectNotes"

)||"";

saveNotes.onclick=function(){

localStorage.setItem(

"projectNotes",

notes.value

);

alert("Notes Saved");

}

/*====================================
Weekly Planner
====================================*/

let planner = JSON.parse(

localStorage.getItem("planner")

)||[];

const plannerTask =

document.getElementById("plannerTask");

const plannerDay =

document.getElementById("plannerDay");

const plannerTime =

document.getElementById("plannerTime");

document

.getElementById("plannerAdd")

.onclick=function(){

if(plannerTask.value.trim()=="") return;

planner.push({

task:plannerTask.value,

day:plannerDay.value,

time:plannerTime.value

});

plannerTask.value="";

plannerTime.value="";

savePlanner();

renderPlanner();

}

function savePlanner(){

localStorage.setItem(

"planner",

JSON.stringify(planner)

);

}

function renderPlanner(){

const days=[

"Monday",

"Tuesday",

"Wednesday",

"Thursday",

"Friday",

"Saturday",

"Sunday"

];

days.forEach(day=>{

document.getElementById(day).innerHTML="";

});

planner.forEach((item,index)=>{

const card=document.createElement("div");

card.className="plan-item";

card.innerHTML=`

<b>${item.time}</b><br>

${item.task}

<br><br>

<button onclick="deletePlan(${index})">

Delete

</button>

`;

document

.getElementById(item.day)

.appendChild(card);

});

}

function deletePlan(index){

planner.splice(index,1);

savePlanner();

renderPlanner();

}

renderPlanner();