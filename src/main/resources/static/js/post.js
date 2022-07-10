$('#submit').click(function(e) {
	var message = $("#message").val();
	if (message == "") {
		e.preventDefault();
		$.alert({
			title: 'Message is Empty!',
			content: 'Please Enter Message',
		});
	}
});
$('#deletebtn').click(function(e) {
	e.preventDefault();
	$.confirm({
		title: 'Delete!',
		content: 'Do You Want To Delete This?',
		buttons: {
			Yes: function() {
				$('#deletebtn').closest('form').submit();
			},
			No: function() { }
		}
	});
});