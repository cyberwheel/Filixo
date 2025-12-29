import os
import time
from config import FILE_EXPIRY

def cleanup_folder(folder_path):
    now = time.time()
    if not os.path.exists(folder_path):
        return

    for file in os.listdir(folder_path):
        path = os.path.join(folder_path, file)
        if os.path.isfile(path):
            if now - os.path.getmtime(path) > FILE_EXPIRY:
                os.remove(path)
