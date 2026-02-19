<div align="center">

![Header](https://capsule-render.vercel.app/api?type=waving&color=0:667eea,50:764ba2,100:4ECDC4&height=200&section=header&text=snapURL&fontSize=70&fontColor=fff&animation=fadeIn&fontAlignY=25&desc=Your%20Ultimate%20URL%20Shortening%20Solution&descAlignY=55&descSize=20)

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Link.png" alt="Link" width="120"/>

### 🔗 Shorten Your Links Instantly | Fast • Secure • Reliable

</div>

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&duration=2800&pause=2000&color=6366F1&center=true&vCenter=true&width=600&lines=snapURL+🔗;Shorten+Your+Links+Instantly!;Fast+•+Secure+•+Reliable" alt="Typing SVG" />
</div>

<div align="center">
  <h1>⚡ snapURL ⚡</h1>
  <p><strong>Your Ultimate URL Shortening Solution</strong></p>
</div>

---

## 📖 About The Project

**snapURL** is a powerful, full-stack URL shortener application built on the **MERN stack**. Transform your long, unwieldy URLs into clean, shareable short links in seconds! Perfect for social media, marketing campaigns, and keeping your links organized.

The app features a **React** frontend with **React Router DOM** for client-side navigation, an **Express.js** REST API backend, and **MongoDB** (via **Mongoose**) for persistent data storage. Short codes are generated using the **ShortID / NanoID** library to ensure uniqueness and collision safety.

### ✨ Key Features

🔗 **Quick URL Shortening** - Convert long URLs into short, memorable links instantly  
📊 **Analytics Dashboard** - Track clicks, views, and link performance  
🎯 **Custom Short URLs** - Create personalized short links for your brand  
⚡ **Lightning Fast** - Optimized for speed and performance  
🔒 **Secure Redirects** - Safe and reliable link management  
📱 **Responsive Design** - Works seamlessly on all devices  
🎨 **Modern UI/UX** - Clean, intuitive interface with CSS animations  
💾 **Persistent Storage** - MongoDB-powered data persistence  
🔄 **RESTful API** - Clean API architecture for easy integration  
🌐 **CORS Enabled** - Configured for cross-origin resource sharing

---

## 🛠️ Tech Stack

<div align="center">

### 🎨 Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router_DOM-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### 🖥️ Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)
![CORS](https://img.shields.io/badge/CORS-orange?style=for-the-badge)
![ShortID](https://img.shields.io/badge/ShortID/NanoID-blueviolet?style=for-the-badge)

### 🔧 Dev Tools

![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

### ☁️ Database & Hosting

![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>

---

## 🏗️ Project Architecture

```
snapURL-URL-Shortner/
│
├── 📁 client/                    # React Frontend
│   ├── 📁 public/
│   │   └── index.html
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── UrlForm.jsx       # URL input form
│   │   │   ├── UrlCard.jsx       # Short URL result card
│   │   │   └── Analytics.jsx     # Analytics display
│   │   ├── 📁 pages/
│   │   │   ├── Home.jsx          # Home / shorten page
│   │   │   └── Dashboard.jsx     # Analytics dashboard
│   │   ├── 📁 styles/
│   │   │   └── App.css           # Global styles
│   │   ├── App.jsx               # Root component + Routes
│   │   └── main.jsx              # React DOM entry point
│   └── package.json
│
├── 📁 server/                    # Node.js + Express Backend
│   ├── 📁 models/
│   │   └── Url.js                # Mongoose URL schema
│   ├── 📁 routes/
│   │   └── urlRoutes.js          # API route handlers
│   ├── 📁 controllers/
│   │   └── urlController.js      # Business logic
│   ├── 📁 middlewares/
│   │   └── validateUrl.js        # URL validation middleware
│   ├── server.js                 # Express app entry point
│   └── package.json
│
├── .env                          # Environment variables
├── .env.example                  # Env template
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

| Method   | Endpoint                  | Description                   |
| -------- | ------------------------- | ----------------------------- |
| `POST`   | `/api/url/shorten`        | Create a new short URL        |
| `GET`    | `/api/url/all`            | Get all shortened URLs        |
| `GET`    | `/:shortId`               | Redirect to original URL      |
| `GET`    | `/api/url/stats/:shortId` | Get analytics for a short URL |
| `DELETE` | `/api/url/:shortId`       | Delete a short URL            |

### 📦 Request / Response Example

```json
// POST /api/url/shorten
// Request Body:
{
  "originalUrl": "https://www.example.com/very/long/url/that/needs/shortening",
  "customAlias": "mylink"  // optional
}

// Response:
{
  "success": true,
  "shortUrl": "http://localhost:5000/mylink",
  "shortId": "mylink",
  "originalUrl": "https://www.example.com/very/long/url/that/needs/shortening",
  "clicks": 0,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 🗄️ Database Schema

```javascript
// Url Model (Mongoose)
{
  originalUrl: { type: String, required: true },
  shortId:     { type: String, required: true, unique: true },
  shortUrl:    { type: String, required: true },
  clicks:      { type: Number, default: 0 },
  createdAt:   { type: Date,   default: Date.now }
}
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- 📦 **Node.js** v14 or higher — [Download](https://nodejs.org/)
- 🍃 **MongoDB** local or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud instance
- 📝 **npm** or **yarn** package manager
- 🔧 **Git** — [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nikhilxagr/snapURL-URL-Shortner.git
   cd snapURL-URL-Shortner
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   ```bash
   # In the /server directory, create a .env file
   cp .env.example .env
   ```

   ```env
   # .env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/snapurl
   BASE_URL=http://localhost:5000
   CLIENT_URL=http://localhost:3000
   ```

5. **Run the backend server**

   ```bash
   cd server
   npm run dev       # with nodemon (recommended)
   # or
   npm start         # without nodemon
   ```

6. **Run the React frontend**

   ```bash
   cd client
   npm start
   ```

7. **Open your browser**

   ```
   Frontend → http://localhost:3000
   Backend  → http://localhost:5000
   ```

---

## 💡 Usage

1. 🌐 **Enter your long URL** in the input field on the Home page
2. ✏️ **Customize** your short link alias (optional)
3. 🎯 **Click "Shorten"** to generate your snapURL
4. 📋 **Copy and share** your new short link instantly
5. 📈 **Track analytics** — view click counts from your dashboard

---

## 🎯 Features in Detail

### 🔗 URL Shortening Engine

- **ShortID / NanoID** based short code generation
- Collision prevention and uniqueness validation
- Support for custom aliases
- Original URL validation before shortening

### 📊 Analytics Dashboard

- Real-time click count tracking
- Total links created overview
- Most clicked links leaderboard
- Link creation timestamp

### 🔐 Security Features

- URL validation and sanitization middleware
- Rate limiting protection (express-rate-limit)
- CORS configured for allowed origins
- Environment variable protection via dotenv
- Malicious/invalid URL detection

---

## 📸 Screenshots

<div align="center">

### Home Page

![Home Page](https://via.placeholder.com/800x400/667eea/ffffff?text=snapURL+Home+Page)

### Dashboard

![Dashboard](https://via.placeholder.com/800x400/4ECDC4/ffffff?text=Analytics+Dashboard)

</div>

---

## 🗺️ Roadmap

- [x] Basic URL shortening functionality
- [x] MongoDB + Mongoose integration
- [x] React Router DOM implementation
- [x] REST API with Express.js
- [x] Click analytics tracking
- [ ] User authentication (JWT)
- [ ] QR code generation per link
- [ ] Public API for developers
- [ ] Browser extension
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create! Any contributions you make are **greatly appreciated**. ❤️

1. 🍴 Fork the Project
2. 🌿 Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. ✍️ Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the Branch (`git push origin feature/AmazingFeature`)
5. 🎉 Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 About Me

<div align="center">

### Hi there! I'm Nikhil 👋

I'm a passionate **Full-Stack Developer** who loves building cool MERN stack applications!  
Check out my work and let's connect! 🚀

</div>

---

## 🌐 Connect With Me

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nikhilxagr)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/nikhilxagr)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/nikhilxagr)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/nikhilxagr)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://nikhilxagr.dev)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nikhilxagr@gmail.com)
[![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/users/nikhilxagr)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@nikhilxagr)
[![Dev.to](https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white)](https://dev.to/nikhilxagr)

</div>

---

## 💖 Support

If you like this project, please consider giving it a ⭐️! It helps me stay motivated to keep building awesome stuff!

<div align="center">

### Show some ❤️ by starring this repository!

[![Star History Chart](https://api.star-history.com/svg?repos=nikhilxagr/snapURL-URL-Shortner&type=Date)](https://star-history.com/#nikhilxagr/snapURL-URL-Shortner&Date)

</div>

---

## 📊 Repository Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/nikhilxagr/snapURL-URL-Shortner?style=social)
![GitHub forks](https://img.shields.io/github/forks/nikhilxagr/snapURL-URL-Shortner?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/nikhilxagr/snapURL-URL-Shortner?style=social)
![GitHub issues](https://img.shields.io/github/issues/nikhilxagr/snapURL-URL-Shortner)
![GitHub pull requests](https://img.shields.io/github/issues-pr/nikhilxagr/snapURL-URL-Shortner)
![GitHub last commit](https://img.shields.io/github/last-commit/nikhilxagr/snapURL-URL-Shortner)
![GitHub repo size](https://img.shields.io/github/repo-size/nikhilxagr/snapURL-URL-Shortner)

</div>

---

<div align="center">

### 💡 "Short links, Big impact!" 💡

**Made with ❤️ by [Nikhil](https://github.com/nikhilxagr)**

⭐ **Don't forget to star this repo if you found it useful!** ⭐

</div>

---

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="50" height="50" />
  <p><strong>Happy Shortening! 🚀</strong></p>
</div>

![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:4ECDC4,50:764ba2,100:667eea&height=120&section=footer)
