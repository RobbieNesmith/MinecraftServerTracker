import sys

lines = sys.stdin.readlines()
for line in lines:
  parts = line.strip().split(" ")

  print("{} {}".format(int(parts[0]) / 12, parts[1]))
