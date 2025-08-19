#!/bin/bash

input=$(rofi -dmenu -p "DuckDuckGo Bang" | xargs bun $HOME/scripts/unduck-cli/app.ts)

echo "$input" | xargs xdg-open
