function Validate()
{
    if (document.getElementById("pass").value != document.getElementById("passC").value)
    {
        document.getElementById("passWarn").style = "display:block";
        return false;
    } else
        document.getElementById("passWarn").style = "display:none";
    var x = document.getElementById("amka").value.toString().substr(0, 6);
    var date = document.getElementById("date").value.replaceAll("-", "");
    var year = date.substr(2, 2);
    var month = date.substr(4, 2);
    var day = date.substr(6, 2);
    date = day + month + year;
    if (x != date)
    {
        document.getElementById("amkaWarn").style = "display:block";
        return false;
    } else
        document.getElementById("amkaWarn").style = "display:none";
    return true;
    //Checkbox is a required input so the form cannot be submitted without it being checked
}

function ShowPass()
{
    if (document.getElementById("showpas").checked)
    {
        document.getElementById("pass").type = "text";
        document.getElementById("passC").type = "text";
    } else
    {
        document.getElementById("pass").type = "password";
        document.getElementById("passC").type = "password";
    }
}
function ShowPass1()
{
    if (document.getElementById("showpas1").checked)
        document.getElementById("password").type = "text";
    else
        document.getElementById("password").type = "password";
}
function PassPower(key)//key is used to understand if it is from sign in or edit
{
    var NoNum = 0;
    var NoDupl = 0;
    var MaxOcc = 0;
    var tmp;
    if (key)
        tmp = document.getElementById("password").value;
    else
        tmp = document.getElementById("pass").value;
    while (tmp.length > 0)
    {
        var letterOcc = 1;
        for (var j = 1; j < tmp.length; j++)
        {
            if (tmp.charAt(0) == tmp.charAt(j))
            {
                NoDupl++;
                letterOcc++;
            }
        }
        if (!isNaN(tmp.charAt(0)))
            NoNum += letterOcc;
        tmp = tmp.replaceAll(tmp.charAt(0), "");
        if (letterOcc > MaxOcc)
            MaxOcc = letterOcc;
    }
    if (key)
        tmp = document.getElementById("password").value.length;
    else
        tmp = document.getElementById("pass").value.length;
    if ((NoNum >= (tmp / 2)) || (MaxOcc >= (tmp / 2)))
    {
        document.getElementById("passStr").innerHTML = "weak password";
        document.getElementById("passStr").classList.remove("text-success", "text-warning");
        document.getElementById("passStr").classList.add("text-danger");
    } else if ((tmp - NoDupl) >= (tmp * 0.8))
    {
        document.getElementById("passStr").innerHTML = "strong password";
        document.getElementById("passStr").classList.remove("text-danger", "text-warning");
        document.getElementById("passStr").classList.add("text-success");
    } else
    {
        document.getElementById("passStr").innerHTML = "medium password";
        document.getElementById("passStr").classList.remove("text-success", "text-danger");
        document.getElementById("passStr").classList.add("text-warning");
    }
}

function isDoc()
{
    if (document.getElementById("rD").checked)
    {
        //document.getElementById("addr").name = "address"
        document.getElementById("addrL").innerHTML = "Clinic address"

        document.getElementById("docSpec").classList.add("mb-3", "mt-3");
        document.getElementById("docSpec").innerHTML = "  \
            <label for=\"DonorY\" class=\"form-label\">Doctor Specialization: </label> \
                <div class=\"form-check form-check-inline\"> \
                    <input class=\"form-check-input\" type=\"radio\" id=\"Doc0\" name=\"specialty\" value=\"GeneralDoctor\" required /> \
                    <label class=\"form-check-label\" for=\"Doc0\">general practitioner</label>  \
                </div>  \
                <div class=\"form-check form-check-inline\">   \
                    <input class=\"form-check-input\" type=\"radio\" id=\"Doc1\" name=\"specialty\" value=\"Pathologist\" />  \
                    <label class=\"form-check-label\" for=\"Doc1\">pathologist</label> \
                </div>";
        document.getElementById("docDescr").classList.add("mb-3", "mt-3");
        document.getElementById("docDescr").innerHTML = " \
            <div class=\" mb-3 mt-3\">\
                <label for=\"docDcr\" class=\"form-label\">Doctor Information</label>\
                <textarea class=\"form-control\" id=\"docDcr\" name=\"doctor_info\" rows=\"4\" style=\"height:100%\"></textarea>\
            </div>";
        document.getElementById("docPrice").classList.add("mb-3", "mt-3");
        document.getElementById("docPrice").innerHTML = "\
            <div class=\"form-floating mb-3 mt-3\">\
               <input type=\"number\" class=\"form-control\" id=\"docPr\" name=\"price\" min=\"0\" value=\"50\" required/>\
              <label for=\"price\">Price of a 30 minute session (euro)</label>\
            </div>"

    } else
    {
        //document.getElementById("addr").name = "address"
        document.getElementById("addrL").innerHTML = "Address"

        document.getElementById("docSpec").classList.remove("mb-3", "mt-3");
        document.getElementById("docSpec").innerHTML = "";
        document.getElementById("docDescr").classList.remove("mb-3", "mt-3");
        document.getElementById("docDescr").innerHTML = "";
        document.getElementById("docPrice").classList.remove("mb-3", "mt-3");
        document.getElementById("docPrice").innerHTML = "";
    }


}

var latitude = 1.0, longitude = 1.0;
function setPosition(lat, lon)
{
    var fromProjection = new OpenLayers.Projection("EPSG:4326");
    var toProjection = new OpenLayers.Projection("EPSG:900913");
    var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection,
            toProjection);
    return position;
}
function handler(position, message)
{
    var popup = new OpenLayers.Popup.FramedCloud("Popup",
            position, null,
            message, null,
            true
            );
    map.addPopup(popup);
}
function OpenMap()
{
    document.getElementById("Map").innerHTML = ""; /*to delete previous maps*/
    document.getElementById("Map").style = "height:400px;width:500px;display:block";
    map = new OpenLayers.Map("Map");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);
    var position = setPosition(latitude, longitude);
    var mar = new OpenLayers.Marker(position);
    markers.addMarker(mar);
    mar.events.register('mousedown', mar, function (evt) {
        handler(position, 'your address');
    }
    );
    const zoom = 11;
    map.setCenter(position, zoom);
}
function ClearMap()
{
    document.getElementById("Map").innerHTML = ""; /*to delete previous maps*/
    document.getElementById("Map").style = "display:none";
    document.getElementById("openMap").style = "display:none";
    document.getElementById("noLoc").style = "display:none";
}
function Verify()
{
    const data = null;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const obj = JSON.parse(this.responseText);
            if (obj[0] == null)  // no response sent
            {
                document.getElementById("noLoc").className = "alert alert-warning";
                document.getElementById("noLoc").style = "display:block";
                document.getElementById("noLoc").innerHTML = "Sorry can't find specified location.";
            } else
            {
                var text = obj[0].display_name; // had error when obj was empty cause it couldnt read property of undefined
                if (text.search("Crete") === -1)
                {
                    document.getElementById("noLoc").className = "alert alert-warning";
                    document.getElementById("noLoc").style = "display:block";
                    document.getElementById("noLoc").innerHTML = "Service is only available in Crete.";
                    return;
                }
                document.getElementById("noLoc").className = "alert alert-success";
                document.getElementById("noLoc").style = "display:block";
                document.getElementById("noLoc").innerHTML = "Found a location!";
                document.getElementById("openMap").style = "display:block";
                latitude = obj[0].lat;
                longitude = obj[0].lon;
                //document.getElementById("demo").innerHTML =text; //display to html
            }

        }
    });
    var q = document.getElementById("address").value + " " + document.getElementById("city").value + " " + document.getElementById("country").value;
    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=" + q + "&format=json&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "a3d96ba6e6mshd9b99ca3d969754p14a654jsnb8c8996063eb");
    xhr.send(data);
}




function fetchLocation(position) //similar to verify, didnt have time to merge
{
    const data = null;
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const obj = JSON.parse(this.responseText);
            if (obj == null)  // no response sent
            {
                document.getElementById("noLoc").className = "alert alert-warning";
                document.getElementById("noLoc").style = "display:block";
                document.getElementById("noLoc").innerHTML = "Sorry can't find specified location.";
            } else
            {
                var text = obj.display_name; // had error when obj was empty cause it couldnt read property of undefined
                if (text.search("Crete") === -1)
                {
                    document.getElementById("noLoc").className = "alert alert-warning";
                    document.getElementById("noLoc").style = "display:block";
                    document.getElementById("noLoc").innerHTML = "Service is only available in Crete.";
                    return;
                }
                document.getElementById("city").value = obj.address.city;
                document.getElementById("country").value = obj.address.country;
                if (text.search("road") === -1)
                {
                    document.getElementById("address").value = obj.address.city_district;
                } else
                {
                    document.getElementById("address").value = obj.address.road;
                    if (text.search("house_number") !== -1)
                        document.getElementById("address").value += " " + obj.address.house_number;
                }

                document.getElementById("noLoc").className = "alert alert-success";
                document.getElementById("noLoc").style = "display:block";
                document.getElementById("noLoc").innerHTML = "Found a location!";
                document.getElementById("openMap").style = "display:block";
            }
        }
    });
    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=" + latitude + "&lon=" + longitude + "&format=json&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "a3d96ba6e6mshd9b99ca3d969754p14a654jsnb8c8996063eb");
    xhr.send(data);
}
function getLocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(fetchLocation);
    } else
    {
        document.getElementById("noLoc").className = "alert alert-warning";
        document.getElementById("noLoc").style = "display:block";
        document.getElementById("noLoc").innerHTML = "Geolocation not supported by this browser.";
    }


}

function createTableFromJSON(data) {
    var html = "<table><tr><th>Category</th><th>Value</th></tr>";
    for (const x in data) {
        var category = x;
        var value = data[x];
        html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
    }
    html += "</table>";
    return html;
}

function RegisterPost() {
    let myForm = document.getElementById('loginForm');
    let formData = new FormData(myForm);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    var jsonData = JSON.stringify(data);
    jsonData = jsonData.slice(0, -1)//removes the } in the end
    jsonData += ",\"lat\":\"" + latitude + "\",\"lon\":\"" + longitude + "\"}";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            /*const responseData = JSON.parse(xhr.responseText);
             $('').html("Status code: " + xhr.status + ", successful registration. Now please log in!");
             if (document.getElementById("rD").checked)
             $('').append(", must be certified by admin");
             $('').append("<br> Your Data" + createTableFromJSON(responseData));*/
            $("#mainPart").load("login.html"); //so the user can login immediatly
        } else if (xhr.status !== 200)
        {
            const responseData = JSON.parse(xhr.responseText);
            var msg = "Status: " + xhr.status;
            for (const x in responseData) {
                var value = responseData[x];
                msg += "\n" + value;
            }
            alert(msg);
            /*document.getElementById('').innerHTML =
             'Request failed. Returned status of ' + xhr.status + "<br>";
             document.getElementById('').innerHTML += createTableFromJSON(responseData);*/
        }
    };
    if (document.getElementById("rD").checked)
        xhr.open('POST', 'RegisterDoctor');
    else
        xhr.open('POST', 'Register');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(jsonData);
}

function completeForm() {
    if (!Validate())
    {
        return false;
    }

    RegisterPost();
    return true;
}

function Switch_to_login() {
    $("#mainPart").load("login.html");
}

function Switch_to_sign_up() {
    $("#mainPart").load("Sign_In.html");
}
async function edit_info() {
    var user = await getUser();
    if (user.hasOwnProperty('doctor_id'))
        $("#mainPart").load("Edit_doc_info.html");
    else
        $("#mainPart").load("Edit_info.html");
    $("#homepage").hide();
    setDefault();
}

function getUsers() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var users = JSON.parse(xhr.responseText);
            var html = "";
            for (var j in users) {
                html += "<div class ='row'>";
                html += "<div class ='col-sm-1 col-md-1 col-lg-1 col-xl-1'></div>";
                html += "<div class ='col-sm-10 col-md-10 col-lg-10 col-xl-10'>";
                html += "<div class= 'adminBoxes'>";
                html += "<div class ='row'>";
                html += "<div class ='col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
                html += "<b>Username: </b>" + users[j]["username"];
                html += "<br><b>Firstname: </b>" + users[j]["firstname"];
                html += "<br><b>lastname: </b>" + users[j]["lastname"];
                html += "<br><b>Birthdate: </b>" + users[j]["birthdate"];

                html += "</div>";
                html += "<div class ='col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
                html += "<b>Email: </b>" + users[j]["email"];
                html += "<br><b>Telephone: </b>" + users[j]["telephone"];
                html += "<br><b>AMKA: </b>" + users[j]["amka"];
                html += "<br><b>Gender: </b>" + users[j]["gender"];


                html += "</div>";
                html += "<div class ='col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
                html += "<b>Address: </b>" + users[j]["address"];
                html += "<br><b>Country: </b>" + users[j]["country"];
                html += "<br><b>City: </b>" + users[j]["city"];
                html += "<br><b>Lat/Lon: </b>" + users[j]["lat"] + "/" + users[j]["lon"];


                html += "</div>";
                html += "<div class ='col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
                if (users[j]["blooddonor"]) {
                    html += "<b>Blooddonor: </b>yes";
                } else {
                    html += "<b>Blooddonor: </b>no";
                }
                html += "<br><b>Bloodtype: </b>" + users[j]["bloodtype"];


                html += "</div>";

                html += "</div>";
                html += "<br>";
                html += "<button class ='btn btn-small adminDelBtn float-end' type = 'button' onclick='deleteUser(" + users[j]["user_id"] + ")'>Delete</button>";
                html += "<br>";
                html += "</div>";

                html += "</div>";
                html += "<div class ='col-sm-1 col-md-1 col-lg-1 col-xl-1'></div>";
                html += "</div>";




            }
            if (html === "") {
                document.getElementById("allUsers").innerHTML = "";
            } else {
                document.getElementById("allUsers").innerHTML += "<h4>Users</h4>";
                document.getElementById("allUsers").innerHTML += html;
            }

        }
    };
    xhr.open('GET', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/users');
    xhr.setRequestHeader('Accept', "application/json");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function loginPOST() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const responseData = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (responseData.hasOwnProperty('admin'))
                setChoicesForAdmin();
            else if (responseData.hasOwnProperty('user_id'))
                setChoicesForLoggedUser();
            else if (responseData.hasOwnProperty('doctor_id'))
                setChoicesForDoctor();
            TimeoutGlobal = setTimeout(checkNotifications, 10000);
            IntervalGlobal = setInterval(checkRandevouzCancels, 10000);
        } else if (xhr.status !== 200) {
            var msg = "Status: " + xhr.status;
            for (const x in responseData) {
                var value = responseData[x];
                msg += "\n" + value;
            }
            alert(msg);
            /*document.getElementById('').innerHTML =
             'Returned status of ' + xhr.status + "<br>";
             document.getElementById('').innerHTML += createTableFromJSON(responseData);*/
        }
    };
    var data = $('#loginForm').serialize();
    xhr.open('POST', 'Login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
}

$(document).ready(function ()
{
    if (document.getElementById("notLoggedInKey") !== null)
        isLoggedIn();
});
function isLoggedIn() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const responseData = JSON.parse(xhr.responseText);

        if (xhr.readyState === 4 && xhr.status === 200) {
            if (responseData.hasOwnProperty('admin'))
                setChoicesForAdmin();
            else if (responseData.hasOwnProperty('user_id'))
                setChoicesForLoggedUser();
            else if (responseData.hasOwnProperty('doctor_id'))
                setChoicesForDoctor();
            TimeoutGlobal = setTimeout(checkNotifications, 10000);
            IntervalGlobal = setInterval(checkRandevouzCancels, 10000);
        } else if (xhr.status !== 200)
        {
            /*document.getElementById('').innerHTML =
             'Returned status of ' + xhr.status + "<br>";
             document.getElementById('').innerHTML += createTableFromJSON(responseData);*/
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}
var TimeoutGlobal, IntervalGlobal;
function logout() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {//403 is that it competed the call but the user had probably already logged out
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 403)) {
            clearTimeout(TimeoutGlobal);
            clearInterval(IntervalGlobal);
            fetch("index.html").then(response => response.text())
                    .then(text => {
                        document.open();
                        document.write(text);
                        document.close();
                    });
        } else if (xhr.status !== 200) // unknown behavior
            alert('Request failed. Returned status of ' + xhr.status);
    };
    xhr.open('POST', 'Logout');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}
function setChoicesForAdmin() {
    document.getElementById("homepage").style = "display:none";
    load("admin_navbar.html", "navLinks");

    adminFunc();
}
function setChoicesForLoggedUser() {
    document.getElementById("homepage").style = "display:none";
    load("user_navbar.html", "navLinks");

    $('#mainPart').load("userUI.html");
}
function setChoicesForDoctor() {
    document.getElementById("homepage").style = "display:block";
    load("doc_navbar.html", "navLinks");//doctor
    $('#mainPart').html("");
}
var userID;
function setDefault() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            for (const x in data)
            {
                var category = x;
                var value = data[x];
                if (document.getElementById(category) !== null)
                    document.getElementById(category).value = value
            }
            if (data.hasOwnProperty('doctor_id')) {
                userID = data["doctor_id"];
                if (data["specialty"] === "GeneralDoctor")
                    document.getElementById("Doc0").checked = true;
                else
                    document.getElementById("Doc1").checked = true;
            } else
                userID = data["user_id"];
            if (data["blooddonor"])
                document.getElementById("DonorY").checked = true;
            else
                document.getElementById("DonorN").checked = true;
            if (data["gender"] === "Male")
                document.getElementById("gM").checked = true;
            else if (data["gender"] === "Female")
                document.getElementById("gF").checked = true;
            else
                document.getElementById("gO").checked = true;
            latitude = data["lat"];
            longitude = data["lon"];

        } else if (xhr.status !== 200)
        {
            /*const responseData = JSON.parse(xhr.responseText);
             document.getElementById('').innerHTML =
             'Returned status of ' + xhr.status + "<br>";
             document.getElementById('').innerHTML += createTableFromJSON(responseData);*/
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}

function EditPost() {
    let myForm = document.getElementById('editForm');
    let formData = new FormData(myForm);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    var jsonData = JSON.stringify(data);
    jsonData = jsonData.slice(0, -1)//removes the } in the end
    jsonData += ",\"lat\":\"" + latitude + "\",\"lon\":\"" + longitude + "\",\"username\":\"" + document.getElementById("username").value + "\",\"user_id\":\"" + userID + "\"}";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            const responseData = JSON.parse(xhr.responseText);
            alert("Status: " + xhr.status + ", successful update!");
            /*$('').html("Status code: " + xhr.status + ", successful update!");
             $('').append("<br> Your Data" + createTableFromJSON(responseData));*/
        } else if (xhr.status !== 200)
        {
            const responseData = JSON.parse(xhr.responseText);
            var msg = "Status: " + xhr.status;
            for (const x in responseData) {
                var value = responseData[x];
                msg += "\n" + value;
            }
            alert(msg);
            /*document.getElementById('').innerHTML =
             'Request failed. Returned status of ' + xhr.status + "<br>";
             document.getElementById('').innerHTML += createTableFromJSON(responseData);*/
        }
    };
    xhr.open('POST', 'EditUser');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(jsonData);
}

function getBMI() {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var age = new Date().getFullYear();
            var birthdate = data["birthdate"].replaceAll("-", "");
            var year = birthdate.substr(0, 4);
            year = parseInt(year);
            age -= year;
            var height = data["height"];
            var weight = data["weight"];
            if (height === null)
            {
                document.getElementById('BMIresult').innerHTML = "It appears you have yet to tell us your height";
                return;
            }
            if (weight === null)
            {
                document.getElementById('BMIresult').innerHTML = "It appears you have yet to tell us your weight";
                return;
            }

            const dataBMI = null;
            const xhrBMI = new XMLHttpRequest();
            xhrBMI.withCredentials = true;
            xhrBMI.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE && xhrBMI.status === 200) {
                    const response = JSON.parse(xhrBMI.responseText);
                    document.getElementById('BMIresult').innerHTML =
                            "BMI: " + response["data"]["bmi"] + "\xa0\xa0\xa0\xa0Health: " + response["data"]["health"];
                } else if (xhrBMI.status !== 200)
                {
                    const responseData = JSON.parse(xhrBMI.responseText);
                    document.getElementById('BMIresult').innerHTML =
                            'Returned status of ' + xhrBMI.status + "<br>";
                    document.getElementById('BMIresult').innerHTML += createTableFromJSON(responseData["errors"]);
                }
            });
            xhrBMI.open("GET", "https://fitness-calculator.p.rapidapi.com/bmi?age=" + age + "&weight=" + weight + "&height=" + height);
            xhrBMI.setRequestHeader("x-rapidapi-host", "fitness-calculator.p.rapidapi.com");
            xhrBMI.setRequestHeader("x-rapidapi-key", "a3d96ba6e6mshd9b99ca3d969754p14a654jsnb8c8996063eb");
            xhrBMI.send(dataBMI);
        } else if (xhr.status !== 200)
        {
            const responseData = JSON.parse(xhr.responseText);
            document.getElementById('BMIresult').innerHTML =
                    'Returned status of ' + xhr.status + "<br>";
            document.getElementById('BMIresult').innerHTML += createTableFromJSON(responseData);
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}

function getIdealWeight() {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var gender = data["gender"].toLowerCase(); // maybe wrong cause date isnt str
            var height = data["height"];
            if (height === null)
            {
                document.getElementById('Idealresult').innerHTML = "It appears you have yet to tell us your height";
                return;
            }
            const dataBMI = null;
            const xhrBMI = new XMLHttpRequest();
            xhrBMI.withCredentials = true;
            xhrBMI.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE && xhrBMI.status === 200) {
                    const response = JSON.parse(xhrBMI.responseText);
                    console.log(response);
                    document.getElementById('Idealresult').innerHTML =
                            "Ideal weight based on Devine: " + response["data"]["Devine"];
                } else if (xhrBMI.status !== 200)
                {
                    const responseData = JSON.parse(xhrBMI.responseText);
                    document.getElementById('Idealresult').innerHTML =
                            'Returned status of ' + xhrBMI.status + "<br>";
                    document.getElementById('Idealresult').innerHTML += createTableFromJSON(responseData["errors"]);
                }
            });
            xhrBMI.open("GET", "https://fitness-calculator.p.rapidapi.com/idealweight?gender=" + gender + "&height=" + height);
            xhrBMI.setRequestHeader("x-rapidapi-host", "fitness-calculator.p.rapidapi.com");
            xhrBMI.setRequestHeader("x-rapidapi-key", "a3d96ba6e6mshd9b99ca3d969754p14a654jsnb8c8996063eb");
            xhrBMI.send(dataBMI);
        } else if (xhr.status !== 200)
        {
            const responseData = JSON.parse(xhr.responseText);
            document.getElementById('Idealresult').innerHTML =
                    'Returned status of ' + xhr.status + "<br>";
            document.getElementById('Idealresult').innerHTML += createTableFromJSON(responseData);
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}

function createTableFromDocJSON(docs) {
    var ret = "";
    for (const y in docs)
    {
        var data = docs[y];
        var html = "<div class= \"doc_buttons\" id = \"" + data["doctor_id"] + "\">";

        html += data["firstname"] + " " + data["lastname"] + "<br>" + data["address"] + " " + data["telephone"] + "<br>" + data["specialty"] +
                "<br>" + data["doctor_info"] + "<br>Randevouz Price: <b>" + data["price"] + " euro</b>";
        html += "<br><div class=\"extra_buttons\" id=\"EB_" + data["doctor_id"] + "\"></div>";
        if (data["lat"] === 1.0)
            html += "<a class =\"btn btn-warning docmap disabled\" role= \"button\">Map</a>";
        else
            html += "<a class =\"btn btn-warning docmap\" onclick=\"putMarker(" + data["lat"] + "," + data["lon"]
                    + ",\'" + data["firstname"] + " " + data["lastname"] + "\')\" role= \"button\">Map</a>";
        html += "\n";
        html += "</div>";
        ret += html;
    }
    return ret;
}
function findDocs() {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {

            } else if (xhr.status !== 200) {
                /*$("").html("Not sure what went wrong");*/
            }
            resolve(JSON.parse(this.responseText)); // this is visFindDoc's result = responseText
        };
        xhr.onerror = reject; // this is visFindDoc's .catch
        xhr.open('GET', 'FindDocs');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send();
    });
}

function visFindDoc() {

    var html = "<div class = \"row\">";
    html += "<div class = \"col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 mt-3\">";
    html += "<div id=\"docSort\"></div>";
    html += "<div id=\"docTabl\"></div>";
    html += "</div>";
    html += "<div class = \"col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 mt-3\">";
    html += "<div id = \"Map\" style= \"height:500px; width:600px; position:fixed;  \"></div>";
    html += "</div>";
    html += "</div>";
    document.getElementById("mainPart").innerHTML = html;
    findDocs()
            .then(function (result)
            {
                html = createTableFromDocJSON(result);
                document.getElementById("docTabl").innerHTML = html;
            }
            )
            .catch(function (error)
            {
                html = "there appears to have been an error, try later" + error;
                document.getElementById("docTabl").innerHTML = html;
            });
    makeMap();
}

function userFindDoc() {
    visFindDoc();
    var html = "";
    html += "<div class ='row'>";
    html += "<div class = 'col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 mt-3 mb-3'>";
    html += "<form id ='sortDocForm' name='sortDocForm' onsubmit= 'sortDoctors(); return false;'>";
    html += "<label for='sortDocs' style='margin-left:10.5%;'>Sort By: </label>";
    html += "<select id='sortDocs' name='sortDocs' style='margin-left:2%;'>";
    html += "<option value='price'>Price</option>";
    html += "<option value='distance'>Distance</option>";
    html += "<option value='car'>Car</option>";
    html += "</select>";
    html += "<input class='btn btn-small' type='submit' value='Submit' style='background-color: #0d8386; color:white; margin-left:3%;'>";
    html += "</form>";
    html += "</div>";
    html += "</div>";

    document.getElementById("docSort").innerHTML = html;
    addUserButtonsFindDoc();
}

function getUser() {
    return new Promise(function (resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(this.responseText));
            } else if (xhr.status !== 200)
            {
                const responseData = JSON.parse(xhr.responseText);
            }
        };
        xhr.onerror = reject;
        xhr.open('GET', 'Login');
        xhr.send();
    });
}

async function sortDoctors() {
    document.getElementById("docTabl").innerHTML = "Working on it, it will take some time";

    var sortMethod = document.getElementById("sortDocs").value;

    if (sortMethod === "price") {
        findDocs()
                .then(function (result) {
                    document.getElementById("docTabl").innerHTML = createTableFromDocJSON(result);
                    addUserButtonsFindDoc();
                })
                .catch(function (error) {
                    document.getElementById("docTabl").innerHTML = "there appears to have been an error, try later" + error;
                });
        return;//done with price dont do the rest
    }

    var doctors = "bad";
    doctors = await findDocs();
    var user = "bad";
    user = await getUser();

    if (user["lat"] === 1) {
        document.getElementById("docTabl").innerHTML = "you have yet to verify your location, as such you cannot use Sort By Distance or Sort By Car";
        return;
    }

    NoLocDocs = [];
    LocsDocs = "";
    Object.keys(doctors).forEach((obj => {
        if (doctors[obj]["lat"] === 1) {
            NoLocDocs.push(doctors[obj]);
            delete doctors[obj];//removes docs that are not in the request, so that the response will have distances 1-1 with the remaining docs
        } else {
            LocsDocs += doctors[obj]["lat"] + "%2C" + doctors[obj]["lon"] + "%3B";//makes the request string
        }
    }));

    if (LocsDocs === "") {// case all doctors are lat/lon = 1, will check it on laptop
        document.getElementById("docTabl").innerHTML = "";
        LocsDocs.forEach((doctor) => {
            document.getElementById("docTabl").innerHTML += createTableFromDocJSON(doctor);
        });
        return;
    }

    LocsDocs = LocsDocs.slice(0, -1); //remove the last ;

    var MethodOfSort;
    if (sortMethod === "distance") {
        MethodOfSort = "distances";
    } else if (sortMethod === "car") {
        MethodOfSort = "durations";
    } else {
        document.getElementById("docTabl").innerHTML = "What did you put as Sorting choice!?!";
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var response = JSON.parse(this.responseText);
            var response = response[MethodOfSort][0];
            Sorted_id = [];
            var i = 0;
            Object.keys(doctors).forEach((obj => {
                if (response[i] === null) {// removes the nulls with a large number (~10.000 km)
                    response[i] = 9999999;
                }
                Sorted_id.push([response[i], doctors[obj]["doctor_id"]]);
                i++;
            }));
            Sorted_id.sort(function (a, b) {
                return a[0] - b[0];
            });
            // now the distances/durations are sorted

            document.getElementById("docTabl").innerHTML = "";

            for (var k in Sorted_id) {
                for (var j in doctors) {
                    if (doctors[j]["doctor_id"] === Sorted_id[k][1]) {
                        var html = "<div class= \"doc_buttons\" id = \"" + doctors[j]["doctor_id"] + "\">";
                        html += doctors[j]["firstname"] + " " + doctors[j]["lastname"] + "<br>" + doctors[j]["address"] + " " + doctors[j]["telephone"] + "<br>" + doctors[j]["specialty"] +
                                "<br>" + doctors[j]["doctor_info"] + "<br>Randevouz Price: <b>" + doctors[j]["price"] + " euro</b>";
                        html += "<br><div class=\"extra_buttons\" id=\"EB_" + doctors[j]["doctor_id"] + "\"></div>";
                        if (doctors[j]["lat"] === 1.0)
                            html += "<a class =\"btn btn-warning docmap disabled\" role= \"button\">Map</a>";
                        else
                            html += "<a class =\"btn btn-warning docmap\" onclick=\"putMarker(" + doctors[j]["lat"] + "," + doctors[j]["lon"]
                                    + ",\'" + doctors[j]["firstname"] + " " + doctors[j]["lastname"] + "\')\" role= \"button\">Map</a>";
                        html += "\n";
                        html += "</div>";


                        document.getElementById("docTabl").innerHTML += html;
                    }
                }
            }
            for (var j in NoLocDocs) {
                var html = "<div class= \"doc_buttons\" id = \"" + NoLocDocs[j]["doctor_id"] + "\">";
                html += NoLocDocs[j]["firstname"] + " " + NoLocDocs[j]["lastname"] + "<br>" + NoLocDocs[j]["address"] + " " + NoLocDocs[j]["telephone"] + "<br>" + NoLocDocs[j]["specialty"] +
                        "<br>" + NoLocDocs[j]["doctor_info"] + "<br>Randevouz Price: <b>" + NoLocDocs[j]["price"] + " euro</b>";
                html += "<br><div class=\"extra_buttons\" id=\"EB_" + NoLocDocs[j]["doctor_id"] + "\"></div>";
                if (NoLocDocs[j]["lat"] === 1.0)
                    html += "<a class =\"btn btn-warning docmap disabled\" role= \"button\">Map</a>";
                else
                    html += "<a class =\"btn btn-warning docmap\" onclick=\"putMarker(" + NoLocDocs[j]["lat"] + "," + NoLocDocs[j]["lon"]
                            + ",\'" + NoLocDocs[j]["firstname"] + " " + NoLocDocs[j]["lastname"] + "\')\" role= \"button\">Map</a>";
                html += "\n";
                html += "</div>";


                document.getElementById("docTabl").innerHTML += html;
            }

            console.log(Sorted_id);
            addUserButtonsFindDoc();
        }
    });
    xhr.open("GET", "https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=" + user["lat"] + "%2C" + user["lon"] + "&destinations=" + LocsDocs);
    xhr.setRequestHeader("x-rapidapi-host", "trueway-matrix.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "a3d96ba6e6mshd9b99ca3d969754p14a654jsnb8c8996063eb");

    xhr.send();
}

async function addUserButtonsFindDoc() {

    var user = "bad";
    user = await getUser();

    var buttons = document.getElementsByClassName("extra_buttons");
    for (var i = 0; i < buttons.length; i++) {
        addMsgRandvz(buttons.item(i).parentNode.id, user["user_id"]);
    }
}

function addMsgRandvz(doc_id, user_id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            document.getElementById('EB_' + doc_id).innerHTML = "";
            if (data === "no") {
                document.getElementById('EB_' + doc_id).innerHTML += "<a class =\"btn btn-warning disabled\" role= \"button\" style = 'margin-right:2%;margin-bottom:1%'>Message</a>";
            } else if (data === "yes") {
                document.getElementById('EB_' + doc_id).innerHTML += "<a class =\"btn btn-warning \" onclick=\"msgDoc(" + user_id + "," + doc_id + ")\" role= \"button\" style = 'margin-right:2%;margin-bottom:1%'>Message</a>";
            }

            var xhrDt = new XMLHttpRequest();
            xhrDt.onload = function () {
                if (xhrDt.readyState === 4 && xhrDt.status === 200) {

                    var randvz = JSON.parse(xhrDt.responseText);
                    if (randvz.length === 0) {
                        document.getElementById('EB_' + doc_id).innerHTML += "<a class =\"btn btn-warning disabled\" role= \"button\" style = 'margin-bottom:1%;'>Randevouz</a>";
                    } else {
                        document.getElementById('EB_' + doc_id).innerHTML += "<a class =\"btn btn-warning \" onclick=\"randvzDoc(" + user_id + "," + doc_id + ")\" role= \"button\" style = 'margin-bottom:1%;'>Randevouz</a>";

                    }
                    document.getElementById('EB_' + doc_id).innerHTML += "<div id='EBR_" + doc_id + "'></div>";
                } else if (xhrDt.status !== 200) {

                }
            };
            xhrDt.open('GET', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/FreeRandevouz/' + doc_id);
            xhrDt.setRequestHeader('Accept', "application/json");
            xhrDt.setRequestHeader("Content-type", "application/json");
            xhrDt.send();

        } else if (xhr.status !== 200) {
        }
    };
    xhr.open('GET', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/CanMessage/' + user_id + "/" + doc_id);
    xhr.setRequestHeader('Accept', "application/json");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();

}

//to clear previous messages and randevouz
function clearMsg() {
    openForms = document.getElementsByClassName("docStuf");
    if (openForms !== null) {
        for (var i = 0; i < openForms.length; i++) {
            openForms[0].parentNode.removeChild(openForms[0]);
        }
    }
}

function msgDoc(user_id, doc_id) {

    clearMsg();

    html = "<div class=\"docStuf\">";
    html += "<form onsubmit=\"sendMsg(" + user_id + "," + doc_id + ", 0);return false;\">";
    html += "<textarea class=\"form-control\" id=\"msg\" name=\"message\" rows=\"4\" style=\"height:100%\"></textarea>";
    html += "<input class=\"btn btn-warning\" type=\"submit\" value=\"Send\"/ style = 'margin-top:1%;'>";
    html += "</form></div>";
    document.getElementById('EBR_' + doc_id).innerHTML = html;
}

function sendMsg(sender, receiver, type) {
    var msg = document.getElementById("msg").value;
    var doc_id, user_id, sender_type;
    if (type) {
        sender_type = "doctor";
        doc_id = sender;
        user_id = receiver;
    } else {
        sender_type = "user";
        doc_id = receiver;
        user_id = sender;
    }
    var json = "{\"doctor_id\":\"" + doc_id + "\", \"user_id\":\"" + user_id + "\", \"message\":\"" + msg + "\", \"sender\":\"" + sender_type + "\"}";

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            clearMsg();
            clearDocMsg(user_id);
        } else if (xhr.status !== 200) {
            /*document.getElementById('')
             .innerHTML = 'Request failed. Returned status of ' + xhr.status + "<br>" +
             JSON.stringify(xhr.responseText);*/
            clearMsg();
            clearDocMsg(user_id);
        }
    };
    xhr.open('POST', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/newMessage');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(json);
}

function randvzDoc(user_id, doc_id) {

    clearMsg();

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {

            var randvz = JSON.parse(xhr.responseText);
            var page = "<div class= \"docStuf\">";
            for (var i in randvz) {
                var html = "";
                html += "<div class= \"doc_buttons\">";
                html += "At: " + randvz[i]["date_time"];
                html += "<br>Extra info: " + randvz[i]["doctor_info"];
                html += "<a id=\"book" + randvz[i]["randevouz_id"] + "\" class =\"btn btn-warning docmap\" onclick=\"showBook(" + randvz[i]["randevouz_id"] + "," + user_id + ")\">Start Booking</a>";
                html += "</div>";
                page += html;
            }
            page += "</div>";
            document.getElementById('EBR_' + doc_id).innerHTML = page;
        } else if (xhr.status !== 200) {

        }
    };
    xhr.open('GET', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/FreeRandevouz/' + doc_id);
    xhr.setRequestHeader('Accept', "application/json");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}//todo

function showBook(rzv_id, user_id) {
    var button = document.getElementById('book' + rzv_id);
    button.style.display = "none";

    var openForms = document.getElementsByClassName("bookText");
    if (openForms !== null) {
        for (var i = 0; i < openForms.length; i++) {
            var parent = openForms[0].parentNode;
            parent.removeChild(openForms[0]);
            parent.lastChild.style.display = "block";
        }
    }

    var html = "<form class=\"bookText\" onsubmit=\"bookRzv(" + rzv_id + "," + user_id + ");return false;\">";
    html += "<textarea class=\"form-control\" id=\"msg\" name=\"message\" rows=\"4\" style=\"height:100%\"></textarea>";
    html += "<input class=\"btn btn-warning\" type=\"submit\" value=\"Book\"/>";
    html += "</form>";
    button.parentNode.insertAdjacentHTML('beforeend', html);
}

function bookRzv(rzv_id, user_id) {
    var msg = document.getElementById("msg").value;

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            /*document.getElementById('').innerHTML = JSON.stringify(xhr.responseText);*/
            clearMsg();
        } else if (xhr.status !== 200) {
            /*document.getElementById('')
             .innerHTML = 'Request failed. Returned status of ' + xhr.status + "<br>" +
             JSON.stringify(xhr.responseText);*/
            clearMsg();
        }
    };
    xhr.open('PUT', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/upadateRandevouz/' + rzv_id + "/" + user_id + "/" + msg + "/selected");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

var markers;
function makeMap()
{
    map = new OpenLayers.Map("Map");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
    markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);
    var position = setPosition(35.341846, 25.148254);
    //var mar=new OpenLayers.Marker(position);
    ////markers.addMarker(mar);
    //.events.register('mousedown', mar, function(evt) {
    //handler(position,'your address');}
    //);

    const zoom = 11;
    map.setCenter(position, zoom);
}

function putMarker(lat, lon, name) {
    markers.clearMarkers();
    //var markers = new OpenLayers.Layer.Markers( "Markers" );
    // map.addLayer(markers); 

    var position = setPosition(lat, lon);
    var mar = new OpenLayers.Marker(position);
    markers.addMarker(mar);
    mar.events.register('mousedown', mar, function (evt) {
        handler(position, name);
    }
    );
    const zoom = 17;
    map.setCenter(position, zoom);
}

function load(url, element)
{
    fetch(url).then(response => response.text())
            .then(text => document.getElementById(element).innerHTML = text);
}

function checkBTinput(value, level, prev_val) {
    if (value === 0) {
        return "<td>-</td><td>-</td>";
    }
    if (prev_val === -1) {
        return "<td>" + value + "</td><td>" + level + "</td>";
    }

    if (value >= prev_val) {
        return "<td>" + value + "(+" + (value - prev_val) + ")</td><td>" + level + "</td>";
    }
    return "<td>" + value + "(" + (value - prev_val) + ")</td><td>" + level + "</td>";
}

function seeBloodtest(flag, Uamka, userID) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var dt = JSON.parse(xhr.responseText);
            var amka;
            if (dt.hasOwnProperty('doctor_id')) {
                amka = Uamka;
            } else {
                amka = dt["amka"];
            }
            var request = 'http://localhost:8080/Computers_REST_API/hy359/medical_db/bloodTests/' + amka;
            if (flag) {
                request += "?fromDate=" + document.getElementById("fromdate").value + "&toDate=" + document.getElementById("todate").value;
            }

            var xhrSee = new XMLHttpRequest();
            xhrSee.onload = function () {
                if (xhrSee.readyState === 4 && xhrSee.status === 200) {

                    var data = JSON.parse(xhrSee.responseText);
                    var prev_val = [-1, -1, -1, -1, -1];
                    var html = "<table id=\"bltable\"><tr><th>Date</th><th>Medical Center</th><th>Vitamin D3</th><th>Vitamin D3 Level</th>\n\
                    <th>Vitamin B12</th><th>Vitamin B12 Level</th><th>Cholesterol</th><th>Cholesterol Level</th>\n\
                    <th>Blood Sugar</th><th>Blood Sugar Level</th><th>Iron</th><th>Iron Level</th>";
                    if (dt.hasOwnProperty('doctor_id')) {
                        html += "<th>Treatment</th>"
                    }
                    html += "</tr>";

                    for (const b in data) {
                        var bltest = data[b];
                        html += "<tr>";
                        html += "<td>" + bltest["test_date"] + "</td><td>" + bltest["medical_center"] + "</td>";
                        var keys = Object.keys(bltest);
                        for (var i = 0; i < 5; i++) {
                            x = (i * 2) + 4;
                            html += checkBTinput(bltest[keys[x]], bltest[keys[x + 1]], prev_val[i]);
                            if (bltest[keys[x]] !== 0) {
                                prev_val[i] = bltest[keys[x]];
                            }
                        }

                        if (dt.hasOwnProperty('doctor_id')) {
                            html += "<td><button class ='btn btn-small' type='button'";
                            html += "onclick = 'loadaddNewTreatement(";
                            html += bltest['bloodtest_id'];
                            html += ",";
                            html += dt['doctor_id'];
                            html += ",";
                            html += userID;
                            html += ")' style='background-color: #0d8386; color:white;'>";
                            html += "Add new</button></td>";
                        }

                        html += "</tr>";
                    }

                    html += "</table>";
                    document.getElementById("bloodtests").innerHTML = html;
                } else if (xhrSee.status !== 200) {

                }
            };
        } else if (xhrSee.status !== 200) {

        }

        xhrSee.open('GET', request);
        xhrSee.setRequestHeader('Accept', "application/json");
        xhrSee.setRequestHeader("Content-type", "application/json");
        xhrSee.send();
    };
    xhr.open('GET', 'Login');
    xhr.send();
}

function loadSeeBT() {
    $('#mainPart').load("seeBloodtest.html");
    seeBloodtest(0);
    seeTreatments(0, "treatments");
}

function addBloodtest() {
    let myForm = document.getElementById('myForm');
    let formData = new FormData(myForm);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    if (data["vitamin_d3"] == "")
        data["vitamin_d3"] = "0";
    if (data["vitamin_b12"] == "")
        data["vitamin_b12"] = "0";
    if (data["cholesterol"] == "")
        data["cholesterol"] = "0";
    if (data["blood_sugar"] == "")
        data["blood_sugar"] = "0";
    if (data["iron"] == "")
        data["iron"] = "0";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var dataUser = JSON.parse(xhr.responseText);
            data["amka"] = dataUser["amka"];
            var jsonData = JSON.stringify(data);
            var xhrAdd = new XMLHttpRequest();
            xhrAdd.onload = function () {
                if (xhrAdd.readyState === 4 && xhrAdd.status === 200) {
                    $("#mainPart").load("addBloodtest.html");
                    /*document.getElementById('').innerHTML = JSON.stringify(xhrAdd.responseText);*/
                } else if (xhrAdd.status !== 200) {
                    const responseData = JSON.parse(xhrAdd.responseText);
                    var msg = "Status: " + xhrAdd.status;
                    for (const x in responseData) {
                        var value = responseData[x];
                        msg += "\n" + value;
                    }
                    alert(msg);
                    /*document.getElementById('')
                     .innerHTML = 'Request failed. Returned status of ' + xhrAdd.status + "<br>" +
                     JSON.stringify(xhrAdd.responseText);*/
                }
            };
            xhrAdd.open('POST', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/newBloodTest');
            xhrAdd.setRequestHeader("Content-type", "application/json");
            xhrAdd.send(jsonData);
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}


function loadSeeTreatments(flag) {
    $('#mainPart').load("seeTreatments.html");
    seeTreatments(flag, "seeTreatments");
}

function seeTreatments(flag, location, userID) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var dt = JSON.parse(xhr.responseText);
            var userid;

            if (dt.hasOwnProperty('doctor_id')) {
                userid = userID;
            } else {
                userid = dt["user_id"];
            }
            var request = 'http://localhost:8080/Computers_REST_API/hy359/medical_db/treatments/' + userid;

            var today = new Date();
            var date = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();


            if (flag === 1) {
                request += "?fromDate=" + document.getElementById("fromdate").value + "&toDate=" + document.getElementById("todate").value;
            } else if (flag === 2) {//active treatments
                request += "?fromDate=" + date;
            } else if (flag === 3) { //finished treatments 
                request += "?toDate=" + date;
            }

            var xhrSee = new XMLHttpRequest();
            xhrSee.onload = function () {
                if (xhrSee.readyState === 4 && xhrSee.status === 200) {

                    var data = JSON.parse(xhrSee.responseText);

                    var html = "<table id=\"treattable\"><tr><th>Start Date</th><th>End Date</th><th>Description</th></tr>";

                    for (const t in data) {

                        var treat = data[t];

                        html += "<tr>";
                        html += "<td>" + treat["start_date"] + "</td><td>" + treat["end_date"] + "</td><td>" + treat["treatment_text"] + "</td>";
                        html += "</tr>";


                    }

                    html += "</table>";

                    if (data.length === 0) {
                        html = "You have no active treatements";
                    }

                    document.getElementById(location).innerHTML = html;
                } else if (xhrSee.status !== 200) {

                }
            };

        } else if (xhrSee.status !== 200) {

        }

        xhrSee.open('GET', request);
        xhrSee.setRequestHeader('Accept', "application/json");
        xhrSee.setRequestHeader("Content-type", "application/json");
        xhrSee.send();
    };

    xhr.open('GET', 'Login');
    xhr.send();
}

function biomarkersDisplay() {
    var x = document.getElementById("triggerVisual");
    if (x.style.display === "none") {
        x.style.display = "inline-table";
    } else {
        x.style.display = "none";
    }
}

google.charts.load('current', {'packages': ['line']});

function createChartElements(bltest) {

    var elements = [bltest['test_date']];
    var i = 1;

    if (document.getElementById('vtmD3').checked) {
        elements[i] = bltest['vitamin_d3'];
        i++;
    }
    if (document.getElementById('vtmB12').checked) {
        elements[i] = bltest['vitamin_b12'];
        i++;
    }
    if (document.getElementById('chol').checked) {
        elements[i] = bltest['cholesterol'];
        i++;
    }
    if (document.getElementById('blsugar').checked) {
        elements[i] = bltest['blood_sugar'];
        i++;
    }
    if (document.getElementById('iron').checked) {
        elements[i] = bltest['iron'];
        i++;
    }

    for (var j in elements) {
        if (elements[j] === 0) {
            elements[j] = null;
        }
    }

    return elements;
}

function createChart(Uamka) {

    if (document.getElementById('fromdate').value === "" || document.getElementById('todate').value === "") {
        alert("Please insert both dates in order to visualize!");
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var dt = JSON.parse(xhr.responseText);
            var amka;
            if (dt.hasOwnProperty('doctor_id')) {
                amka = Uamka;
            } else {
                amka = dt["amka"];
            }
            var request = 'http://localhost:8080/Computers_REST_API/hy359/medical_db/bloodTests/' + amka;

            request += "?fromDate=" + document.getElementById("fromdate").value + "&toDate=" + document.getElementById("todate").value;

            var xhrSee = new XMLHttpRequest();
            xhrSee.onload = function () {
                if (xhrSee.readyState === 4 && xhrSee.status === 200) {
                    var data = JSON.parse(xhrSee.responseText);

                    var ch = new google.visualization.DataTable();

                    ch.addColumn('string', 'Date');

                    if (document.getElementById('vtmD3').checked) {
                        ch.addColumn('number', 'Vitamin D3');
                    }
                    if (document.getElementById('vtmB12').checked) {
                        ch.addColumn('number', 'Vitamin B12');
                    }
                    if (document.getElementById('chol').checked) {
                        ch.addColumn('number', 'Cholesterol');
                    }
                    if (document.getElementById('blsugar').checked) {
                        ch.addColumn('number', 'Blood Sugar');
                    }
                    if (document.getElementById('iron').checked) {
                        ch.addColumn('number', 'Iron');
                    }


                    for (const i in data) {
                        var j = data[i];
                        ch.addRow(createChartElements(j));
                    }

                    var options = {
                        chart: {title: 'Comparison of Blood Tests'},
                        width: 900, height: 500
                    };

                    var chart = new google.charts.Line(document.getElementById('bloodtests'));
                    chart.draw(ch, google.charts.Line.convertOptions(options));

                } else if (xhrSee.status !== 200) {

                }

            };

        } else if (xhr.status !== 200) {

        }

        xhrSee.open('GET', request);
        xhrSee.setRequestHeader('Accept', "application/json");
        xhrSee.setRequestHeader("Content-type", "application/json");
        xhrSee.send();

    };

    xhr.open('GET', 'Login');
    xhr.send();
}

function makeCalendar() {
    $("#homepage").hide();
    $("#mainPart").load("dcrandevouz.html", function () {
        renderDate();
        checkRandevouz(null);
    });
}

var dt = new Date();
function renderDate() {

    dt.setDate(1);
    var day = dt.getDay();
    var today = new Date();
    var endDate = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate(); //how many days the month has

    var prevDate = new Date(dt.getFullYear(), dt.getMonth(), 0).getDate();

    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    document.getElementById("month").innerHTML = months[dt.getMonth()];

    var cells = "";

    //fills the cells with the days that can be seen from the previous month
    for (x = day; x > 0; x--) {
        cells += "<div class='prev_days with-revert'>" + (prevDate - x + 1) + "</div>";
    }

    var td = getTodayToString();

    for (i = 1; i <= endDate; i++) {
        if (i === today.getDate() && dt.getMonth() === today.getMonth()) {
            // cells += "<div class='today' onclick = 'checkRandevouz("+td+")'>" + i + "</div>";
            cells += "<div class='today' onclick =";
            cells += "'checkRandevouz(";
            cells += "\"";
            cells += td;
            cells += "\"";
            cells += ")'";
            cells += ">";
            cells += i;
            cells += "</div>";
        } else {

            cells += "<div id = '";
            cells += dt.getFullYear();
            cells += "-";

            if (dt.getMonth() < 10) {
                cells += "0";
            }

            cells += dt.getMonth() + 1;
            cells += "-";
            if (i < 10) {
                cells += "0";
            }
            cells += i;
            cells += "' onclick = \"checkRandevouz(this.id)\"";
            cells += ">";
            cells += i;
            cells += "</div>";

        }
    }


    document.getElementsByClassName("days")[0].innerHTML = cells;

}

function changeMonth(month) {

    if (month === "last") {
        dt.setMonth(dt.getMonth() - 1);
    } else if (month === 'next') {
        dt.setMonth(dt.getMonth() + 1);
    }
    renderDate();
}

function getTodayToString() {

    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();

    if (day < 10) {
        day = "0" + day;
    }

    month++;

    if (month < 10) {
        month = "0" + month;
    }

    return d.getFullYear() + "-" + month + "-" + day;

}

function Doctor_checkRandevouz(date_time, status, rand_id, date) {

    var html = "";
    html += "<div class = 'docRandevouz'>";
    html += date_time;
    html += "<br>";
    html += "Status: ";
    html += status;
    html += "<button class = 'btn btn-small doneBtn' type= \"button\" onclick = 'completeRandevouz(";
    html += rand_id;
    html += ",";
    html += "\"";
    html += date;
    html += "\"";
    html += ")'";
    if (status === 'done' || status === 'cancelled' || status === 'free') {
        html += " disabled ";
    }
    html += ">Done</button>";
    html += "<button class = 'btn btn-small cancelBtn' type= \"button\" onclick = 'cancelRandevouz(";
    html += rand_id;
    html += ",";
    html += "\"";
    html += date;
    html += "\"";
    html += ")'";
    if (status === 'done' || status === 'cancelled') {
        html += " disabled ";
    }
    html += ">Cancel</button>";
    html += "</div>";
    return html;
}

function checkRandevouz(date) {

    var pdf_date = date;

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var dt = JSON.parse(xhr.responseText);
            var docID = dt['doctor_id'];
            var request = 'http://localhost:8080/Computers_REST_API/hy359/medical_db/allRandevouz/' + docID + '/' + 'doctor';


            var xhrSee = new XMLHttpRequest();
            xhrSee.onload = function () {
                if (xhrSee.readyState === 4 && xhrSee.status === 200) {
                    var data = JSON.parse(xhrSee.responseText);
                    var html = '';

                    for (const d in data) {
                        var doc_ranz = data[d];
                        var arr = doc_ranz['date_time'].slice(0, 10);

                        if (date === null) {
                            pdf_date = getTodayToString();
                            if (arr === getTodayToString()) {
                                html += Doctor_checkRandevouz(doc_ranz['date_time'], doc_ranz['status'], doc_ranz['randevouz_id'], getTodayToString());
                            }
                        } else {
                            if (arr === date) {
                                html += Doctor_checkRandevouz(doc_ranz['date_time'], doc_ranz['status'], doc_ranz['randevouz_id'], date);
                            }
                        }
                    }

                    var pdf_html = "";

                    if (html === '') {
                        html += "You have no schedueled randevouz for this day!";
                    } else {
                        pdf_html += "<a class = 'btn btn-small' id='pdfBtn' ";
                        pdf_html += "href='PdfMaker?doctor_id=" + docID + "&date=" + pdf_date + "'";
                        pdf_html += "type ='button' target='_blank' >PDF Create";
                        pdf_html += "</a>";
                    }

                    document.getElementById("pdfButton").innerHTML = pdf_html;
                    document.getElementById("randevouz").innerHTML = html;

                } else if (xhrSee.status !== 200) {

                }
            };

            xhrSee.open('GET', request);
            xhrSee.setRequestHeader('Accept', "application/json");
            xhrSee.setRequestHeader("Content-type", "application/json");
            xhrSee.send();

        } else if (xhr.status !== 200) {

        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}

function cancelRandevouz(rand_id, date) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            /*document.getElementById('').innerHTML = JSON.stringify(xhr.responseText);*/

            checkRandevouz(date);

        } else if (xhr.status !== 200) {
            /*document.getElementById('')
             .innerHTML = 'Request failed. Returned status of ' + xhr.status + "<br>" +
             JSON.stringify(xhr.responseText);*/

        }
    };

    xhr.open('PUT', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/updateRandevouz/' + rand_id + "/" + "cancelled?canceller=doctor");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function completeRandevouz(rand_id, date) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            /*document.getElementById('').innerHTML = JSON.stringify(xhr.responseText);*/

            checkRandevouz(date);

        } else if (xhr.status !== 200) {
            /*document.getElementById('')
             .innerHTML = 'Request failed. Returned status of ' + xhr.status + "<br>" +
             JSON.stringify(xhr.responseText);*/

        }
    };

    xhr.open('PUT', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/updateRandevouz/' + rand_id + "/" + "done");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();


}

function loadCreateRand() {
    $("#randevouz").load("createRandevouz.html");
}

function addRandevouz() {

    const data = {};
    data['date_time'] = document.getElementById('newRandDate').value + " " + document.getElementById('newRandTime').value + ":00";
    data['doctor_info'] = document.getElementById('newRandInfo').value;
    data['status'] = 'free';

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var dt = JSON.parse(xhr.responseText);
            data['doctor_id'] = dt['doctor_id'];

            var jsonData = JSON.stringify(data);
            var request = 'http://localhost:8080/Computers_REST_API/hy359/medical_db/newRandevouz';

            console.log(jsonData);

            xhrAdd = new XMLHttpRequest();

            xhrAdd.onload = function () {
                if (xhrAdd.readyState === 4 && xhrAdd.status === 200) {
                    checkRandevouz(document.getElementById('newRandDate').value);
                } else if (xhrAdd.status !== 200) {
                    const responseData = JSON.parse(xhrAdd.responseText);
                    var msg = "Status: " + xhrAdd.status;
                    for (const x in responseData) {
                        var value = responseData[x];
                        msg += "\n" + value;
                    }
                    alert(msg);
                    /*document.getElementById('')
                     .innerHTML = 'Request failed. Returned status of ' + xhrAdd.status + "<br>" +
                     JSON.stringify(xhrAdd.responseText);*/
                }
            };

            xhrAdd.open('POST', request);
            xhrAdd.setRequestHeader("Content-type", "application/json");
            xhrAdd.send(jsonData);
        }
    };

    xhr.open('GET', 'Login');
    xhr.send();

}

function clearDocMsg(user_id) {
    msg_div = document.getElementById('sendMsg_' + user_id);
    if (msg_div !== null) {
        msg_div.innerHTML = '';
    }
}

function msgUser(doc_id, user_id) {
    var html = "";
    html += "<form onsubmit=\"sendMsg(" + doc_id + "," + user_id + ", 1);return false;\">";
    html += "<textarea class=\"form-control\" id=\"msg\" name=\"message\" rows=\"4\"  style='height:100%;width:80%;margin-top:1%;'></textarea>";
    html += "<input class=\"btn btn-small\" id ='docSendmsg' type=\"submit\" value=\"Send\" />";
    html += "</form>";
    html += "<button class = 'btn btn-small' id ='docDiscardmsg' type='button' onclick = 'clearDocMsg(" + user_id + ")'>Discard</button>"

    document.getElementById('sendMsg_' + user_id).innerHTML = html;
}

function loadPatientCheck() {
    $('#homepage').hide();
    $('#mainPart').load('docPatients.html', function () {
        /*$('#patient_medical').load("seeBloodtest.html",function(){
         $('#patient_medical *').prop('disabled','true');
         });*/
        checkPatients();
    });
}

function getUserData(userID, docID) {
    var request = 'http://localhost:8080/Computers_REST_API/hy359/medical_db/user/' + userID;
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var html = "";

            html += "<div class = 'row'> <div class = 'col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
            html += "Name: " + data['firstname'] + "\xa0\xa0" + data['lastname'] + "<br>Gender: " + data['gender'];
            html += "<br>Telephone: " + data['telephone'];
            html += "</div>";

            html += "<div class = 'col-sm-3 col-md-3 col-lg-3 col-xl-3'>"
            html += "Date of Birth: " + data['birthdate'];
            html += "<br>BloodType: " + data['bloodtype'];
            html += "</div>";

            html += "<div class = 'col-sm-3 col-md-3 col-lg-3 col-xl-3'>"
            html += "<button class = 'btn btn-small treatBtn' type= \"button\""
                    + "onclick = 'loadMedicalRec(\"" + data['amka'] + "\"," + userID + ",\"" + data['firstname'] + "\",\"" + data['lastname'] + "\")'>Treatments</button>";
            html += "</div>";
            html += "<div class = 'col-sm-3 col-md-3 col-lg-3 col-xl-3'>"
            html += "<button class = 'btn btn-warning msgBtn' type= \"button\""
                    + "onclick = 'msgUser(" + docID + "," + userID + ")'>Message</button>"
            html += "</div>";
            html += "</div>";
            html += "<div class = 'row'>";
            html += "<div id = 'sendMsg_" + userID + "'></div>";
            html += "</div>";

            document.getElementById('user' + userID).innerHTML = html;

        }

    };
    xhr.open('GET', request);
    xhr.setRequestHeader('Accept', "application/json");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function checkPatients() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        var dt = JSON.parse(xhr.responseText);
        var docID = dt['doctor_id'];
        var request = 'http://localhost:8080/Computers_REST_API/hy359/medical_db/docDoneRandevouz/' + docID;


        var xhrSee = new XMLHttpRequest();
        xhrSee.onload = function () {
            if (xhrSee.readyState === 4 && xhrSee.status === 200) {
                var data = JSON.parse(xhrSee.responseText);
                //var html = '';

                document.getElementById('patients').innerHTML = '';
                for (var u in data) {

                    var userID = data[u];

                    html = "<div class = 'userID_pat' id = 'user";
                    html += userID;
                    html += "'></div>";


                    document.getElementById('patients').innerHTML += html;
                    getUserData(userID, docID);

                }


            }
        };
        xhrSee.open('GET', request);
        xhrSee.setRequestHeader('Accept', "application/json");
        xhrSee.setRequestHeader("Content-type", "application/json");
        xhrSee.send();
    };
    xhr.open('GET', 'Login');
    xhr.send();
}

function loadMedicalRec(amka, userID, fname, lname) {
    /*$('#patient_medical *').prop('disabled',false);*/
    $('#mainPart').load("seeBloodtest.html", function () {
        var html = '';

        html += "<a id = 'patientsBackLink' href=\"#patients\" onclick ='loadPatientCheck()'>";
        html += "<span>&#10094;</span> Back to Patients</a>";


        document.getElementById('goBacktoPatients').innerHTML = html;
        document.getElementById('patientName').innerHTML = "<h4 id='patName'>" + fname + " " + lname + "</h4>";
        document.getElementById("myForm").setAttribute("onSubmit", "seeBloodtest(1,'" + amka + "'," + userID + "); seeTreatments(1,\"treatments\"," + userID + ");return false;");
        document.getElementById("AllExams").setAttribute("onClick", "seeBloodtest(0,'" + amka + "'," + userID + ");seeTreatments(0,\"treatments\"," + userID + ");");
        document.getElementById("VisualizeExams").setAttribute("onClick", "createChart('" + amka + "'," + userID + "); seeTreatments(1,'treatments'," + userID + ");");
        seeBloodtest(0, amka, userID);
        seeTreatments(0, "treatments", userID);
    });

}

function loadaddNewTreatement(bltestID, docID, userID) {
    $('#treatments').load("addNewTreatment.html", function () {
        document.getElementById("TreatmentsForm").setAttribute("onSubmit", "addNewTreatment(" + bltestID + "," + docID + "," + userID + ");return false;");
    });
}

function addNewTreatment(bltestID, docID, userID) {

    const data = {};
    data['doctor_id'] = docID;
    data['user_id'] = userID;
    data['start_date'] = document.getElementById('newStartDate').value;
    data['end_date'] = document.getElementById('newEndDate').value;
    data['treatment_text'] = document.getElementById('newTreatInfo').value;
    data['bloodtest_id'] = bltestID;

    var jsonData = JSON.stringify(data);
    var request = 'http://localhost:8080/Computers_REST_API/hy359/medical_db/newTreatment';

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (xhr.readyState === 4 && xhr.status === 200) {
            seeTreatments(0, "treatments", userID);
        } else if (xhr.status !== 200) {
            const responseData = JSON.parse(xhr.responseText);
            var msg = "Status: " + xhr.status;
            for (const x in responseData) {
                var value = responseData[x];
                msg += "\n" + value;
            }
            alert(msg);
            /*document.getElementById('').innerHTML = 'Request failed. Returned status of ' + xhr.status + "<br>" +
             JSON.stringify(xhr.responseText);*/
        }

    };
    xhr.open('POST', request);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(jsonData);
}


function getPending() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            if (data.hasOwnProperty('user_id')) {
                var xhrNtf = new XMLHttpRequest();
                xhrNtf.onload = function () {
                    if (xhrNtf.readyState === 4 && xhrNtf.status === 200) {
                        var dataNtf = JSON.parse(xhrNtf.responseText);
                        var html = "";
                        for (var i in dataNtf) {
                            var randvz = dataNtf[i];
                            html += "<div class = 'row mb-3 mt-3'>";
                            html += "<div class ='col-sm-2 col-md-2 col-lg-2 col-xl-2'></div>";
                            html += "<div class ='col-sm-8 col-md-8 col-lg-8 col-xl-8 mb-3 mt-3'>";
                            html += "<div class = 'pendingUserRands' >";
                            html += "<div class = 'row'>";
                            html += "<div class ='col-sm-4 col-md-4 col-lg-4 col-xl-4'>";
                            html += "Appointment time: <span style=font-weight:bold;>";
                            html += randvz["date_time"];
                            html += "</span>";
                            html += "<div id='info_" + randvz["randevouz_id"] + "'></div>";
                            html += "<div id='price_" + randvz["randevouz_id"] + "'></div>";
                            html += "<button class='btn btn-small cancelBtnUser' type='button' onclick='cancelBook(";
                            html += randvz["randevouz_id"];
                            html += ")'>Cancel</button>";
                            html += "</div>";
                            html += "<div class ='col-sm-6 col-md-6 col-lg-6 col-xl-6'>";
                            html += "Extra information:<br><mark>" + randvz["doctor_info"] + "</mark>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "<div class ='col-sm-2 col-md-2 col-lg-2 col-xl-2'></div>";
                            html += "</div>";



                            addDocInfo(randvz["doctor_id"], randvz["randevouz_id"]);

                        }
                        document.getElementById("mainPart").innerHTML = html;
                    }


                }
                ;
                xhrNtf.open('GET', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/pendingRandevouz/' + data["user_id"] + "/user");
                xhrNtf.setRequestHeader('Accept', "application/json");
                xhrNtf.setRequestHeader("Content-type", "application/json");
                xhrNtf.send();
            }
        } else if (xhr.status !== 200) {
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}

function addDocInfo(doc_id, rand_id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var doctor = JSON.parse(xhr.responseText);
            document.getElementById("info_" + rand_id).innerHTML = "Doctor: <span style= font-weight:bold;>" + doctor["firstname"] + " " + doctor["lastname"] + "</span>\n\
                <br>Address: <span style= font-weight:bold;>" + doctor["address"] + "</span>\n\
                <br>Telephone: <span style= font-weight:bold;>" + doctor["telephone"] + "</span>";
            document.getElementById("price_" + rand_id).innerHTML = "Price: <span style= font-weight:bold;>" + doctor["price"] + "</span>";
        }
    };
    xhr.open('GET', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/doctor/' + doc_id);
    xhr.setRequestHeader('Accept', "application/json");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();

}
function cancelBook(rzv_id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            getPending();
        } else if (xhr.readyStatus !== 200) {
            getPending();
        }
    };
    xhr.open('PUT', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/updateRandevouz/' + rzv_id + "/cancelled?canceller=user");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();

}

function getDoneRandvz() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            if (data.hasOwnProperty('user_id')) {
                var xhrNtf = new XMLHttpRequest();
                xhrNtf.onload = function () {
                    if (xhrNtf.readyState === 4 && xhrNtf.status === 200) {
                        var dataNtf = JSON.parse(xhrNtf.responseText);
                        var html = "";
                        for (var i in dataNtf) {
                            var randvz = dataNtf[i];

                            html += "<div class = 'row mb-3 mt-3'>";
                            html += "<div class ='col-sm-2 col-md-2 col-lg-2 col-xl-2'></div>";
                            html += "<div class ='col-sm-8 col-md-8 col-lg-8 col-xl-8 mb-3 mt-3'>";
                            html += "<div class = 'pendingUserRands' >";
                            html += "<div class = 'row'>";
                            html += "<div class ='col-sm-4 col-md-4 col-lg-4 col-xl-4'>";
                            html += "Appointment time: <span style=font-weight:bold;>";
                            html += randvz["date_time"];
                            html += "</span>";
                            html += "<div id='info_" + randvz["randevouz_id"] + "'></div>";
                            html += "<div id='price_" + randvz["randevouz_id"] + "'></div>";
                            html += "</div>";
                            html += "<div class ='col-sm-6 col-md-6 col-lg-6 col-xl-6'>";
                            html += "Extra information:<br><mark>" + randvz["doctor_info"] + "</mark>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "<div class ='col-sm-2 col-md-2 col-lg-2 col-xl-2'></div>";
                            html += "</div>";

                            addDocInfo(randvz["doctor_id"], randvz["randevouz_id"]);

                        }
                        document.getElementById("mainPart").innerHTML = html;
                    }
                }
                ;
                xhrNtf.open('GET', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/doneRandevouz/' + data["user_id"] + "/user");
                xhrNtf.setRequestHeader('Accept', "application/json");
                xhrNtf.setRequestHeader("Content-type", "application/json");
                xhrNtf.send();
            }
        } else if (xhr.status !== 200) {
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();


}

function checkNotifications() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            if (data.hasOwnProperty("admin")) {
            } else if (data.hasOwnProperty('user_id')) {
                var xhrNtf = new XMLHttpRequest();
                xhrNtf.onload = function () {
                    if (xhrNtf.readyState === 4 && xhrNtf.status === 200) {
                        var dataNtf = JSON.parse(xhrNtf.responseText);
                        if (dataNtf === null) {// no dates
                            TimeoutGlobal = setTimeout(checkNotifications, 10000);
                            return;
                        }
                        var bool = false;
                        for (var i in dataNtf) {
                            var dt = dataNtf[i];
                            var date = dt["date_time"];
                            //the following 2 lines are from github
                            var arr = date.split(/-|\s|:/);
                            var date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
                            var today = new Date();
                            if (date.getTime() <= today.getTime())
                                continue;
                            if ((date.getTime() - today.getTime()) <= 14400000) {//4 hours in ms
                                alert("you have a doctor appointment at: " + date);
                                bool = true;
                                break;
                            }
                            break;
                        }
                        if (!bool) {
                            TimeoutGlobal = setTimeout(checkNotifications, 10000);
                        }

                    }
                };
                xhrNtf.open('GET', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/pendingRandevouz/' + data["user_id"] + "/user");
                xhrNtf.setRequestHeader('Accept', "application/json");
                xhrNtf.setRequestHeader("Content-type", "application/json");
                xhrNtf.send();
            }
        } else if (xhr.status !== 200) {
            TimeoutGlobal = setTimeout(checkNotifications, 10000);
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}
function callUserFindDocs() {
    document.getElementById("homepage").style = "display:none";
    $("#mainPart").html();
    userFindDoc();
}

function callVisFindDocs() {
    document.getElementById("homepage").style = "display:none";
    $("#mainPart").html();
    visFindDoc();
}

function getUncertDocs() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var doctors = JSON.parse(xhr.responseText);
            var html = "";
            for (var j in doctors) {

                html += "<div class ='row'>";
                html += "<div class ='col-sm-1 col-md-1 col-lg-1 col-xl-1'></div>";
                html += "<div class ='col-sm-10 col-md-10 col-lg-10 col-xl-10'>";
                html += "<div class= 'adminBoxes'" + doctors[j]["doctor_id"] + "'>";
                html += "<div class ='row'>";
                html += "<div class ='col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
                html += "<b>Username: </b>" + doctors[j]["username"];
                html += "<br><b>Firstname: </b>" + doctors[j]["firstname"];
                html += "<br><b>lastname: </b>" + doctors[j]["lastname"];
                html += "<br><b>Birthdate: </b>" + doctors[j]["birthdate"];

                html += "</div>";
                html += "<div class ='col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
                html += "<b>Email: </b>" + doctors[j]["email"];
                html += "<br><b>Telephone: </b>" + doctors[j]["telephone"];
                html += "<br><b>AMKA: </b>" + doctors[j]["amka"];
                html += "<br><b>Gender: </b>" + doctors[j]["gender"];


                html += "</div>";
                html += "<div class ='col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
                html += "<b>Address: </b>" + doctors[j]["address"];
                html += "<br><b>Country: </b>" + doctors[j]["country"];
                html += "<br><b>City: </b>" + doctors[j]["city"];
                html += "<br><b>Lat/Lon: </b>" + doctors[j]["lat"] + "/" + doctors[j]["lon"];


                html += "</div>";
                html += "<div class ='col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
                if (doctors[j]["blooddonor"]) {
                    html += "<b>Blooddonor: </b>yes";
                } else {
                    html += "<b>Blooddonor: </b>no";
                }
                html += "<br><b>Bloodtype: </b>" + doctors[j]["bloodtype"];
                html += "<br><b>Specialty: </b>" + doctors[j]["specialty"];
                html += "<br><b>Price: </b>" + doctors[j]["price"];


                html += "</div>";
                html += "<div class ='col-sm-5 col-md-5 col-lg-5 col-xl-5'>";
                html += "<b>Doctor Information: </b><mark>" + doctors[j]["doctor_info"] + "</mark>";
                html += "</div>";
                html += "</div>";

                html += "<br>";
                html += "<button class ='btn btn-small adminDelBtn float-end' type = 'button' onclick='deleteDoc(" + doctors[j]["doctor_id"] + ")'>Delete</button>";
                html += "<button class ='btn btn-small adminCertBtn float-end' type = 'button' onclick='certifyDoc(" + doctors[j]["doctor_id"] + ")'>Certify</button>";
                html += "<br>";
                html += "</div>";
                html += "</div>";
                html += "<div class ='col-sm-1 col-md-1 col-lg-1 col-xl-1'></div>";
                html += "</div>";




            }
            if (html === "") {
                document.getElementById("uncertifiedDocs").innerHTML = "";
            } else {
                document.getElementById("uncertifiedDocs").innerHTML += "<h4>Uncertified Doctors</h4>";
                document.getElementById("uncertifiedDocs").innerHTML += html;
            }
        }
    };
    xhr.open('GET', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/uncertified');
    xhr.setRequestHeader('Accept', "application/json");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

async function getCertDocs() {
    var doctors = "";
    doctors = await findDocs();
    var html = "";
    for (var j in doctors) {

        html += "<div class ='row'>";
        html += "<div class ='col-sm-1 col-md-1 col-lg-1 col-xl-1'></div>";
        html += "<div class ='col-sm-10 col-md-10 col-lg-10 col-xl-10'>";
        html += "<div class= 'adminBoxes'" + doctors[j]["doctor_id"] + "'>";
        html += "<div class ='row'>";
        html += "<div class ='col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
        html += "<b>Username: </b>" + doctors[j]["username"];
        html += "<br><b>Firstname: </b>" + doctors[j]["firstname"];
        html += "<br><b>lastname: </b>" + doctors[j]["lastname"];
        html += "<br><b>Birthdate: </b>" + doctors[j]["birthdate"];

        html += "</div>";
        html += "<div class ='col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
        html += "<b>Email: </b>" + doctors[j]["email"];
        html += "<br><b>Telephone: </b>" + doctors[j]["telephone"];
        html += "<br><b>AMKA: </b>" + doctors[j]["amka"];
        html += "<br><b>Gender: </b>" + doctors[j]["gender"];


        html += "</div>";
        html += "<div class ='col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
        html += "<b>Address: </b>" + doctors[j]["address"];
        html += "<br><b>Country: </b>" + doctors[j]["country"];
        html += "<br><b>City: </b>" + doctors[j]["city"];
        html += "<br><b>Lat/Lon: </b>" + doctors[j]["lat"] + "/" + doctors[j]["lon"];


        html += "</div>";
        html += "<div class ='col-sm-3 col-md-3 col-lg-3 col-xl-3'>";
        if (doctors[j]["blooddonor"]) {
            html += "<b>Blooddonor: </b>yes";
        } else {
            html += "<b>Blooddonor: </b>no";
        }
        html += "<br><b>Bloodtype: </b>" + doctors[j]["bloodtype"];
        html += "<br><b>Specialty: </b>" + doctors[j]["specialty"];
        html += "<br><b>Price: </b>" + doctors[j]["price"];


        html += "</div>";
        html += "<div class ='col-sm-12 col-md-12 col-lg-12col-xl-12 mt-3'>";
        html += "<b>Doctor Information: </b><mark>" + doctors[j]["doctor_info"] + "</mark>";
        html += "</div>";
        html += "</div>";

        html += "<br>";
        html += "<button class ='btn btn-small adminDelBtn float-end' type = 'button' onclick='deleteDoc(" + doctors[j]["doctor_id"] + ")'>Delete</button>";
        html += "<br>";

        html += "</div>";
        html += "</div>";
        html += "<div class ='col-sm-1 col-md-1 col-lg-1 col-xl-1'></div>";
        html += "</div>";



    }
    if (html === "") {
        document.getElementById("certifiedDocs").innerHTML = "";
    } else {
        document.getElementById("certifiedDocs").innerHTML += "<h4>Certified Doctors</h4>";
        document.getElementById("certifiedDocs").innerHTML += html;
    }
}

function certifyDoc(doc_id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200)
            adminFunc();
    };
    xhr.open('PUT', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/certifyDoctor/' + doc_id);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();

}

function deleteDoc(doctor_id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200)
            adminFunc();
    };
    xhr.open('DELETE', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/doctorDelete/' + doctor_id);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function deleteUser(user_id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200)
            adminFunc();
    };
    xhr.open('DELETE', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/userDelete/' + user_id);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function adminFunc() {
    //document.getElementById("mainPart").innerHTML = "<h1>Doctors</h1><div id=\"Udocs\"></div><div id=\"Cdocs\"></div><h1>Users</h1><div id=\"Users\"></div>";
    $("#mainPart").load("adminUI.html", function () {
        getUncertDocs();
        getCertDocs();
        getUsers();
    });

}

function checkRandevouzCancels() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            if (data.hasOwnProperty("admin")) {
            } else {
                var id, type;
                if (data.hasOwnProperty('user_id')) {
                    id = data["user_id"];
                    type = "user";
                } else {
                    id = data["doctor_id"];
                    type = "doctor";
                }
                var xhrCl = new XMLHttpRequest();
                xhrCl.onload = function () {
                    if (xhrCl.readyState === 4 && xhrCl.status === 200) {
                        var dataCl = JSON.parse(xhrCl.responseText);
                        var alertMsg = "";
                        for (var i in dataCl) {
                            rvzCl = dataCl[i];
                            if (rvzCl["doctor_info"] !== type) {
                                alertMsg += "The appointment you had at " + rvzCl["date_time"] + " has been cancelled\n";
                                var xhrDl = new XMLHttpRequest();
                                xhrDl.onload = function () {};
                                xhrDl.open('DELETE', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/RandevouzDeletion/' + rvzCl["randevouz_id"]);
                                xhrDl.setRequestHeader("Content-type", "application/json");
                                xhrDl.send();
                            }
                        }
                        if (alertMsg !== "") {
                            alert(alertMsg);
                        }
                    }
                };
                xhrCl.open('GET', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/cancelledRandevouz/' + id + "/" + type);
                xhrCl.setRequestHeader('Accept', "application/json");
                xhrCl.setRequestHeader("Content-type", "application/json");
                xhrCl.send();
            }

        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}

function addMsgName(id, msg_id, type) {
    if (type === 'doctor')
        type = 'user';
    else
        type = 'doctor';

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            document.getElementById("name_" + msg_id).innerHTML = data['firstname'] + " " + data['lastname'];
        }
    };
    xhr.open('GET', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/' + type + '/' + id);
    xhr.setRequestHeader('Accept', "application/json");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();

}

function loadInbox() {
    $("#mainPart").load("seeMessages.html", function () {
        inbox();
    });
}

function inbox() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var id, type;
            if (data.hasOwnProperty('user_id')) {
                id = data["user_id"];
                type = "user";
            } else {
                id = data["doctor_id"];
                type = "doctor";
            }
            var xhrMsg = new XMLHttpRequest();
            xhrMsg.onload = function () {
                if (xhrMsg.readyState === 4 && xhrMsg.status === 200) {
                    var dataMsg = JSON.parse(xhrMsg.responseText);
                    var html = "<table id=\"msgtable\">";
                    html += "<tr><th>Date</th><th>Name</th><th>Message</th></tr>";
                    for (var i in dataMsg) {
                        var msg = dataMsg[i];
                        html += "<tr><td>" + msg['date_time'] + "</td><td id='name_" + msg['message_id'] + "'></td><td>" + msg['message'] + "</td></tr>";
                    }
                    html += "</table>";
                    document.getElementById('seeMsgs').innerHTML = html;
                    for (var i in dataMsg) {
                        var msg = dataMsg[i];
                        addMsgName(msg['user_id'], msg['message_id'], type);
                    }
                }
            };
            xhrMsg.open('GET', 'http://localhost:8080/Computers_REST_API/hy359/medical_db/inbox/' + id + "/" + type);
            xhrMsg.setRequestHeader('Accept', "application/json");
            xhrMsg.setRequestHeader("Content-type", "application/json");
            xhrMsg.send();
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}

$(document).off().on('click', "#navLinks a", function ()
{
    var ev = event.target.id;
    switch (ev) {
        case "navHome":
            document.getElementById("homepage").style = "display:block";
            $("#mainPart").html("");
            break;
        case "navLogin":
            $("#mainPart").load("login.html");
            document.getElementById("homepage").style = "display:none";
            break;
        case "navSign":
            $("#mainPart").load("Sign_In.html");
            document.getElementById("homepage").style = "display:none";
            break;
        case "navAddBl":
            $("#mainPart").load("addBloodtest.html");
            document.getElementById("homepage").style = "display:none";
            break;
        case "navLogout":
            logout();
            break;
        default:
            break;
    }

});



