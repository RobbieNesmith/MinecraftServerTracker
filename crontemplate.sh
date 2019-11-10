echo "--------------------"
echo "Virtual env dir name"
echo "--------------------"
read venvname
echo "-----------"
echo "Server name"
echo "-----------"
read servername

echo "*/5 * * * * $(pwd)/$venvname/bin/python $(pwd)/playertracker.py $servername"
