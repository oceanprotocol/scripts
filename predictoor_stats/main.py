import requests
import tabulate
import operator
import sys
import time
from subgrapy import get_predictions,print_nice,get_contracts,print_contracts


if len(sys.argv) < 2 or sys.argv[1] is None:
    print("Usage:  main.py <contract_address> <number_of_slots> <sort_method> <until_timestamp>")
    print("*contract_address: feed to get_predictions, or use 'all'")
    print("*number_of_slots: how many slots per feed to get (default 10)")
    print("*sort_method=1:  slot desc,user_address")
    print("*sort_method=2:  slot desc,amount desc,user_address (default)")
    print("*until_timestamp:  iterate from this slot desc (default time.now())")
    print("\nPlease provide a contract address.  Here is the list: \n")
    contract=get_contracts()
    print_contracts(contract)
    sys.exit()

jobs=[]
if sys.argv[1]=='all':
    contracts=get_contracts()
    data_t= [list(t) for t in contracts]
    for dta in data_t:
        jobs.append(dta[0])
else:
    jobs.append(sys.argv[1])
limit = 10
if len(sys.argv) > 2:
    limit=int(sys.argv[2])

sort=2
if len(sys.argv) > 3:
    if int(sys.argv[3]) == 1:
        sort=1
ts = round(time.time())
if len(sys.argv) > 4:
    if int(sys.argv[4]) > 1:
        ts=int(sys.argv[4])

for job in jobs:
    stats=get_predictions(job,limit,ts)
    #use the following to sort:  slot desc,user_address
    if sort==1:
        list1 = sorted(stats, key=lambda x: (-1*int(x[1]), x[2]))
    else:
        list1 = sorted(stats, key=lambda x: (-1*int(x[1]),-1*float(x[3]), x[2]))
    print_nice(list1)
    print("\n******************************************************************\n")
