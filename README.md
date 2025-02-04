# Take-Home Challenge FullStack1Take-Home Challenge FullStack
Date: 2024-12-19


## How run the project
Steps to run the project:
1. Create a .env file from the .env.example file
`cp .env.example .env`

2. Generate the key for the project
`php artisan key:generate`

3. Create the database file
`touch database/database.sqlite`

3. Run the docker-compose file
`docker-compose up --build -d --remove-orphans`

5. Migrate the database and seed the data
`docker exec -it app php artisan migrate:fresh --seed`

6. Run this command to scrape the articles.
`docker exec -it app php artisan scrape:articles`

7. Build the frontend
`docker exec -it app npm run build`

8. Access the project in the browser
`http://localhost:8001`


Seeder have a default user 
- email: murad@recmail.net
- password: 12345678