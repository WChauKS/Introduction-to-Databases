function searchWebsite(truckID) {
  // var searchTruck = document.getElementById('foodtruckID').value;
  // window.location = '/website/search/' + encodeURI(searchTruck)
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("link").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "/search/" + encodeURI(truckID), true);
  xhttp.send();
  console.log(truckID);
}

// function addTimeSlot() {
//   xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       if(this.responseText == 'ER_DUP_ENTRY'){
//         document.getElementById("status").innerHTML = "test";
//       }
//     }
//   };
//   xhttp.open("POST", "/timeslot", true);
//   xhttp.send();
//   // console.log(truckID);
// }

function updateSchedule(schedule) {
  var location = document.getElementById("updateLocation").value;
  var time = document.getElementById("updateTime").value;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.reload(true);
      console.log("success");
      console.log(schedule);
      console.log(location);
      console.log(time);
    }
  };
  xhttp.open("PUT", "/truckschedule/" + encodeURI(schedule) + "/" + encodeURI(location) + "/"+ encodeURI(time), true);
  xhttp.send();
}

function deleteSchedule(schedule) {
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.reload(true);
      console.log("success");
    }
  };
  xhttp.open("DELETE", "/truckschedule/" + encodeURI(schedule), true);
  xhttp.send();
  console.log(schedule);
}