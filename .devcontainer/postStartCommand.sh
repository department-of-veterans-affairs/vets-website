#!/bin/zsh

# workaround for https://github.com/microsoft/vscode-dev-containers/issues/557
if [[ $(which code-insiders 2>&1) && ! $(which code 2>&1) ]]; then 
    alias code=code-insiders
fi