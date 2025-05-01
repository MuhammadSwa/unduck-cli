#!/bin/bash

input=$(rofi -dmenu -p "DuckDuckGo Bang:" | xargs node dist/index.js)

echo "$input" | xargs xdg-open
