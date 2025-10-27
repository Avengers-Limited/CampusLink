# 🎓 CampusLink - University Networking Platform

<div align="center">
  
  ![CampusLink Logo](https://img.shields.io/badge/CampusLink-v1.0.0-6C63FF?style=for-the-badge)
  ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
  ![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

  **A university-exclusive networking platform for students to connect, find project teammates, and collaborate.**

</div>

---

## 📱 About CampusLink

CampusLink is a mobile application designed specifically for university students to:
- 🤝 Connect with fellow students
- 👥 Find project teammates based on skills and interests
- 🚀 Create and join collaborative teams
- 💼 Build meaningful professional relationships
- 🎯 Discover opportunities that match your skills

## ✨ Features

### 🔐 Authentication
- Secure email/password authentication
- University email verification
- Profile setup and customization
- Password recovery

### 🏠 Home Dashboard
- Personalized greeting and activity feed
- Quick actions for common tasks
- Active projects overview
- Suggested connections based on interests
- Search functionality for projects and teammates

### 👥 Teams & Projects
- Browse available teams and projects
- Filter by category (Development, Design, Marketing, Research, etc.)
- View team details, members, and open positions
- Create new teams
- Join existing teams

### 👤 User Profile
- Comprehensive profile with bio, major, and year
- Skills and interests showcase
- Project and connection statistics
- Settings and preferences
- Account management

### 💬 Messaging System
- Direct messaging between users
- Group chat creation
- Real-time communication
- File sharing capabilities

### 📱 Additional Features
- Social feed with posts and interactions
- Lost & Found section
- Confessions & Polls
- Help & Support system

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: ExpressJS, NodeJS
- **Authentication**: JWT Auth
- **Database**: MongoDB
- **Storage**: MongoDB, LocalHost
- **Navigation**: React Navigation v7
- **State Management**: React Context API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

For mobile development:
- **Android**: [Android Studio](https://developer.android.com/studio) or Expo Go app
- **iOS**: Xcode (macOS only) or Expo Go app

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Avengers-Limited/CampusLink.git
cd CampusLink
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up the database schema (see Database Setup section)
3. Configure authentication
4. Get your API credentials

### 4. Configure Environment Variables

1. Create a `.env` file in the project root
2. Add your Supabase credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Application

```bash
# Start the Expo development server
npm start

# Start with tunnel mode (recommended for testing)
npm run start:tunnel

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

## 📂 Project Structure

```
CampusLink/
├── assets/                 # Images, fonts, and other static assets
├── components/             # Reusable UI components
├── constants/             
│   ├── colors.js          # Color palette and theme
│   └── typography.js      # Typography styles
├── context/               
│   └── AuthContext.js     # Authentication context and state
├── lib/                   
│   └── supabase.js        # Supabase client configuration
├── navigation/            
│   ├── AppNavigator.js    # Main navigation setup
│   └── MainTabNavigator.js # Bottom tab navigation
├── screens/               
│   ├── WelcomeScreen.js   # Welcome/landing screen
│   ├── LoginScreen.js     # Login screen
│   ├── RegisterScreen.js  # Registration screen
│   ├── ProfileSetupScreen.js # Profile setup after registration
│   ├── HomeScreen.js      # Main dashboard
│   ├── FeedScreen.js      # Social feed
│   ├── TeamsScreen.js     # Teams and projects browser
│   ├── ProfileScreen.js   # User profile screen
│   ├── ChatScreen.js      # Chat system
│   └── [other screens...]
├── utils/                 # Utility functions
├── App.js                 # Main app component
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🎨 Design System

CampusLink follows a modern, clean design language:

### Color Palette
- **Primary**: `#6C63FF` (Purple) - Main brand color
- **Secondary**: `#FF6584` (Pink) - Accent color
- **Background**: `#FFFFFF` / `#F8F9FA`
- **Text**: `#1A1A1A` / `#666666` / `#999999`

All colors are defined in `constants/colors.js` for easy customization.

## 🔒 Security

- All passwords are securely hashed by Supabase Auth
- Row Level Security (RLS) policies protect user data
- API keys are safe to use in the client (anon key is public)
- Never commit sensitive credentials to version control

## 📝 Database Schema

### Main Tables

1. **profiles**
   - User profile information
   - Linked to Supabase Auth users
   - Stores: name, bio, major, year, skills, etc.

2. **posts**
   - Social feed posts
   - User-generated content
   - Categories and interactions

3. **teams**
   - Team/project information
   - Creator, description, category
   - Open positions tracking

4. **team_members**
   - Junction table for team membership
   - User-team relationships
   - Role management

## 🧪 Testing

```bash
# Run tests (to be implemented)
npm test

# Run linter
npm run lint
```

## 🚧 Roadmap

- [ ] Real-time messaging between team members
- [ ] Push notifications for team invites
- [ ] Advanced search and filtering
- [ ] User recommendations algorithm
- [ ] Team matching based on skills
- [ ] Project milestones and task management
- [ ] In-app chat functionality
- [ ] File sharing and collaboration tools
- [ ] Social features (posts, likes, comments)
- [ ] Event creation and management
- [ ] Calendar integration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Owner**: Avengers Limited
- **Repository**: [CampusLink](https://github.com/Avengers-Limited/CampusLink)

## 📞 Support

For support, email support@campuslink.com or join our community discussions.

---

<div align="center">
  Made with ❤️ by the CampusLink Team
</div>
