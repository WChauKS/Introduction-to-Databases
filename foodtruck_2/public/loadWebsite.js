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

window.addEventListener('load', function() {
    loadWebsite();
})