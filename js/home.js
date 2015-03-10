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
function ajax(number){ //number will bercor
        console.log("ajax");
        $.ajax({
            //url: "http://50.204.18.115/apps/BarcodeDemo/php/test.php", //real url - public
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/get_item",
            //data: "qs=" + result.text,
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
                //$('#log').append("<p>"+item.bercor+"--"+item.desc+"</p>");
                $('#info').html("<p class='alert alert-info msg'>" + item.desc + "</p>" );
                $('#item').val( item.bercor);
            });      
}
function addToOrder(item) {
        //$('#log').append("item.qty " + item.qty + "item.bercor ish " + item.bercor + " item.desc is " + item.desc + " order.Id is " + order.Id);
        //check to see if the bercor already exists on the order
        console.log("addToOrder");
         $.ajax({
            //url: "http://50.204.18.115/apps/BarcodeDemo/php/test.php", //real url - public
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/add_item_to_order",
            //data: "qs=" + result.text,
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
                //$('#log').append("<p>"+item.bercor+"--"+item.desc+"</p>");
                
            });      
} 