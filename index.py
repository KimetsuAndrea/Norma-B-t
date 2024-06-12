import os
import pyinotify
import subprocess
import time

current_directory = os.path.dirname(os.path.abspath(__file__))
subdirectory_path = f"{current_directory}"

class EventHandler(pyinotify.ProcessEvent):
    def process_default(self, event):
        if event.dir:
            return
        print(f"File {event.pathname} has been modified")
        commit_and_push_changes(current_directory)

def execute_git_command(command, cwd):
    subprocess.run(command, shell=True, cwd=cwd)

def commit_and_push_changes(file_path):
    delay_in_seconds = 2
    
    execute_git_command("git add .", cwd=f"{subdirectory_path}")
    print("Changes added")
    
    time.sleep(delay_in_seconds)
    
    execute_git_command(f"git commit -m 'Updated {file_path}'", cwd=f"{subdirectory_path}")
    print("Changes committed")
    
    time.sleep(delay_in_seconds)
    
    execute_git_command("git push", cwd=subdirectory_path)
    print("Pushed successfully")

wm = pyinotify.WatchManager()
handler = EventHandler()
notifier = pyinotify.Notifier(wm, handler)

# Add a watch for the specified subdirectory
wm.add_watch(subdirectory_path, pyinotify.IN_MODIFY)

print(f"Watching directory: {subdirectory_path}")

try:
    notifier.loop()
except KeyboardInterrupt:
    notifier.stop()