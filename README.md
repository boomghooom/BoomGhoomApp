# BoomGhoom 🎉

A premium mobile app for city-based social events and group activities in India. Built with Expo, React Native, and TypeScript following Clean Architecture principles.

![BoomGhoom Logo](assets/icon.png)

## Features ✨

### Authentication
- 📱 Phone number + OTP verification
- 🔐 Google & Apple SSO support
- 🏙️ City-based location selection

### Events & Activities
- 🗺️ Interactive city map with event markers
- 📍 Location-based event discovery
- 🎯 Category-based filtering (Sports, Music, Food, Travel, etc.)
- 📅 Event creation with detailed settings
- 👥 Join requests with admin approval
- 📊 Gender ratio & average age display

### Social Features
- 👫 Friend system with requests
- 💬 Direct messaging with friends
- 🔔 Real-time notifications
- 👤 Detailed user profiles with ratings

### Finance & Monetization
- 💰 Due system (₹25 per event join)
- 📈 80% commission for event creators
- 💳 UPI/Card payment integration
- 🏦 Withdrawal with bank details

### KYC Verification
- 📷 Selfie capture for verification
- 🪪 Optional ID verification
- ✅ Verified badge for trusted users

## Tech Stack 🛠️

- **Framework**: Expo SDK 51
- **Language**: TypeScript (strict mode)
- **State Management**: Zustand
- **Navigation**: React Navigation v6
- **UI Components**: Custom components with Reanimated
- **Maps**: React Native Maps
- **Styling**: StyleSheet with centralized theme
- **Architecture**: Clean Architecture (Presentation, Domain, Data layers)

## Project Structure 📁

```
src/
├── domain/                 # Business logic & entities
│   └── entities/          # Core data models
│
├── data/                   # Data layer (future: API, repositories)
│
├── presentation/          # UI layer
│   ├── components/        # Reusable UI components
│   │   ├── base/         # Core components (Button, Input, Card, etc.)
│   │   └── shared/       # Feature-specific components
│   │
│   ├── screens/          # App screens
│   │   ├── auth/         # Authentication screens
│   │   ├── kyc/          # KYC verification screens
│   │   ├── main/         # Main app screens
│   │   ├── event/        # Event-related screens
│   │   ├── finance/      # Wallet & payments
│   │   └── social/       # Friends & chat
│   │
│   ├── navigation/       # Navigation configuration
│   ├── store/           # Zustand stores
│   └── theme/           # Design system
│
└── utils/               # Utility functions
```

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator / Android Emulator or physical device

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/boomghoom.git
cd boomghoom

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## Design System 🎨

### Colors

The app uses a gradient-inspired color palette derived from the logo:

- **Primary Orange**: `#FF8A50`
- **Primary Magenta**: `#E066A0`
- **Primary Purple**: `#9B6DFF`
- **Primary Blue**: `#5B8DEF`

### Typography

- Clean, modern sans-serif with clear visual hierarchy
- Font sizes follow a modular scale (1.25 ratio)
- Consistent letter spacing and line heights

### Spacing

Based on a 4px grid system:
- `xxs`: 4px
- `xs`: 8px
- `sm`: 12px
- `md`: 16px
- `lg`: 20px
- `xl`: 24px
- `2xl`: 32px

## Architecture Principles 🏗️

1. **SOLID Principles** - Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion

2. **Unidirectional Data Flow** - State flows down, events flow up

3. **Repository Pattern** - Data access abstraction

4. **Dependency Injection** - Loose coupling between modules

## Key Screens 📱

| Screen | Description |
|--------|-------------|
| Splash | Animated logo splash with gradient background |
| Onboarding | Swipeable introduction slides |
| Login/Signup | Phone + SSO authentication |
| City Selection | Location-based setup |
| Home | Interactive map with event discovery |
| Event Detail | Full event info with join actions |
| Create Event | Step-by-step event creation |
| Profile | User stats, wallet, and settings |
| Wallet | Dues, commissions, transactions |
| Friends | Friend list and requests |
| Chat | Direct messaging |

## Future Roadmap 🗺️

- [ ] Real-time chat with WebSockets
- [ ] Push notifications
- [ ] Event deep linking
- [ ] Group chat for events
- [ ] Advanced search & filters
- [ ] Event ratings & reviews
- [ ] Admin dashboard

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for connecting people through amazing experiences.

