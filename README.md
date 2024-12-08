# Backend for Shoe Configurator

This repository contains the backend code for a **Shoe Configurator** school project. The project allows users to customize sneakers and heels, place orders, and manage user authentication. The backend handles user registration, login, and order processing, including validations and database management.

## Features

- **User Authentication:**
  - Register and login functionality with hashed passwords.
  - JSON Web Token (JWT) based authentication.
  - Role-based access control (admin/user).

- **Order Management:**
  - Create, retrieve, update, and delete orders.
  - Support for sneaker and heel customization.
  - Validation for materials, colors, and model types.

- **Database Integration:**
  - MongoDB with Mongoose ORM for data modeling and validation.

- **Error Handling:**
  - Graceful handling of errors with descriptive responses.
  - Middleware for 404 and other unexpected errors.

- **Environment Configuration:**
  - Environment variables for sensitive data like MongoDB URI and JWT secrets.

## API Endpoints

### User Routes (`/api/v1/users`)
| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| POST   | `/register`     | Register a new user  |
| POST   | `/login`        | User login           |

### Order Routes (`/api/v1/orders`)
| Method | Endpoint        | Description                           |
|--------|-----------------|---------------------------------------|
| POST   | `/`             | Create a new order                   |
| GET    | `/`             | Get all orders                       |
| GET    | `/:id`          | Get order by ID                      |
| PUT    | `/:id`          | Update order status (admin only)     |
| DELETE | `/:id`          | Delete an order (admin only)         |

## Tech Stack

- **Node.js:** Server runtime.
- **Express.js:** Framework for handling routes and middleware.
- **MongoDB + Mongoose:** Database and schema modeling.
- **JWT:** Authentication and role management.
- **dotenv:** Manage environment variables.
- **bcrypt:** Password hashing.

## Installation

1. Clone the repository:
   git clone https://github.com/your-username/backend-shoe-configurator.git
   cd backend-shoe-configurator

2. Install dependencies:
    npm install

3. Set up environment variables:
    Create a .env file in the root directory and add the following:
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

4. Start the server:
    npm start

5. The backend will run on http://localhost:3000.

### Example .env File
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shoe-configurator
JWT_SECRET=supersecretkey

### Error Handling
. 404 Errors: Gracefully handles routes that are not found.  
. Validation Errors: Ensures input data meets required formats and constraints.  
. Unhandled Promise Rejections: Captures and logs any unanticipated promise rejections.  