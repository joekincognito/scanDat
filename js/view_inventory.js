var tableShell = '<table class="table table-condensed table-bordered table-striped" style="font-size:16px"><thead><tr><th>Bercor</th><th>Desc</th><th>OH</th><th>Min</th><th>Max</th></tr></thead><tbody></tbody></table> ';
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
function onDeviceReady(){  
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
        if(result)
        {
            result = JSON.parse(result);                  
            role = parseInt(result.role);
            if(role>2)$('.role-based').prop("disabled", true);
            user = result; 
            $('.glyphicon-user').after('&nbsp;&nbsp;'+user.first_name+' '+user.last_name);
             getInventory();
        }
        else
        {
            alert("An Error has occurred");
        }
});  
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
                //console.log("returnData is: " + result);
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
    var active=true;
$.each( results, function( index, item ){
    tableID=index.replace(/\s+/g, '-').replace(/[^a-zA-Z-]/g, '').toLowerCase();
    $('.nav-tabs').append('<li role="presentation"><a href="#'+tableID+'" aria controls="'+tableID+'" role="tab" data-toggle="tab">'+index+'</a></li>');
    $('.tab-content').append('<div role="tabpanel" class="tab-pane" id="'+tableID+'"></div>');
    $('#'+tableID).append(tableShell);
    $.each( item, function( k, v ){
        $('#'+tableID+' table tbody').append('<tr><td>'+v.bercor+'</td><td>'+v.desc+'</td><td>'+v.onHand+'</td><td>'+v.min+'</td><td>'+v.max+'</td></tr>');
    });
$(".nav-tabs li:first-child").addClass('active');
$(".tab-pane:first-child").addClass('active');
$(".nav-tabs>li").css({"border": "1px solid rgba(2, 7, 23, 0.12)","border-radius": "4px", "background-color": "rgba(255, 255, 255, 0.2)"});
});
/*
$('tbody').html('');
inventory = results.inventory;
$.each( inventory, function( index, item ){
  $('tbody').append('<tr><td>'+item.bercor+'</td><td>'+item.onHand+ "</td><td>" + item.min + "</td><td>" + item.max + "</td><td>" + item.name + "</td></tr>");
});
*/
}