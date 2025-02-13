# OTC Password Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  [![Project Status: Archived](https://img.shields.io/badge/Status-Archived-lightgrey)](https://www.google.com/search?q=github+archived+badge)

A secure password management application designed to simplify password storage and enhance security. Developed during a January 2025 internship at OTC.

## Features

*   Secure password storage using AES-256 encryption.
*   Role-based access control for managing user permissions.
*   User-friendly interface for adding, viewing, editing, and deleting passwords.
*   Detailed logging of application activity.
*   Master account functionality for initial setup and user management.

## Technologies Used

*   **Full-Stack Framework:** Next.js ([https://nextjs.org/](https://nextjs.org/))
*   **Backend:** Express.js ([https://expressjs.com/](https://expressjs.com/))
*   **Database:** PostgreSQL ([https://www.postgresql.org/](https://www.postgresql.org/))
*   **ORM:** Prisma ([https://www.prisma.io/](https://www.prisma.io/))
*   **Security:** CryptoJS ([https://cryptojs.gitbook.io/cryptojs/](https://cryptojs.gitbook.io/cryptojs/))

## Installation

1.  Clone the repository: `git clone https://github.com/NotMatta/internship-project.git`
2.  Navigate to the project directory: `cd internship-project`
3.  Install dependencies: `npm install` (or `yarn install`)
4.  Set up environment variables:
    *   Create a `.env` file in the root directory.
    *   Set the following variables:
        *   `DATABASE_URL`: The URL for your PostgreSQL database.
        *   `PASSWORD_ENCRYPTION_SECRET`: A secret key for encrypting passwords.
        *   `JWT_SECRET`: A secret key for encrypting JWT tokens.
        *   `MASTER_PASSWORD`: The initial password for the master account.
5.  Prepare the database: `npx prisma migrate dev` (or `npx prisma db push` for development)
6.  Generate the master account: `npm run generate_master`
7.  Run the development server: `npm run dev` (or `yarn dev`)

## Usage

1.  Log in using the master account:
    *   Email: `master@master`
    *   Password: The value you set for `MASTER_PASSWORD` in the `.env` file.
2.  Create roles and users through the administrative interface.
3.  Assign roles to users.
4.  Start using the password manager.
5.  Monitor application activity through the logs.

## Contributing

This project is not open to contributions as it is archived.

## Project Status

Archived. This project is no longer being actively developed or maintained.

## License

MIT License
