# HH.ru parser


## Description
This is app that uses HH.ru API to get info about vacancies and store them.



## Requirements
- Python 3.x
- Docker
- Node.js

## Installation

1. Clone the repository:
    ```bash
    https://github.com/wfa22/SummerPracticum2024.git
    cd SummerPracticum2024
    ```
    
2. Start Docker Engine

3. Build the Docker container:
    ```bash
    docker-compose build
    ```

## Running the Project

1. Apply database migrations:
    ```bash
    docker-compose run --rm app sh -c "python manage.py migrate"
    ```

2. Start the server:
    ```bash
    docker-compose up
    ```

The application should now be running and accessible.


### Documentation
This is our [API Documentation](API-Documentation.md)

