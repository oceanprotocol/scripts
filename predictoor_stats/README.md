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
Usage:  main.py <contract_address> <number_of_slots = default 10> <sort_method>
*sort_method=1:  slot desc,user_address
*sort_method=2:  slot desc,amount desc,user_address (default)
```