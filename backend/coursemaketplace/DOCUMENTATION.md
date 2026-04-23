# 📘 Comprehensive Beginner's Documentation

Welcome to the Online Course Marketplace! If you are new to programming or Spring Boot, do not worry. This document will explain exactly *what* we built, *how* it works, and *how* you can use it end-to-end.

---

## 🛑 Chapter 1: The Core Concepts

To understand this project, you need to understand the **MVC (Model-View-Controller)** pattern mixed with a **Layered Architecture**. Think of our application like a fine-dining restaurant:

1. **Controllers (`/controller` folder) = The Waiters**
   They take the order (the HTTP Request) from the customer (Frontend/Postman), carry it to the Kitchen, and bring back the food (HTTP Response/JSON). They do *not* cook the food.
2. **Services (`/service` folder) = The Chefs**
   This is where validation, math, and business rules happen. The chef takes the raw ingredients, ensures everything is correct, and cooks the meal.
3. **Repositories (`/repository` folder) = The Pantry Workers**
   They go deep into the basement (MySQL Database) to safely fetch and store the required data.
4. **Entities (`/entity` folder) = The Blueprints**
   These are Java representations of the database tables (e.g., `Course` table, `User` table).
5. **DTOs (`/dto` folder) = The Menu/Receipt**
   Data Transfer Objects. We don’t give the customer the raw DB rows (like hashed passwords). We map Entities to DTOs so we only show the user what they are allowed to see.

---

## 📂 Chapter 2: The Final Folder Structure Breakdown

Here is what every folder in `src/main/java/com/purav/coursemaketplace/` does:
*   **`config/`**: Holds core configurations, primarily `SecurityConfig.java` which acts as our application's Bouncer (deciding who needs a token).
*   **`controller/`**: Holds API endpoints (e.g., `AuthController`, `CourseController`).
*   **`dto/request/`**: Holds models for data *coming into* the server (e.g., `LoginRequest`).
*   **`dto/response/`**: Holds models for data *going out* from the server (e.g., `AuthResponse`).
*   **`entity/`**: The Database tables mapping (`User`, `Course`, `CourseMaterial`, `Enrollment`).
*   **`exception/`**: Global rules for when things go wrong (e.g., 404 Not Found, 400 Bad Request) so the app does not crash and handles errors gracefully.
*   **`repository/`**: Interfaces that give us free magic database queries (`findById`, `save`, `findByEmail`) using Spring Data JPA.
*   **`security/`**: All the logic for creating, decoding, and validating JSON Web Tokens (JWT).
*   **`service/`**: The core business logic connecting repositories to the endpoints.

---

## ⚙️ Chapter 3: End-to-End Postman Guide

Here is a step-by-step tutorial on how to test this entire application yourself using an API client like Postman!

### Step 1: Register an INSTRUCTOR
*   **URL:** `POST http://localhost:8080/auth/register`
*   **Body (JSON):**
    ```json
    {
      "name": "John Doe",
      "email": "instructor@test.com",
      "password": "password123",
      "role": "INSTRUCTOR"
    }
    ```

### Step 2: Login the INSTRUCTOR
*   **URL:** `POST http://localhost:8080/auth/login`
*   **Body (JSON):**
    ```json
    {
      "email": "instructor@test.com",
      "password": "password123"
    }
    ```
*   **IMPORTANT:** The response will give you a `token` string. Copy this! Go to the "Authorization" tab in Postman, select "Bearer Token", and paste it there for all future requests.

### Step 3: Create a Course (Instructor Only)
*   **URL:** `POST http://localhost:8080/courses`
*   *(Ensure your Bearer Token is active!)*
*   **Body (JSON):**
    ```json
    {
      "title": "Learn Java Core",
      "description": "The best beginner Java class.",
      "price": 19.99
    }
    ```
*   **Note:** The system will return a `courseId` (e.g., `1`). Note it down.

### Step 4: Upload a Video Material to the Course
*   **URL:** `POST http://localhost:8080/courses/1/materials`
*   *(Ensure your Bearer Token is active!)*
*   **Body Type:** Change from `raw (JSON)` to `form-data`!
    *   Key: `title` -> Value: `Intro Video` (Type: Text)
    *   Key: `type` -> Value: `VIDEO` (Type: Text)
    *   Key: `file` -> Value: *[Select a random video or PDF from your computer]* (Type: File)

### Step 5: Register & Login a LEARNER
*   Open a new tab and register/login exactly like Step 1 & 2, but set `"role": "LEARNER"`. 
*   **Copy the new Token** for this Student.

### Step 6: The Learner Buys (Enrolls) in the Course
*   **URL:** `POST http://localhost:8080/enrollments/courses/1`
*   *(Use the LEARNER's Bearer token here!)*
*   No body needed. This registers the learner securely to the course!

### Step 7: View the Course Materials
*   **URL:** `GET http://localhost:8080/courses/1/materials`
*   Because the learner is now officially enrolled, the server will print out the JSON list containing the uploaded URLs of the videos/PDFs instead of throwing an "Access Denied" error!

---

## 🔒 Chapter 4: Important Technical Details to Know

*   **Passwords are Safe:** When you register, `BCryptPasswordEncoder` scrambles your password string before saving it to MySQL. Even database admins cannot see a user's true password.
*   **The Big File Problem:** Large files are not stored in MySQL. They are saved to `d:\coursemaketplace\uploads\`. The DB merely remembers the folder path `/uploads/1/uuid_name.mp4`.
*   **N+1 Problem Solved:** The Admin routes use `@EntityGraph`. When the admin wants to fetch all enrollments, Spring writes exactly **one** optimized query, rather than writing a new query for every single row! This makes the admin dashboard lightning-fast even with 100,000 students.
