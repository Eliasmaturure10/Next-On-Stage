import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import spotifyService from '@/services';
import type { SpotifyArtist } from '@/services/spotifyService';

interface ArtistProfileProps {
  artist: SpotifyArtist;
  onBack?: () => void;
}

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

interface Album {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date: string;
  external_urls: {
    spotify: string;
  };
}

export function ArtistProfile({ artist, onBack }: ArtistProfileProps) {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const linkColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'text');

  useEffect(() => {
    loadArtistData();
  }, [artist.id]);

  const loadArtistData = async () => {
    setLoading(true);
    try {
      const [tracksData, albumsData] = await Promise.all([
        spotifyService.getArtistTopTracks(artist.id),
        spotifyService.getArtistAlbums(artist.id, 10),
      ]);
      
      setTopTracks(tracksData.slice(0, 5)); // Show top 5 tracks
      setAlbums(albumsData.slice(0, 6)); // Show 6 albums
    } catch (error) {
      console.error('Error loading artist data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const openSpotifyLink = (url: string) => {
    Linking.openURL(url).catch((err) => {
      console.error('Error opening Spotify link:', err);
    });
  };

  const renderPopularityBar = (popularity: number) => {
    const widthPercentage = `${popularity}%` as const;
    return (
      <View style={styles.popularityBarContainer}>
        <View style={[styles.popularityBar, { width: widthPercentage, backgroundColor: linkColor }]} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.content}>
        {/* Back Button */}
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ThemedText type="link">← Back to Search</ThemedText>
          </TouchableOpacity>
        )}

        {/* Artist Header */}
        <View style={styles.header}>
          {artist.images && artist.images.length > 0 ? (
            <Image
              source={{ uri: artist.images[0].url }}
              style={styles.artistImage}
            />
          ) : (
            <View style={[styles.artistImage, styles.placeholderImage]}>
              <ThemedText type="title">♪</ThemedText>
            </View>
          )}
          
          <ThemedText type="title" style={styles.artistName}>
            {artist.name}
          </ThemedText>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                {formatFollowers(artist.followers.total)}
              </ThemedText>
              <ThemedText type="default" style={styles.statLabel}>
                Followers
              </ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                {artist.popularity}
              </ThemedText>
              <ThemedText type="default" style={styles.statLabel}>
                Popularity
              </ThemedText>
            </View>
          </View>

          {/* Popularity Bar */}
          <View style={styles.popularitySection}>
            <ThemedText type="default" style={styles.sectionLabel}>
              Popularity Score
            </ThemedText>
            {renderPopularityBar(artist.popularity)}
            <ThemedText type="default" style={styles.popularityText}>
              {artist.popularity}/100
            </ThemedText>
          </View>

          {/* Genres */}
          {artist.genres && artist.genres.length > 0 && (
            <View style={styles.genresContainer}>
              <ThemedText type="default" style={styles.sectionLabel}>
                Genres
              </ThemedText>
              <View style={styles.genresList}>
                {artist.genres.slice(0, 4).map((genre, index) => (
                  <View key={index} style={[styles.genreTag, { borderColor }]}>
                    <ThemedText type="default" style={styles.genreText}>
                      {genre}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Spotify Link */}
          <TouchableOpacity
            style={[styles.spotifyButton, { backgroundColor: linkColor }]}
            onPress={() => openSpotifyLink(artist.external_urls.spotify)}
          >
            <ThemedText type="defaultSemiBold" style={styles.spotifyButtonText}>
              Open in Spotify
            </ThemedText>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={linkColor} />
            <ThemedText type="default" style={styles.loadingText}>
              Loading artist details...
            </ThemedText>
          </View>
        ) : (
          <>
            {/* Top Tracks */}
            {topTracks.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Top Tracks
                </ThemedText>
                {topTracks.map((track, index) => (
                  <TouchableOpacity
                    key={track.id}
                    style={styles.trackItem}
                    onPress={() => openSpotifyLink(track.external_urls.spotify)}
                  >
                    <ThemedText type="default" style={styles.trackNumber}>
                      {index + 1}
                    </ThemedText>
                    <ThemedText type="defaultSemiBold" style={styles.trackName}>
                      {track.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Albums */}
            {albums.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Recent Albums
                </ThemedText>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.albumsScroll}
                >
                  {albums.map((album) => (
                    <TouchableOpacity
                      key={album.id}
                      style={styles.albumItem}
                      onPress={() => openSpotifyLink(album.external_urls.spotify)}
                    >
                      {album.images && album.images.length > 0 ? (
                        <Image
                          source={{ uri: album.images[0].url }}
                          style={styles.albumImage}
                        />
                      ) : (
                        <View style={[styles.albumImage, styles.placeholderAlbum]}>
                          <ThemedText type="default">♪</ThemedText>
                        </View>
                      )}
                      <ThemedText 
                        type="default" 
                        style={styles.albumName}
                        numberOfLines={2}
                      >
                        {album.name}
                      </ThemedText>
                      <ThemedText type="default" style={styles.albumYear}>
                        {new Date(album.release_date).getFullYear()}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  artistImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  placeholderImage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistName: {
    textAlign: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
  },
  statLabel: {
    opacity: 0.7,
    fontSize: 12,
  },
  popularitySection: {
    width: '100%',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  popularityBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginBottom: 4,
  },
  popularityBar: {
    height: '100%',
    borderRadius: 3,
  },
  popularityText: {
    textAlign: 'right',
    fontSize: 12,
    opacity: 0.6,
  },
  genresContainer: {
    width: '100%',
    marginBottom: 24,
  },
  genresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  genreText: {
    fontSize: 12,
  },
  spotifyButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  spotifyButtonText: {
    color: 'white',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  trackNumber: {
    width: 24,
    textAlign: 'center',
    opacity: 0.7,
  },
  trackName: {
    flex: 1,
    marginLeft: 12,
  },
  albumsScroll: {
    marginHorizontal: -8,
  },
  albumItem: {
    width: 120,
    marginHorizontal: 8,
  },
  albumImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeholderAlbum: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumName: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  albumYear: {
    fontSize: 10,
    opacity: 0.6,
    textAlign: 'center',
  },
});

export default ArtistProfile;