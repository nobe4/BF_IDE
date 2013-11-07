$(document).ready(function() {
	var bf = new BF();
	var keepRunning = true;
	
	//first display
	$("#inputText").val("++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.<.");
	
	var defaultScript = ["++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.",
	"++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>----. >++++++++++++++. -----------------. ++++++++. +++++. <<++. >++++. >+++++++. ------------------. ++++++++. <<. >+++. -----. +.",
	": ++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>>+++++++++++++++++++. ---------------. +. +++. -------. <<++++++++++. >>+++++++++++++++. --. +++. ----------------. <<+. >>++++++++++++++++++++++. <<++++++. . >>-------------. +. +++++. ------------. +. +++++. -------. <<---------------. >>+++++++++++++. -----. <<. >>-----------. +++++++++++. ++++++++++++++."];


	function reset () {
		bf.reset();
		updateBFScript();
		updateDebug();
		displayStep();
		$("#memoryDisplay").find("td:not(:nth-child(1))").remove();
		$('#outputText').text("");
		keepRunning = false;
		showCurrentOperation();
	};

	reset();

	function printOutput(string,out){

		out.text("");

		var lines = string.split('\n');

		for (var i = 0; i < lines.length; i++) {
		    out.append(lines[i]);

		    if(i < lines.length - 1) 
		    	out.append('<br>');
		}

	};

	function processNext (show) {
		bf.next();
		
		if(show)
		{
			printOutput(bf.output,$('#outputText'))

			if( keepRunning && (bf.sequenceIndex != bf.sequence.length) )
				setTimeout(function(){processNext(show)}, $('#speedSelect').val());

			displayMemory();
			displayStep();
			showCurrentOperation();
		}
		else
		{
			if(bf.sequenceIndex != bf.sequence.length)
				processNext(false);
			else
			{
				printOutput(bf.output,$('#outputText'))
				displayMemory();
				displayStep();
				showCurrentOperation();
			}	
		}
	};

	$('#playButton').click(function () {
		console.log('playButton clicked');
		if(keepRunning == false)
		{
			bf.reset();
			keepRunning = true;
			processNext(true);
		}
	});

	$('#nextButton').click(function () {
		console.log("nextButton clicked");
		keepRunning = false;
		processNext(true);
	});

	$('#fastButton').click(function () {
		console.log("fastButton clicked");
		if(keepRunning == false)
		{
			keepRunning = true;
			processNext(false);
		}
	});

	$('#pauseButton').click(function () {
		if(keepRunning == true)
			keepRunning = false;
	});

	$('#stopButton').click(function () {
		if(keepRunning == true)
			keepRunning = false;

		reset();
	});

	$('#continueButton').click(function () {
		console.log("continueButton clicked");
		if(keepRunning == false)
		{
			keepRunning = true;
			processNext(true);
		}
	});


	$('.exampleButton').click(function () {
		setScript(defaultScript[$(this).attr("value")]);
	});

	//update when we enter a new symbole
	$('#inputText').keyup(function () {
		console.log('inputText focus');
		reset();
	});


	$('#saveAndGenerate').click(function () {
		console.log('saveAndGenerate clicked');
		$('#generationInput').val(createScript($('#generationInput').val()));
	});

	function colorizeScript (sequence,obj) {
		var t,color;
		obj.text("");
		for (var i = 0; i < sequence.length; i++) {
			t = sequence[i];
			switch(t) {
				case '+':
				color = "purple";
				break;
				case '-':
				color = "red";
				break;
				case '>':
				color = "blue";
				break;
				case '<':
				color = "teal";
				break;
				case '[':
				color = "black";
				break;
				case ']':
				color = "black";
				break;
				case '.':
				color = "green";
				break;
				case ',':
				color = "lime";
				break;
				default:
				color = "silver";
				break;
			}
			obj.append("<font color='" + color + "'>"+t+"</font>");
			if((i+1)%30 == 0)
				obj.append("<br>");
		}
	};

	function updateBFScript () {
		console.log("updateBFScript");
		bf.load($('#inputText').val());
		colorizeScript(bf.sequence,$('#outputScript'));
		$('#scriptLenght').text(bf.sequence.length);
	};

	function updateDebug() {
		console.log("updateDebug");
		
		var debugString = "";

		if(bf.checkBracket() == false)
			debugString += "Wrong number of brackets.";

		if (debugString == "")
			debugString = "Everything is under control !";

		$('#debugOutput').text(debugString);
	};

	function displayMemory () {
		console.log("displayMemory");
		//deleting all column except the first one
		$("#memoryDisplay").find("td:not(:nth-child(1))").remove();
		for (var i = bf.minIndex ; i < bf.maxIndex + 1; i++)
		{
			if(i == bf.memoryIndex)
				$('#currentIndex').append($('<td><a class="icon-arrow-down"></a></td>'));
			else
				$('#currentIndex').append($('<td></td>'));

			$('#indexTable').append($('<td></td>').text(i));
			$('#asciiTable').append($('<td></td>').text(bf.memory[i]));
			$('#charTable').append($('<td></td>').text(String.fromCharCode(bf.memory[i])));
		}

		var s = "[ ";
		for (var i = 0; i < bf.breakPoints.length; i++) {
			s += bf.breakPoints[i] + " ";
		}
		s += "]";

		$('#bPointDisplay').text(s);
	};

	function showCurrentOperation () {
		if(bf.sequenceIndex == -1)
			$('#currentFunction').text("Start");
		else if(bf.sequenceIndex == bf.sequence.length)
			$('#currentFunction').text("End");
		else{
			switch(bf.sequence[bf.sequenceIndex]) {
				case '+':
				$('#currentFunction').text("Increase memory value");
				break;
				case '-':
				$('#currentFunction').text("Decrease memory value");
				break;
				case '>':
				$('#currentFunction').text("Moving right in the memory");
				break;
				case '<':
				$('#currentFunction').text("Moving left in the memory");
				break;
				case '[':
				$('#currentFunction').text("Breakpoint first node");
				break;
				case ']':
				$('#currentFunction').text("Breakpoint second node");
				break;
				case '.':
				$('#currentFunction').text("Printing memory's value");
				break;
				case ',':
				$('#currentFunction').text("Entering memory's value");
				break;
			}
		}
	};

	function displayStep () {
		console.log("displayStep");
		var string = bf.sequence;
		var pre = string.substring(0,bf.sequenceIndex);
		var post = string.substring(bf.sequenceIndex + 1, bf.sequence.length);
		var step = string.charAt(bf.sequenceIndex);

		if(pre == "") pre ="_";
		if(post == "") post ="_";
		if(step == "") step = "_";

		colorizeScript(pre,$('#preDisplay'));
		colorizeScript(post,$('#postDisplay'));
		colorizeScript(step,$('#stepDisplay'));
	};

	function setScript (script) {
		$('#inputText').val(script);
		reset();
	};

	function createScript (string) {
		var code = "";
		var lastCharCode; 
		var x;
		var instr = "+";
		var currentChar;

		for (var i=0; i<string.length; i+=1) {

		    currentChar = string.charCodeAt(i);
		    
		    if (currentChar > 255) {
		    	return "Code de caractÃ¨re supÃ©rieur Ã  255 au bit "+(i+1)+": "+string[i];
		    }
		    
		    if (i > 0) {
		    	x = currentChar - lastCharCode;
		    }
		    else {
		    	x = currentChar;
		    }
		    
		    if (x < 0) {
		    	instr = "-";
		    }
		    else if (x > 0) {
		    	instr = "+";
		    }
		    else {
		    	instr = "";
		    }

		    lastCharCode = currentChar;
		    
		    for (var j=0; j<Math.abs(x); j+=1) {
		    	code += instr;
		    }
		    code += ".";
		}

	code += "[-]";

	  return code;
	};

});