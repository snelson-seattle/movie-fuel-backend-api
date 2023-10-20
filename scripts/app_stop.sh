#!/bin/bash
pgrep -d -l -f "node src/app.js" | sudo xargs kill
