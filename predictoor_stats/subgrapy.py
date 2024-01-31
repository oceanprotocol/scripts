import os
import requests
import time
from tabulate import tabulate


SUBGRAPH_URL="http://v4.subgraph.sapphire-mainnet.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph"

def query_subgraph(query):
    request = requests.post(SUBGRAPH_URL, "", json={"query": query}, timeout=1.5)
    if request.status_code != 200:
        # pylint: disable=broad-exception-raised
        raise Exception(
            f"Query failed. Url: {SUBGRAPH_URL}. Return code is {request.status_code}\n{query}"
        )
    result = request.json()
    return result

def get_contracts():
    contracts=[]
    query = """
        {
        predictContracts{
                id
                token{
                    name
                }
                secondsPerEpoch
        }
        }
        """
    try:
        result = query_subgraph( query)
        for contract in result["data"]["predictContracts"]:
            contracts.append((contract["id"],contract["token"]["name"],contract["secondsPerEpoch"]))
                
    except Exception as e:
            print(e)
            return {}
    return contracts

def get_predictions(contract,no_of_slots):
    ts = round(time.time())
    stats=[]
    while True:
        query = """
        {
        predictContracts(where: {id_in:["%s"]}){
                id
                token{
                    name
                }
                secondsPerEpoch
                slots(first:%s orderBy:id orderDirection:desc where:{slot_lt:%s}){
                    id
                    slot
                    predictions{
                        user {
                            id
                        }
                        stake
                        payout{
                            predictedValue
                            payout
                        }
                    }
            }
        }
        }
        """ % (
            contract,
            no_of_slots,
            ts
            
        )
        try:
            result = query_subgraph( query)
            if result["data"]["predictContracts"] == []:
                break
            for contract in result["data"]["predictContracts"]:
                feed=contract["token"]["name"]+"-"+contract["secondsPerEpoch"]
                for sslot in contract["slots"]:
                    slot=sslot["slot"]
                    for predict in sslot["predictions"]:
                        user=predict["user"]["id"]
                        stake=predict["stake"]
                        if predict["payout"] is not None:
                            predval=predict["payout"]["predictedValue"]
                            payout=predict["payout"]["payout"]
                        else:
                            predval=None
                            payout=None
                        stats.append((feed,slot,user,stake,predval,payout))
        except Exception as e:
            print(e)
            return {}
    return stats


def print_nice(stats):
    headers = ["Feed", "Slot","User","Stake","Predicted Value","Payout"]
    data_t= [list(t) for t in stats]
    #now make it nice by separating slots
    slot=data_t[0][1]
    total_preds=0
    total_staked=0
    data=[]
    for i in data_t:
        if i[1]!=slot:
            data.append(["-- Total for slot ^--","--",f"-( {total_preds} addrs)--",f"-( {total_staked} staked)--","--","--"])
            slot=i[1]
            total_preds=0
            total_staked=0
        data.append(i)
        total_preds=total_preds+1
        total_staked=total_staked+float(i[3])
    #append last line
    data.append(["-- Total for slot ^--","--",f"-( {total_preds} addrs)--",f"-( {total_staked} staked)--","--","--"])
    #now print it
    print(tabulate(data, headers, tablefmt="fancy_grid"))

def print_contracts(contracts):

    headers = ["Contract address", "Namet","SecondsPerEpoch"]
    data_t= [list(t) for t in contracts]
    print(tabulate(data_t, headers, tablefmt="fancy_grid"))