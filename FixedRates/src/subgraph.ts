import fetch from "cross-fetch";
export function getSubgraphURL(chainId:number):string{
    let url:string
    switch(chainId){
        case 1: url="https://v4.subgraph.mainnet.oceanprotocol.com";break;
        case 5: url="https://v4.subgraph.goerli.oceanprotocol.com";break;
        case 137: url="https://v4.subgraph.polygon.oceanprotocol.com";break;
        case 80001: url="https://v4.subgraph.mumbai.oceanprotocol.com";break;
        case 56: url="https://v4.subgraph.bsc.oceanprotocol.com";break;
        case 246: url="https://v4.subgraph.energyweb.oceanprotocol.com";break;
        case 1285: url="https://v4.subgraph.moonriver.oceanprotocol.com";break;
        case 23294: url="https://v4.subgraph.sapphire-mainnet.oceanprotocol.com";break;
        default: url=''
    }
    return url
}


export async function fetchAllFre(subgraphURL){
    let skip = 0
    let myallocs=[]
    let fixedRateExchanges:any=[]
    do {
        const query = {
            query: `query{
                fixedRateExchanges(skip:${skip}, first:1000){
                  id
                  contract
                  exchangeId
                  publishMarketFeeAddress
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
        if (!respJSON.data || respJSON.data.fixedRateExchanges.length < 1) {
            break
        }
        for(const fre of respJSON.data.fixedRateExchanges){
            fixedRateExchanges.push({
                id:fre.id,
                contract:fre.contract,
                exchangeId: fre.exchangeId,
                publishMarketFeeAddress: fre.publishMarketFeeAddress
            }

            )
        }
    }
    while(true)
    return(fixedRateExchanges)
}
