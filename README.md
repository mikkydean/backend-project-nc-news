# Northcoders News API

Environment setup

To ensure that this project reflects best practices for security, the environment variables for connecting to the database have been placed in separate .env files and added to .gitignore. This would prevent malicious actors from having access to the database directly.

To succesfully connect to the databases locally, create the following .env files in your cloned version of this project:
    * .env.test with the entry 'PGDATABASE=nc_news_test'
    * .env.development with the entry 'PGDATABASE=nc_news'
