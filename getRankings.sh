cat servertracking/* | tr "{" "\n" | tr "," "\n" | grep name | cut -d "\"" -f 4 | sort | uniq -c | sort -bfnr | python timetohours.py
