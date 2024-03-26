import requests
import sys
import time
from subgrapy import get_ve_snapshot


if len(sys.argv) < 2 or sys.argv[1] is None:
    print("Usage:  main.py <block_number>")
    sys.exit()
get_ve_snapshot(sys.argv[1])
