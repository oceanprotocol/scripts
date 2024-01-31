import requests
import tabulate
import operator
import sys
import time
from subgrapy import get_predictions,print_nice,get_contracts,print_contracts


if len(sys.argv) < 2 or sys.argv[1] is None:
    print("Usage:  main.py <contract_address> <number_of_slots = default 10> <sort_method> <until_timestamp = default now>")
    print("*sort_method=1:  slot desc,user_address")
    print("*sort_method=2:  slot desc,amount desc,user_address (default)")
    print("*until_timestamp:  iterate from this slot desc (default last)")
    print("\nPlease provide a contract address.  Here is the list: \n")
    contract=get_contracts()
    print_contracts(contract)
    sys.exit()


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

stats=get_predictions(sys.argv[1],limit,ts)

#use the following to sort:  slot desc,user_address
if sort==1:
    list1 = sorted(stats, key=lambda x: (-1*int(x[1]), x[2]))
else:
    list1 = sorted(stats, key=lambda x: (-1*int(x[1]),-1*float(x[3]), x[2]))
print_nice(list1)


#print(tabulate.tabulate(stats, headers='keys', tablefmt='psql'))