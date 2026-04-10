# SkyCast - Weather App

A modern, beautiful weather application built with React Native and Expo.


https://github.com/user-attachments/assets/fe61c28e-209b-4813-a595-139c66e56d4e




## Features

### 🌤 Core Functionality
- **Current Weather Display** - Real-time weather data with temperature, conditions, and forecasts
- **City Search** - Advanced search with live results, recent searches, and haptic feedback
- **Location Services** - GPS-based location detection with fallback to manual city selection
- **Weather Forecasts** - Hourly and 5-day forecasts with detailed weather information
- **Responsive Design** - Optimized for various screen sizes and orientations

### 🎨 UI/UX Features
- **Glassmorphism Design** - Modern frosted glass effects with blur and transparency
- **Animated Transitions** - Smooth entrance animations and micro-interactions
- **Haptic Feedback** - Satisfying tactile responses for user actions
- **Skeleton Loading** - Beautiful shimmer effects while data loads
- **Error Handling** - User-friendly error screens with retry functionality
- **Dark Theme** - Optimized for OLED displays with proper contrast

### 🛠 Technical Stack
- **React Native** - Cross-platform mobile development
- **Expo Router** - File-based routing with type-safe navigation
- **TypeScript** - Type safety and developer experience
- **React Native Reanimated** - 60fps animations and gestures
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **Expo Blur** - Native blur effects for glassmorphism
- **Expo Haptics** - Tactile feedback system
- **AsyncStorage** - Persistent recent searches storage
- **OpenWeatherMap API** - Real-time weather data integration

### 📱 Project Structure
```
skycast/
├── app/                    # Screens and routing
│   ├── _layout.tsx         # Root layout with context provider
│   ├── index.tsx           # Home screen with weather display
│   └── search.tsx          # City search with live results
├── components/               # Reusable UI components
│   ├── WeatherBackground.tsx
│   ├── WeatherIcon.tsx
│   ├── StatCard.tsx
│   ├── SearchResultCard.tsx
│   ├── HourlyForecast.tsx
│   ├── HourlyCard.tsx
│   ├── DailyForecast.tsx
│   ├── DailyRow.tsx
│   ├── SkeletonLoader.tsx
│   └── ErrorScreen.tsx
├── hooks/                   # Custom React hooks
│   ├── useLocation.ts
│   ├── useWeather.ts
│   ├── useDebounce.ts
│   └── useWeatherContext.tsx
├── utils/                   # Utility functions
│   ├── api.ts                # OpenWeatherMap API integration
│   ├── weatherHelpers.ts      # Weather data formatting
│   ├── recentSearches.ts     # AsyncStorage management
│   ├── haptics.ts           # Haptic feedback utilities
│   └── WeatherContext.tsx   # Global state management
├── constants/                # App constants
│   └── theme.ts            # Color schemes and styling
└── assets/                   # Images and fonts
```

### 🚀 Getting Started

#### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Physical iOS/Android device or simulator
- OpenWeatherMap API key (stored in `app.json`)

#### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/skycast.git
cd skycast

# Install dependencies
npm install

# Start the development server
npx expo start
```

#### Configuration
1. **API Key Setup**:
   - Add your OpenWeatherMap API key to `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "WEATHER_API_KEY": "your_api_key_here"
       }
     }
   }
   ```

2. **Environment Variables** (Optional):
   ```bash
   # For development
   echo "EXPO_PUBLIC_WEATHER_API_KEY=your_key_here" > .env.local
   
   # For production
   expo build:android --release-channel
   ```

### 🎯 Key Features Implementation

#### Weather Context System
The app uses a centralized `WeatherContext` for state management:
- **Location Selection**: GPS coordinates vs. manual city search
- **Global State**: Shared across all screens
- **Type Safety**: Full TypeScript integration

#### Advanced Search System
- **Live Search**: 500ms debounced API calls as user types
- **Recent Searches**: Persistent storage with AsyncStorage (max 5 cities)
- **Search Results**: Real-time weather cards with animated appearance
- **Haptic Feedback**: Satisfying tactile responses for all interactions

#### Animation System
- **Entrance Animations**: Smooth fade-in effects when data loads
- **Micro-interactions**: Scale and spring animations for buttons and cards
- **Loading States**: Beautiful skeleton shimmer while fetching data
- **Screen Transitions**: Seamless navigation between states

### 🎨 Design System

#### Color Scheme
- **Primary Gradients**: Dynamic based on weather conditions
- **Glassmorphism**: Blur effects with proper opacity layers
- **Dark Theme**: Optimized for OLED and battery efficiency
- **Typography**: Clean, readable font hierarchy

#### Component Architecture
- **Atomic Design**: Small, focused components with single responsibilities
- **Reusability**: Consistent props and styling patterns
- **Performance**: Optimized animations with 60fps Reanimated
- **Accessibility**: Proper screen reader support and semantic markup

### 📊 Data Flow

#### Weather Data Pipeline
1. **Location Detection** → GPS coordinates or manual city selection
2. **API Integration** → OpenWeatherMap current weather and forecast
3. **State Management** → WeatherContext updates trigger data refresh
4. **UI Updates** → Real-time display updates with smooth transitions

### 🔧 Development Workflow

#### Code Quality
- **TypeScript**: Full type safety with strict mode
- **ESLint**: Consistent code formatting and linting rules
- **Prettier**: Automated code formatting
- **Git Hooks**: Pre-commit hooks for code quality

#### Testing Strategy
- **Component Testing**: Unit tests for individual components
- **Integration Testing**: End-to-end user flow testing
- **Performance Testing**: Animation smoothness and memory usage

### 📱 Platform Support

#### iOS
- Native iOS performance with 60fps animations
- Haptic feedback via Taptic Engine
- Proper status bar handling
- Adaptive layouts for various iPhone sizes

#### Android
- Material Design integration with platform-specific components
- Haptic feedback via native vibration
- Optimized for various Android devices
- Proper back navigation handling

### 🚀 Build & Deployment

#### Development Build
```bash
npx expo start --dev
```

#### Production Build
```bash
# Android
expo build:android --release-channel

# iOS
expo build:ios --release-channel
```

#### App Store Deployment
- **Google Play Store**: Ready for Android deployment
- **Apple App Store**: Ready for iOS deployment
- **Over-the-Air**: Expo OTA updates for instant distribution

### 🤝 Contributing

#### Development Guidelines
1. **Fork the repository** and create a feature branch
2. **Follow TypeScript patterns** and maintain type safety
3. **Test thoroughly** before submitting pull requests
4. **Document changes** with clear commit messages
5. **Respect existing architecture** and design patterns

#### Code Style
- Use functional components with hooks
- Maintain consistent naming conventions
- Add proper TypeScript interfaces
- Include JSDoc comments for complex functions
- Follow React Native best practices

### 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

### 👥 Support

For questions, issues, or feature requests:
- 📧 Create an [Issue](https://github.com/your-username/skycast/issues)
- 💬 Start a [Discussion](https://github.com/your-username/skycast/discussions)
- 📧 Email: support@skycast.app

---

**Built with ❤️ using React Native & Expo**
