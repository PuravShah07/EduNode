# Online Course Marketplace

A full-stack online course marketplace similar to Udemy/Coursera. The backend is a Spring Boot REST API with JWT auth, MySQL persistence, and local file storage for course materials. The frontend is a React + Vite SPA with routing, API calls, and Tailwind styling.

This README is intentionally beginner-friendly. It explains what each part does, how it was built step by step, and why certain choices were made.

## Tech Stack

Backend
- Java 21
- Spring Boot 4.0.3
- Spring Security (JWT)
- Spring Data JPA + Hibernate
- MySQL

Frontend
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS

## What the Project Does

Roles
- Student (Learner): browse courses, enroll, and view materials.
- Instructor: create courses, upload materials, manage their content.
- Admin: manage users and view global data.

Main features
- Auth with JWT
- Course CRUD and search/sort
- File uploads (videos/PDFs) stored under uploads/
- Enrollments to unlock materials

## Project Structure (High Level)

Backend
- src/main/java/com/purav/coursemaketplace
  - controller: REST endpoints
  - service: business logic
  - repository: database access
  - entity: JPA entities
  - dto: request/response payloads
  - security: JWT filter, auth utilities
  - config: security and web config
- src/main/resources/application.properties

Frontend
- frontend/src
  - pages: route-level screens
  - components: shared UI
  - api: axios client and API wrappers

## System Architecture (Simple View)

Browser (React) -> REST API (Spring Boot) -> Database (MySQL)
                                |
                                -> Local file storage (uploads/)

## API Overview (Key Endpoints)

Auth
- POST /auth/register
- POST /auth/login

Courses
- POST /courses (instructor)
- GET /courses
- GET /courses/{id}
- GET /courses/my-courses (instructor)

Materials
- POST /courses/{courseId}/materials (instructor)
- DELETE /courses/materials/{materialId} (instructor)

Enrollments
- POST /enrollments
- GET /enrollments/my

## Frontend Pages

- Home: landing page and marketing sections
- Courses: course list with search and sort
- Course Details: course info and material access
- Login/Register: authentication
- Dashboard: user-specific content
- Admin: admin-only actions

## How It Was Built (Step by Step, Plain Language)

Step 1: Decide the core features
- A marketplace needs users, courses, and enrollments. Those are the core tables.
- A course can have materials, so a material table is needed too.

Step 2: Design the database tables (entities)
- User has name, email, password, and role.
- Course belongs to an instructor (a User).
- Enrollment connects a user to a course (many-to-many via a join table).
- CourseMaterial stores file metadata and belongs to a course.

Why this way: using a separate Enrollment table makes it easy to store extra info later (enrolledAt, progress, reviews) without breaking the schema.

Step 3: Build repositories
- Each entity gets a repository to read and write data using Spring Data JPA.

Why this way: repositories keep SQL out of controllers, so logic stays clean and testable.

Step 4: Create services (business logic)
- Services handle rules like "only instructors can upload" or "students must be enrolled to view".

Why this way: separating logic prevents controllers from becoming large and messy.

Step 5: Create controllers (REST API)
- Controllers expose routes like /courses and /auth.
- They call services and return DTOs to the client.

Why this way: controllers should only translate HTTP to method calls, not hold complex logic.

Step 6: Add security (JWT)
- Login returns a JWT token.
- Every protected request must include Authorization: Bearer <token>.
- A JWT filter validates the token and loads the user.

Why JWT: it keeps the server stateless (no session storage needed), which scales better for APIs.

Step 7: Add file uploads
- Files are stored on disk under uploads/{courseId}/filename.
- The path is saved in the database as the file URL.

Why local storage: it is simple and fast for local development. The same interface can later be swapped to S3 or Azure Blob.

Step 8: Build the frontend
- React Router defines the pages.
- Axios handles API requests and injects JWT tokens from localStorage.
- Tailwind makes UI styling quick and consistent.

Why this way: React + Vite is lightweight, fast to start, and simple to deploy.

Step 9: Connect frontend to backend
- Axios base URL points to the backend API.
- Pages call the API wrappers from frontend/src/api.

Why this way: keeping API calls in one folder makes it easy to update endpoints later.

## "Why This Line/Function" Examples (Human Explanation)

These are the kinds of design decisions used across the codebase.

1) JWT filter in the security chain
- It runs before the username/password filter so requests can be authenticated with tokens.
- That is why you see addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class).

2) @PreAuthorize on instructor-only endpoints
- It blocks requests early if the user is not an instructor.
- That is why create course and upload material endpoints are annotated with hasRole('INSTRUCTOR').

3) Clean file names and generate UUIDs
- Cleaning avoids risky paths like ../ in user filenames.
- UUIDs avoid collisions when multiple files have the same name.

4) Separate DTOs for request/response
- You do not expose passwords or internal fields to clients.
- You can validate input with annotations on request DTOs.

## How to Run Locally

Backend
1) Create database
   CREATE DATABASE course_marketplace;
2) Update src/main/resources/application.properties with your MySQL user/pass.
3) Run
   ./mvnw spring-boot:run

Frontend
1) cd frontend
2) npm install
3) npm run dev

## Environment Notes

- The API base URL is taken from VITE_API_BASE_URL. If not set, the frontend uses /api_proxy.
- The backend currently uses local uploads/ storage. Do not commit sensitive files.
- application.properties contains a password; for real deployments, use environment variables.

## Testing

- Backend uses Spring Boot test starters.
- Frontend uses ESLint only right now.

## Where to Read More

- DOCUMENTATION.md contains extended docs and examples.
- HELP.md and frontend/README.md are template references.
