# IDS Fintech Products Portal

## Overview

The **IDS Fintech Products Portal** is a full-stack web application designed to provide a centralized platform for managing IDS Fintech products, clients, deployments, environments, and users.

The application uses a **.NET Web API backend** with a **React + TypeScript frontend**, connected to a **MySQL database**.

## Technologies

### Backend

* .NET Web API
* C#
* Dapper
* MySqlConnector
* JWT Authentication
* BCrypt password hashing
* Swagger / OpenAPI

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Lucide React icons

### Database

* MySQL

## Project Structure

```text
IDSFintechPortal/
│
├── Backend/
│   └── IDSFintech.Api/
│
└── Frontend/
    └── ids-fintech-portal/
```

## Installation

### Backend

Navigate to the backend:

```bash
cd Backend\IDSFintech.Api
```

Install the required NuGet packages:

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package BCrypt.Net-Next
dotnet add package Swashbuckle.AspNetCore
dotnet add package Dapper
dotnet add package MySqlConnector
```

Run the backend:

```bash
dotnet run
```

Swagger can be used to test and explore the API endpoints.

### Frontend

Navigate to the frontend:

```bash
cd Frontend\ids-fintech-portal
```

If creating the frontend from scratch:

```bash
npm create vite@latest ids-fintech-portal -- --template react-ts
```

Install dependencies:

```bash
npm install
npm install react-router-dom
npm install axios
npm install lucide-react
```

Run the frontend:

```bash
npm run dev
```

## Authentication & User Roles

The system uses **JWT authentication** and role-based access control.

### CEO

* Can log in without approval.
* Can view users.
* Does not require account approval.

### Manager

* Can log in without employee approval.
* Can view pending users.
* Can approve or reject employee registrations.

### Employee

* Can register an account.
* New accounts are created with **Pending** status.
* Cannot log in until approved by a Manager.
* Can log in after approval.
* Cannot approve or reject other users.

When a Manager approves or rejects a pending employee, the pending user list is automatically updated and the processed user disappears from the pending list.

## Password Security

Passwords are securely hashed using **BCrypt.Net-Next** rather than being stored as plain text.

JWT tokens are used to authenticate users and protect authorized API endpoints.

## Git

Git is initialized in the project using:

```bash
git init
```

Add project files:

```bash
git add .
```

Create a commit:

```bash
git commit -m "Initial project setup"
```

## Running the Project

Open two terminals.

**Terminal 1 – Backend:**

```bash
cd Backend\IDSFintech.Api
dotnet run
```

**Terminal 2 – Frontend:**

```bash
cd Frontend\ids-fintech-portal
npm run dev
```

The frontend communicates with the backend API through HTTP requests using **Axios**.
