pragma solidity^0.4.24;

/**
* @title TxSimulation - Mocks contract's reaction to an incoming msg.value in wei
* @dev  This contract allows a Transaction Simulation feature allowing customers/users 
*       to simulate the send of an ether value to the contract.
* 
*/
contract TxSimulation {
    /** 
    * @dev Price of one token in wei
    * @notice : Token price in wei must be stored as : uint tokenPriceInWei = _weisPerToken(_publicPricePerEth)
    */
    uint internal tokenPriceInWei;

    /**
    * @dev MUST return the current available supply in any way (including decimals)
    */
    function availableSupply() public view returns(uint) {
        return;
    }

    /**
    * @dev Renders wei value of one token from its price for one ether
    * @param _pricePerEth Token amount distributed vs one ether (literal) 
    * @return wei price of one token
    */
    function _weisPerToken(uint _pricePerEth) internal view returns(uint) {
        return (1000000000000000000 / _pricePerEth);
    }
    
    /**
     * @dev Allows the contract owner to setup / change the token price
     * @param _newPrice the litteral new price per ether ( ex : 1500 ) 
     * @notice MUST include no decimals
     */
    function setPricePerEth(uint _newPrice) external /*tokenReady ownerOnly*/ {
        tokenPriceInWei = _weisPerToken(_newPrice);
    }

  
    /**
     * @dev Simulate / Mocks a Transaction / Reaction to an incoming msg.value to a payable function 
     * @param incomingValue mocking the incoming msg.value of a payable function
     * @return amountToBePaid Wei amount that would finally be paid by client
     * @return tokenAmount Amount of tokens which is possible to buy for incoming transfer/payment
     * @return refund Eventual wei amount to refund to msg.sender
     * @notice can be used to distribute tokens as it implements failsafes / overflows check
     */
    function simulateTX(uint incomingValue) public view returns(uint amountToBePaid, uint tokenAmount, uint refund) {
        
        uint available_supply = availableSupply();
        uint amountTransfered = incomingValue;
        uint delta;

        tokenAmount = (amountTransfered / tokenPriceInWei) * 10 ** decimals;
        
        if (tokenAmount > 0) {	// check unlegitimate overflow 
        
            if (tokenAmount > available_supply) {	// if legitimate supply overflow
            
                delta = tokenAmount - available_supply;	// delta in tokens
                tokenAmount = available_supply;
        
                if (delta > 0) { 		// if a refund is needed
                    refund = (delta * tokenPriceInWei) / 10 ** decimals;
                    amountToBePaid = amountTransfered - refund;
                }
            
            } else { // normal treatment
                amountToBePaid = amountTransfered;            
            }
            
        } else {	// sale is impossible no tokens to sale
            refund = amountTransfered;
            tokenAmount = 0;  // check for overflow jic
        }

        assert(
            refund <= incomingValue &&
            amountToBePaid <= incomingValue
        );
    }
    
}
