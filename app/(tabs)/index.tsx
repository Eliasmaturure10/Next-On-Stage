import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ArtistSearch from '@/components/ArtistSearch';
import ArtistProfile from '@/components/ArtistProfile';
import type { SpotifyArtist } from '@/services/spotifyService';

export default function HomeScreen() {
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(null);

  const handleArtistSelect = (artist: SpotifyArtist) => {
    setSelectedArtist(artist);
  };

  const handleBackToSearch = () => {
    setSelectedArtist(null);
  };

  return (
    <ThemedView style={styles.container}>
      {selectedArtist ? (
        <ArtistProfile 
          artist={selectedArtist} 
          onBack={handleBackToSearch}
        />
      ) : (
        <>
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Next on Stage
            </ThemedText>
            <ThemedText type="default" style={styles.subtitle}>
              Discover artists and find their next concerts
            </ThemedText>
          </ThemedView>
          
          <ArtistSearch 
            onArtistSelect={handleArtistSelect}
            placeholder="Search for your favorite artists..."
          />
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
