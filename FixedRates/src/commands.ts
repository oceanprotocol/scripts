import {
    FixedRateExchange,
	Config,
	ConfigHelper,
	amountToUnits,
	sendTx,
    decimals,
} from "@oceanprotocol/lib";
import { getSubgraphURL,fetchAllFre } from "./subgraph";
import { Signer, ethers } from "ethers";
import { exit } from "process";

export class Commands {
	public signer: Signer;
	//public config: Config;
    public subgraphURL:string
    public fre:FixedRateExchange
    public network:any
	
	constructor(signer: Signer, network: number, config?: Config) {
		this.signer = signer;
		//this.config = config || new ConfigHelper().getConfig(network);
		this.subgraphURL = getSubgraphURL(network)
        this.network=network
	}
	// utils
	public async sleep(ms: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	// commands
    public async showAll(){
        const fres:any=await fetchAllFre(this.subgraphURL)
        for(const fre of fres){
            const fixedContract = new FixedRateExchange(fre.contract,this.signer,this.network)
            const info=await fixedContract.getFeesInfo(fre.exchangeId)
            console.log(info)
        }
        
    }
    public async claimOPC(args: string[]){

    }
    public async claimPublishMarket(args: string[]){
        if(args.length<3){
            console.error("Not enough params")
            return
        }
        const fres:any=await fetchAllFre(this.subgraphURL)
        for(const fre of fres){
            const fixedContract = new FixedRateExchange(fre.contract,this.signer,this.network)
            const info=await fixedContract.getFeesInfo(fre.exchangeId)
            console.log(info)
            //console.log(args)   
            if(info.marketFeeCollector.toLowerCase()==args[1].toLowerCase() && parseFloat(args[2])<=parseFloat(info.marketFeeAvailable)){
                console.log("Claiming...")
                const tx=await fixedContract.collectMarketFee(fre.exchangeId)
                console.log("Claim tx: "+tx.hash)
                await this.signer.provider?.waitForTransaction(tx.hash,2)
                
                
            }
            else{
                console.log("Skip this one...")
            }
            
        }
    }

}