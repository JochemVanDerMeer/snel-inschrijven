const reservation = document.querySelector("#box1")
const admin = document.querySelector("#box2")

if(window.innerHeight > window.innerWidth){
    alert("Please rotate the screen of your phone for a better view.");
  }

reservation.addEventListener("click", function (e) {
    window.location.href = 'https://snelinschrijven.herokuapp.com/enroll'
});

admin.addEventListener("click", function (e) {
    window.location.href = 'https://snelinschrijven.herokuapp.com/admin'
});