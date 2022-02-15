const serverUrl = "https://un3rhs0thiej.usemoralis.com:2053/server";
const appId = "ncvYrSG6uFOwd9ae44XkI2TFOqzGphSqnAM6lW79";
const CONTRACT_ADDRESS = "0xf4a72f0f8abcf9902d434ba4accf83201052efb1";
Moralis.start({ serverUrl, appId });

let web3;

async function init(){
    let currentUser = Moralis.User.current();
    if(!currentUser){
        window.location.pathname = '/index.html';
    }
    address = Moralis.User.current().get("ethAddress")
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token_id_input").value = nftId;
    document.getElementById("address_input").value = address;
}

async function mint(){
    let token_id = document.getElementById("token_id_input").value;
    console.log(token_id);
    let amount = (document.getElementById("amount_input")) ? Number(document.getElementById("amount_input").value) : null;
    const sendOptions = {
        contractAddress: CONTRACT_ADDRESS,
        functionName: "mint",
        abi: contractAbi,
        params: {
          account: Moralis.User.current().get("ethAddress") ,
          id: token_id,
          amount: amount 
        },
    };
    await Moralis.enableWeb3();   
    const transaction = await Moralis.executeFunction(sendOptions);
    await transaction.wait();
    // Read new value
    const message = await Moralis.executeFunction(sendOptions);
    console.log(message)
}

document.getElementById("submit_mint").onclick = mint;

init();