// main.js

const serverUrl = "https://un3rhs0thiej.usemoralis.com:2053/server";
const appId = "ncvYrSG6uFOwd9ae44XkI2TFOqzGphSqnAM6lW79";
const CONTRACT_ADDRESS = "0xf4a72f0f8abcf9902d434ba4accf83201052efb1";
let user;
Moralis.start({ serverUrl, appId });

/** Add from here down */

function fetchNFTMetaData(NFTs){
    let promises = [];
    for(let i = 0; i < NFTs.length; i++){
        let nft = NFTs[i];
        let id = nft.token_id;
        promises.push(fetch("https://un3rhs0thiej.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=ncvYrSG6uFOwd9ae44XkI2TFOqzGphSqnAM6lW79&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(res => {
            const options = { address: CONTRACT_ADDRESS, token_id: id ,chain: "rinkeby" };
            return Moralis.Web3API.token.getTokenIdOwners(options);
        })
        .then((res) => {
            nft.owners = [];
            res.result.forEach(element => {
                nft.owners.push(element.owner_of);
            });
            return nft;
        }))
    }
    return Promise.all(promises);
}

function renderInventory(NFTs,ownerData){
    const parent = document.getElementById("app");
    for(let i = 0; i < NFTs.length; i++){
        const nft = NFTs[i];
        let htmlToAdd = `
        <div class="card">
        <img class="card-img-top" src="${nft.metadata.image}"  style="width:250px; height:250px"  alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${nft.metadata.name}</h5>
            <p class="card-text">${nft.metadata.description}</p>
            <p class="card-text">No Of Token in circulation: ${nft.amount}</p>
            <p class="card-text">Your Balance: ${ownerData[nft.token_id]}</p>
            <p class="card-text">Number Of Owners: ${nft.owners.length}</p>
            <a href="/mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
            <a href="/transfer.html?nftId=${nft.token_id}" class="btn btn-secondary">Transfer</a>
        </div></div>`
        let col = document.createElement("div");
        col.className = "col col-md-4";
        col.innerHTML = htmlToAdd;
        parent.appendChild(col);
    }
}

async function getOwnerData(){
    let accounts = user.get('accounts');
    const options = { chain: 'rinkeby', address: accounts[0], token_address: CONTRACT_ADDRESS };
    return await Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
        let result = data.result.reduce((object,element) => {
            object[element.token_id] = element.amount
            return object
        },{});
        console.log(result);
        return result;  
    })
}

async function login() {
    user = Moralis.User.current();
    if (!user) {
        try {
            user = await Moralis.authenticate({ signingMessage: "Hello World!" })
            console.log(user)
            console.log(user.get('ethAddress'))
        } catch(error) {
            console.log(error)
        }
    }
    const options = { address: CONTRACT_ADDRESS, chain: "rinkeby" };
    const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetaData = await fetchNFTMetaData(NFTs.result);
    let ownerData = await getOwnerData();
    renderInventory(NFTWithMetaData, ownerData);
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

login();
document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;