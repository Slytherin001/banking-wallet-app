# 💳 Banking Wallet Application (Full Stack)

A role-based digital wallet system built using **Angular (Frontend)** and **Node.js + Express (Backend)**.

This application supports OWNER, ADMIN, and USER roles with secure authentication, money transfer, credit/debit transactions, and paginated transaction history.

---

## 🚀 Tech Stack

### 🔹 Frontend (client/)

- Angular (Standalone Components)
- RxJS (BehaviorSubject state management)
- SCSS
- ngx-toastr
- Custom Pipes (Rupee Format, Date Format)

### 🔹 Backend (server/)

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication (HTTP-only cookies)
- REST APIs

---

## 🔐 Environment Configuration

Inside the `server/` directory, create a `.env` file:

```
MONGO_URI=<your_mongodb_connection_string>
PORT=5000
OWNER_USERNAME=<default_owner_username>
OWNER_PASSWORD=<default_owner_password>
OWNER_ROLE=OWNER
JWT_SECRET=<your_secure_secret_key>
```

### Initial Owner Setup

Inside the `server/server.js` file, there is a `createOwner()` function inside `app.listen()`.

This function is commented out by default.

👉 To create the default OWNER account:

1. Uncomment the `createOwner()` function.
2. Run the application using:

```
npm run dev
```

3. Once the owner account is created successfully, comment the `createOwner()` function again.
4. Restart the application.

This ensures the default OWNER is created only once and prevents duplicate entries.

### ⚠️ Security Notice

- Never commit your `.env` file
- Add `.env` to `.gitignore`
- Always use strong passwords and secrets in production

## 📂 Project Structure

```
root/
 ├── client/              → Angular Frontend
 ├── server/              → Node.js Backend
 ├── package.json         → Runs both frontend & backend
 ├── package-lock.json
```

---

## ✨ Features

### 🔐 Authentication & Roles

- Role-based login system
- OWNER → Can create Admin & credit money to admin only
- ADMIN → Can create Users & credit money to user only
- USER → Can transfer money & view transactions
- Secure authentication using cookies

---

### 💰 Wallet System

- Credit money
- Debit money
- Transfer money
- Real-time balance updates
- Transaction history tracking

---

### 📊 Transaction Management

- Paginated transaction history
- Custom formatted currency (₹)
- Date formatting pipe
- Dynamic debit/credit styling

---

### 🧩 UI & UX

- Clean dashboard layout
- Custom dropdowns
- Toast notifications
- Loading spinners
- Responsive design

---

## 🛠 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

---

### 2️⃣ Install Root Dependencies

```bash
npm install
```

---

### 3️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

---

### 4️⃣ Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## ▶️ Running the Application

From the **root folder**, run:

```bash
npm run dev
```

✅ This single command will automatically start:

- Angular Frontend (usually on: http://localhost:4200)
- Node Backend (usually on: http://localhost:5000)

No need to start them separately.

---

## 🌐 API Base URL

```
http://localhost:5000/api/v1
```

Make sure MongoDB is running before starting the server.

---

## 🔄 Example Workflow

1. OWNER creates ADMIN
2. ADMIN creates USER
3. ADMIN credits money to USER
4. USER transfers money
5. Transactions appear in history with pagination

---

## 📦 Environment Variables (Server)

Create a `.env` file inside the `server/` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 📊 State Management Approach

The frontend uses:

- BehaviorSubject for reactive data handling
- Observables for transaction updates
- Role-based dynamic data loading
- Pagination state handling

---

## 🔒 Security

- HTTP-only cookies for authentication
- Role-based route guards
- Protected backend routes
- Input validation

---

## 📈 Future Improvements

- WebSocket for real-time transaction updates
- Dashboard analytics
- Export transaction history (PDF/CSV)
- Docker support
- Deployment to cloud (Render / AWS / Vercel)

---

## 🧪 Testing

You can run Angular tests with:

```bash
cd client
ng test
```

Backend testing can be added using:

- Jest
- Supertest

---

## 👨‍💻 Author

MD KAIF ALI
Full Stack Developer

---

## 📜 License

This project is for educational and portfolio purposes.

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!
