$(document).ready(function() {
	$('#error2').hide();
	
	
	 //var error=getUrlVars()["error"];
	// if(){
		
//	}
	
	
	
});
$('#submit').click(function(e) {
	var password = $("#password").val();
	if (password == "") {
		e.preventDefault();
		$('#error1').hide();
		$('#error2').show();
	}
});

/* function getUrlVars() {
          var decodedUri = decodeURIComponent(window.location.href);
          var vars = [], hash;
          var hashes = decodedUri.slice(decodedUri.indexOf('?') + 1).split('&');
          for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
          }
          return vars;
        }*/