var dataEdited=[];
var data1=[];
var dataToBedisplayed=[];
var queryString = {};
var addUserQueryString = {};  
var baseUrl="http://localhost:8080/";
//var baseUrl="https://capstonecontactapp.herokuapp.com/";
var baseReferenceDistinctUrl=baseUrl+"distinct?distinct=";
var baseUserUrl=baseUrl+"contacts/";
// queryString["userId"]="ravi";
// addUserQueryString["userId"]="ravi";


var DASH_USER = {};

function updateDASH_USER(fetchedUser) {

    var keys = Object.keys(fetchedUser);

    for (var i = 0; i < keys.length; i++) {
        DASH_USER[keys[i]] = fetchedUser[keys[i]];
    }
   
    queryString["userId"]=DASH_USER.username;
    addUserQueryString["userId"]=DASH_USER.username;
    $("#hidden").removeClass('toggle');
    $("#hidden").addClass('show');
    userSubmit();
    getAllContacts();
    $("#loggedinUser").html('<div class="nav-item" >User ('+DASH_USER.username+')</div>');

    return DASH_USER;
}

function getUser() {

    var settings = {
      url: '../users/me',
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    };

    $.ajax(settings).done(function(response) {
        if (response.user) {    
            updateDASH_USER(response.user);
        }
        else {
            window.location = response.redirect;
        }
    });
}

//var unirest = require('unirest');
function defineBasicTabulatorColumns()
{
$("#showResult").tabulator({
            //set height of table (optional)
            fitColumns:true,
            responsiveLayout:true, //fit columns to width of table (optional)
            pagination:"local",
            paginationSize:10,
            addRowPos:"top",
            selectable:true,

          
            columns:[
                {title:"Name", field:"name", sorter:"string",headerFilter:true },
        {title:"Gender", field:"gender", sorter:"string",headerFilter:true },
        {title:"Email", field:"email", sorter:"string",headerFilter:true,formatter:"email"},
        
        {title:"Age", field:"age", sorter:"string",headerFilter:true },
        {title:"Company", field:"company", sorter:"string",headerFilter:true },
        
        
        {title:"Phone", field:"phone", sorter:"string",headerFilter:true,editable:true },
        // {title:"About", field:"about", sorter:"string",headerFilter:true },
        {title:"Address", field:"address", sorter:"string",headerFilter:true },
        {title:"ZipCode", field:"zipcode", sorter:"string",headerFilter:true },
        {title:"Country", field:"country", sorter:"string",headerFilter:true }
        
           
       
    ],
    rowClick:function(e, id, data, row){ //trigger an alert message when the row is clicked
        data1.push(data);
    },
}); 

$("#showResult").tabulator({
    cellEdited:function(id, field, value, oldValue, data, cell, row){
        //id - the id of the row
        //field - field of the cell
        //value - the new value for the cell
        //oldValue - the old value for the cell
        //data - the data for the row
        //cell - the DOM element of the cell
        //row - the DOM element of the row
        dataEdited.push(data);
        cell.addClass('cellEdited');
        $("#save-row").addClass('show1');
    },
});

}

function setDataReturnedFromAjaxCall()
{
$("#showResult").tabulator("setData", dataToBedisplayed); 
}

function defineDownloadFunctions()
{

$("#download-csv").click(function(){
    $("#showResult").tabulator("download", "csv", "data.csv");
});

// //trigger download of data.json file
$("#download-json").click(function(){
    $("#showResult").tabulator("download", "json", "data.json");
});
$("#add-row").click(function(){
   // $("#showResult").tabulator("addRow");
   

});
}

function showContactDetails () {
defineBasicTabulatorColumns();
setDataReturnedFromAjaxCall();
defineDownloadFunctions();
}

function makeGetAjaxCall(){
    
    
    $.ajax({
            method: "GET",
    url: baseUserUrl,
    contentType:'application/json',  // <---add this
    dataType: 'json',                // <---update this
    data: queryString,
    success: function(result) {
        dataToBedisplayed=result.users;
        showContactDetails();

    },
    error: function(e, ts, et){alert("Error in Retrieving Data"+ts)}
});

}

function getAllContacts() {
    makeGetAjaxCall();

}
function attachSubmitEvent()
{
    $("#userSubmit").click(function(event) {

        $("#hidden").removeClass('toggle');
        $("#hidden").addClass('show');
        getAllContacts();
    });
}
function attachDeleteEvent()
{
      $("#delete-row").click(function(event) {
       for(i=0;i<data1.length;i++)
       {
        
       makeDeleteAjaxCall();
       }
       data1=[];
});

}

function attachSaveUserEvent()
{
      $("#save-row").click(function(event) {
       for(i=0;i<dataEdited.length;i++)
       {
        
       makePutAjaxCall(dataEdited[i]);
       }
       dataEdited=[];
});


}
function makeDeleteAjaxCall()
{
var url1=baseUserUrl;
var id=data1[i].id;
url1=url1+id;

$.ajax({
    url: url1,
    type: 'DELETE',//<-----this should have to be an object.
    contentType:'application/json',
    data: JSON.stringify(queryString),
    success: function(result) {
    handleSuccessfulDeleteEvent(id);
},
    error: function(result){alert("Deleted Error  ")}
});

}

function makePutAjaxCall(data1)
{
    
var url1=baseUserUrl;
var id=dataEdited[i].id;

url1=url1+id;
data1["userId"]=DASH_USER.username;

$.ajax({
    url: url1,
    type: 'PUT',//<-----this should have to be an object.
    contentType:'application/json',  // <---add this
      data: JSON.stringify(data1),
             // <---update this
    success: function(result) {
        
    getAllContacts();
},
    //error: function(result){alert("PUT Error  ")}
    error: function(e, ts, et){alert("Error in Putting Data"+ts)}
});

}

function handleSuccessfulDeleteEvent(id)
{
    for(i=0;i<dataToBedisplayed.length;i++)
{
    if(id  == dataToBedisplayed[i].id)
    {
    dataToBedisplayed.splice(i, 1);
    showContactDetails();
    break;
    }
}

}

function userSubmit() {	
    
    attachSubmitEvent();
    attachDeleteEvent();
    attachSaveUserEvent();
}
function handleAddUser()
{
     var firstName=$("#given-name").val();
     var lastName=$("#family-name").val();
     var email=$("#emailp").val();
     var gender=$("#genderp").val();
     var city=$("#cityp").val();
     var phone=$("#phonep").val();
     var age=$("#agep").val();
     var company=$("#companyp").val();
     var address=$("#addressp").val();
      var state=$("#statep").val();
     var zipcode=$("#zipcodep").val();
     var country=$("#countryp").val();

     var name={};
    if(firstName != undefined && firstName != null && firstName.length > 0)
        name ["firstName"] = firstName;
    if(lastName != undefined && lastName != null && lastName.length > 0)
        name ["lastName"] = lastName;
    addUserQueryString['name']=name;
    
    if(gender != "SelectGender" && gender != null && gender.length > 0)
        addUserQueryString ["gender"] = gender;
    addUserQueryString['username']=firstName;
    
     
    if(email != undefined && email != null && email.length > 0)
        addUserQueryString ["email"] = email;
    var address={};
     if(city != undefined && city != null && city.length > 0)
        address ["city"] = city;
    if(zipcode != undefined && zipcode != null && zipcode.length > 0)
        address ["zipcode"] = zipcode;
    if(country != undefined && country != null && country.length > 0)
        address ["country"] = country;
    if(state != undefined && state != null && state.length > 0)
        address ["state"] = state;
    addUserQueryString['address']=address;
    if(phone != undefined && phone != null && phone.length > 0)
        addUserQueryString ["phone"] = phone;
     if(age != undefined && age != null && age.length > 0)
        addUserQueryString ["age"] = age;
     if(company != undefined && company != null && company.length > 0)
        addUserQueryString ["company"] = company;
       
    makePostAjaxCall();  
    closePopUp();
}

function makePostAjaxCall(){
    $.ajax({
            method: "POST",
    url: baseUserUrl+"add/",
    contentType:'application/json',  // <---add this
    dataType: 'text',                // <---update this
    data: JSON.stringify(addUserQueryString),
    success: function(result) {
        
        getAllContacts();

    },
    error: function(e, ts, et){
        alert("Error in Posting Data"+JSON.stringify(e) ); 
    }
});

}
function closePopUp(){
    document.getElementById('id01').style.display='none';
}


$(function(){
    getUser();

    

});