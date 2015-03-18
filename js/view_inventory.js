$(document).ready(function() {
    // are we running in native app or in a browser?
    window.isphone = false;
    if(document.URL.indexOf("http://") === -1 
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;
    }
    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});
function onDeviceReady() {
  getInventory();
}
function getInventory(){
  $.ajax({
            //url: "http://50.204.18.115/apps/BarcodeDemo/php/test.php", //real url - public
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/get_inventory_as_json",
            //data: "qs=" + result.text,
            statusCode: {
                404: function() {
                alert( "page not found" );
                }} 
            })
            .done(function( result ) {
                console.log("returnData is: " + result);
                if(result)
                {
                    result = JSON.parse(result);                  
                    getInventorySuccess(result);
                }
                else
                {
                    alert("An Error has occurred");
                }
            });  
}
function getInventorySuccess(results) {
        $('tbody').html('');
        inventory = results.inventory;
        $.each( inventory, function( index, item ){
          $('tbody').append('<tr><td>'+item.bercor+'</td><td>'+item.onHand+ "</td><td>" + item.min + "</td><td>" + item.max + "</td><td>" + item.name + "</td></tr>");
        });
}