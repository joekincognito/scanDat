$('.tab-content').on("click",'select',function(){
  $(this).focus();
});

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
             getOrder();
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
                if(result)
                {
                    //console.log(result);
                    result = JSON.parse(result);                  
                    getOrdersSuccess(result);
                }
                else
                {
                    alert("An Error has occurred");
                }
            });  
}
var tableShell = '<table class="table table-bordered table-striped table-condensed" style="font-size:16px"><thead><tr><th>#</th><th>Bercor</th><th>Desc</th><th>User</th><th>Order</th></tr></thead><tbody></tbody></table> ';
var panelShell = ' <div  class="panel panel-primary">'+
                    '<div class="panel-heading">'+
                      '<div class="form-group">'+
                        '<label class="sr-only" for="po">Order Name (PO)</label> '+
                        '<div class="input-group">'+
                          '<input id="po" type="text" class="form-control role-based">'+
                          '<span style="position:absolute;top:0px;left:-10px;" class="glyphicon form-control-feedback"></span>'+
                          '<span class="input-group-btn">'+
                            '<button id="poUpdate" class="btn btn-default role-based">Update</button>'+
                          '</span>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="panel-body">'+
                    '</div>'+
                    '<div class="panel-footer">'+
                    '<div class="row">'+
                    '<div class="col-md-4">'+
                      '<button id="update" class="btn btn-primary">Update Order</button>'+
                    '</div>'+
                    '<div class="col-md-4">'+
                      '<div class="btn-group center-block">'+
  '<button type="button" class="btn btn-success dropdown-toggle role-based" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
    'Place Order <span class="caret"></span>'+
  '</button>'+
  '<ul class="dropdown-menu">'+
    '<li><a href="#" id="delivery">Delivery</a></li>'+
    '<li><a href="#" id="pickup">Pickup</a></li>'+
  '</ul>'+
'</div>'+
                    '</div>'+
                    '<div class="col-md-4">'+
                      '<button id="deleteOrder" class="btn btn-danger role-based pull-right">Delete Order</button>'+
                    '</div>'+
                      '<div id="info"></div>'+
                    '</div>'+
                    '</div>'+
                   '</div>';

function getOrdersSuccess(results) {
    var orders=results;
    if(user.role<2){
      var active=true;
      //FOR EACH ORDER
      $.each( results, function( index, order ){
        name = order.name;
        tableID = name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
        tableID += String(order.id);
        orderID = order.id;
        create_nav_tab(tableID,name);
        create_tab_panel(tableID,orderID,name);
        //FOR EACH ITEM
        $.each( order.items, function( k, v ){
          if(v.description.charAt(0)=='*'){
            $('#'+tableID+' table tbody').append('<tr id='+v.id+' class="orderItem warning"><td><input id="itemQTY" class="watch input-group" name="quantity" type="number" min="1" max="200" style="color:black;" value="'+v.qty+'""></td><td id="bercor">'+v.bercor+ "</td><td>" + v.description + "</td><td>" + v.first_name + " " + v.last_name + "</td><td>"+create_order_options(orders,orderID)+"</td></tr>");
          }
          else{            
            $('#'+tableID+' table tbody').append('<tr id='+v.id+' class="orderItem"><td><input id="itemQTY" class="watch input-group" name="quantity" type="number" min="1" max="200" style="color:black;" value="'+v.qty+'""></td><td id="bercor">'+v.bercor+ "</td><td>" + v.description + "</td><td>" + v.first_name + " " + v.last_name + "</td><td>"+create_order_options(orders,orderID)+"</td></tr>");
          }
        });
        $(".nav-tabs li:first-child").addClass('active');
        $(".tab-pane:first-child").addClass('active');
      });
      create_nav_tab('new','+');
    }
    else{
      $('#wrapper').append(tableShell);
      //FOR EACH ORDER
      $.each( results, function( index, order ){
        //FOR EACH ITEM
        orderID = order.id;
        $.each( order.items, function( k, v ){
          if(v.description.charAt(0)=='*'){
            $('table tbody').append('<tr id='+v.id+' class="orderItem warning"><td><input id="itemQTY" class="watch input-group" name="quantity" type="number" min="1" max="200" style="color:black;" value="'+v.qty+'""></td><td id="bercor">'+v.bercor+ "</td><td>" + v.description + "</td><td>" + v.first_name + " " + v.last_name + "</td><td>"+create_order_options(orders,orderID)+" </td></tr>");
          }
          else{            
            $('table tbody').append('<tr id='+v.id+' class="orderItem"><td><input id="itemQTY" class="watch input-group" name="quantity" type="number" min="1" max="200" style="color:black;" value="'+v.qty+'""></td><td id="bercor">'+v.bercor+ "</td><td>" + v.description + "</td><td>" + v.first_name + " " + v.last_name + "</td><td>"+create_order_options(orders,orderID)+" </td></tr>");
          }
        });
          $('select').prop('disabled','true');
        });
      $('#wrapper').append('<button id="update" class="btn btn-primary">Update</button>');
    }
}
$('.nav-tabs').on('click',"a[href='#new']", function(){
  create_new_order();
});
function create_order_options(orders,orderID){
    var options = "<select class='watch form-control'>";
    $.each(orders,function(){
      selected = (this.id==orderID)?"selected":"";
      options+="<option value="+this.id+" " +selected+">"+this.name+"</option>";
    });
    options+="</select>";
    return options;
}
function create_nav_tab(tableID,name){
  $('.nav-tabs').append('<li role="presentation"><a href="#'+tableID+'" aria controls="'+tableID+'" role="tab" data-toggle="tab">'+name+'</a></li>');
}
function create_tab_panel(tableID,orderID,name){
  $('.tab-content').append('<div role="tabpanel" class="order tab-pane" id="'+tableID+'"></div>');
  $('#'+tableID).data("orderId",orderID);
  $('#'+tableID).append(panelShell);
  $('#'+tableID+' .panel .panel-body').append(tableShell);
  $('#'+tableID+' .panel-heading .input-group input').val(name);
}

$('#wrapper').on("change", ".watch", function(){
    if (!$(this).parent().parent().hasClass("changed")){
        $(this).parent().parent().addClass("changed");
    }
});
$('.tab-content').on("change", '.panel-heading input',function(){
    if (!$(this).hasClass("poChanged")){
        $(this).addClass("poChanged");
    }
});

function create_new_order(){
  $.ajax({
    url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/create_order",
    statusCode: {
    404: function() {
    alert( "page not found" );
    }} 
  })
  .done(function( returnData ) {
    if(returnData)
    {
      location.reload();
    }else{
      alert("error");
    }
  });   
}
function update_order(items) {
        items = JSON.stringify(items);
         $.ajax({
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/update_order",
            data: "items=" + items,
            statusCode: {
                404: function() {
                alert( "page not found" );
                }} 
            })
            .done(function( returnData ) {
                if(returnData)
                {
                     if($('#po').hasClass("poChanged"))
                     {$('#poUpdate').click();}else{
                      location.reload();
                     }
                }
                else
                {
                    $('.panel-footer').append('<div id="info"></div>');
                    $('#info').html("<br><p class='alert alert-danger msg'>Error</p>" );
                    setTimeout(function(){
                       $('#info').hide();
                     },3000); 
                }
            });  
          };
//PO Update Button Click
$('.tab-content').on("click",".panel-heading button", function(){
  index = ($('.panel-heading button').index($(this)));
  if ($(this).parent().parent().children('input').hasClass("poChanged")){
    id = $(this).parents('.tab-pane').data("orderId");
    po = $(this).parent().parent().children('input');
    update_po(id, po, index);
  }
});
//UPDATE BUTTON CLICK
$('#wrapper').on("click","#update", function(){
  var items = [];
  //changedOrderItems=$(this).parent().siblings('.panel-body').children().children().children('.changed')
if(user.role<2){
  changedOrderItems=$(this).parents('.panel-footer').siblings('.panel-body').children().children().children('.changed');
}
else{
  changedOrderItems=$('.changed');
  //console.log(changedOrderItems);
}
  if(changedOrderItems.length > 0){
    changedOrderItems.each(function(){
      item = [];
        item.push( $(this).attr('id') , $(this).find('#itemQTY').val() , $(this).find('option:selected').val() );
        items.push( item );
    });
    update_order(items);
  }
  else{
  if(user.role<2){
    $(this).parent().siblings('.panel-heading').children('.form-group').children('.input-group').children('.input-group-btn').children('#poUpdate').click();
  }
  }
});
//Delete Order Button Click
$('.tab-content').on("click","#deleteOrder", function(){
  id = $(this).parents('.order').data("orderId");
  delete_order(id);
});
//Place Order Button Click
$('.tab-content').on("click",'#delivery',function(){
    if(($('.changed').length > 0) || ($('#po').hasClass("poChanged"))){$('#update').click()}
    $('#placeOrder').prop('disabled', true);
    $('.panel-footer').append('<br><span class="alert alert-info">Order Processing Please Wait</span>');
    id = $(this).parents('.order').data("orderId");
    info='{"deliveryMethod":"delivery"}';
    prepare_order(id,info);
});

$('.tab-content').on("click",'#pickup',function(){
    if(($('.changed').length > 0) || ($('#po').hasClass("poChanged"))){$('#update').click()}
    $('#placeOrder').prop('disabled', true);
    $('.panel-footer').append('<br><span class="alert alert-info">Order Processing Please Wait</span>');
    id = $(this).parents('.order').data("orderId");
    person = user.first_name+' '+user.last_name;
    info='{"deliveryMethod":"pickup", "person":"'+person+'"}';
    //console.log(info);
    prepare_order(id,info);
});

function delete_order(id){
  $.ajax({
    url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/delete_order",
    data: "id=" + id,
      statusCode: {
      404: function() {
      alert( "page not found" );
      }} 
  })
  .done(function( returnData ) {
    if(returnData)
    {
      location.reload();
    }
    else
    {

    } 
  });  
}

function update_po(id, po, index) {
         $.ajax({
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/update_po",
            data: "id=" + id + "&po=" + po.val(),
            statusCode: {
                404: function() {
                alert( "page not found" );
                }} 
            })
            .done(function( returnData ) {
                if(returnData)
                {
                    po.removeClass("poChanged");
                    $('.nav-tabs li a:eq('+index+')').text(po.val());
                    $('select').find('option:eq('+index+')').text(po.val());
                    po.siblings('span').toggleClass('glyphicon-ok');
                    po.parent().toggleClass('has-success has-feedback');
                    setTimeout(function(){
                        po.siblings('span:first').toggleClass('glyphicon-ok');
                        po.parent().toggleClass('has-success has-feedback');
                      },3000); 
                }
                else
                {
                    $('#info').html("<br><p class='alert alert-danger msg'>Error</p>" );
                } 
            });  
          };

function prepare_order(id,info){
    $.ajax({
        url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/prepare_order",
        data: "id=" + id,
        statusCode: {
            404: function() {
            alert( "page not found" );
            }} 
        })
    .done(function( returnData ) {
        if(returnData){
            place_order(returnData,id,info);
            //console.log(info);
        }
        else{
        }
    });
}
function place_order(order,id,info){ 
    ordercheck=$.parseJSON(order);
    custID = ordercheck.CustID;
    //console.log(info);return;
    if(custID==2501){
      url = "http://10.1.1.1:10080/apps/BarcodeDemo/php/order.php";
    }else{
      url= "http://50.204.18.115/apps/BarcodeDemo/php/order.php";
    }
    $.ajax({
            url: url,
            //url: "http://10.1.1.1:10080/apps/BarcodeDemo/php/order.php",
            crossDomain: true,
            data: "qs=" + order + "&info=" + info,
            statusCode: {
                404: function() {
                alert( "page not found" );
                }} 
            })
            .done(function( returnData ) {
                if (returnData == "Order Placed Successfully!"){
                        order_success_callback(id);
                }
                else
                {
                  alert(returnData);
                }
            });
}
function order_success_callback(){
  $.ajax({
        url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/mark_order_submitted",
        data: "id=" + id,
        statusCode: {
            404: function() {
            alert( "page not found" );
            }} 
        })
    .done(function( returnData ) {
       if (returnData == "true"){
        if(phone){
          navigator.notification.alert(
              "Order Marked Submitted", //message
              function(){window.location="home.html"}, //callback
              'Order Marked Submitted!',   //Title
              'OK'                //buttonName
          );
        }
        else{
          alert('The Order Has Been Submitted');
          window.location="index";
        }
      }
      else
      {
        if(phone){
          navigator.notification.alert(
                          "Order Not Marked Submitted", //message
                          function(){window.location="Home.html"}, //callback
                          'Order Not Marked Submitted ',   //Title
                          'OK'                //buttonName
                      );
        }
        else{
          alert("The order was not marked submitted, Please Notify jkelley@gwberkheimer.com")
        }
      }
    });
  
}