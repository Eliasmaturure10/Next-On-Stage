# Next on Stage 🎵

A React Native concert discovery app built with Expo and integrated with the Spotify Web API. Find your favorite artists, discover their music, and book tickets for upcoming concerts.

## Features

- 🔍 **Artist Search**: Search for artists using the Spotify Web API
- 🎨 **Artist Profiles**: View detailed artist information, including:
  - Follower count and popularity score
  - Top tracks and recent albums
  - Genre information
  - Direct Spotify links
- 🎪 **Concert Discovery**: Browse upcoming concerts and events
- 🎯 **Genre Exploration**: Discover new music by genre
- 🌙 **Dark/Light Mode**: Full theme support

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Spotify API

To enable artist search functionality, you need to set up Spotify API credentials:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in the app details:
   - **App Name**: Next on Stage
   - **App Description**: Concert discovery app
   - **Redirect URIs**: Not needed for this app
   - **Which API/SDKs are you planning to use**: Web API
4. Click "Save"
5. Copy your **Client ID** and **Client Secret**

### 3. Environment Configuration

Create a `.env` file in the root directory and add your Spotify credentials:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

> **Note**: The `.env` file is already added to `.gitignore` to keep your credentials secure.

### 4. Start the App

```bash
npx expo start
```

In the output, you'll find options to open the app in:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Project Structure

```
app/
  (tabs)/
    index.tsx          # Home screen with artist search
    explore.tsx        # Discover trending artists and concerts
    _layout.tsx        # Tab navigation layout
components/
  ArtistSearch.tsx     # Artist search component
  ArtistProfile.tsx    # Detailed artist profile view
  ThemedText.tsx       # Themed text component
  ThemedView.tsx       # Themed view component
services/
  spotifyService.ts    # Spotify API integration
  index.ts            # Service exports and configuration
```

## API Integration

The app uses the Spotify Web API with the following endpoints:

- **Search Artists**: `/search?type=artist`
- **Get Artist**: `/artists/{id}`
- **Artist Top Tracks**: `/artists/{id}/top-tracks`
- **Artist Albums**: `/artists/{id}/albums`

Authentication is handled using the Client Credentials flow, which is perfect for app-only requests that don't require user authorization.

## Customization

### Adding New Features

1. **Concert Booking API**: Integrate with Ticketmaster or similar APIs
2. **User Favorites**: Add local storage for favorite artists
3. **Push Notifications**: Notify users about new concerts
4. **Social Features**: Share discoveries with friends

### Styling

The app uses a theme system with light/dark mode support. Customize colors in:
- `constants/Colors.ts`
- `hooks/useThemeColor.ts`

## Technologies Used

- **React Native** with **Expo** for cross-platform development
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **Axios** for HTTP requests
- **Spotify Web API** for music data

## Troubleshooting

### Artist Search Not Working

1. Verify your Spotify API credentials in the `.env` file
2. Check that your Spotify app is not in Development Mode (if applicable)
3. Ensure you have an active internet connection
4. Check the console for API error messages

### Environment Variables Not Loading

- Restart the development server after adding the `.env` file
- Ensure the `.env` file is in the root directory
- Check that variable names match exactly: `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for music data
- [Expo](https://expo.dev/) for the development platform
- Concert mockup data inspired by real venues and artists