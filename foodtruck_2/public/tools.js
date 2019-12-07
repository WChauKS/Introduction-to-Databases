// function gets called when dropdown menu is changed from website.handlebars
// selection is stored as "link" which is then routed to '/search/:s' which gets the website of the truck selected
// Result: website of the truck is displayed
function searchWebsite(truckID) {
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

// function gets called when Update button is clicked from truckschedule.handlebars
// gets the selection for location and time slot and is routed to '/truckschedule/:schedule_id/:location_id/:time_slot_id'
// Result: updates the location and time for the truck in that row in the truckschedule table in the database
//          page is re-rendered with the changes made
function updateSchedule(schedule) {
  var location = document.getElementById("updateLocation").value;
  var time = document.getElementById("updateTime").value;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.location.reload(true);
      console.log("success");
      console.log(location);
      console.log(time);
      console.log(schedule);
    }
  };
  xhttp.open("PUT", "/truckschedule/" + encodeURI(schedule) + "/" + encodeURI(location) + "/"+ encodeURI(time), true);
  xhttp.send();
}

// function gets called when Delete button is clicked from truckschedule.handlebars
// gets the schedule_id and is routed to '/truckschedule/:schedule_id'
// Result: deletes the row from the truckschedule table in the database
//          page is re-rendered with the changes made
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

// function gets called when dropdown menu is changed from truckschedule.handlebars
// updates value in order to process the DELETE and UPDATE functions
// Result: value of updateLocation is changed to selection
function locationValue(location){
  document.getElementById("updateLocation").value = location;
  // console.log(document.getElementById("updateLocation").value);
}

// function gets called when dropdown menu is changed from truckschedule.handlebars
// updates value in order to process the DELETE and UPDATE functions
// Result: value of updateTime is changed to selection
function timeValue(time){
  document.getElementById("updateTime").value = time;
  // console.log(document.getElementById("updateTime").value);
}