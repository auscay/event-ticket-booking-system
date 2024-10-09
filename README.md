# Event Ticket Booking System

This repository contains a Node.js application that implements an event ticket booking system. It provides a RESTful API for initializing events, booking tickets, managing waiting lists, and handling cancellations. The project is built using modern Javascript - **ES6 Modules**, **Express.js**, **Sequelize ORM**, and a **MySQL database**, with a focus on concurrency handling, error management, and Test-Driven Development (TDD).

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Concurrency Handling](#concurrency-handling)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Testing](#testing)
- [Design Choices](#design-choices)
- [Future Enhancements](#future-enhancements)

## Features 

- Initialize a new event with a set number of tickets.
- Book tickets for users concurrently, with thread safety.
- Maintain a waiting list for users when tickets are sold out.
- Automatically assign cancelled tickets to waiting list users.
- RESTful API design for easy integration and scalability.
- Test-Driven Development (TDD) using jest and supertest.
- In-memory storage for rapid prototyping combined with a MySQL database for data persistence.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- NPM or Yarn package manager

### Installation Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/auscay/event-ticket-booking-system.git
    cd event-booking-system

2. Install dependencies:
    ```bash
    npm install

3. Set up the MySQL database and create a .env file in the root directory with the following environment variables:
    ```mysql
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password

4. Run database migrations if you wish to use Sequelize CLI to manage database schema: (not recommended)
    ```mysql
    npx sequelize-cli db:migrate

5. Start the server:
    ```bash
    npm start

The server will run on http://localhost:8000 by default.

## Usage

Check the API documentation for detailed information on available endpoints and their usage [here](https://documenter.getpostman.com/view/28440801/2sAXxQcWg2).

## API Endpoints

Method | Endpoint | Description | Request Body | Response
-------|----------|-------------|---------------|--------
POST | /api/v1/events | Initialize a new event | { "name": "Event Name", "totalTickets": 100 } | { "id": 1, "name": "Event Name", "totalTickets": 100, "availableTickets": 100, "waitingList": [] }
------|----------|-------------|---------------|--------
POST | /api/v1/book | Book tickets for a user | { "eventID": 1, "userId": 1, "quantity": 10 } | { "eventId": 1, "userId": 1, "quantity": 2, "status": "Booked" }
------|----------|-------------|---------------|--------
POST | /api/v1/cancel | Cancel a booking | { "eventID": 1, "userId": 1, "quantity": 5 } | { "eventId": 1, "userId": 1, "quantity": 2, "status": "Cancelled" }
------|----------|-------------|---------------|--------
GET | /api/v1/:eventID | Get details for a particular event | N/A | [ { "id": 1, "name": "Event Name", "totalTickets": 100, "availableTickets": 100, "waitingList": [] } ]

## Concurrency Handling

- Concurrency is handled using transactions in Sequelize to ensure that booking and cancellation operations are atomic.
- Race conditions are mitigated by using row-level locks on the event data during operations.
- Each transaction either fully succeeds or fails, maintaining consistent state in the database.

### Example code for concurrency handling:
```javascript
const transaction = await sequelize.transaction();
try {
  const event = await Event.findByPk(eventId, { lock: true, transaction });
  if (event.availableTickets > 0) {
    await Booking.create({ userId, eventId }, { transaction });
    event.availableTickets -= 1;
    await event.save({ transaction });
    await transaction.commit();
  } else {
    // Handle waiting list logic
    await transaction.rollback();
  }
} catch (error) {
  await transaction.rollback();
}
```

## Testing

Testing is done using Jest and Supertest.

1. To run the tests:
    ```bash
    npm test

2. The test results will be displayed in the console, indicating whether all tests passed.

## Design Choices

- **Node.js and Express.js**: For building a scalable and efficient server-side application.
- **Sequelize ORM**: For database management and schema definition.
- **MySQL**: For data persistence and scalability.
- **ES6 Modules**: For modular and maintainable code.
- **Jest and Supertest**: For testing and ensuring code quality.
- **Rate Limiting**: For managing API usage and preventing abuse.
- **Logging**: For monitoring and debugging.

## Future Enhancements

- Authentication and Authorization: Implement user authentication and authorization to secure the API.
- Notification System: Notify users when their status changes (e.g., moved from waiting list to booked).
- Performance Optimization: Use caching mechanisms for high-traffic events.








