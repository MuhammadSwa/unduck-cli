#!/bin/bash

input=$(rofi -dmenu -p "DuckDuckGo Bang" | xargs node $HOME/scripts/unduck-cli/dist/index.js)

echo "$input" | xargs xdg-open
