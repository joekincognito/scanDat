var order = {};
var item = {};
var customer = {};
var user = {};
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
  getOrder();
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
        }
        else
        {
            alert("An Error has occurred");
        }
});  
}
function getOrder(){
  $.ajax({
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/get_current_order_as_json",
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
function getOrdersSuccess(results) {
        $('#current tbody').html('');
        order = results.order;
        order_items = results.order_items;
        $('#po').val(order.name);
        $.each( order_items, function( index, item ){
          if(user.role>2){
            if((item.first_name + item.last_name)==user.first_name+user.last_name){
                disabled="";
              }else{ 
                disabled="disabled";
            }
          }else{
            disabled="";
          }
          if(item.description.charAt(0)=='*'){
            $('#current tbody').append('<tr id='+item.id+' class="warning"><td><input id="itemQTY" class="input-group" name="quantity" type="number" min="1" max="200" style="color:black;" '+disabled+' value="'+item.qty+'""></td><td id="bercor">'+item.bercor+ "</td><td>" + item.description + "</td><td>" + item.first_name + " " + item.last_name + "</td></tr>");
          }
          else
          {            
            $('#current tbody').append('<tr id='+item.id+'><td><input id="itemQTY" class="input-group" name="quantity" type="number" min="1" max="200" style="color:black;" '+disabled+' value="'+item.qty+'""></td><td id="bercor">'+item.bercor+ "</td><td>" + item.description + "</td><td>" + item.first_name + " " + item.last_name + "</td></tr>");
          }
        });
}

$('#current tbody').on("change", "#itemQTY", function(){
    if (!$(this).parent().parent().hasClass("changed")){
        $(this).parent().parent().addClass("changed");
    }
});
$('.panel-heading').on("change", '#po',function(){
    if (!$(this).hasClass("poChanged")){
        $(this).addClass("poChanged");
    }
});
$('#update').click(function(){
  var items = [];
  $('.changed').each(function(){
    item = [];
      item.push( $(this).attr('id') , $(this).children().children().filter('#itemQTY').val() );
      items.push( item );
  });
  update_order(items);
});
function update_order(items) {
        console.log(items);
        console.log("update_order");
        items = JSON.stringify(items);
        console.log(items);
         $.ajax({
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/update_order",
            data: "items=" + items,
            statusCode: {
                404: function() {
                alert( "page not found" );
                }} 
            })
            .done(function( returnData ) {
                console.log("returnData is: " + returnData);
                if(returnData)
                {
                    $('#info').html("<br><p class='alert alert-success msg'>Items Updated Successfully</p>");
                }
                else
                {
                    $('#info').html("<br><p class='alert alert-danger msg'>Error</p>" );
                }
            });  
          }; 
$('#poUpdate').click(function(){
  if ($('#po').hasClass("poChanged")){
    id = order.id;
    po = $('#po').val();
    update_po(id, po);
  }
});
function update_po(id, po) {
        console.log("update_po");
         $.ajax({
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/update_po",
            data: "id=" + id + "&po=" + po,
            statusCode: {
                404: function() {
                alert( "page not found" );
                }} 
            })
            .done(function( returnData ) {
                console.log("returnData is: " + returnData);
                if(returnData)
                {
                    $('#po').removeClass("poChanged");
                    $('#po').siblings('span').toggleClass('glyphicon-ok');
                    $('#po').parent().toggleClass('has-success has-feedback');
                    setTimeout(function(){
                        $('#po').siblings('span:first').toggleClass('glyphicon-ok');
                        $('#po').parent().toggleClass('has-success has-feedback');
                      },3000); 
                }
                else
                {
                    $('#info').html("<br><p class='alert alert-danger msg'>Error</p>" );
                } 
            });  
          };
$('#placeOrder').click(function(){
    $('#placeOrder').prop('disabled', true);
    $('.panel-footer').append('<br><span class="alert alert-info">Order Processing Please Wait</span>');
    //"http://10.1.1.1:10080/apps/BarcodeDemo/php/order.php",
    //"http://50.204.18.115/apps/BarcodeDemo/php/order.php",
    prepare_order();
});
function prepare_order(){
    $('.panel-footer').append('<br>prepare_order</br>');
    $.ajax({
        url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/prepare_order",
        statusCode: {
            404: function() {
            alert( "page not found" );
            }} 
        })
    .done(function( returnData ) {
        if(returnData){
            //console.log(returnData);
            $('.panel-footer').append('<br>'+returnData+'</br>');
            place_order(returnData);
        }
        else{
            console.log("error");
        }
    });
}
function place_order(a_order){
$('.panel-footer').append('<br>place_order</br>');    
    $.ajax({
            url: "http://50.204.18.115/apps/BarcodeDemo/php/order.php",
            //url: "http://10.1.1.1:10080/apps/BarcodeDemo/php/order.php",
            contentType: "application/json",
            data: "qs=" + a_order,
            statusCode: {
                404: function() {
                alert( "page not found" );
                },
                408: function() {
                alert( "Access Denied" );
                }
            } 
            })
            .done(function( returnData ) {
                $('.panel-footer').append('<br>Place order - returnData is: '+returnData+'</br>');
                if (returnData == "Order Placed Successfully!"){
                    navigator.notification.alert(
                        returnData, //message
                        order_success_callback(), //callback
                        'Order Success!',   //Title
                        'OK'                //buttonName
                    );
                }
                else
                {
                    navigator.notification.alert(
                                    'Order Processing Error', //message
                                    function(){window.location="index.html"}, //callback
                                    'Order ',   //Title
                                    'OK'                //buttonName
                                );
                }
            });
}
function order_success_callback(){
  $.ajax({
        url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/mark_order_submitted",
        statusCode: {
            404: function() {
            alert( "page not found" );
            }} 
        })
    .done(function( returnData ) {
        $('.panel-footer').append('<br>'+returnData+'</br>');
       if (returnData == "true"){
          navigator.notification.alert(
              "Order Marked Submitted", //message
              function(){window.location="home.html"}, //callback
              'Order Marked Submitted!',   //Title
              'OK'                //buttonName
          );
      }
      else
      {
          navigator.notification.alert(
                          "Order Not Marked Submitted", //message
                          function(){window.location="Home.html"}, //callback
                          'Order Not Marked Submitted ',   //Title
                          'OK'                //buttonName
                      );
      }
    });
}