var customer = {};
var user = {};
var phone = false;

$(document).ready(function() {
    // are we running in native app or in a browser?
    window.isphone = false;
    if(document.URL.indexOf("http://") === -1 
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;
        phone = true;
    }
    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});
function onDeviceReady() {  
  getUser();
}

function getUser(){
  $.ajax({
    url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/get_user",
    statusCode: {
        404: function() {
        alert( "page not found" );
        }} 
    })
    .done(function( result ) {
        if(result) {
            var result = JSON.parse(result);                  
            var role = parseInt(result.role);
            user = result;
            //$('.glyphicon-user').after('&nbsp;&nbsp;'+user.first_name+' '+user.last_name);
        }else{
            alert("An Error has occurred");
        }
    });
}

//prevent go button on keyboard from submitting
$("form").submit(function(e){
    e.preventDefault();
});

$('#scan').click(function(){
    //var scanner = cordova.require("cordova/plugin/BarcodeScanner");
    $('#info').html("");
    cordova.plugins.barcodeScanner.scan( function (result) {
            var serial_number = result.text;
            $('#item').val(serial_number);
            hasSerialNumberMatch(serial_number);
    }, function (error) {
        $('#item').val(serial_number+"-error"); 
        $('#info').html("<p>Scanning failed: " + error + "</p>"); 
    });
    
});

$('#go').click(function(){
    var serial_number = $('#item').val();
    hasSerialNumberMatch(serial_number);
});

function hasSerialNumberMatch(serial_number) {
    $.ajax({
            url: "http://50.204.18.115/apps/BarcodeDemo/php/consignment.php",
            crossDomain: true,
            //username: 'ScanAppFloorPlanAccount',
            //password: 'WordPassIsNotaGoodPassword!',
            data: "customer_number=" + user.customer_id + "&serial_number=" + serial_number
            //data: "customer_number=2501&serial_number=Z9876A12345"
            })
            .fail(function (jqXHR, exception) {
                // Our error logic here
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'No connection.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                 $('#info').html("<p class='alert alert-danger msg'>Error: " + msg + "</p>");
            })
            .done(function( returnData ) {
                if(returnData=="Success"){
                    $('#info').html("<p class='alert alert-success msg'>Scan Successfull: Item Removed From Stock</p>");
                }else if(returnData){
                    $('#info').html("<p class='alert alert-danger msg'>Error: " + returnData + "</p>");
                }else{
                    $('#info').html("<p class='alert alert-danger msg'>Serial Number Error, Serial Number: " + serial_number + " Please Try Again</p>");
                }
            })
            .fail(function() {
                $('#info').html("<p class='alert alert-danger msg'>Something Went Wrong - Please Try Again</p>");
            });
}