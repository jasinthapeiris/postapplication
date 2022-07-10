$('#submit').click(function(e) {
	var message = $("#message").val();
	if (message == "") {
		e.preventDefault();
		$.alert({
			title: 'Empty Message!',
			content: 'Please Enter Message',
		});
	}
});
$('#deletebtn').click(function(e) {
	e.preventDefault();
	$.confirm({
		title: 'Delete!',
		content: 'Please Confirm Delete Message',
		buttons: {
			confirm: function() {
				$('#deletebtn').closest('form').submit();
			},
			cancel: function() { }
		}
	});
});