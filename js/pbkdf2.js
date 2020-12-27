document.addEventListener('DOMContentLoaded', function () {  // wait for the DOM to be loaded
	
	const passwd = document.getElementById("passwd");
	const passwdLen = document.getElementById("passwdLen");
	passwd.addEventListener("input", process);
	
	const salt = document.getElementById("salt");
	const saltLen = document.getElementById("saltLen");
	salt.addEventListener("input", process);
	
	const func = document.getElementById("func");
	const rounds = document.getElementById("rounds");
	const keySize = document.getElementById("keySize");
	
	const buttonProcess = document.getElementById("buttonProcess");
	buttonProcess.addEventListener("click", process);
	
	const hex = document.getElementById("hex");
	const hexLen = document.getElementById("hexLen");

});

function process() {
	
	clearData();
	
	passwdLen.innerHTML = " - " + passwd.value.length + " characters";

	if (isPositiveInteger(rounds.value) == false) {
		alert("Rounds must be a positive integer");
	}
	
	var i;
	var passwdBits = sjcl.codec.utf8String.toBits(passwd.value);
	var saltBits = sjcl.codec.utf8String.toBits(salt.value);
	
	switch (func.value) {
		case "sha1":
			hash = sjcl.hash.sha1;
			break;
		case "sha256":
			hash = sjcl.hash.sha256;
			break;
		case "sha512":
			hash = sjcl.hash.sha512;
	}
	
	bits = sjcl.misc.pbkdf2(passwdBits, saltBits, rounds.value, keySize.value, sjcl.misc.hmac, hash)
	hex.value = sjcl.codec.hex.fromBits(bits);
	
	var bitsPerChar = 0;
	var guessesPerSec = 1e14;  // Online Attack Scenario: 10^3 ; Offline Fast Attack Scenario: 10^11 ; Massive Cracking Array Scenario: 10^14
	var yearsSearch = 0.0;
	var sep = "\xa0\xa0■\xa0\xa0";
	
	bitsPerChar = hex.value.length * 4;
	digitPerChar = bitsPerChar * Math.log10(2);
	yearsSearch = Math.pow(10, digitPerChar-Math.log10(guessesPerSec)) / (3600*24*365);
	hexLen.innerHTML = sep + hex.value.length + " characters" + sep + bitsPerChar + " bits" + sep + "Space size = 2^" + bitsPerChar + " = 10^" + digitPerChar.toFixed(1) + sep + "Brute force: " + yearsSearch.toPrecision(2) +" years of exhausting search at 10^" + Math.log10(guessesPerSec) + " guesses/s";
}

function clearData() {
	hex.value = "1";
}

function isPositiveInteger(n) {
	return 0 === n % (!isNaN(parseFloat(n)) && 0 <= ~~n);
}