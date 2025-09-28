import SpotifyService from './spotifyService';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env';

// Configuration for environment variables
// Environment variables are loaded from .env file via react-native-dotenv

// Create singleton instance
const spotifyService = new SpotifyService(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);

export default spotifyService;

// Helper function to check if Spotify is configured
export const isSpotifyConfigured = (): boolean => {
  return !!(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET);
};