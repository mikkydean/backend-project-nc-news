# Northcoders News API

This project was completed as part of the Northcoders Software Development Bootcamp in April 2024. It involved building an API for accessing application data programmatically. It is designed to mimic the building of a real world back-end service (such as Reddit) that provides information to a front-end architecture.

The hosted application is available at the following link: https://nc-news-7ch2.onrender.com/api

Please note: This hosted version spins down with inactivty. It may require a short while to spin up again.

## Local setup

Minimum required software versions:
* Node **21.7.1**
* Postgres **16.2**

### Cloning the project

To work with this project locally,  proceed as follows:

1. Go to: https://github.com/mikkydean/backend-project-nc-news
2. Choose 'Code' and copy the URL to your clipboard
3. In Terminal, type `git clone` and paste the link
4. Open in your code editor (e.g. Visual Studio Code)
5. Run `npm install` to install dependencies

### Enviroment setup

To succesfully connect to the databases locally, create the following .env files:

* `.env.test` with the entry `PGDATABASE=nc_news_test`
* `.env.development` with the entry `PGDATABASE=nc_news`

### Seeding databases

To create and seed the local versions of the databases, run the following commands:

1. `npm run setup-dbs`
2. `npm run seed`

### Running tests

This project was completed following the principle of Test-Driven Development (TDD). The tests were written in the `__tests__` directory using the Jest testing framework.

Tests can be run using the command `npm test` or `npm t`.
