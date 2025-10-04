# PayShield Frontend Development Guide

## 🏗️ Architecture Overview

This React frontend is built with Vite and follows modern React patterns:

### **Component Structure:**
```
src/
├── App.jsx              # Main application component
├── main.jsx             # React DOM entry point  
├── index.css            # Global styles & CSS variables
├── App.css              # App-specific styles
└── components/
    ├── ProductGrid.jsx   # Product listing component
    ├── Cart.jsx          # Shopping cart component
    ├── MfaModal.jsx      # Multi-factor authentication modal
    └── Message.jsx       # Success/error message component
```

## 🎨 **Styling Strategy**

- **CSS Modules** for component-scoped styles
- **CSS Variables** for consistent theming
- **Modern CSS** with Grid & Flexbox
- **Responsive Design** with mobile-first approach

## 🔄 **State Management**

Currently using React's built-in `useState` for:
- Shopping cart items
- MFA modal visibility  
- Form inputs and loading states
- Success/error messages

**For Future Enhancement:**
- Consider **Zustand** or **Redux Toolkit** for complex state
- **React Query** for API state management
- **React Hook Form** for advanced form handling

## 🌐 **API Integration**

### **Backend Communication:**
```javascript
// Development: Vite proxy handles API calls
fetch('/api/preauth', { /* ... */ })

// Production: Direct backend calls  
fetch('http://localhost:3001/api/preauth', { /* ... */ })
```

### **Environment Variables:**
```bash
# frontend/.env
VITE_BACKEND_URL=http://localhost:3001
```

## 🧪 **Development Workflow**

### **Hot Module Replacement:**
Changes to React components update instantly without losing state.

### **Component Development:**
1. Create new component in `src/components/`
2. Import and use in parent components
3. Add corresponding CSS file for styling
4. Test in browser with live reload

### **API Testing:**
- Backend must be running on port 3001
- Use browser dev tools Network tab to debug API calls
- Console.log responses during development

## 📦 **Build Process**

### **Development Build:**
```bash
npm run dev
# Starts Vite dev server on http://localhost:3000
# Enables HMR, source maps, and proxy to backend
```

### **Production Build:**
```bash
npm run build
# Creates optimized bundle in /dist
# Minifies JavaScript, optimizes assets
# Backend automatically serves from /dist if available
```

## 🔧 **Configuration Files**

### **vite.config.js:**
- React plugin configuration
- Development server settings  
- Proxy configuration for API calls
- Build output directory

### **package.json:**
- Dependencies for React, Vite
- Development and build scripts
- Version management

## 🚀 **Future Enhancements**

### **Recommended Additions:**
- **React Router** for multi-page navigation
- **Material-UI** or **Chakra UI** for component library
- **React Hook Form** for advanced form handling
- **React Query** for server state management
- **TypeScript** for type safety
- **Vitest** for unit testing
- **Storybook** for component documentation

### **Advanced Features:**
- User authentication & profiles
- Order history and tracking  
- Advanced payment methods
- Real-time notifications
- Progressive Web App (PWA) capabilities

## 📱 **Mobile Responsiveness**

The current design is mobile-first with:
- Responsive grid layouts
- Touch-friendly button sizes
- Modal dialogs that work on mobile
- Flexible typography scaling

## 🎯 **Performance Considerations**

- **Code Splitting** via dynamic imports
- **Lazy Loading** for non-critical components
- **Memoization** for expensive calculations
- **Virtual Scrolling** for large lists (if needed)

## 🛠️ **Debugging Tips**

### **React Developer Tools:**
Install browser extension for component inspection

### **Vite Dev Tools:**
- Network tab shows API calls
- Console shows React errors
- Hot reload preserves component state

### **Common Issues:**
- **CORS errors**: Ensure backend CORS is configured
- **Proxy issues**: Check vite.config.js proxy settings
- **Build failures**: Ensure all imports are correct