DISPLAY = (elem) => { 
  var box = document.getElementById('response');
  if (elem) {
    var domElem = document.createElement('DIV');
    domElem.innerHTML = elem;
    box.appendChild(domElem);
    box.appendChild(document.createTextNode('---------'));
  }
}
                  
                  
/////////////// | Token Public Values | /////////////// (as submitted front-side)
  
  // supply without decimals (but contract storage MUST implement decimals)
  var maxSupply = 2000000;																														
  var decimals = 4;																																
	

/////////////// | Smart Contract MOCKING | ///////////////
  //* mocking 10 ** decimals
    var DECIMALS_COUNT = () => {
     return Math.pow(10, decimals);
    }
  //*
  
  //* mocking availableSupply()
    // can be divided to simulate a supply variation
    var availableSupply = (maxSupply/* dividedby x */) * DECIMALS_COUNT(); 
    DISPLAY('availableSupply: '+availableSupply);
  //*
  
  //* mocking the wei value of one ether
  	var ONE_ETHER = 1000000000000000000;							// 1 ether in wei
  //*
  
  //* mocking solidity _weiPerToken function
  function _weisPerToken(_pricePerEth) {//internal view returns(uint) {
    return (ONE_ETHER / _pricePerEth);
  }
  //* mocking tokenPriceInWei contract storage
  // as stored by contract, 
  var tokenPriceInWei = _weisPerToken(2500);				// 2500 Tokens / Ethereum			
  //*

  //* mocking _tokenPricePerEth()		
  _tokenPricePerEth = () => {
    DISPLAY('tokenPriceInWei: '+tokenPriceInWei)
    // price with no decimals
    let realPrice = _weisPerToken(tokenPriceInWei) * DECIMALS_COUNT();
  
    DISPLAY(parseInt(realPrice)+' tkn vs 1 eth'); 
    return realPrice;
  }
  //*
  
  ///
  var tokenPricePerEth_FUNCTION_RETURN = _tokenPricePerEth();
  DISPLAY('tokenPricePerEth_FUNCTION_RETURN: '+tokenPricePerEth_FUNCTION_RETURN)
  ///
 
  
                            /////////////// | FUNCTION | ///////////////
  
  simulateTX = (incomeValue) => {
  DISPLAY('<hr>--- msg.value in wei --- <br>'+incomeValue+'<br>'+incomeValue / ONE_ETHER+' ether');
  
  var amountTransfered = incomeValue;
  var tokenAmount;
 	var amountToBePaid;
  var refund;
  
  tokenAmount = (amountTransfered / tokenPriceInWei) * DECIMALS_COUNT();
  DISPLAY('* Supposed tokenAmount *<br>'+tokenAmount);
  
  if (tokenAmount > 0) {	// check unlegitimate overflow 
  
    if (tokenAmount > availableSupply) {	// if legitimate supply overflow
    DISPLAY('<h2 class="red">* OVERFLOW CASE *</h3>');
      
      var delta = tokenAmount - availableSupply;	// delta in tokens
      DISPLAY('* delta *<br> '+delta);
  
      tokenAmount = availableSupply;
  
      
     	if (delta > 0) 		// if a refund is needed
        refund = (delta * tokenPriceInWei) / DECIMALS_COUNT();
      	amountToBePaid = amountTransfered - refund;
      
    	} else {
    		// normal treatment
    		amountToBePaid = amountTransfered;
        // return all datas
    	}
    
  } else {	// sale is impossible no tokens to sale
  	refund = amountTransfered;
    tokenAmount = 0;	// check for oveflow here too (jic)
    
  }

  DISPLAY('* refund *<br>'+refund / ONE_ETHER+' ether');
 	DISPLAY('* tokenAmount to send *<br>'+tokenAmount + ' (' +tokenAmount / DECIMALS_COUNT()+')' );
	DISPLAY('* amountToBePaid *<br>'+amountToBePaid+' wei<br>'+amountToBePaid / ONE_ETHER + ' ether');
  
  }
  ///
  
  
/////////////// | TEST | ///////////////
                  
simulateTX(ONE_ETHER*1.5);			// simulate the send of 1.5 ether
  
 
