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
  $('#info').append('<p>consignment.js loaded</p>');
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
            //ajax(result.text,null);
            //$('#item').val( result.text);
            $('#info').append("<p>Scan Result " + result.text + "</p>"); 
        //}
    }, function (error) { 
        $('#info').append("<p>Scanning failed: " + error + "</p>"); 
    });
    
});