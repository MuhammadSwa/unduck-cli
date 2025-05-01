# DuckDuckGo Bang CLI Utility (A Fork from [t3dotgg/unduck](https://github.com/t3dotgg/unduck))

A simple command-line utility written in TypeScript to generate DuckDuckGo Bang redirect URLs, designed for easy integration with tools like Rofi on Linux.

## Features

* Generate DuckDuckGo URLs from bang commands (e.g., `!g my search`).
* Outputs the resulting URL to standard output.
* Convenient for scripting and integrating with launchers like Rofi.


## Installation

1.  Clone this repository:
    ```bash
    git clone <repository-url> # Replace <repository-url> with the actual URL
    cd <repository-directory>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Building
Compile the TypeScript files into a single, executable JavaScript file using `ncc`:
```bash
npm run build
```

## Usage Example
- I use unduck.sh for interactive use with Rofi and opening in default browser. I have a keybinding for it.
