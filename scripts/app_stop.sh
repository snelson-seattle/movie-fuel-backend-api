#!/bin/bash
if pgrep -d -l -f "node app.js" 2>/dev/null; then
    echo "Terminating node application"
    pkill node
fi
