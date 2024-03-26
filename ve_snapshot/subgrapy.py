import os
import requests
import time



SUBGRAPH_URL="http://v4.subgraph.mainnet.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph"

def query_subgraph(query):
    request = requests.post(SUBGRAPH_URL, "", json={"query": query}, timeout=15)
    if request.status_code != 200:
        # pylint: disable=broad-exception-raised
        raise Exception(
            f"Query failed. Url: {SUBGRAPH_URL}. Return code is {request.status_code}\n{query}"
        )
    result = request.json()
    return result

def get_block_details(block=None):
    contracts=[]
    query = """
        {
        _meta{
            block(where:{number:%s}){
                number
                timestamp
            }
        }
        }
        """% (
            block,
            
        )
    try:
        result = query_subgraph( query)
        return int(result["data"]["_meta"]["block"]['timestamp'])
    except Exception as e:
            print(e)
            return None

def get_ve_snapshot(block):
    block_timestamp = get_block_details(block)
    if block_timestamp is None:
        print("Failed to get block timestamp")
        return
    print("Block, address, unlockTime,lockedAmount, veAmount")
    skip=0
    total_locked=0
    total_ve=0
    total_users = 0
    while True:
        query = """
        {
            veOCEANs(block:{number:%s} first:1000 skip:%s){
                id
                lockedAmount
                unlockTime
                deposits(orderBy:timestamp orderDirection:desc first:1){
                    timestamp
                }
            }
        }
        """ % (
            block,
            skip
        )
        try:
            result = query_subgraph( query)
            if result["data"]["veOCEANs"] == []:
                break
            for user in result["data"]["veOCEANs"]:
                
                address = user["id"]
                lockedAmount = float(user["lockedAmount"])
                unlockTime = int(user["unlockTime"])
                if lockedAmount<0.001 or unlockTime < block_timestamp:
                    continue
                ve_amount=30/100*lockedAmount * (unlockTime - block_timestamp) / (4 * 365 * 24 * 60 * 60)
                print(f"{block},{address},{unlockTime},{lockedAmount},{ve_amount}")
                total_locked=total_locked+lockedAmount
                total_ve = total_ve + ve_amount
                total_users = total_users + 1
            
        except Exception as e:
            print(e)
            return {}
        skip=skip+1000

    print("\n\n")
    print(f"No of accounts: {total_users}")
    print(f"Total locked: {total_locked}")
    print(f"Total ve: {total_ve}")
    print(f"Total budget: {total_locked+total_ve}")



