var order = {};
var item = {};
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
  getUser(); //will disable the place order button if the users group is 4
 
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
            if(role>2)$('.role-based').prop("disabled", true);
            user = result; 
            $('.glyphicon-user').after('&nbsp;&nbsp;'+user.first_name+' '+user.last_name);
        }
        else
        {
            alert("An Error has occurred");
        }
});  
}


$('#addToOrder').click(function(){
    item.bercor=$('#item').val();
    item.qty=parseInt($('#qty').val());
    //console.log(item);
    if(!item.desc){
        ajax(item.bercor);
        setTimeout(function()
            {
                if(item.desc){
                    item.qty=parseInt($('#qty').val());
                    addToOrder(item);
                }
                else{
                    $('#info').html('<p class="alert alert-warning msg">Try hitting add to order again<p>');
                }
            },
            4000);//wait 3 seconds then check if we got the description from the ajax call
    }
    else{
        addToOrder(item);      
    }
});

$('#scan').click(function(){
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");
    scanner.scan( function (result) {         
        if(!(result.text.toString().length===5 || result.text.toString().length===6)){
            alert("Scan Error or invalid barcode\n" +
             "Please Try Again!");
        }
        else 
        {
            ajax(result.text,null);
        }
    }, function (error) { 
        //$('#log').append("<p>Scanning failed: " + error + "</p>"); 
    });
    
});
function ajax(number){ //number will bercor
        //console.log("ajax");
        $.ajax({
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/get_item",
            data: "qs=" + number,
            statusCode: {
                404: function() {
                alert( "page not found" );
                }} 
            })
            .done(function( returnData ) {
                //console.log('ajax.done');
                //console.log(returnData);
                item = jQuery.parseJSON( returnData );
                //console.log(item);
                $('#info').html("<p class='alert alert-info msg'>" + item.desc + "</p>" );
                $('#item').val( item.bercor);
            });      
}
function addToOrder(item) {
        //console.log("addToOrder");
         $.ajax({
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/add_item_to_order",
            data: item,
            statusCode: {
                404: function() {
                alert( "page not found" );
                }} 
            })
            .done(function( returnData ) {
                if(returnData)
                {
                    $('#info').html('<p class="alert alert-success msg">item successfully added to the order in progress<p>');
                    $('#item').val('');
                    item.desc=false;
                    $('#qty').val(1);
                }
                else
                {
                    $('#info').html("<p class='alert alert-danger msg'>Error</p>" );
                }
            });      
} 