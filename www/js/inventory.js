var order = {};
var gQTY; //global scoped qty
var oh; //global scoped onHand qty field
var gqmin; //global scoped min quantity
var gqmax;//global scoped max quantity
var min;//global scoped min field
var max;//global scoped max field
var item = {};
var inv_center;
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
$('#iCenter').change(function(){
    inv_center = $('#iCenter option:selected').prop('id');
});
function onDeviceReady() {
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
             getInventoryCenters();
        }
        else
        {
            alert("An Error has occurred");
        }
});  
}
function getInventoryCenters(){
  $.ajax({
            //url: "http://50.204.18.115/apps/BarcodeDemo/php/test.php", //real url - public
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/get_inventory_centers_as_json",
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
                    getInventoryCentersSuccess(result);
                }
                else
                {
                    alert("An Error has occurred");
                }
            });  
}
function getInventoryCentersSuccess(result){
        iCenters = result.inventory_centers;
        
        var htmlString ="";
        $.each( iCenters, function( index, center ){
            htmlString += "<option id="+center.id+">";
            htmlString += center.name;
            htmlString += "</option>"; 
        });

        $('select').html(htmlString);
        inv_center=$('#iCenter option:eq(0)').prop('id');
}

$('.bercor').change(function(){$('.bercor').val($(this).val())});

/*********************************/
/*********SCAN IN OUT*************/
/*********************************/
$('#incInv').click(function(){
    bercor = $(this).parent().parent().children('.panel-body').children('.input-group').children('.bercor').val();
    qty = $(this).parent().parent().children('.panel-body').children('.form-group').children('#qty').val();
    if(!qty){
        $('#qty').siblings('span').toggleClass('glyphicon-warning-sign');
        $('#qty').parent().toggleClass('has-warning has-feedback');
        setTimeout(function(){$('#qty').siblings('span').toggleClass('glyphicon-warning-sign');$('#qty').parent().toggleClass('has-warning has-feedback')},3000);
    }
    else{
        //inv_center = $('option:selected').prop('id');
        updateInv(bercor,parseInt(qty),inv_center);
    }
});
$('#decInv').click(function(){
    bercor = $(this).parent().parent().children('.panel-body').children('.input-group').children('.bercor').val();
    qty = $(this).parent().parent().children('.panel-body').children('.form-group').children('#qty').val();
    if(!qty){
        $('#qty').siblings('span').toggleClass('glyphicon-warning-sign');
        $('#qty').parent().toggleClass('has-warning has-feedback');
        setTimeout(function(){$('#qty').siblings('span').toggleClass('glyphicon-warning-sign');$('#qty').parent().toggleClass('has-warning has-feedback')},3000);
    }
    else{
        //inv_center = $('option:selected').prop('id');
        updateInv(bercor,-parseInt(qty),inv_center);
    }
});
function updateInv(bercor,qty,inv_center){
        console.log("incInv");
         $.ajax({
            //url: "http://50.204.18.115/apps/BarcodeDemo/php/test.php", //real url - public
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/update_inventory",
            //data: "qs=" + result.text,
            data: "bercor=" + bercor + "&qty=" + qty + "&inv_center=" + inv_center,
            statusCode: {
                404: function() {
                alert( "page not found" );
                }} 
            })
            .done(function( returnData ) {
                if(returnData)
                {
                    console.log(returnData);
                    $('#qty').siblings('span').toggleClass('glyphicon-ok');
                    $('#qty').parent().toggleClass('has-success has-feedback');
                    setTimeout(function(){
                        $('#qty').siblings('span').toggleClass('glyphicon-ok');
                        $('#qty').parent().toggleClass('has-success has-feedback');
                        $('#qty').val('');
                    },3000); 
                }
                else
                {
                    alert("An Error Occurred");
                } 
            });  
}

/*********************************/
/*********MIN MAX*****************/
/*********************************/
$('#mmUpdate').click(function(){
    bercor = $(this).parent().parent().children('.panel-body').children('.input-group').children('.bercor').val();
    min = $(this).parent().parent().children('.panel-body').children('.form-group').children('#min').val();    
    max = $(this).parent().parent().children('.panel-body').children('.form-group').children('#max').val();    
    console.log(min+'-'+max+'-'+inv_center+'-');
    if(min&&max){
        setMinMax(bercor,min,max,inv_center);
    }
    else{ 
        if(!min){
            $('#min').siblings('span').toggleClass('glyphicon-warning-sign');
            $('#min').parent().toggleClass('has-warning has-feedback');
            setTimeout(function(){$('#min').siblings('span').toggleClass('glyphicon-warning-sign');$('#min').parent().toggleClass('has-warning has-feedback')},3000);
        }
        if(!max){
            $('#max').siblings('span').toggleClass('glyphicon-warning-sign');
            $('#max').parent().toggleClass('has-warning has-feedback');
            setTimeout(function(){$('#max').siblings('span').toggleClass('glyphicon-warning-sign');$('#max').parent().toggleClass('has-warning has-feedback')},3000);
        }
    }
});
function setMinMax(bercor,min,max,inv_center) {
    console.log("setMinMax");
     $.ajax({
        //url: "http://50.204.18.115/apps/BarcodeDemo/php/test.php", //real url - public
        url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/update_inventory",
        //data: "qs=" + result.text,
        data: "bercor=" + bercor + "&min=" + min + "&max=" + max + "&inv_center=" + inv_center,
        statusCode: {
            404: function() {
            alert( "page not found" );
            }} 
        })
        .done(function( returnData ) {
            if(returnData)
            {
                $('#min').siblings('span').toggleClass('glyphicon-ok');
                $('#max').siblings('span').toggleClass('glyphicon-ok');
                $('#min').parent().toggleClass('has-success has-feedback');
                $('#max').parent().toggleClass('has-success has-feedback');
                setTimeout(function(){
                    $('#max').siblings('span').toggleClass('glyphicon-ok');
                    $('#min').siblings('span').toggleClass('glyphicon-ok');
                    $('#min').parent().toggleClass('has-success has-feedback');
                    $('#max').parent().toggleClass('has-success has-feedback');
                    $('#min').val('');$('#max').val('');
                },3000); 
            }
            else
            {
                alert("An Error Occurred");
            } 
        });      
}
$('#mmCheck').click(function(){
    bercor = $(this).parent().parent().children('.panel-body').children('.input-group').children('.bercor').val();
    min = $(this).parent().parent().children('.panel-body').children('.form-group').children('#min');    
    max = $(this).parent().parent().children('.panel-body').children('.form-group').children('#max');
    if(bercor){
        getMinMax(bercor,min,max,inv_center);
    }
});
function getMinMax(bercor,min,max,inv_center){
     //inv_center = $('option:selected').prop('id');
     console.log("getMinMax");
     $.ajax({
        //url: "http://50.204.18.115/apps/BarcodeDemo/php/test.php", //real url - public
        url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/get_inventory_item_as_json",
        //data: "qs=" + result.text,
        data: "bercor=" + bercor + "&inv_center=" + inv_center,
        statusCode: {
            404: function() {
            alert( "page not found" );
            }} 
        })
        .done(function( returnData ) {
            if(returnData)
            {
                item = jQuery.parseJSON( returnData );
                min.val(item[0].min);
                max.val(item[0].max);
            }
            else
            {
                alert("An Error Occurred");
            } 
        });      
}

/*********************************/
/*********ON HAND*****************/
/*********************************/
$('#ohUpdate').click(function(){
    bercor = $(this).parent().parent().children('.panel-body').children('.input-group').children('.bercor').val();
    oh = $(this).parent().parent().children('.panel-body').children('.form-group').children('#onHand').val(); 
    if(!oh){
        $('#onHand').siblings('span').toggleClass('glyphicon-warning-sign');
        $('#onHand').parent().toggleClass('has-warning has-feedback');
        setTimeout(function(){$('#onHand').siblings('span').toggleClass('glyphicon-warning-sign');$('#onHand').parent().toggleClass('has-warning has-feedback')},3000);
    }
    else{
        setOH(bercor,parseInt(oh),inv_center);
    }
});
function setOH(bercor,qty,inv_center) {
     console.log("setOH");
     $.ajax({
        url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/update_inventory",
        data: "bercor=" + bercor + "&qty=" + qty + "&inv_center=" + inv_center + "&action=setOH",
        statusCode: {
            404: function() {
            alert( "page not found" );
            }} 
        })
        .done(function( returnData ) {
            if(returnData)
            {
             console.log(returnData);
             $('#onHand').siblings('span').toggleClass('glyphicon-ok');
             $('#onHand').parent().toggleClass('has-success has-feedback');
             setTimeout(function(){
                $('#onHand').siblings('span').toggleClass('glyphicon-ok');
                $('#onHand').parent().toggleClass('has-success has-feedback');
                $('#onHand').val('');
             },3000);
            }
            else
            {
                alert("An Error Occurred");
            } 
        });      

}
$('#ohCheck').click(function(){
    bercor = $(this).parent().parent().children('.panel-body').children('.input-group').children('.bercor').val();
    oh = $(this).parent().parent().children('.panel-body').children('.form-group').children('#onHand');    
    if(bercor){
        getOH(bercor,oh,inv_center);
    }
});
function getOH(bercor,oh,inv_center) {
    //inv_center = $('option:selected').prop('id');
    console.log("getOH");
     $.ajax({
        url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/get_inventory_item_as_json",
        data: "bercor=" + bercor + "&inv_center=" + inv_center,
        statusCode: {
            404: function() {
            alert( "page not found" );
            }} 
        })
        .done(function( returnData ) {
            if(returnData)
            {
                console.log(returnData);
                item = jQuery.parseJSON( returnData );
                oh.val(item[0].onHand);
            }
            else
            {
                alert("An Error Occurred");
            } 
        });    
}
/******************************/
/*********SCAN*****************/
/******************************/
$('.scan').click(function(){
    cordova.plugins.barcodeScanner.scan( function (result) {  
        if(!(result.text.toString().length===5 || result.text.toString().length===6)){
            alert("Scan Error or invalid barcode\n" +
             "Please Try Again!");
        }
        else 
        {
            $('.bercor').val(result.text);
        }
    }, function (error) { 
        //$('#log').append("<p>Scanning failed: " + error + "</p>"); 
    });
    
});

/******************************/
/*********USE*****************/
/******************************/
$('#use').click(function(){
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
                 bercor = number;
            }else{
                bercor = result.text;
            }
           updateInv(bercor,-1,inv_center,"true");
       }
     }, function (error) { 
         //$('#log').append("<p>Scanning failed: " + error + "</p>"); 
     });
     
 });

//tx.executeSql('insert into orderItems(orderID, bercor, desc, qty) values(?,?,?,?)',[order.Id,item.bercor,'"'+item.desc+'"',item.qty]);

function ajax(number,itemQTY){ //number will bercor
        $.ajax({
            url: "http://50.204.18.115/apps/BarcodeDemo/php/test.php", //real url - public
            //url: "http://10.1.1.1:10080/apps/BarcodeDemo/php/test.php",  //testing url - local
            //data: "qs=" + result.text,
            data: "qs=" + number,
            statusCode: {
                404: function() {
                alert( "page not found" );
                }} 
            })
            .done(function( returnData ) {
                item = jQuery.parseJSON( returnData );
                //$('#log').append("<p>"+order.Id+" "+item.bercor+" "+item.desc+" "+itemQTY+"</p>");
                db.transaction(
                    function(tx){
                        tx.executeSql('select * from orderItems where orderID = ? and bercor = ?',[order.Id,item.bercor],
                    function(tx,results){
                        //$('#log').append("<p>results rows length:"+results.rows.length+"</p>");
                        if (results.rows.length > 0)
                        { 
                            //if the bercor already exists on the order, 
                            tx.executeSql('update orderItems set qty=?, desc=? where (orderID=? and bercor=?)',[itemQTY,'"*'+item.desc+'"',order.Id,item.bercor]);
                         }
                        else
                        {
                            //if the bercor does not exist on the order, add it to the order
                            tx.executeSql('insert into orderItems(orderID, bercor, desc, qty) values(?,?,?,?)',[order.Id,item.bercor,'"*'+item.desc+'"',itemQTY]);
                        }                  
                    },errorCB);
                    },errorCB,function(){/*$('#log').append("<p>order add success</p>")*/}
                );
            });    
}

function errorCB(err) {
    //$('#log').append("<p>Error processing SQL: "+err.message+"</p>");
}

function successCB() {
    //$('#log').append("<p>success!</p>");
} 
