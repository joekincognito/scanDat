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
  getUser();//Not doing anything at the moment
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
        if(result)
        {
            result = JSON.parse(result);                  
            role = parseInt(result.role);
            user = result; 
            //$('.glyphicon-user').after('&nbsp;&nbsp;'+user.first_name+' '+user.last_name);
        }
        else
        {
            alert("An Error has occurred");
        }
});  
}

$('#scan').click(function(){
    //var scanner = cordova.require("cordova/plugin/BarcodeScanner");
    cordova.plugins.barcodeScanner.scan( function (result) {         
        // if(!(result.text.toString().length===5 || result.text.toString().length===6)){
        //     alert("Scan Error or invalid barcode\n" +
        //      "Please Try Again!");
        // }
        // else 
        // {
            //customer_number = user.customer_number; 
            serial_number = result.text;

            serial_number_match = hasSerialNumberMatch(serial_number)
            if(serial_number_match=="Success"){
                $('#info').append("<p>Scan Successfull: " + result.text + "</p>");
            }else{
                $('#info').append("<p>Serial Number Error, Serial Number: " + result.text + "<br>" + serial_number_match + " </p>");
            }
            
        //}
    }, function (error) { 
        $('#info').append("<p>Scanning failed: " + error + "</p>"); 
    });
    
});

function hasSerialNumberMatch(serial_number) {
    //customer_number   serial_number   po_number  
    //console.log(info);return;
    // if(custID==2501){
    //   url = "http://10.1.1.1:10080/apps/BarcodeDemo/php/consignment.php";
    // }else{
      url= "http://50.204.18.115/apps/BarcodeDemo/php/consignment.php";
    //}
    $.ajax({
            url: url,
            //url: "http://10.1.1.1:10080/apps/BarcodeDemo/php/order.php",
            crossDomain: true,
            username: 'ScanAppFloorPlanAccount';
            password: 'WordPassIsNotaGoodPassword!';
            data: "customer_number=" + "2501" + "&serial_number=" + serial_number,
            statusCode: {
                404: function() {
                alert( "page not found" );
                }} 
            })
            .done(function( returnData ) {
                return returnData;
            });
}