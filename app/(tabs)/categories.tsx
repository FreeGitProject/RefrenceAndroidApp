import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Filter } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
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

const categoryColors: { [key: string]: string } = {
  'C# Fundamentals': '#3b82f6',
  'OOP': '#10b981',
  'SOLID': '#f59e0b',
  'Design Patterns': '#ef4444',
  '.NET Concepts': '#8b5cf6',
};

export default function CategoriesScreen() {
  const params = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    params.category as string || null
  );
  
  const concepts: Concept[] = conceptsData;
  
  const categories = useMemo(() => {
    const categoryMap = concepts.reduce((acc, concept) => {
      if (!acc[concept.category]) {
        acc[concept.category] = [];
      }
      acc[concept.category].push(concept);
      return acc;
    }, {} as { [key: string]: Concept[] });
    
    return Object.entries(categoryMap).map(([name, items]) => ({
      name,
      count: items.length,
      concepts: items.sort((a, b) => a.title.localeCompare(b.title)),
      color: categoryColors[name] || '#64748b',
    }));
  }, [concepts]);

  const filteredConcepts = useMemo(() => {
    if (!selectedCategory) return [];
    const category = categories.find(cat => cat.name === selectedCategory);
    return category?.concepts || [];
  }, [selectedCategory, categories]);

  const renderCategoryItem = ({ item }: { item: { name: string; count: number; color: string } }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { borderLeftColor: item.color },
        selectedCategory === item.name && styles.selectedCategoryCard
      ]}
      onPress={() => setSelectedCategory(item.name)}
    >
      <View style={styles.categoryContent}>
        <View>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryCount}>{item.count} concepts</Text>
        </View>
        <ChevronRight 
          size={20} 
          color={selectedCategory === item.name ? '#f97316' : '#64748b'} 
        />
      </View>
    </TouchableOpacity>
  );

  const renderConceptItem = ({ item }: { item: Concept }) => (
    <TouchableOpacity
      style={styles.conceptCard}
      onPress={() => router.push({
        pathname: '/topic-detail',
        params: { topicID: item.topicID.toString() }
      })}
    >
      <Text style={styles.conceptTitle}>{item.title}</Text>
      <Text style={styles.conceptDefinition} numberOfLines={2}>
        {item.definition}
      </Text>
      <View style={styles.conceptFooter}>
        <View style={styles.keywordTags}>
          {item.keywords.slice(0, 3).map((keyword, index) => (
            <View key={index} style={styles.keywordTag}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </View>
          ))}
        </View>
        <ChevronRight size={16} color="#64748b" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        {selectedCategory && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.clearButtonText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      {!selectedCategory ? (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.name}
          style={styles.categoriesList}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.conceptsContainer}>
          <View style={styles.selectedCategoryHeader}>
            <Text style={styles.selectedCategoryTitle}>{selectedCategory}</Text>
            <Text style={styles.selectedCategoryCount}>
              {filteredConcepts.length} concepts
            </Text>
          </View>
          
          <FlatList
            data={filteredConcepts}
            renderItem={renderConceptItem}
            keyExtractor={(item) => item.topicID.toString()}
            style={styles.conceptsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
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
  clearButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#f97316',
  },
  categoriesList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedCategoryCard: {
    borderColor: '#f97316',
    backgroundColor: '#1e293b',
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  conceptsContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  selectedCategoryHeader: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  selectedCategoryTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  selectedCategoryCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  conceptsList: {
    flex: 1,
  },
  conceptCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  conceptTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  conceptDefinition: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 12,
  },
  conceptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keywordTags: {
    flexDirection: 'row',
    flex: 1,
  },
  keywordTag: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  keywordText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#94a3b8',
  },
});