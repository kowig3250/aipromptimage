import subprocess
import os

os.environ["PYTHONIOENCODING"] = "utf-8"

file_path = r"D:\연구자동화에이전트들\미하이_칙센트미하이_전문가몰입이론.md"
notebook_id = "0d159b5d-f2ce-45f9-aa74-d04686407f31"

with open(file_path, "r", encoding="utf-8") as f:
    text_content = f.read()

print("Uploading to NotebookLM Mihaly Csikszentmihalyi Project...")
cmd = ["nlm", "add", "text", notebook_id, text_content, "--title", "미하이_칙센트미하이_오리지널학술자료"]
result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")

if result.returncode == 0:
    print("SUCCESS!")
    print(result.stdout)
else:
    print("FAILED!")
    print(result.stderr)
