import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ArtistSearch } from '@/components/ArtistSearch';
import { useThemeColor } from '@/hooks/useThemeColor';
import type { SpotifyArtist } from '@/services/spotifyService';

export default function ExploreScreen() {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'text');
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(null);

  const handleArtistSelect = (artist: SpotifyArtist) => {
    setSelectedArtist(artist);
  };

  const popularGenres = [
    '🎸 Rock', '🎵 Pop', '🎤 Hip Hop', '🎶 Jazz',
    '🎺 Blues', '⚡ Electronic', '🎻 Classical', '🤠 Country'
  ];

  const featuredArtists = [
    { name: 'Drake', genre: 'Hip Hop', listeners: '85M' },
    { name: 'Taylor Swift', genre: 'Pop', listeners: '90M' },
    { name: 'Kendrick Lamar', genre: 'Hip Hop', listeners: '65M' },
    { name: 'The Weeknd', genre: 'R&B', listeners: '78M' },
  ];

  const upcomingConcerts = [
    { artist: 'Arctic Monkeys', venue: 'Madison Square Garden', date: 'Oct 15, 2025', price: '$150-$300' },
    { artist: 'Billie Eilish', venue: 'Hollywood Bowl', date: 'Nov 22, 2025', price: '$80-$200' },
    { artist: 'John Mayer', venue: 'Red Rocks', date: 'Dec 5, 2025', price: '$120-$250' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Discover Music
          </ThemedText>
          <ThemedText type="default" style={styles.subtitle}>
            Explore trending artists and genres
          </ThemedText>
        </ThemedView>

        {/* Artist Search */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Search Artists
          </ThemedText>
          <ArtistSearch 
            onArtistSelect={handleArtistSelect}
            placeholder="Search for any artist on Spotify..."
          />
          {selectedArtist && (
            <ThemedView style={styles.selectedArtistCard}>
              <ThemedText type="defaultSemiBold" style={styles.selectedArtistName}>
                ✨ Selected: {selectedArtist.name}
              </ThemedText>
              <ThemedText type="default" style={styles.selectedArtistInfo}>
                {selectedArtist.genres.join(', ')} • {selectedArtist.followers.total.toLocaleString()} followers
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Popular Genres */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Popular Genres
          </ThemedText>
          <View style={styles.genreGrid}>
            {popularGenres.map((genre, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.genreCard, { borderColor }]}
                activeOpacity={0.7}
              >
                <ThemedText type="defaultSemiBold" style={styles.genreText}>
                  {genre}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        {/* Featured Artists */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Trending Artists
          </ThemedText>
          {featuredArtists.map((artist, index) => (
            <TouchableOpacity
              key={index}
              style={styles.artistCard}
              activeOpacity={0.7}
            >
              <View style={styles.artistInfo}>
                <ThemedText type="defaultSemiBold" style={styles.artistName}>
                  {artist.name}
                </ThemedText>
                <ThemedText type="default" style={styles.artistGenre}>
                  {artist.genre} • {artist.listeners} monthly listeners
                </ThemedText>
              </View>
              <ThemedText type="link" style={styles.viewButton}>
                View →
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Upcoming Concerts */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Upcoming Concerts
          </ThemedText>
          {upcomingConcerts.map((concert, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.concertCard, { backgroundColor: tintColor + '20' }]}
              activeOpacity={0.7}
            >
              <View style={styles.concertHeader}>
                <ThemedText type="defaultSemiBold" style={styles.concertArtist}>
                  {concert.artist}
                </ThemedText>
                <ThemedText type="default" style={styles.concertPrice}>
                  {concert.price}
                </ThemedText>
              </View>
              <ThemedText type="default" style={styles.concertDetails}>
                📍 {concert.venue}
              </ThemedText>
              <ThemedText type="default" style={styles.concertDetails}>
                📅 {concert.date}
              </ThemedText>
              <TouchableOpacity
                style={[styles.bookButton, { backgroundColor: tintColor }]}
                activeOpacity={0.8}
              >
                <ThemedText type="defaultSemiBold" style={styles.bookButtonText}>
                  Book Now
                </ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Tips */}
        <ThemedView style={styles.instructionsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            💡 Discovery Tips
          </ThemedText>
          <ThemedView style={styles.instructionCard}>
            <ThemedText type="default" style={styles.instructionText}>
              ✅ Spotify integration is active!
              {'\n\n'}🔍 Use the search above to find any artist on Spotify
              {'\n'}🎵 Click on genres to explore different music styles
              {'\n'}🎤 Tap "View" on any artist to see more details
              {'\n'}🎫 Check out upcoming concerts near you
              {'\n\n'}Search for artists like: "Taylor Swift", "Drake", "The Beatles", "Adele"
            </ThemedText>
          </ThemedView>
        </ThemedView>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genreCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  genreText: {
    fontSize: 14,
  },
  artistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    marginBottom: 4,
  },
  artistGenre: {
    fontSize: 12,
    opacity: 0.7,
  },
  viewButton: {
    fontSize: 14,
  },
  concertCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  concertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  concertArtist: {
    fontSize: 18,
  },
  concertPrice: {
    fontSize: 14,
    opacity: 0.8,
  },
  concertDetails: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  bookButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
  },
  instructionsSection: {
    marginTop: 20,
  },
  instructionCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  selectedArtistCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.3)',
  },
  selectedArtistName: {
    fontSize: 16,
    marginBottom: 4,
  },
  selectedArtistInfo: {
    fontSize: 12,
    opacity: 0.7,
  },
});