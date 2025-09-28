import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import spotifyService, { isSpotifyConfigured } from '@/services';
import type { SpotifyArtist } from '@/services/spotifyService';

interface ArtistSearchProps {
  onArtistSelect?: (artist: SpotifyArtist) => void;
  placeholder?: string;
}

export function ArtistSearch({ onArtistSelect, placeholder = "Search for artists..." }: ArtistSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const borderColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  useEffect(() => {
    if (!isSpotifyConfigured()) {
      setError('Spotify API not configured. Please add your credentials to the .env file.');
      return;
    }

    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        searchArtists();
      } else {
        setArtists([]);
      }
    }, 500); // Debounce search

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const searchArtists = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const results = await spotifyService.searchArtists(searchQuery, 10);
      setArtists(results);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search artists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleArtistPress = (artist: SpotifyArtist) => {
    onArtistSelect?.(artist);
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M followers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K followers`;
    }
    return `${count} followers`;
  };

  const renderArtistItem = ({ item }: { item: SpotifyArtist }) => (
    <TouchableOpacity
      style={styles.artistItem}
      onPress={() => handleArtistPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.artistContent}>
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: item.images[0].url }}
            style={styles.artistImage}
          />
        ) : (
          <View style={[styles.artistImage, styles.placeholderImage]}>
            <ThemedText type="default">♪</ThemedText>
          </View>
        )}
        
        <View style={styles.artistInfo}>
          <ThemedText type="defaultSemiBold" style={styles.artistName}>
            {item.name}
          </ThemedText>
          
          <ThemedText type="default" style={styles.artistDetails}>
            {formatFollowers(item.followers.total)}
          </ThemedText>
          
          {item.genres && item.genres.length > 0 && (
            <ThemedText type="default" style={styles.genres}>
              {item.genres.slice(0, 2).join(', ')}
            </ThemedText>
          )}
          
          <View style={styles.popularityContainer}>
            <ThemedText type="default" style={styles.popularity}>
              Popularity: {item.popularity}/100
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const showConfigurationAlert = () => {
    Alert.alert(
      'Spotify API Configuration Required',
      'To use artist search, you need to:\n\n1. Go to https://developer.spotify.com/dashboard\n2. Create a new app\n3. Copy your Client ID and Client Secret\n4. Add them to your .env file',
      [{ text: 'OK' }]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { borderColor }]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {loading && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="small"
            color={borderColor}
          />
        )}
      </View>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText type="default" style={styles.errorText}>
            {error}
          </ThemedText>
          {!isSpotifyConfigured() && (
            <TouchableOpacity onPress={showConfigurationAlert}>
              <ThemedText type="link" style={styles.configLink}>
                Setup Instructions
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      )}

      <FlatList
        data={artists}
        keyExtractor={(item) => item.id}
        renderItem={renderArtistItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  loadingIndicator: {
    marginLeft: 12,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
    marginBottom: 8,
  },
  configLink: {
    textAlign: 'center',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  artistItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  artistContent: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  placeholderImage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  artistName: {
    fontSize: 18,
    marginBottom: 4,
  },
  artistDetails: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  genres: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  popularityContainer: {
    marginTop: 4,
  },
  popularity: {
    fontSize: 12,
    opacity: 0.6,
  },
});

export default ArtistSearch;