const days = document.querySelectorAll(".day");
const rightarrow = document.querySelector("#right-arrow");
const leftarrow = document.querySelector("#left-arrow");
const takenSlots = document.querySelector(".res");
const slots = document.querySelectorAll(".slot");
const date = document.querySelector(".date");
const spots = document.querySelector(".spots");
const timefield = document.querySelector(".timefield");
const adminAddSpot = document.querySelector(".adminAddSpot")
const chooseSpot = document.querySelector(".chooseSpot")
const chosenDateForSpot = document.querySelector(".chosenDateForSpot")
const deleteSpotInfo = document.querySelector(".deleteSpotInfo")
const deleteSpotSubmit = document.querySelector(".deleteSpotSubmit")
const clearSpotInfo = document.querySelector(".clearSpotInfo")
const clearSpotSubmit = document.querySelector(".clearSpotSubmit")
const spotInfo = document.querySelector(".spotInfo")
const deleteSpotDate = document.querySelector(".deleteSpotDate")
const deleteTime = document.querySelector(".deleteTime")
const addOrRemove = document.querySelector(".addOrRemove")


var spot = document.querySelectorAll(".spot");

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
var d = new Date();

setDates();
spots.hidden = true;
addOrRemove.hidden = true;


function convertTime(time) {
  time = time.split("");
  time[2] = "";
  time[5] = "_";
  time[8] = "";
  time = time.join("");
  return time;
}

function removeSpaces(str) {
  str = str.split("");
  for (var i = 0; i < str.length; i++) {
    if (str[i] == "_") {
      str[i] = " ";
    }
  }
  str = str.join("");
  return str;
}

function clearSlots() {
  date.textContent = "";
  for (var n = 0; n < slots.length; n++) {
    var str = slots[n].textContent;
    slots[n].style.backgroundColor = "darkgrey";
    str = str.split("");
    str = str.splice(0, 5);
    str = str.join("");
    slots[n].textContent = str;
  }
}

function resetColours() {
  for (var i = 0; i < days.length; i++) {
    days[i].style.backgroundColor = "#f8f9d2";
  }
}

adminAddSpot.addEventListener("click", function (e) {
  deleteSpotSubmit.hidden = true;
  chooseSpot.hidden = false;
  chosenDateForSpot.readOnly = true
  const chosendate = document.querySelector(".chosendate")
  chosenDateForSpot.value = chosendate.textContent
});



for (var i = 0; i < days.length; i++) {
  days[i].addEventListener("click", function (e) {

    deleteSpotSubmit.hidden = true;
    chooseSpot.hidden=true;
    addOrRemove.hidden = false;
    resetColours();
    clearSlots();
    timefield.innerHTML = "";
    let dateTitle = document.createElement("p");
    dateTitle.setAttribute("class", "chosendate");
    dateTitle.textContent = e.target.textContent;
    timefield.appendChild(dateTitle);
    date.textContent = e.target.textContent;


    e.target.style.backgroundColor = "lightgray";
    takenSlots.hidden = false;
    timefield.hidden = false;
    takenSlots.hidden = true;
    spots.hidden = false;
    spotList = spots.textContent;
    spots.hidden = true;
    spotList = spotList.substring(1);
    spotList = spotList.slice(0, -1);
    spotList = spotList.split(", ");
    for (var i = 0; i < spotList.length; i += 2) {
      spotList.splice(i, 1);
    }
    var finalSpotList = [];
    for (var j = 0; j < spotList.length; j += 2) {
      finalSpotList.push([spotList[j], spotList[j + 1]]);
    }
    
    checkDate = convertSlotFormat(e.target.textContent).slice(0, -10);
    checkDate = checkDate.split("_");
    checkDate = checkDate[2] + "_" + checkDate[1] + "_" + checkDate[0];
    for (var m = 0; m < finalSpotList.length; m++) {
      if (finalSpotList[m][0].substring(5) == checkDate) {
        var times = [];
        times = finalSpotList[m][1].substring(6).split(",");
        for (var i = 0; i < times.length; i++) {
          
          timefield.appendChild(
            createSlotItem(
              checkDate,
              convertUnderscoreSlotFormat(times[i]),
              e.target.textContent
            )
          );
        }
      }
    }
    spot = document.querySelectorAll(".spot");
    for (var i = 0; i < spot.length; i++) {
      spot[i].addEventListener("click", function (e) {
        chooseSpot.hidden=true;
        if (spotInfo.textContent.length > 32) {
          spotInfo.textContent = spotInfo.textContent.substring(0, spotInfo.textContent.length - 23);
        } 
        deleteSpotSubmit.hidden = false;
        spotInfo.textContent += " " + e.target.textContent
        console.log("here",e.target.textContent)
        var deleteSpot = convertSlotFormat(e.target.textContent)
        deleteSpot = deleteSpot.split("")
        var time = deleteSpot.splice(10)
        time.shift()
        deleteSpot = deleteSpot.join("")
        time = time.join("")
  
        deleteSpotDate.value = deleteSpot
        deleteTime.value = time
        deleteSpotDate.readOnly = true  
        deleteTime.readOnly = true
      }) 
    }
  });
}

function convertUnderscoreSlotFormat(slotInput) {
  slotInput = slotInput.split("");
  var res =
    slotInput[0] +
    slotInput[1] +
    ":" +
    slotInput[2] +
    slotInput[3] +
    "-" +
    slotInput[5] +
    slotInput[6] +
    ":" +
    slotInput[7] +
    slotInput[8];
  return res;
}

function convertSlotFormat(slotInput) {
  var slotInput = slotInput.split(" ");
  var month = slotInput[1];
  for (var j = 0; j < months.length; j++) {
    if (month == months[j]) {
      month = months.indexOf(months[j]) + 1;
      if (month.toString().length == 1) {
        month = "0" + month
      }
    }
  }
  month = String(month);
  if (month.toString().length == 1) {
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

  console.log(newFormat)
  return newFormat;
}

function createSlotItem(name, time, date) {
  let input = document.createElement("div");
  input.setAttribute("value", date + " " + time);
  input.setAttribute("class", "spot");
  input.textContent = date + " " + time;
  console.log(date)
  return input;
}

leftarrow.addEventListener("click", function (e) {
  var olddate = d.setDate(d.getDate() - 12);
  setDates(olddate);
  timefield.hidden = true;
  addOrRemove.hidden = true;
});

rightarrow.addEventListener("click", function (e) {
  var newdate = d.setDate(d.getDate() + 12);
  setDates(newdate);
  timefield.hidden = true;
  addOrRemove.hidden = true;
});

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