1.  Create venv
2.  Install deps
```bash 
pip install -r requirements.txt
```
3. Run the script and get help:
```bash
python main.py
```
4. Detailed usage:
```bash
predictoor_stats$ python main.py

Usage:  main.py <contract_address> <number_of_slots> <sort_method> <until_timestamp>
*contract_address: feed to get_predictions, or you can use all/300/3600 for agregation
*number_of_slots: how many slots per feed to get (default 10)
*sort_method=1:  slot desc,user_address
*sort_method=2:  slot desc,amount desc,user_address (default)
*until_timestamp:  iterate from this slot desc (default time.now())

Please provide a contract address.  Here is the list: 

╒════════════════════════════════════════════╤═══════════╤═══════════════════╕
│ Contract address                           │ Namet     │   SecondsPerEpoch │
╞════════════════════════════════════════════╪═══════════╪═══════════════════╡
│ 0x18f54cc21b7a2fdd011bea06bba7801b280e3151 │ ADA/USDT  │               300 │
├────────────────────────────────────────────┼───────────┼───────────────────┤
│ 0xa2d9dbbdf21c30bb3e63d16ba75f644ac11a0cf0 │ ADA/USDT  │              3600 │
├────────────────────────────────────────────┼───────────┼───────────────────┤

```