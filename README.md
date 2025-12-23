# Aithor E-Book Reader

A modern, feature-rich web-based e-book reader application built with Next.js 16, featuring real-time API integration for book management, customizable reading experiences, and multi-language translation capabilities.

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## 🚀 Features

### 📚 Book Management
- Upload PDF and EPUB files (up to 50MB)
- Drag-and-drop file upload with progress tracking
- Automatic book processing and content extraction
- Book library with grid view
- Detailed book information (pages, words, estimated reading time)

### 🔐 Authentication & Security
- JWT-based authentication
- Secure token management
- Protected routes with automatic redirects
- User profile with reading statistics

### 📖 Reading Experience
- Page-by-page navigation
- Customizable reading settings:
  - Font size adjustment (12-24px)
  - Dark/Light theme toggle
  - Line height control (1.2-2.4)
- Real-time reading progress tracking
- HTML content rendering with proper typography
- Book statistics display (pages, words, reading time)

### 🌐 Translation
- Multi-language translation support
- 13 supported languages:
  - English, Spanish, French, German, Italian, Portuguese
  - Russian, Chinese, Japanese, Korean
  - Arabic, Hindi, Turkish
- Customizable tone and style
- Progress animation during translation

### 💻 User Interface
- Responsive mobile-first design
- Bottom navigation bar
- Loading states and error handling
- Intuitive user experience
- Status badges for book processing

## 🛠️ Technology Stack

- **Framework**: Next.js 16.0.7 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Turbopack
- **API**: RESTful API integration
- **Authentication**: JWT Bearer tokens
- **State Management**: React Hooks

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Git

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/EgeUnlu35/aithor.git
cd aithor
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
aithor/
├── app/
│   ├── book/[bookId]/          # Book details page
│   ├── login/                  # Authentication page
│   ├── profile/                # User profile
│   ├── reader/[bookId]/        # Book reader
│   ├── translate/[bookId]/     # Translation interface
│   ├── upload/                 # File upload
│   ├── page.tsx                # Home/Library
│   └── layout.tsx              # Root layout
├── lib/
│   ├── auth.ts                 # Authentication utilities
│   ├── api.ts                  # API integration
│   ├── storage.ts              # Local storage utilities
│   └── mockBooks.ts            # Type definitions
├── components/
│   └── BookCard.tsx            # Book display component
└── public/                     # Static assets
```

## 🔌 API Integration

The application connects to a backend API with the following endpoints:

### Authentication
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user info

### Books
- `GET /api/v1/books` - List user books (with pagination)
- `POST /api/v1/books/upload` - Upload new book
- `GET /api/v1/books/{book_id}` - Get book details
- `GET /api/v1/books/{book_id}/status` - Check processing status
- `GET /api/v1/books/{book_id}/stats` - Get book statistics
- `GET /api/v1/books/{book_id}/pages` - List book pages
- `GET /api/v1/books/{book_id}/pages/{page_number}` - Get page content

## 🎨 Key Components

### Authentication (`/lib/auth.ts`)
- `login(email, password)` - Authenticate user
- `getAuthToken()` - Retrieve stored token
- `clearAuthToken()` - Remove token and logout
- `isAuthenticated()` - Check authentication status
- `authenticatedFetch()` - Wrapper for authenticated API calls

### API Integration (`/lib/api.ts`)
- `fetchBooks()` - Get user's book list
- `fetchCurrentUser()` - Get user information
- `fetchBookDetails()` - Get book metadata
- `fetchBookStatus()` - Check processing status
- `fetchBookStats()` - Get book statistics
- `fetchPageContent()` - Get page content with navigation

## 🚦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔒 Security Features

- JWT token-based authentication
- Secure token storage in localStorage
- Protected routes with authentication checks
- Automatic redirect for unauthenticated users
- Bearer token included in all authenticated requests
- Token validation on page load

## 📱 Responsive Design

The application is built with a mobile-first approach:
- Optimized for touch interactions
- Responsive grid layouts
- Bottom navigation for easy thumb access
- Consistent spacing and typography
- Works seamlessly on phones, tablets, and desktops

## 🎯 User Flow

1. **Login**: User authenticates with email and password
2. **Library**: Browse and manage uploaded books
3. **Upload**: Add new books via drag-and-drop or file selection
4. **Details**: View book information and statistics
5. **Read**: Open reader with customizable settings
6. **Navigate**: Use Previous/Next to move through pages
7. **Translate**: Convert book to different languages
8. **Profile**: View reading statistics and manage account

## 🐛 Error Handling

- API error messages displayed to users
- Loading states during data fetching
- Graceful handling of network failures
- Book processing status monitoring
- Upload validation and feedback
- Authentication error redirects

## 🌟 Future Enhancements

- [ ] Reading progress persistence
- [ ] Bookmarks and annotations
- [ ] Search within books
- [ ] Book collections and shelves
- [ ] Social features (sharing, reviews)
- [ ] Offline reading support
- [ ] Additional file format support
- [ ] Advanced translation options
- [ ] Reading analytics dashboard

## 📄 License

This project is part of an academic assignment.

## 👥 Contributors

- Ege Ünlü - [@EgeUnlu35](https://github.com/EgeUnlu35)

## 🔗 Links

- Repository: [https://github.com/EgeUnlu35/aithor](https://github.com/EgeUnlu35/aithor)
- Issues: [https://github.com/EgeUnlu35/aithor/issues](https://github.com/EgeUnlu35/aithor/issues)

## 📞 Support

For support or questions, please open an issue on GitHub.

---

**Status**: Mid-Phase Complete ✅  
**Last Updated**: December 23, 2025
