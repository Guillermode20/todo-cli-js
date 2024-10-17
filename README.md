# Todo CLI

A simple command-line interface (CLI) application to manage your tasks.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd todo-cli
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

1. Run the application:
    ```sh
    node index.js <command> [options]
    ```

## Commands

- `--new <task...>`: Add a new task
    ```sh
    node index.js --new "Buy groceries"
    ```

- `--list [pending|done]`: List all tasks or filter by status
    ```sh
    node index.js --list
    node index.js --list pending
    node index.js --list done
    ```

- `--done <taskId>`: Mark a task as done
    ```sh
    node index.js --done 1
    ```

- `--delete <taskId>`: Delete a task
    ```sh
    node index.js --delete 1
    ```

- `--delete-all`: Delete all tasks
    ```sh
    node index.js --delete-all
    ```

## License

This project is licensed under the IMIT License. 