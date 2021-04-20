document.addEventListener('DOMContentLoaded', function () {  // wait for the DOM to be loaded
	
	const inputText = document.getElementById("inputText");
	const inputTextLen = document.getElementById("inputTextLen");
	inputText.addEventListener("input", process);
	
	const buttonProcess = document.getElementById("buttonProcess");
	buttonProcess.addEventListener("click", process);
	
	const func = document.getElementById("func");
	const rounds = document.getElementById("rounds");
	const substrEnable = document.getElementById("substrEnable");
	const substrStart = document.getElementById("substrStart");
	const substrLen = document.getElementById("substrLen");
	
	const hex = document.getElementById("hex");
	const hexLen = document.getElementById("hexLen");
	const bytes = document.getElementById("bytes");
	const bytesLen = document.getElementById("bytesLen");
	const base32 = document.getElementById("base32");
	const base32Len = document.getElementById("base32Len");
	const base64 = document.getElementById("base64");
	const base64Len = document.getElementById("base64Len");

});

function process() {
	
	clearData();
	
	inputTextLen.innerHTML = " - " + inputText.value.length + " characters";

	if (isPositiveInteger(rounds.value) == false) {
		alert("Rounds must be a positive integer");
	}
	
	var i;
	var bits = sjcl.codec.utf8String.toBits(inputText.value);
	
	for (i = 1; i <= rounds.value; i++) {
		switch (func.value) {
			case "sha1":
				bits = sjcl.hash.sha1.hash(bits);
				break;
			case "sha256":
				bits = sjcl.hash.sha256.hash(bits);
				break;
			case "sha512":
				bits = sjcl.hash.sha512.hash(bits);
		}
		console.log(func.value + " round " + i + ": " + transform(sjcl.codec.hex.fromBits(bits)));
	}
	
	var bitsPerChar = 0;
	var guessesPerSec = 1e14;  // Online Attack Scenario: 10^3 ; Offline Fast Attack Scenario: 10^11 ; Massive Cracking Array Scenario: 10^14
	var yearsSearch = 0.0;
	var sep = "\xa0\xa0■\xa0\xa0";
	
	hex.value = transform(sjcl.codec.hex.fromBits(bits));
	bitsPerChar = hex.value.length * 4;
	digitPerChar = bitsPerChar * Math.log10(2);
	yearsSearch = Math.pow(10, digitPerChar-Math.log10(guessesPerSec)) / (3600*24*365);
	hexLen.innerHTML = sep + hex.value.length + " characters" + sep + bitsPerChar + " bits" + sep + "Space size = 2^" + bitsPerChar + " = 10^" + digitPerChar.toFixed(1) + sep + "Brute force: " + yearsSearch.toPrecision(2) +" years of exhaustive search at 10^" + Math.log10(guessesPerSec) + " guesses/s";
	
	bytes.value = sjcl.codec.bytes.fromBits(sjcl.codec.hex.toBits(hex.value));
	bytesLen.innerHTML = sep + Math.ceil(hex.value.length/2) + " bytes";
	
	base32.value = transform(sjcl.codec.base32.fromBits(bits, true));
	bitsPerChar =  base32.value.length * 5;
	digitPerChar = bitsPerChar * Math.log10(2);
	yearsSearch = Math.pow(10, digitPerChar-Math.log10(guessesPerSec)) / (3600*24*365);
	base32Len.innerHTML = sep + base32.value.length + " characters" + sep + bitsPerChar + " bits" + sep + "Space size = 2^" + bitsPerChar + " = 10^" + digitPerChar.toFixed(1) + sep + "Brute force: " + yearsSearch.toPrecision(2) +" years of exhaustive search at 10^" + Math.log10(guessesPerSec) + " guesses/s";
	
	base64.value = transform(sjcl.codec.base64.fromBits(bits, true));
	bitsPerChar = base64.value.length * 6;
	digitPerChar = bitsPerChar * Math.log10(2);
	yearsSearch = Math.pow(10, digitPerChar-Math.log10(guessesPerSec)) / (3600*24*365);
	base64Len.innerHTML = sep + base64.value.length + " characters" + sep + bitsPerChar + " bits" + sep + "Space size = 2^" + bitsPerChar + " = 10^" + digitPerChar.toFixed(1) + sep + "Brute force: " + yearsSearch.toPrecision(2) +" years of exhaustive search at 10^" + Math.log10(guessesPerSec) + " guesses/s";
}

function clearData() {
	hex.value = "1";
	base32.value = "";
	base64.value = "";
	bytes.value = "";
}

function isPositiveInteger(n) {
	return 0 === n % (!isNaN(parseFloat(n)) && 0 <= ~~n);
}

function transform(str) {
	if (substrEnable.checked == true) {
		str = str.substr(substrStart.value, substrLen.value)
	}
	return str
}