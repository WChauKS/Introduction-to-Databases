// function gets called when website.handlebars is first loaded
// allows for the page to always have the first truck's website field to be populated
// automatically routed to '/search/:s' which gets the website of the first truck
// Result: website of the truck is displayed
function loadWebsite() {
  var truckID = document.getElementById("foodtruckID").value;
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

// calls loadWebsite to display the website for the first truck upon loading website.handlebars
window.addEventListener('load', function() {
    loadWebsite();
})