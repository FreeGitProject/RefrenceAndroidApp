import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { router } from 'expo-router';
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

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const concepts: Concept[] = conceptsData;

  const searchResults = useMemo(() => {
    if (!searchText.trim()) return [];

    const searchTextLower = searchText.toLowerCase();
    
    return concepts.filter(concept => {
      const inTitle = concept.title.toLowerCase().includes(searchTextLower);
      const inDefinition = concept.definition.toLowerCase().includes(searchTextLower);
      const inKeywords = concept.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTextLower)
      );
      const inCategory = concept.category.toLowerCase().includes(searchTextLower);
      
      return inTitle || inDefinition || inKeywords || inCategory;
    }).map(concept => {
      // Calculate relevance score for sorting
      let score = 0;
      const titleMatch = concept.title.toLowerCase().includes(searchTextLower);
      const definitionMatch = concept.definition.toLowerCase().includes(searchTextLower);
      const keywordMatch = concept.keywords.some(k => k.toLowerCase().includes(searchTextLower));
      
      if (titleMatch) score += 10;
      if (definitionMatch) score += 5;
      if (keywordMatch) score += 3;
      
      return { ...concept, relevanceScore: score };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [searchText, concepts]);

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return `**${part}**`; // We'll handle this in rendering
      }
      return part;
    }).join('');
  };

  const renderSearchResult = ({ item }: { item: Concept }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => router.push({
        pathname: '/topic-detail',
        params: { 
          topicID: item.topicID.toString(),
          highlight: searchText 
        }
      })}
    >
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultCategory}>{item.category}</Text>
      </View>
      <Text style={styles.resultDefinition} numberOfLines={2}>
        {item.definition}
      </Text>
      {item.keywords.some(k => k.toLowerCase().includes(searchText.toLowerCase())) && (
        <View style={styles.keywordsContainer}>
          <Text style={styles.keywordsLabel}>Keywords: </Text>
          <Text style={styles.keywords}>
            {item.keywords
              .filter(k => k.toLowerCase().includes(searchText.toLowerCase()))
              .slice(0, 3)
              .join(', ')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search C# concepts..."
            placeholderTextColor="#64748b"
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.resultsContainer}>
        {searchText.trim() === '' ? (
          <View style={styles.emptyState}>
            <Search size={48} color="#334155" />
            <Text style={styles.emptyStateTitle}>Start typing to search</Text>
            <Text style={styles.emptyStateSubtitle}>
              Search through C# concepts, definitions, and keywords
            </Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try different keywords or check your spelling
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </Text>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.topicID.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.resultsList}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginBottom: 16,
  },
  resultsList: {
    flex: 1,
  },
  resultCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  resultCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#f97316',
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resultDefinition: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 8,
  },
  keywordsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keywordsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  keywords: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#f97316',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
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
  },
});