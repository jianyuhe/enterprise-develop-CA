$(document).ready(function() {
	
	// DO GET information of book from a url
	$.ajax({
		type : "GET",
		url : "/books/library",
		success: function(result){
			$.each(result, function(i, book){
				//insert book information into table and create detail button
				var bookRow = '<tr>' +
									'<td>' + book.book_id + '</td>' +
									'<td>' + book.title + '</td>' +
									'<td>' + book.genre + '</td>' +
									'<td> <button id="b_detail"  onclick="bdetail(' + book.book_id + ')">Details</button> </td>' +
									
								  '</tr>';
				
				$('#book_table tbody').append(bookRow);
				
	        });
			
			$( "#book_table tbody tr:odd" ).addClass("info");
			$( "#book_table tbody tr:even" ).addClass("success");
		
		},
		error : function(e) {
			alert("ERROR: ", e);
			console.log("ERROR: ", e);
		}
	});
	
	// do Filter on View
	$("#inputFilter").on("keyup", function() {
	    var inputValue = $(this).val().toLowerCase();
	    $("#book_table tr").not('thead tr').filter(function() {
	    	$(this).toggle($(this).text().toLowerCase().indexOf(inputValue) > -1)
	    });
	});
})
//get book id which detail button click
function bdetail(id)
{
 document.getElementById("detail").value = id;
 //document.getElementById("detail_id").submit();
}
