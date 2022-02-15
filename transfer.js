const serverUrl = "https://un3rhs0thiej.usemoralis.com:2053/server";
const appId = "ncvYrSG6uFOwd9ae44XkI2TFOqzGphSqnAM6lW79";
const CONTRACT_ADDRESS = "0xf4a72f0f8abcf9902d434ba4accf83201052efb1";
Moralis.start({ serverUrl, appId });

async function init(){
    let currentUser = Moralis.User.current();
    if(!currentUser){
        window.location.pathname = '/index.html';
    }
    address = Moralis.User.current().get("ethAddress")
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token_id_input").value = nftId;
}

async function transfer(){
    let token_id = document.getElementById("token_id_input").value;
    let amount = (document.getElementById("amount_input")) ? Number(document.getElementById("amount_input").value) : null;
    let address = document.getElementById("address_input").value;
    // sending 15 tokens with token id = 1
    const options = {
        type: "erc1155",  
        receiver: address,
        contractAddress: CONTRACT_ADDRESS,
        tokenId: token_id,
        amount: amount
    }
    console.log(options);
    await Moralis.enableWeb3();   
    let transaction = await Moralis.transfer(options)
    const result = await transaction.wait();
    console.log(result);









    // const sendOptions = {
    //     contractAddress: CONTRACT_ADDRESS,
    //     functionName: "mint",
    //     abi: contractAbi,
    //     params: {
    //       account: Moralis.User.current().get("ethAddress") ,
    //       id: token_id,
    //       amount: amount 
    //     },
    // };
    // await Moralis.enableWeb3();   
    // const transaction = await Moralis.executeFunction(sendOptions);
    // await transaction.wait();
    // // Read new value
    // const message = await Moralis.executeFunction(sendOptions);
    // console.log(message)
}

document.getElementById("submit_transfer").onclick = transfer;

init();