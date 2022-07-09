$(document).ready(function () {
    $("#error1").hide();
    $("#error2").hide();

	const error = getUrlVars()["error"];

	if (error === "error1") {
        $('#error1').show();
        $('#error2').hide();
    }
});

$('#submit').click(function (e) {
	const password = $("#password").val();
	if (password === "") {
        e.preventDefault();
        $('#error1').hide();
        $('#error2').show();
    }
});

function getUrlVars() {
	const decodedUri = decodeURIComponent(window.location.href);
	let vars = [], hash;
	const hashes = decodedUri.slice(decodedUri.indexOf('?') + 1).split('&');

	for (let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}