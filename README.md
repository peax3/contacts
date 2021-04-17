# Keep Contacts API

> Keep Contacts allows you to add, save and manage your contacts.

> This is a Node/Express/MongoDB REST API that uses JWT authentication and Cloudinary to store each contact's avatar.

## Usage

Documentation with examples [here](https://peax3contacts.herokuapp.com/)

The API is live [here](https://peax3contacts.herokuapp.com/)

## Install Dependencies

```
npm install
```

## Run App

```sh
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users and contacts, run

```sh
# Import all data
node seeder -i

# Destroy all data
node seeder -d
```
