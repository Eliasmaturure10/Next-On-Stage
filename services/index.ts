import SpotifyService from './spotifyService';

// Configuration for environment variables
// In a real app, you would get these from your environment variables
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';

// Create singleton instance
const spotifyService = new SpotifyService(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);

export default spotifyService;

// Helper function to check if Spotify is configured
export const isSpotifyConfigured = (): boolean => {
  return !!(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET);
};