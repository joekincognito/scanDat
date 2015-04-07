var db;
var order = {};
var item = {};
var customer = {};
$(document).ready(function() {
    // are we running in native app or in a browser?
    window.isphone = false;
    if(document.URL.indexOf("http://") === -1 
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;
    }

    if( window.isphone ) {
        //$('#log').append ('<p>phone<p>');
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        //$('#log').append('<p>not phone</p>');
        onDeviceReady();
    }
    $('#orderHistory').on("click", ".order-heading", function(){
        $(this).siblings('.order-body').toggleClass('hidden');
    });
});


function onDeviceReady() {
    //$('#log').hide();
    getOrders();
}

function getOrders() {
        $.ajax({
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/get_orders_as_json",
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
                    getOrdersSuccess(result);
                }
                else
                {
                    alert("An Error has occurred");
                }
            });  
}
function getOrdersSuccess( results) {

        orders = results.orders;
        order_items = results.order_items;
        $.each( orders, function( index, order ){
        var ordersHtml = '<div class="panel panel-primary">'+
                            '<div class="panel-heading order-heading">'+
                              '<h4 style="margin-top:0px;margin-bottom:0px" class="row">' +
                              '<span class="col-md-5">'+order.date.substring(0,11)+'</span><span class="col-md-5">'+ name + '</span>'+
                              '<span class="col-md-2"><span class="caret pull-right" style="border-top: 8px solid; border-right: 8px solid transparent; border-left: 8px solid transparent;"></span></span></h4>'+
                            '</div>';
            ordersHtml += '<div class="panel-body order-body hidden">'+
                              '<div class="table-responsive">'+
                                '<table class="table table-bordered" style="font-size:16px">'+
                                  '<thead>'+
                                    '<tr><th>Qty</th><th>Bercor</th><th>Desc</th></tr>'+
                                  '</thead>'+
                                  '<tbody id="table'+order.id+'"">';
            ordersHtml +='</tbody></table></div></div></div>';                                  
            $('#orderHistory').append(ordersHtml);
        });
        //for (var i=0; i<len; i++){
        $.each( order_items, function( index, item ){
                tablename="#table"+item.orders_id;
                $(tablename).append('<tr><td>'+item.qty+'</td><td>'+item.bercor+'</td><td>'+item.description+'</td></tr>');
                //orderholder +='<span>'+ result.desc + '</span>');   
        });
 
        //$('#orderHistory').text($('#orderHistory').html());
}

function errorCB(err) {
    //$('#log').append("<p>Error processing SQL: "+err.message+"</p>");
}

function successCB() {
    //$('#log').append("<p>success!</p>");
} 