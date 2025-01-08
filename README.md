How to setup the project?

1. Clone the repositor
2. Clone the <a href="https://github.com/msajawal-sial/email-notification-service">email-notification-service-repository</a>
3. Open terminal in the root directory of the email-notification-service repository
4. Build docker image for email-notification-service by using `docker build -t email-notification-service:latest .`
5. Open terminal in the root directory of the current repository
6. Add environemnt variable 'SEND_GRID_API_KEY' email-notification-service container in docker-compose.yml file
7. Run `docker compose up'