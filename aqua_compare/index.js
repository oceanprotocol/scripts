
var sha256 = require("crypto-js/sha256");
const fetch=require('cross-fetch')
const web3=require('web3')

const networks=[
    { 
        chainId:1,
        subgraphURL:"https://v4.subgraph.mainnet.oceanprotocol.com",
        aquariusURLs:[
            "https://v4.aquarius.oceanprotocol.com",
            "https://v4-2.aquarius.oceanprotocol.com"
        ]
    },
    { 
        chainId:5,
        subgraphURL:"https://v4.subgraph.goerli.oceanprotocol.com",
        aquariusURLs:[
            "https://v4.aquarius.oceanprotocol.com",
            "https://v4-2.aquarius.oceanprotocol.com"
        ]
    },
    { 
        chainId:137,
        subgraphURL:"https://v4.subgraph.polygon.oceanprotocol.com",
        aquariusURLs:[
            "https://v4.aquarius.oceanprotocol.com",
            "https://v4-2.aquarius.oceanprotocol.com"
        ]
    },
    { 
        chainId:80001,
        subgraphURL:"https://v4.subgraph.mumbai.oceanprotocol.com",
        aquariusURLs:[
            "https://v4.aquarius.oceanprotocol.com",
            "https://v4-2.aquarius.oceanprotocol.com"
        ]
    }
]



async function fetchAllNft(subgraphURL){
    let skip = 0
    let myallocs=[]
    let nfts=[]
    do {
        const query = {
            query: `query{
                        nfts(skip:${skip}, first:1000){
                            id
                        }
                    }`
        }
        const response = await fetch(subgraphURL+"/subgraphs/name/oceanprotocol/ocean-subgraph", {
            method: 'POST',
            body: JSON.stringify(query)
        })
        const respJSON = await response.json()
        
        //console.log(respJSON)
        skip = skip + 1000
        if (!respJSON.data || respJSON.data.nfts.length < 1) {
            break
        }
        for(nft of respJSON.data.nfts){
            nfts.push(nft.id)
        }
    }
    while(true)
    return(nfts)
}


async function fetchDDO(did,aquariusURLs){
    const url=aquariusURLs+"/api/aquarius/assets/ddo/"+did
    let ddo
    try{
        const response = await fetch(url, {
            method: 'GET'
        })
        //console.log(url)
        ddo=await response.json()
        if(ddo.error){
            return null
        }
    }
    catch(e){
        //console.log(e)
        return null
    }
    return(ddo)
}

async function doCompare(){
    for(network of networks){
        //console.log(network)
        const nfts=await fetchAllNft(network.subgraphURL)
        console.log("Got "+nfts.length+" nfts on chain "+network.chainId+" from graph, searching for DDO in both aquarius...")
        let missingboth=0
        let missing1=0
        let missing2=0
        for(nft of nfts){
            //console.log("NFT:"+nft)
            const hash=sha256(web3.utils.toChecksumAddress(nft) + network.chainId.toString(10))
            const did="did:op:"+hash
            //console.log("Fetching "+did)
            const ddo_aqua1=await fetchDDO(did,network.aquariusURLs[0])
            const ddo_aqua2=await fetchDDO(did,network.aquariusURLs[1])
            if(!ddo_aqua1 && !ddo_aqua2) {
                //console.log("\tFailed to grab "+did+" from both aqua")
                missingboth++
                continue
            }
            if(ddo_aqua1 && !ddo_aqua2){
                console.log("\tDID "+did+" found in aqua1, but not found in aqua2")
                missing2++
            }
            if(!ddo_aqua1 && ddo_aqua2){
                console.log("\tDID "+did+" not found in aqua1, but found in aqua2")
                missing1++
            }
        }
        console.log("   Not found in both: "+missingboth+", Missing from aqua1: "+missing1+", Missing from aqua2: "+missing2)
        console.log("\n\n")
    }
}


doCompare()