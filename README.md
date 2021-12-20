# A basic Amazon price scraper written in NodeJS using scrape-it and sqlite3

Initialize the db with some dummy items:

```
cd db
sqlite3 database.sqlite < schema.sql
sqlite3 database.sqlite < seed.sql
cd ..
```

Install dependencies and launch the scraper:

```
yarn
node index.js
```
