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
            result = JSON.parse(result);                  
            role = parseInt(result.role);
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
            serial_number = result.text;
            serial_number_match = hasSerialNumberMatch(serial_number);
            $('#info').append("<p class='alert alert-success msg'>serial_number_match=" + serial_number_match + "</p>");
            if(serial_number_match){
                $('#item').val(serial_number);
                $('#info').append("<p class='alert alert-success msg'>Scan Successfull: Item Removed From Stock</p>");
            }else{
                $('#info').append("<p class='alert alert-danger msg'>Serial Number Error, Serial Number: " + result.text + " Please Try Again</p>");
            }
            
    }, function (error) { 
        $('#info').append("<p>Scanning failed: " + error + "</p>"); 
    });
    
});

function hasSerialNumberMatch(serial_number) {
    $('#info').append("<p class='alert alert-success msg'>customer_number=" + user.customer_id + "&serial_number=" + serial_number + "</p>");
    url= "http://50.204.18.115/apps/BarcodeDemo/php/consignment.php";
    $.ajax({
            url: url,
            //url: "http://10.1.1.1:10080/apps/BarcodeDemo/php/order.php",
            crossDomain: true,
            //username: 'ScanAppFloorPlanAccount',
            //password: 'WordPassIsNotaGoodPassword!',
            //data: "customer_number=" + user.customer_id + "&serial_number=" + serial_number,
            data: "customer_number=2501&serial_number=Z9876A12345",
            statusCode: {
                404: function() {
                alert( "page not found" );
                    }
                } 
            })
            .done(function( returnData ) {
                $('#info').append("<p class='alert alert-success msg'>serial_number_match=" + returnData + "</p>");
                if(returnData=="Success"){
                    $('#info').append("<p class='alert alert-success msg'>returnData = Success</p>");
                    return true;
                }
                return returnData;
            })
            .fail(function() {
                return "error";
            });
}