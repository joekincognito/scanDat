var order = {};
var item = {};
var customer = {};

  $('#addToOrder').click(function(){
    item.bercor=$('#item').val();
    item.qty=parseInt($('#qty').val());
    console.log(item);
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
        if(!(result.text.toString().length===5 || result.text.toString().length===6 || result.text.toString().length===12)){
            navigator.notification.alert(
              "Scan Error or Invalid Barcode\n"+
              "Please Try Again!", //message
              function(){window.location="home.html"}, //callback
              'Scan Error',   //Title
              'OK'                //buttonName
          );
        }
        else 
        {
            if(result.text.toString().length===12){
                number=result.text.substring(6,11);
                ajax(number,null);
            }
            else{
                ajax(result.text,null);
            }
        }
    }, function (error) { 
        //$('#log').append("<p>Scanning failed: " + error + "</p>"); 
    });
    
});
function ajax(number){ //number will bercor
        console.log("ajax");
        $.ajax({
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/get_item",
            data: "qs=" + number,
            statusCode: {
                404: function() {
                alert( "page not found" );
                }} 
            })
            .done(function( returnData ) {
                console.log('ajax.done');
                console.log(returnData);
                item = jQuery.parseJSON( returnData );
                console.log(item);
                $('#info').html("<p class='alert alert-info msg'>" + item.desc + "</p>" );
                $('#item').val( item.bercor);
            });      
}
function addToOrder(item) {
        console.log("addToOrder");
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