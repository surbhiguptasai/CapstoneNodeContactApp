var dataEdited=[];
var data1=[];
var dataToBedisplayed=[];
var queryString = {};
var addUserQueryString = {};  
var baseUrl="http://localhost:8080/";
//var baseUrl="https://capstone-node.herokuapp.com/";
var baseReferenceDistinctUrl=baseUrl+"distinct?distinct=";
var baseUserUrl=baseUrl+"users/";

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

            columns:[ //Define Table Columns

            ///{title:"Gender", field:"<input type='checkbox' name='vehicle' value='Bike'>", editable:true},
            {title:"ID",
            
             columns:[   {title:"AccountID",field:"accountCode", sorter:"number", align:"left",headerFilter:true},
             ],
              },
              {//create column group
                
            title:"Personal Info",
            columns:[
                {title:"Name", field:"name", sorter:"string",headerFilter:true },
        {title:"Gender", field:"gender", sorter:"string",headerFilter:true },
        {title:"Email", field:"email", sorter:"string",headerFilter:true,formatter:"email"},
        {title:"City", field:"city", sorter:"string",headerFilter:true },
        {title:"Phone", field:"phone", sorter:"string",headerFilter:true },
        {title:"SSN", field:"ssn", sorter:"string",headerFilter:true }
            ],
        },

        {//create column group
            title:"Account Info",
            columns:[
        {title:"AccountType", field:"acttype", sorter:"string",headerFilter:true },        
        {title:"BranchName", field:"branchName", sorter:"string",headerFilter:true },        
        {title:"AccountOpenDate", field:"actopendate", sorter:"date",headerFilter:true },
        {title:"Balance($)", field:"totalAmount", sorter:"string",headerFilter:true,editable:true}
           ],
        }
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
        data=populateFirstNameLastName(data);
        dataEdited.push(data);
        cell.addClass('cellEdited');
        $("#save-row").addClass('show1');
       // alert("id is **"+id+"field is **"+field+"value **"+value+"oldValue **"+oldValue);
        //alert("data is **"+JSON.stringify(data)+"row **"+JSON.stringify(row));

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
   formOnLoad();

});
}

function populateFirstNameLastName(data){
var name=data.name;

//alert("Name is"+name);
var res=name.split(" ");
data.name.firstName=res[0];
data.name.lastName=res[1];
return data;
}

function showAccountDetails (data) {
defineBasicTabulatorColumns();
setDataReturnedFromAjaxCall();
defineDownloadFunctions();
}

function retrieveSearchCriteria()
{
     var accountCode=$("#accountCode").val();
     var acttype=$("#acttype").val();
     var ssn=$("#ssn").val();
     var username=$("#username").val();
     var gender=$("#gender").val();
     var city=$("#city").val();


    if(accountCode != undefined && accountCode != null && accountCode.length > 0)
        queryString ["accountCode"] = accountCode;
      if(acttype != "SelectAccountType" && acttype != null && acttype.length > 0)
        queryString ["acttype"] = acttype;
    if(ssn != undefined && ssn != null && ssn.length > 0)
        queryString ["ssn"] = ssn;
    if(username != undefined && username != null && username.length > 0)
        queryString ["username"] = username;
    if(gender != "SelectGender" && gender != null && gender.length > 0)
        queryString ["gender"] = gender;
     if(city != "SelectCity" && city != null && city.length > 0)
        queryString ["address.city"] = city;
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
        showAccountDetails(dataToBedisplayed);

    },
    error: function(e, ts, et){alert("Error in Retrieving Data"+ts)}
});

}

function getAllUsers(callback) {
	//var numRecords=10;
	//var url="https://capstone-node.herokuapp.com/users";
    retrieveSearchCriteria();
    makeGetAjaxCall();

}
function deleteUser()
{
    alert("User Deleted");
}
function attachSubmitEvent()
{
    $("#userSubmit").click(function(event) {

        $("#hidden").removeClass('toggle');
        $("#hidden").addClass('show');
        getAllUsers(showAccountDetails);
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
    contentType:'application/json',  // <---add this
                   // <---update this
    success: function(result) {
    handleSuccessfulDeleteEvent(id);
    //alert("Are you sure to delete the row??  ");
},
    error: function(result){alert("Deleted Error  ")}
});

}

function makePutAjaxCall(data1)
{
var url1=baseUserUrl;
var id=dataEdited[i].id;

url1=url1+id;

$.ajax({
    url: url1,
    type: 'PUT',//<-----this should have to be an object.
    contentType:'application/json',  // <---add this
      data: JSON.stringify(data1),
             // <---update this
    success: function(result) {
        alert("PUT success");
    getAllUsers(showAccountDetails);
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
    showAccountDetails(dataToBedisplayed);
    break;
    }
}

}

// function handleSuccessfulPutEvent(id)
// {
//     for(i=0;i<dataToBedisplayed.length;i++)
// {
//     if(id  == dataToBedisplayed[i].id)
//     {
//     dataToBedisplayed.splice(i, 1);
//     showAccountDetails(dataToBedisplayed);
//     break;
//     }
// }

// }
function userSubmit() {	
    
    attachSubmitEvent();
    attachDeleteEvent();
    attachSaveUserEvent();
}


function showActtype(data){
	$.each(data,function(k,v){
		$.each(v,function(k1,v1)
		{
		$("#acttype").append("<option>"+v1+"</option>");
	    })
	})
}


function populateActType() {
	//var url="https://capstone-node.herokuapp.com/distinct?distinct=acttype";
    var url=baseReferenceDistinctUrl+"acttype";
    //http://localhost:8080/users/
	 var queryString = {};

	$.getJSON(url,queryString,showActtype);
}

function showGentype(data){
	$.each(data,function(k,v){
		$.each(v,function(k1,v1)
		{
		$("#gender").append("<option>"+v1+"</option>");
	    })
	})
}
function populateGenType() {
	var url=baseReferenceDistinctUrl+"gender";
	 var queryString = {};

	$.getJSON(url,queryString,showGentype);
}

function showCitytype(data){
     
	$.each(data,function(k,v){
		$.each(v,function(k1,v1)
		{
		$("#city").append("<option>"+v1+"</option>");
	    })
	})
}
function populateCityType() {
	var url=baseReferenceDistinctUrl+"address.city";
	 var queryString = {};

	$.getJSON(url,queryString,showCitytype);
}
function handleAddUser()
{
   

     var ssn=$("#ssnp").val();
     var firstName=$("#given-name").val();
     var lastName=$("#family-name").val();
     
     var email=$("#email").val();
     var acttype=$("#acttypep").val();
     var accountCode=$("#actCode").val();
     var gender=$("#genderp").val();
     var city=$("#cityp").val();
     var phone=$("#phone").val();
     var branch=$("#brName").val();
     var balance=$("#bal").val();
     var accOpenDate=$("#accOpenDate").val();

 
     
     var name={};
    if(firstName != undefined && firstName != null && firstName.length > 0)
        name ["firstName"] = firstName;
    if(lastName != undefined && lastName != null && lastName.length > 0)
        name ["lastName"] = lastName;
    addUserQueryString['name']=name;
    
    if(gender != "SelectGender" && gender != null && gender.length > 0)
        addUserQueryString ["gender"] = gender;
    addUserQueryString['username']=firstName;
    
     if(accountCode != undefined && accountCode != null && accountCode.length > 0)
        addUserQueryString ["accountCode"] = accountCode;
    if(branch != undefined && branch != null && branch.length > 0)
        addUserQueryString ["branchName"] = branch;
    if(balance != undefined && balance != null && balance.length > 0)
        addUserQueryString ["totalAmount"] = balance;
    if(email != undefined && email != null && email.length > 0)
        addUserQueryString ["email"] = email;
    var address={};
     if(city != "SelectCity" && city != null && city.length > 0)
        address ["city"] = city;
    addUserQueryString['address']=address;
    if(phone != undefined && phone != null && phone.length > 0)
        addUserQueryString ["phone"] = phone;

   if(ssn != undefined && ssn != null && ssn.length > 0)
   {
        
        addUserQueryString ["ssn"] = ssn;

    }
   // addUserQueryString ["ssn"] = 12345;
alert("accOpenDate is"+accOpenDate);
        if(accOpenDate != undefined && accOpenDate != null && accOpenDate.length > 0)
        {alert("accOpenDate is inside "+accOpenDate);
        addUserQueryString ["accOpenDate"] = accOpenDate;
    }
      if(acttype != "SelectAccountType" && acttype != null && acttype.length > 0)
        addUserQueryString ["acttype"] = acttype;
 
    
    
  makePostAjaxCall();  
    closePopUp();


}
function makePostAjaxCall(){
    $.ajax({
            method: "POST",
    url: baseUserUrl,
    contentType:'application/json',  // <---add this
    dataType: 'text',                // <---update this
    data: JSON.stringify(addUserQueryString),
    success: function(result) {
        
        getAllUsers(showAccountDetails);

    },
    error: function(e, ts, et){
        alert("Error in Posting Data"+JSON.stringify(e) ); 
    }
});

}
function closePopUp(){
    document.getElementById('id01').style.display='none';
}


function formOnLoad()
{
  
    populateCityPopupType();
    populateGenPopupType();
    populateActPopupType();
}
function showActPopUptype(data){
    $.each(data,function(k,v){
        $.each(v,function(k1,v1)
        {
        $("#acttypep").append("<option>"+v1+"</option>");
        })
    })
}


function populateActPopupType() {
    //var url="https://capstone-node.herokuapp.com/distinct?distinct=acttype";
    var url=baseReferenceDistinctUrl+"acttype";
    //http://localhost:8080/users/
     var addUserQueryString = {};

    $.getJSON(url,addUserQueryString,showActPopUptype);
}

function showGenPopuptype(data){
    $.each(data,function(k,v){
        $.each(v,function(k1,v1)
        {
        $("#genderp").append("<option>"+v1+"</option>");
        })
    })
}
function populateGenPopupType() {
    var url=baseReferenceDistinctUrl+"gender";
     var addUserQueryString = {};

    $.getJSON(url,addUserQueryString,showGenPopuptype);
}
function populateCityPopupType() {
    var url=baseReferenceDistinctUrl+"address.city";
     var addUserQueryString = {};

    $.getJSON(url,addUserQueryString,showCityPopUptype);
}
function showCityPopUptype(data){
    $.each(data,function(k,v){
        $.each(v,function(k1,v1)
        {
        $("#cityp").append("<option>"+v1+"</option>");
        })
    })
}

$(function(){
	populateCityType();
	populateGenType();
	populateActType();
	userSubmit();

});