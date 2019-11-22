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

// function updateSchedule(name, location, day, time) {
//   xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       if(this.responseText == 'ER_DUP_ENTRY'){
//         document.getElementById("table").innerHTML = this.responseText;
//       }
//     }
//   };
//   xhttp.open("PUT", "/truckSchedule/" + encodeURI(name) + "/" + encodeURI(location) + "/" + encodeURI() + "/", true);
//   xhttp.send();
//   // console.log(truckID);
// }

function deleteSchedule() {
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(this.responseText == 'ER_DUP_ENTRY'){
        document.getElementById("table").innerHTML = this.responseText;
      }
    }
  };
  xhttp.open("PUT", "/truckSchedule", true);
  xhttp.send();
  // console.log(truckID);
}