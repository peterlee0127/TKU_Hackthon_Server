function do_POST()
{   
    var name = $('#name').val();
    var room = $('#room').val();
    var time = $('#time').val();
    var data = $('<tr>'+
                    '<td>'+ name +'</td>'+
                    '<td>'+ room +'</td>'+
                    '<td>'+ time +'</td>'+
                '</tr>');
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/api/newClass",
        data: "&class_name="+name+"&class_room="+room+"&class_time="+time,
        dataType:'json',
        success:function(json){
                    var name = json.class_name;
                    var room = json.class_room;
                    var time = json.class_time;
                    var data = $('<tr>'+
                            '<td>'+ '<a href="/'+json._id+'">'+name +'</a></td>'+
                            '<td>'+ room +'</td>'+
                            '<td>'+ time +'</td>'+
                    '</tr>');
                    $('tbody').append(data);
        }
    });
}
//
//function add_class()
//{
//    var name = $('#name').val();
//    var room = $('#room').val();
//    var time = $('#time').val();  
//    var data = $('<tr>'+
//                            '<td>'+ name +'</td>'+
//                            '<td>'+ room +'</td>'+
//                            '<td>'+ time +'</td>'+
//                    '</tr>');
//    $('tbody').append(data);
//}

function init_class_list(json)
{

    for (var i = json.length - 1; i >= 0; i--) {
            
        var name = json[i].class_name;
        var room = json[i].class_room;
        var time = json[i].class_time;
        var data = $('<tr>'+
                            '<td>'+ '<a href="/'+json[i]._id+'">'+name +'</a></td>'+
                            '<td>'+ room +'</td>'+
                            '<td>'+ time +'</td>'+
                    '</tr>');
        $('tbody').append(data);
    }   
}