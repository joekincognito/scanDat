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

$('#scan').click(function(){
    //var scanner = cordova.require("cordova/plugin/BarcodeScanner");
    cordova.plugins.barcodeScanner.scan( function (result) {
            var serial_number = result.text;
            hasSerialNumberMatch(serial_number);
    }, function (error) { 
        $('#info').append("<p>Scanning failed: " + error + "</p>"); 
    });
    
});

function hasSerialNumberMatch(serial_number) {
    $.ajax({
            url: "http://50.204.18.115/apps/BarcodeDemo/php/consignment.php",
            crossDomain: true,
            //username: 'ScanAppFloorPlanAccount',
            //password: 'WordPassIsNotaGoodPassword!',
            data: "customer_number=" + user.customer_id + "&serial_number=" + serial_number,
            //data: "customer_number=2501&serial_number=Z9876A12345",
            statusCode: {
                404: function() {
                alert( "page not found" );
                    }
                } 
            })
            .done(function( returnData ) {
                if(returnData=="Success"){
                    $('#item').val(serial_number);
                    $('#info').html("<p class='alert alert-success msg'>Scan Successfull: Item Removed From Stock</p>");
                }else{
                    $('#info').html("<p class='alert alert-danger msg'>Serial Number Error, Serial Number: " + serial_number + " Please Try Again</p>");
                }
            })
            .fail(function() {
                $('#info').html("<p class='alert alert-danger msg'>Something Went Wrong - Please Try Again</p>");
            });
}