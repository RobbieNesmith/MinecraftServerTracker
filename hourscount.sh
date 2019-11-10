echo $(( $(grep -o $1 servertracking/* | wc -l) / 12 ))
