# TDT App API

Simple ToDo API built with Node.js, Express and TypeScript. Built for the final project of the OpenBootcamp React course. The goal of this project is to create an API that handles HTTP requests from some Frontend and provides functionality to interact with the database (MongoDB). More information in the Features section.

## Table of contents
- [Quick Start](#quick-start)
    - [Installation](#installation)
    - [Usage](#usage)
- [Features](#features)
- [API Documentation](#api-documentation)
- [License](#license)

## Quick Start

### Installation
1. Clone it:
    ```
    $ git clone https://github.com/lemartinezm/todo-app-back
    ```

2. Go into the project directory and run the command:
    ```
    $ npm install
    ```

3. For run in dev mode:
    ```
    $ npm run dev
    ```

For other scripts, check the package.json file.

### Usage

Before execution, you need to create an ".env" file in the root path of the project. This file should include (as shown):

```
PORT = 8000
MONGOURI = mongodb://localhost:27017/todoapp
MONGO_URI_TEST = mongodb://localhost:27017/todoapp-test
SECRET_KEY = mysecretkey
```

- PORT: where the server will run.

- MONGOURI: Mongo URI for development database. In the example, database is called "todoapp".

- MONGO_URI_TEST: Mongo URI for test database. In the example, database is called "todoapp-test".

- SECRET_KEY: the key to be used for signing tokens.


Finally, don't forget to initialize your database.

## Features
The features implemented are:
- Users registration
- Login
- CRUD for ToDos
- CRUD for Users

For future versions:
- Add teams: include the possibility for teams creation and share ToDos between users that belongs to the team.
- CRUD for teams
- Improve the tests

## API Documentation
For endpoints documentation, visit the [Deploy on Render](https://todo-app-back.onrender.com/docs/).

## License
[MIT](LICENSE)