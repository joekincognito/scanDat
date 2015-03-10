$('#current tbody').on("change", "#itemQTY", function(){
    //add changed class to the tr if it doesnt already have it
    //$('#log').append("<p>#itemQTY change function triggered</p>");
    if (!$(this).parent().parent().hasClass("changed")){
        //$('#log').append("<p>addClass</p>");
        $(this).parent().parent().addClass("changed");
    }
});
$('.panel-heading').on("change", '#po',function(){
    //$('#log').append("<p>dat der order nambre hast bein change</p>");
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
            //url: "http://50.204.18.115/apps/BarcodeDemo/php/test.php", //real url - public
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/update_order",
            //data: "qs=" + result.text,
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
                //$('#log').append("<p>"+item.bercor+"--"+item.desc+"</p>");
                
            });  
          }; 
$('#poUpdate').click(function(){
  if ($('#po').hasClass("poChanged")){
    id = <?php echo $order['id'].';'; ?>
    po = $('#po').val();
    update_po(id, po);
  }
});
function update_po(id, po) {
        console.log("update_po");
         $.ajax({
            //url: "http://50.204.18.115/apps/BarcodeDemo/php/test.php", //real url - public
            url: "http://apps.gwberkheimer.com/scan_app.php/scan_app/update_po",
            //data: "qs=" + result.text,
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