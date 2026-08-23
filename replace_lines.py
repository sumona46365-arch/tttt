import sys

def replace_lines(file_path, start_line, end_line, replacement_file):
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    with open(replacement_file, 'r') as f:
        replacement_lines = f.readlines()
    
    # Line numbers are 1-indexed
    start_idx = start_line - 1
    end_idx = end_line
    
    new_lines = lines[:start_idx] + replacement_lines + lines[end_idx:]
    
    with open(file_path, 'w') as f:
        f.writelines(new_lines)

if __name__ == "__main__":
    replace_lines(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4])
