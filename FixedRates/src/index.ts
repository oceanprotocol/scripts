import { ethers } from "ethers";
import { Commands } from "./commands";


if (!process.env.MNEMONIC && !process.env.PRIVATE_KEY) {
	console.error("Have you forgot to set MNEMONIC or PRIVATE_KEY?");
	process.exit(0);
}
if (!process.env.RPC) {
	console.error("Have you forgot to set env RPC?");
	process.exit(0);
}

function help() {
	console.log("Available options:");

	console.log("\t showAll - show all FixedRates");
    console.log("\t claimOPC MIN_AMOUNT- claim all OPC fees if fees>= MIN_AMOUNT");
    console.log("\t claimPublishMarket PUBLISH_MARKET_ADDRESS MIN_AMOUNT- claim all fees for a specific publish market if fees>= MIN_AMOUNT");

}

async function start() {
	const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
	console.log("Using RPC: " + process.env.RPC);
	let signer;
	if (process.env.PRIVATE_KEY)
		signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
	else {
		signer = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
		signer = await signer.connect(provider);
	}
	console.log("Using account: " + (await signer.getAddress()));

	const { chainId } = await signer.provider.getNetwork();
	const commands = new Commands(signer, chainId);
	const myArgs = process.argv.slice(2);
	switch (myArgs[0]) {
		case "showAll":
			await commands.showAll();
			break;
        case "claimOPC":
            await commands.claimOPC(myArgs);
            break;
        case "claimPublishMarket":
            await commands.claimPublishMarket(myArgs);
            break;
		case "h":
			help();
			break;
		default:
			console.error("Not sure what command to use ? use h for help.");
			break;
	}
	process.exit(0);
}

start();