function BF () {
	this.sequence = "";
	this.memory = [];
	this.breakPoints = [];
	this.output = "";
	this.memoryIndex = 0;
	this.sequenceIndex = -1;
	this.minIndex = 0;
	this.maxIndex = 0;
};


BF.prototype.reset = function() {
	this.memory = [];
	this.breakPoints = [];
	this.output = "";
	this.memoryIndex = 0;
	this.sequenceIndex = -1;
	this.minIndex = 0;
	this.maxIndex = 0;
};

BF.prototype.load = function(string) {
  	this.sequence = string;
  	this.normalize();
};

BF.prototype.normalize = function() {
  //chaine = chaine.substring(0, n) + chaine.substring(n + 1, chaine.length);
  for (var i = 0; i < this.sequence.length; i++) {
      if((this.sequence[i] != '>') && (this.sequence[i] != '<') && (this.sequence[i] != '+') && (this.sequence[i] != '-') && (this.sequence[i] != '.') && (this.sequence[i] != ',') && (this.sequence[i] != '[') && (this.sequence[i] != ']'))
      {
      	this.sequence = this.sequence.substring(0, i) + this.sequence.substring(i + 1, this.sequence.length);
      	i--;
      }
  }
};

BF.prototype.checkBracket = function() {
	var nbOfBracket = 0;
	for (var i = 0; i < this.sequence.length; i++) {
	    if(this.sequence[i] == '[')
	    	nbOfBracket++;
	    else if(this.sequence[i] == ']')
	    	nbOfBracket--;
	}

	if(nbOfBracket == 0)
		return true;
	else
		return false;
};

BF.prototype.findBracket = function(curr) {
	var nbOfBracket = 1;
	for (var i = curr + 1; i < this.sequence.length; i++) {
	    if(this.sequence[i] == '[')
	    	nbOfBracket++;
	    else if(this.sequence[i] == ']')
	    	nbOfBracket--;

	    if(nbOfBracket == 0)
	    	return i;
	}
}

BF.prototype.next = function() {
	if(this.sequenceIndex >= this.sequence.length){
		console.log("Stack Overflow");
		return;
	}

	/*
	>​ 	incrémente (augmente de 1) le pointeur.
	<​ 	décrémente (diminue de 1) le pointeur.
	+​ 	incrémente l'octet du tableau sur lequel est positionné le pointeur (l'octet pointé).
	-​ 	décrémente l'octet pointé.
	.​ 	sortie de l'octet pointé (valeur ASCII).
	,​ 	entrée d'un octet dans le tableau à l'endroit où est positionné le pointeur (valeur ASCII).
	[​ 	saute à l'instruction après le ] correspondant si l'octet pointé est à 0.
	]​ 	retourne à l'instruction après le [ si l'octet pointé est différent de 0.
	 */

	switch(this.sequence[this.sequenceIndex]) {
		  	case '>':
		  		(this.memoryIndex)++;
		  		if(this.memoryIndex > this.maxIndex){
		  			this.maxIndex = this.memoryIndex;
		  			this.memory[this.memoryIndex] = 0;
		  		}
		       		
		        break;
		  	case '<': 
		       	(this.memoryIndex)--;
		       	if(this.memoryIndex < this.minIndex){
		       		this.minIndex = this.memoryIndex;
		       		this.memory[this.memoryIndex] = 0;
		  		}
		        break;
		    case '+': 
		    	if(isNaN(this.memory[this.memoryIndex]))
		    		this.memory[this.memoryIndex] = 0;

		  		this.memory[this.memoryIndex]++;
		        break;
		  	case '-': 
		  		if(isNaN(this.memory[this.memoryIndex]))
		    		this.memory[this.memoryIndex] = 0;
		  		
		  		this.memory[this.memoryIndex]--;
		        break;
		  	case '.': 
		  		this.output += String.fromCharCode(this.memory[this.memoryIndex]);
		        break;
		  	case ',': 
		        this.memory[this.memoryIndex] = prompt("Please enter a single char").charCodeAt(0); 
		        break;
		    case '[':
		    	if(this.breakPoints.indexOf(this.sequenceIndex) == -1)
		    		this.breakPoints.push(this.sequenceIndex);
		    	if(this.memory[this.memoryIndex] == 0)
		    		this.sequenceIndex = this.findBracket(this.breakPoints.pop());
		        break;
		  	case ']':
		  		this.sequenceIndex = this.breakPoints[this.breakPoints.length-1]-1;
		        break;
	  	}
	  	this.sequenceIndex ++;
};

// BF.prototype.previous = function() {
// 	if(this.sequenceIndex < 0){
// 		console.log("Stack Overflow");
// 		return;
// 	}
// 	switch(this.sequence[this.sequenceIndex]) {
// 		  	case '>':
// 		  		(this.memoryIndex)--;	
// 		        break;
// 		  	case '<': 
// 		       	(this.memoryIndex)++;
// 		        break;
// 		    case '+': 
// 		    	this.memory[this.memoryIndex]--;
// 		        break;
// 		  	case '-': 
// 		  		this.memory[this.memoryIndex]++;
// 		        break;
// 		  	case '.': 
// 		  		this.output += String.fromCharCode(this.memory[this.memoryIndex]);
// 		        break;
// 		  	case ',': 
// 		        this.memory[this.memoryIndex] = prompt("Please enter a single char").charCodeAt(0); 
// 		        break;
// 		    case '[':
// 		    	if(this.breakPoints.indexOf(this.sequenceIndex) == -1)
// 		    		this.breakPoints.push([this.sequenceIndex,this.memory[memoryIndex]]);

// 		    	if(this.memory[this.memoryIndex] == 0)
// 		    		this.sequenceIndex = this.findBracket(this.breakPoints.pop()[0]);
// 		        break;
// 		  	case ']':
// 		  		this.sequenceIndex = this.breakPoints[this.breakPoints.length-1]-1;
// 		        break;
// 	  	}
// 	  	this.sequenceIndex --;
// };

