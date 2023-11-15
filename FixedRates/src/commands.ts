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
    public freAddress="0xf26c6C93f9f1d725e149d95f8E7B2334a406aD10"
	
	constructor(signer: Signer, network: number, config?: Config) {
		this.signer = signer;
		//this.config = config || new ConfigHelper().getConfig(network);
		this.subgraphURL = getSubgraphURL(network)
        this.fre = new FixedRateExchange(this.freAddress,this.signer,network)
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
            const info=await this.fre.getFeesInfo(fre.exchangeId)
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
            const info=await this.fre.getFeesInfo(fre.exchangeId)
            console.log(info)
            //console.log(args)   
            if(info.marketFeeCollector.toLowerCase()==args[1].toLowerCase() && parseFloat(args[2])<=parseFloat(info.marketFeeAvailable)){
                console.log("Claiming...")
                const tx=await this.fre.collectMarketFee(fre.exchangeId)
                console.log("Claim tx: "+tx.hash)
                await this.signer.provider?.waitForTransaction(tx.hash,2)
                
                
            }
            else{
                console.log("Skip this one...")
            }
            
        }
    }

}