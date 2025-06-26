import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Trash2, BookOpen } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import conceptsData from '@/data/concepts.json';

interface Concept {
  topicID: number;
  title: string;
  category: string;
  definition: string;
  detailedExplanation: string;
  codeExample: string;
  keywords: string[];
}

const FAVORITES_KEY = 'user_favorites';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  
  const concepts: Concept[] = conceptsData;
  
  const favoriteConcepts = concepts.filter(concept => 
    favorites.includes(concept.topicID)
  );

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (topicID: number) => {
    try {
      const updatedFavorites = favorites.filter(id => id !== topicID);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const clearAllFavorites = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorites? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              setFavorites([]);
              await AsyncStorage.removeItem(FAVORITES_KEY);
            } catch (error) {
              console.error('Error clearing favorites:', error);
            }
          },
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }: { item: Concept }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => router.push({
        pathname: '/topic-detail',
        params: { topicID: item.topicID.toString() }
      })}
    >
      <View style={styles.favoriteContent}>
        <View style={styles.favoriteHeader}>
          <Text style={styles.favoriteTitle}>{item.title}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFavorite(item.topicID)}
          >
            <Trash2 size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.favoriteCategory}>{item.category}</Text>
        <Text style={styles.favoriteDefinition} numberOfLines={2}>
          {item.definition}
        </Text>
        
        <View style={styles.keywordTags}>
          {item.keywords.slice(0, 3).map((keyword, index) => (
            <View key={index} style={styles.keywordTag}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        {favoriteConcepts.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={clearAllFavorites}
          >
            <Trash2 size={16} color="#ef4444" />
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {favoriteConcepts.length === 0 ? (
        <View style={styles.emptyState}>
          <Star size={48} color="#334155" />
          <Text style={styles.emptyStateTitle}>No favorites yet</Text>
          <Text style={styles.emptyStateSubtitle}>
            Star concepts you want to reference quickly. They'll appear here for easy access.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push('/categories')}
          >
            <BookOpen size={16} color="#ffffff" />
            <Text style={styles.exploreButtonText}>Explore Concepts</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.statsBar}>
            <Text style={styles.statsText}>
              {favoriteConcepts.length} favorite concept{favoriteConcepts.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          <FlatList
            data={favoriteConcepts}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.topicID.toString()}
            style={styles.favoritesList}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  statsBar: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  statsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  favoritesList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  favoriteCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  favoriteContent: {
    padding: 16,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  favoriteTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  removeButton: {
    padding: 4,
  },
  favoriteCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#f97316',
    marginBottom: 8,
  },
  favoriteDefinition: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 12,
  },
  keywordTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keywordTag: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  keywordText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#94a3b8',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f97316',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  exploreButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
});