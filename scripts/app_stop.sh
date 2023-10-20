#!/bin/bash
if pgrep -d -l -f "node app.js"; 
then pgrep -d -l -f "node app.js" | sudo xargs kill;
fi
