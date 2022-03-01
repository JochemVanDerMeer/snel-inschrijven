const days = document.querySelectorAll(".day");
const rightarrow = document.querySelector("#right-arrow");
const leftarrow = document.querySelector("#left-arrow");
const timefield = document.querySelector(".timefield");
const datetitle = document.querySelector(".datetitle");
var slots1 = document.querySelectorAll(".slot");
const result = document.querySelector(".result");
const slots2 = document.querySelector(".slots");
const currentSlots = document.querySelector(".res");
const namefield = document.querySelector(".name");
const message = document.querySelector(".pleaseEnter");
const emailfield = document.querySelector(".email");
const emailmessage = document.querySelector(".emailmessage");
const spots = document.querySelector(".spots");
const chosendate = document.querySelector(".chosendate")

var d = new Date();
var selectedDate = "";
var selectedTime = "";
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let chosentimes = [];
var openslots = [];
let matches = [];

setDates();
currentSlots.hidden = true;
spots.hidden = true;
var daycount = 0;


namefield.value = sessionStorage.getItem("username");
emailfield.value = sessionStorage.getItem("useremail")
for (var i = 0; i < days.length; i++) {
  days[i].addEventListener("click", function (e) {
    if (namefield.value == "") {
      message.removeAttribute("hidden");
      return;
    }
    else if (emailfield.value == "") {
      emailmessage.removeAttribute("hidden");
      return;
    }
    message.hidden = true;
    emailmessage.hidden = true;
    //currentSlots.hidden = false;
    spots.hidden = false;
    sessionStorage.setItem("username", namefield.value);
    sessionStorage.setItem("useremail", emailfield.value);

    daycount += 1;
    selectedTime = "";
    resetColours();

    timefield.innerHTML = '';

    let dateTitle = document.createElement('p');
    dateTitle.setAttribute("class", "chosendate")
    dateTitle.textContent = e.target.textContent
    timefield.appendChild(dateTitle)
    timefield.removeAttribute("hidden");


    spotList = spots.textContent
    spotList = spotList.substring(1);
    spotList = spotList.slice(0,-1)

    spotList = spotList.split(", ")
    


    for (var i = 0; i < spotList.length; i+=2) {

      spotList.splice(i,1)
    }

    var finalSpotList = []
    for (var j = 0; j < spotList.length; j+=2) {
      finalSpotList.push([spotList[j], spotList[j+1]])
    }
    checkDate = convertSlotFormat(e.target.textContent).slice(0,-10)
    checkDate = checkDate.split("_")
    checkDate = checkDate[2] + "_" + checkDate[1] + "_" + checkDate[0]
    for (var m = 0; m < finalSpotList.length; m++) {

      if (finalSpotList[m][0].substring(5) == checkDate){

        var times = []
        times = finalSpotList[m][1].substring(6).split(",")

        var fieldCounter = 0
        for (var i = 0; i < times.length; i++) {
          fieldCounter += 1
          timefield.appendChild(createSlotItem(checkDate, convertUnderscoreSlotFormat(times[i]), e.target.textContent))
        }
        var fieldHeight = 200
        fieldHeight += 40 * fieldCounter
        var finalHeight = "height: " + fieldHeight.toString() + "px";
        timefield.setAttribute("style", finalHeight)
      }
    }
    

    e.target.style.backgroundColor = "lightblue";
    selectedDate = e.target.textContent;

    for (var j = 0; j < slots1.length; j++) {
      if (daycount >= 2) {
        var temp = slots1[j].value.split("");
        temp.splice(0, 12);
        temp = temp.join("");
        slots1[j].value = temp;
      }

      slots1[j].value = selectedDate + " " + slots1[j].value;
    }
    slots1 = document.querySelectorAll(".slot");

    for (var c = 0; c < slots1.length; c++) {
      console.log("finalslotlist", finalslotlist)
      console.log("slots1", convertSlotFormat(slots1[c].value))
      if (finalslotlist.includes(convertSlotFormat(slots1[c].value))) {
        slots1[c].style.backgroundColor = "red";
        slots1[c].disabled = true;
      }
    }

    for (var p = 0; p < slots1.length; p++) {
      openslots.push(slots1[p].textContent);
    }
    currentSlots.hidden = true;
    spots.hidden = true;
  });
}

var slotlist = currentSlots.textContent;
slotlist = slotlist.slice(0, -1);

function createSlotItem(name,time, date) {
  let input = document.createElement('input');
  input.setAttribute("name", "submit_button")
  input.setAttribute("type", "submit")
  input.setAttribute("value", date + " " + time)
  input.setAttribute("class", "slot")
  return input;
}

slotlist = slotlist.split(" ");
var finalslotlist = [];

console.log(slotlist)


for (var l = 0; l < slotlist.length; l += 1) {


  finalslotlist.push(slotlist[l]);
}

finalslotlist[0] = finalslotlist[0].substring(1);

for (var u = 0; u < finalslotlist.length - 1; u++) {
  finalslotlist[u] = finalslotlist[u].slice(0, -1);
}



for (var i = 0; i < slots1.length; i++) {
  slots1[i].addEventListener("click", function (e) {
    console.log("check")
    resetColours();
    e.target.style.backgroundColor = "lightblue";
    selectedTime = e.target.textContent;
  });
}

leftarrow.addEventListener("click", function (e) {
  resetColours();
  var olddate = d.setDate(d.getDate() - 12);
  setDates(olddate);
  timefield.hidden = true;
});

rightarrow.addEventListener("click", function (e) {
  resetColours();
  var newdate = d.setDate(d.getDate() + 12);
  setDates(newdate);
  timefield.hidden = true;
});

function convertUnderscoreSlotFormat(slotInput) {
  slotInput = slotInput.split("")
  var res = slotInput[0] + slotInput[1] + ":" + slotInput[2] + slotInput[3] + "-" + slotInput[5] + slotInput[6] + ":" + slotInput[7] + slotInput[8]
  return res
}

function convertSlotFormat(slotInput) {
  var slotInput = slotInput.split(" ");
  var month = slotInput[1];
  for (var j = 0; j < months.length; j++) {
    if (month == months[j]) {
      month = months.indexOf(months[j]) + 1;
    }
  }
  month = String(month);
  if (month.length == 1) {
    month = "0" + month;
  }
  slotInput[1] = month;
  var newFormat =
    slotInput[2] + "_" + slotInput[1] + "_" + slotInput[0] + "_" + slotInput[3];
  newFormat = newFormat.split("");
  for (var i = 0; i < newFormat.length; i++) {
    if (newFormat[i] == ":") {
      newFormat[i] = "";
    } else if (newFormat[i] == "-") {
      newFormat[i] = "_";
    }
  }
  newFormat = newFormat.join("");
  return newFormat;
}

function addDays(qty) {
  var dd = d.getDate();
  var mm = d.getMonth();
  var yyyy = d.getFullYear();
  return new Date(yyyy, mm, dd + qty);
}

function setDates() {
  for (var i = 0; i < days.length; i++) {
    var date = String(addDays(i));
    var res = "";
    date = date.split("");
    date.splice(0, 4);
    var month = date.splice(0, 3);
    date.splice(0, 1);
    date.splice(2, 0, " ", month[0], month[1], month[2]);
    date.splice(11, date.length - 10);
    for (var j = 0; j < date.length; j++) {
      res += date[j];
    }
    days[i].textContent = res;
  }
}

function resetColours() {
  for (var i = 0; i < days.length; i++) {
    days[i].style.backgroundColor = "#deebdd";
  }
  for (var j = 0; j < slots1.length; j++) {
    slots1[j].style.backgroundColor = "darkgray";
    slots1[j].disabled = false;
  }
}

function removeSlots() {
  timefield.hidden = true;
}