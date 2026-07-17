# EduNode — Secure Course Marketplace

EduNode is a secure, creator-first online learning platform that prevents course piracy using real-time stream decryption and integrates verified checkout workflows.

---

## The Problem

* **Course Piracy**: Standard platforms expose raw media URLs, making it easy to scrape and distribute premium videos.
* **Complex Payments**: Handling race conditions during payment verification can lead to inconsistent enrollment states.

**EduNode's Solution:**
* **AES-256 Content Shielding**: Media is stored encrypted. It is decrypted in-memory on the fly and streamed directly to the player, never touching the client's local storage.
* **Verified Checkouts**: Razorpay integration with server-side HMAC-SHA256 signature verification guarantees secure, atomic enrollments.

---

## Key Features

* **Cryptographic Shielding**: Files encrypted at rest; decrypted dynamically chunk-by-chunk for authorized playback.
* **Secure Checkout**: Cryptographically verified Razorpay modal checkout and free-course bypass logic.
* **Instructor Dashboard**: KPIs (Earnings, Students) and interactive canvas charts.
* **Real-time Simulator**: Interactive page widget demonstrating client/server salting and cipher execution.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Spring Boot 3, Spring Security (JWT), Java 17 |
| **Database** | MySQL, Hibernate / Spring Data JPA |
| **Integrations** | Cloudinary (Media hosting), Razorpay (Payments) |

---

## Project Structure

```
EduNode/
├── backend/coursemaketplace/   # Spring Boot REST API
│   ├── src/                    # Controllers, Services, Configurations
│   └── pom.xml                 # Maven dependencies
├── frontend/                   # React Single Page App
│   ├── src/                    # Pages, Components, State Management
│   └── package.json            # Scripts & dependencies
```

---

## Setup & Run Locally

### Prerequisites
* JDK 17+
* Node.js v18+ & npm
* MySQL Server

---

### Step 1: Database Setup
Run the following SQL query:
```sql
CREATE DATABASE course_marketplace;
```

---

### Step 2: Backend Setup
1. Configure credentials in [backend/coursemaketplace/src/main/resources/application.properties](file:///d:/EduNode/backend/coursemaketplace/src/main/resources/application.properties):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/course_marketplace
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD

   cloudinary.cloud-name=YOUR_CLOUDINARY_CLOUD_NAME
   cloudinary.api-key=YOUR_CLOUDINARY_API_KEY
   cloudinary.api-secret=YOUR_CLOUDINARY_API_SECRET

   razorpay.key.id=YOUR_RAZORPAY_TEST_KEY_ID
   razorpay.key.secret=YOUR_RAZORPAY_TEST_KEY_SECRET
   ```

2. Start the API server:
   ```bash
   cd backend/coursemaketplace
   ./mvnw spring-boot:run
   ```
   *Runs at `http://localhost:8080`*

---

### Step 3: Frontend Setup
1. Install dependencies and start:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Runs at `http://localhost:5173`*

---

## Security Architecture Highlights

* **Role-Based Rules**: Custom annotations secure routes by roles (`ROLE_LEARNER`, `ROLE_INSTRUCTOR`).
* **Decryption Pipeline**: Stream content dynamically block-by-block without writing raw files to disk.
* **Password Hashing**: User passwords are encrypted with BCrypt before storage.
