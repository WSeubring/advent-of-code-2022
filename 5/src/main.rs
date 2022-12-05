use std::fmt;
use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

struct MovementCommand {
    amount: usize,
    from: usize,
    to: usize,
}

impl fmt::Display for MovementCommand {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "amount {}, from: {}, to: {}",
            self.amount, self.from, self.to
        )
    }
}

fn main() {
    let n_stacks = 9;
    let mut stacks: Vec<Vec<char>> = vec![vec![]; n_stacks];

    // File hosts must exist in current path before this produces output
    if let Ok(lines) = read_lines("../input.txt") {
        let mut is_initializing = true;
        // Consumes the iterator, returns an (Optional) String
        for line in lines {
            if let Ok(line) = line {
                if line.is_empty() {
                    is_initializing = false;

                    //Reverse the stacks such that the top of the stack is the last element
                    for i in 0..n_stacks {
                        stacks[i].reverse();
                    }

                    //Print the stacks
                    for i in 0..n_stacks {
                        println!("Stack {}: {:?}", i, stacks[i]);
                    }
                } else if is_initializing {
                    // Create the stacks in provided order ( we reverse the order after initialization)
                    let start_offset = 1;
                    let gap_size = 3;

                    append_line_crates_to_stacks(&line, start_offset, gap_size, &mut stacks);
                } else {
                    // Apply the command provided in the line
                    let parts = line.split(" ").collect::<Vec<&str>>();

                    let movement_command = MovementCommand {
                        amount: parts[1].parse::<usize>().unwrap(),
                        from: parts[3].parse::<usize>().unwrap() - 1,
                        to: parts[5].parse::<usize>().unwrap() - 1,
                    };

                    println!("Command: {}", movement_command);

                    // Apply command to the stacks
                    perform_movement_command(movement_command, &mut stacks)
                }
                //Print the stacks
                for i in 0..n_stacks {
                    println!("Stack {}: {:?}", i, stacks[i]);
                }
                println!("#######################################################################");
                println!("{}", is_initializing);
                println!("#######################################################################");
            }
        }
    }
}

fn append_line_crates_to_stacks(
    line: &str,
    start_offset: usize,
    gap_size: usize,
    stacks: &mut Vec<Vec<char>>,
) {
    for i in 0..line.len() {
        if i % (gap_size + 1) == start_offset {
            let col = i / (gap_size + 1);
            let crate_name = line.chars().nth(i).unwrap();

            if crate_name.is_ascii_alphabetic() {
                stacks[col].push(crate_name)
            }
        }
    }
}

fn perform_movement_command(movement_command: MovementCommand, stacks: &mut Vec<Vec<char>>) {
    // Apply command to the stacks
    for _ in 0..movement_command.amount {
        let crate_name = stacks[movement_command.from].pop().unwrap();
        stacks[movement_command.to].push(crate_name);
    }
}

// The output is wrapped in a Result to allow matching on errors
// Returns an Iterator to the Reader of the lines of the file.
fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
    P: AsRef<Path>,
{
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}
