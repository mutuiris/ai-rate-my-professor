#!/bin/bash

# This script collects all code files from the server folder of a Node.js project
# Put this in the root folder of your project
# Run the command chmod +x collect_nodejs_code.sh
# Then run ./collect_nodejs_code.sh

project_dir=$(pwd)
server_dir="${project_dir}/server"
output_file="${project_dir}/server_code_context.txt"

if [ -f "$output_file" ]; then
  rm "$output_file"
fi

include_extensions=("js" "ts" "json" "sh")

read_files() {
  for entry in "$1"/*
  do
    if [ -d "$entry" ] && [[ "$entry" != *"node_modules"* ]]; then
      read_files "$entry"
    elif [ -f "$entry" ]; then
      filename=$(basename -- "$entry")
      extension="${filename##*.}"
      if [[ " ${include_extensions[@]} " =~ " ${extension} " ]] && [[ "$filename" != "package.json" ]] && [[ "$filename" != "package-lock.json" ]]; then
        relative_path=${entry#"$project_dir/"}
        echo "// File: $relative_path" >> "$output_file"
        cat "$entry" >> "$output_file"
        echo "" >> "$output_file"
      fi
    fi
  done
}

if [ -d "$server_dir" ]; then
  read_files "$server_dir"
  echo "All relevant code files from the server folder have been collected in $output_file"
else
  echo "Server directory not found. Make sure you're running this script from the project root."
fi
