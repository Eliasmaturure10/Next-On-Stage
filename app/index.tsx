import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const NextOnStageApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [favoriteArtists, setFavoriteArtists] = useState([
    { id: 1, name: 'Drake', color: '#2563eb' },
    { id: 2, name: 'Taylor Swift', color: '#2563eb' },
    { id: 3, name: 'Lil Baby', color: '#2563eb' },
    { id: 4, name: 'Dax', color: '#2563eb' },
    { id: 5, name: 'Kendrick Lamar', color: '#2563eb' }
  ]);
  
  const [upcomingShows, setUpcomingShows] = useState([
    {
      id: 1,
      artist: 'Drake',
      location: 'Madison Square Garden, NYC',
      cost: '$150 - $300',
      date: 'Aug 15, 2025',
      time: '8:00 PM',
    },
    {
      id: 2,
      artist: 'Taylor Swift',
      location: 'SoFi Stadium, LA',
      cost: '$200 - $500',
      date: 'Sep 3, 2025',
      time: '7:30 PM',
    }
  ]);

  const [bookedShows, setBookedShows] = useState([]);
  const [savedShows, setSavedShows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allShows = [
    ...upcomingShows,
    {
      id: 3,
      artist: 'Kendrick Lamar',
      location: 'Chicago United Center',
      cost: '$120 - $250',
      date: 'Oct 12, 2025',
      time: '8:30 PM',
    },
    {
      id: 4,
      artist: 'Lil Baby',
      location: 'Atlanta State Farm Arena',
      cost: '$80 - $180',
      date: 'Nov 5, 2025',
      time: '9:00 PM',
    },
    {
      id: 5,
      artist: 'Dax',
      location: 'Toronto Scotiabank Arena',
      cost: '$60 - $120',
      date: 'Dec 1, 2025',
      time: '8:00 PM',
    }
  ];

  const filteredShows = allShows.filter(show => 
    show.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    show.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookShow = (show) => {
    setSelectedShow(show);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (selectedShow) {
      setBookedShows([...bookedShows, selectedShow]);
      setShowBookingModal(false);
      setSelectedShow(null);
      Alert.alert('Success', 'Show booked successfully!');
    }
  };

  const toggleSaveShow = (show) => {
    const isAlreadySaved = savedShows.find(s => s.id === show.id);
    if (isAlreadySaved) {
      setSavedShows(savedShows.filter(s => s.id !== show.id));
    } else {
      setSavedShows([...savedShows, show]);
    }
  };

  const ShowCard = ({ show, showBookButton = true }) => {
    const isShowSaved = savedShows.find(s => s.id === show.id);
    
    return (
      <View style={styles.showCard}>
        <View style={styles.showCardHeader}>
          <Text style={styles.showArtist}>{show.artist}</Text>
          <TouchableOpacity
            style={[styles.heartButton, isShowSaved && styles.heartButtonSaved]}
            onPress={() => toggleSaveShow(show)}
          >
            <Ionicons 
              name={isShowSaved ? 'heart' : 'heart-outline'} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.showDetails}>
          <View style={styles.showDetailRow}>
            <Ionicons name="location" size={16} color="white" />
            <Text style={styles.showDetailText}>{show.location}</Text>
          </View>
          <View style={styles.showDetailRow}>
            <Ionicons name="cash" size={16} color="white" />
            <Text style={styles.showDetailText}>{show.cost}</Text>
          </View>
          <View style={styles.showDetailRow}>
            <Ionicons name="calendar" size={16} color="white" />
            <Text style={styles.showDetailText}>{show.date}</Text>
          </View>
          <View style={styles.showDetailRow}>
            <Ionicons name="time" size={16} color="white" />
            <Text style={styles.showDetailText}>{show.time}</Text>
          </View>
        </View>
        
        {showBookButton && (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => handleBookShow(show)}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const Sidebar = () => (
    <Modal
      visible={sidebarOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSidebarOpen(false)}
    >
      <View style={styles.sidebarOverlay}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <View style={styles.accountSection}>
              <View style={styles.accountIcon} />
              <Text style={styles.accountText}>My Account</Text>
            </View>
            <TouchableOpacity onPress={() => setSidebarOpen(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.favoriteSection}>
            <Text style={styles.favoriteTitle}>My favorite Artists</Text>
            <FlatList
              data={favoriteArtists}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.artistItem}>
                  <View style={[styles.artistIcon, { backgroundColor: item.color }]} />
                  <Text style={styles.artistName}>{item.name}</Text>
                </View>
              )}
            />
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Explore other Artists</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const TabButton = ({ title, tabKey, count }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tabKey && styles.tabButtonActive
      ]}
      onPress={() => setActiveTab(tabKey)}
    >
      <Text style={[
        styles.tabButtonText,
        activeTab === tabKey && styles.tabButtonTextActive
      ]}>
        {title} {count !== undefined && `(${count})`}
      </Text>
    </TouchableOpacity>
  );

  const renderHomeContent = () => (
    <ScrollView style={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Shows</Text>
        {upcomingShows.map(show => (
          <ShowCard key={show.id} show={show} />
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        {allShows.slice(2, 4).map(show => (
          <ShowCard key={show.id} show={show} />
        ))}
      </View>
    </ScrollView>
  );

  const renderExploreContent = () => (
    <View style={styles.content}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for artists, venues, or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredShows}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ShowCard show={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderBookedContent = () => (
    <View style={styles.content}>
      {bookedShows.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar" size={48} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No shows booked yet</Text>
          <Text style={styles.emptyStateText}>Browse shows and book your favorites!</Text>
        </View>
      ) : (
        <FlatList
          data={bookedShows}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ShowCard show={item} showBookButton={false} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  const renderSavedContent = () => (
    <View style={styles.content}>
      {savedShows.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart" size={48} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No saved shows yet</Text>
          <Text style={styles.emptyStateText}>Save shows to book them later!</Text>
        </View>
      ) : (
        <FlatList
          data={savedShows}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ShowCard show={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setSidebarOpen(true)}>
            <Ionicons name="menu" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NextOnStage</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.savedButton}
            onPress={() => setActiveTab('saved')}
          >
            <Ionicons name="heart" size={20} color="white" />
            <Text style={styles.savedButtonText}>Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TabButton title="Home" tabKey="home" />
        <TabButton title="Explore" tabKey="explore" />
        <TabButton title="Booked" tabKey="booked" count={bookedShows.length} />
        <TabButton title="Saved" tabKey="saved" count={savedShows.length} />
      </View>

      {activeTab === 'home' && renderHomeContent()}
      {activeTab === 'explore' && renderExploreContent()}
      {activeTab === 'booked' && renderBookedContent()}
      {activeTab === 'saved' && renderSavedContent()}

      <Sidebar />

      <Modal
        visible={showBookingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            {selectedShow && (
              <View style={styles.modalContent}>
                <Text style={styles.modalArtist}>{selectedShow.artist}</Text>
                <Text style={styles.modalDetail}>{selectedShow.location}</Text>
                <Text style={styles.modalDetail}>{selectedShow.date} at {selectedShow.time}</Text>
                <Text style={styles.modalCost}>{selectedShow.cost}</Text>
              </View>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowBookingModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmBooking}
              >
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  savedButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 0,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0, // allow shrinking
  },
  tabButtonActive: {
    backgroundColor: '#2563eb',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  tabButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  showCard: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  showCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  showArtist: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  heartButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#1d4ed8',
  },
  heartButtonSaved: {
    backgroundColor: '#dc2626',
  },
  showDetails: {
    marginBottom: 16,
  },
  showDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  showDetailText: {
    fontSize: 14,
    color: 'white',
  },
  bookButton: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: width * 0.8,
    height: height,
    backgroundColor: 'white',
    padding: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  accountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10b981',
  },
  accountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteSection: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 16,
  },
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  artistIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  artistName: {
    fontSize: 14,
    fontWeight: '500',
  },
  exploreButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 24,
  },
  modalArtist: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  modalCost: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginTop: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NextOnStageApp;