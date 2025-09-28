import axios from 'axios';

// Spotify API endpoints
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

// Types for Spotify API responses
export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[];
    total: number;
  };
}

class SpotifyService {
  private accessToken: string | null = null;
  private tokenExpiration: number = 0;

  constructor(
    private clientId: string,
    private clientSecret: string
  ) {}

  /**
   * Get access token using Client Credentials flow
   * This is suitable for app-only requests that don't require user authorization
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiration) {
      return this.accessToken;
    }

    try {
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        SPOTIFY_TOKEN_URL,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiration time (subtract 5 minutes for buffer)
      this.tokenExpiration = Date.now() + (response.data.expires_in * 1000) - 300000;
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw new Error('Failed to authenticate with Spotify API');
    }
  }

  /**
   * Search for artists by name
   */
  async searchArtists(query: string, limit: number = 20): Promise<SpotifyArtist[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get<SpotifySearchResponse>(
        `${SPOTIFY_API_BASE}/search`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params: {
            q: query,
            type: 'artist',
            limit: limit,
          },
        }
      );

      return response.data.artists.items;
    } catch (error) {
      console.error('Error searching artists:', error);
      throw new Error('Failed to search artists');
    }
  }

  /**
   * Get artist by ID
   */
  async getArtist(artistId: string): Promise<SpotifyArtist> {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get<SpotifyArtist>(
        `${SPOTIFY_API_BASE}/artists/${artistId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting artist:', error);
      throw new Error('Failed to get artist information');
    }
  }

  /**
   * Get artist's top tracks
   */
  async getArtistTopTracks(artistId: string, country: string = 'US') {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(
        `${SPOTIFY_API_BASE}/artists/${artistId}/top-tracks`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params: {
            market: country,
          },
        }
      );

      return response.data.tracks;
    } catch (error) {
      console.error('Error getting artist top tracks:', error);
      throw new Error('Failed to get artist top tracks');
    }
  }

  /**
   * Get artist's albums
   */
  async getArtistAlbums(artistId: string, limit: number = 20) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(
        `${SPOTIFY_API_BASE}/artists/${artistId}/albums`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params: {
            include_groups: 'album,single',
            market: 'US',
            limit: limit,
          },
        }
      );

      return response.data.items;
    } catch (error) {
      console.error('Error getting artist albums:', error);
      throw new Error('Failed to get artist albums');
    }
  }
}

export default SpotifyService;