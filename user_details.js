var data1=[];
var unirest = require('unirest');

function showAccountDetails (data) {
	//$("#showResult").tabulator();
var genderEditor = function(cell, value){
//cell - JQuery object for current cell
//value - the current value for current cell

//create and style editor
var editor = $("<input type='checkbox' name='vehicle' value='Bike'>");
// editor.css({
//     "padding":"3px",
//     "width":"100%",
//     "box-sizing":"border-box",
// })

// //Set value of editor to the value of the cell
// .val(value);

//set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
// if(cell.hasClass("tabulator-cell")){
//     setTimeout(function(){
//         editor.focus();
//     },100);
// }

//when the value has been set, update the cell
// editor.on("change blur", function(e){
//     cell.trigger("editval", editor.val());
// });

//return the editor element
    return editor;
}

		$("#showResult").tabulator({
            // set height of table (optional)
            fitColumns:true,
            responsiveLayout:true, //fit columns to width of table (optional)
            pagination:"remote",
            paginationSize:10,
            addRowPos:"top",
            selectable:true,

            columns:[ //Define Table Columns

            ///{title:"Gender", field:"<input type='checkbox' name='vehicle' value='Bike'>", editable:true},
            {title:"AccountID", field:"accountCode", sorter:"number", align:"left",headerFilter:true },
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
        {title:"Balance", field:"totalAmount", sorter:"string",headerFilter:true,formatter:"money",editable:true}
           ],
        }
        // {title:"Favourite Color", field:"col", sorter:"string", sortable:false},
        // {title:"Date Of Birth", field:"dob", sorter:"date", align:"center"},
    ],
    rowClick:function(e, id, data, row){ //trigger an alert message when the row is clicked
        
        data1.push(data);
        //alert("Row " + id + " Clicked!!!!"+JSON.stringify(data1));
    },
});
		//Set initial page
$("#showResult").tabulator("setPage", 1);
		$("#download-csv").click(function(){
    $("#showResult").tabulator("download", "csv", "data.csv");
});

//trigger download of data.json file
$("#download-json").click(function(){
    $("#showResult").tabulator("download", "json", "data.json");
});
$("#add-row").click(function(){
    $("#showResult").tabulator("addRow");
});


	$("#showResult").tabulator("setData", data.users);

	
	//$("#showResult").html(val);	


}
function getAllUsers(callback) {
	var numRecords=10;
	//var url="https://capstone-node.herokuapp.com/users";
    var url="http://localhost:8080/users/";
    var accountCode=$("#accountCode").val();
     var acttype=$("#acttype").val();
     var ssn=$("#ssn").val();
     var username=$("#username").val();
     var gender=$("#gender").val();
     var city=$("#city").val();
    //alert("accountId is "+accountId);

    var queryString = {};
// var jsonObj = {};
// jsonObj ["accountID"] = 10;

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


//     var Client = require('node-rest-client').Client;


// var client = new Client();
// client.registerMethod("jsonGetMethod", "http://localhost:8080/users/", "GET");

// //alert("id"+accountId);
 
//        		//firing ajax request..

//             client.methods.jsonGetMethod(queryString,function (data, response) {
//     // parsed response body as js object 
//     console.log(data);
//     // raw response 
//     console.log(response);
//     showAccountDetails(data);
// });


   $.getJSON(url,queryString,callback);
}
function deleteUser()
{
    alert("User Deleted");
}
function userSubmit() {	
    var url1="http://localhost:8080/users/";
	$("#userSubmit").click(function(event) {

		$("#hidden").removeClass('toggle');
		$("#hidden").addClass('show');
		getAllUsers(showAccountDetails);
	});

    $("#delete-row").click(function(event) {
       alert("Delete User Called");
       alert("data1 is "+data1);
       for(i=0;i<data1.length;i++)
       {
        var id=data1[i].id;
        alert("id to be deleted  is***********"+id);
        url1=url1+id;
        alert("url is "+url1);
        $.ajax({
        url: url1,
    type: 'DELETE',
    success: function(result) {
        alert("User Deleted");
    }
});

       }
       data1=[];
    });

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
    var url="http://localhost:8080/distinct?distinct=acttype";
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
	var url="https://capstone-node.herokuapp.com/distinct?distinct=gender";
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
	var url="https://capstone-node.herokuapp.com/distinct?distinct=address.city";
	 var queryString = {};

	$.getJSON(url,queryString,showCitytype);
}

$(function(){
	populateCityType();
	populateGenType();
	populateActType();
	userSubmit();

});