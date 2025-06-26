import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, Copy, Share2 } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
   //import { Light as SyntaxHighlighter, dark as atomOneDark } from 'react-native-syntax-highlighter';
  // @ts-ignore
import {  SyntaxHighlighter, atomOneDark } from 'react-native-syntax-highlighter';


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

export default function TopicDetailScreen() {
  const params = useLocalSearchParams();
  const topicID = parseInt(params.topicID as string);
  const highlightTerm = params.highlight as string;
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const concepts: Concept[] = conceptsData;
  const concept = concepts.find(c => c.topicID === topicID);

  useEffect(() => {
    checkFavoriteStatus();
  }, [topicID]);

  const checkFavoriteStatus = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const favorites = JSON.parse(stored);
        setIsFavorite(favorites.includes(topicID));
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      let favorites = stored ? JSON.parse(stored) : [];
      
      if (isFavorite) {
        favorites = favorites.filter((id: number) => id !== topicID);
      } else {
        favorites.push(topicID);
      }
      
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const highlightText = (text: string, term?: string) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <Text>
        {parts.map((part, index) => (
          <Text
            key={index}
            style={part.toLowerCase() === term.toLowerCase() ? styles.highlighted : undefined}
          >
            {part}
          </Text>
        ))}
      </Text>
    );
  };

  if (!concept) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Concept not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleFavorite}
            disabled={loading}
          >
            <Star 
              size={24} 
              color={isFavorite ? '#f97316' : '#64748b'}
              fill={isFavorite ? '#f97316' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.category}>{concept.category}</Text>
          <Text style={styles.title}>
            {highlightText(concept.title, highlightTerm)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Definition</Text>
          <Text style={styles.definition}>
            {highlightText(concept.definition, highlightTerm)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Explanation</Text>
          <Text style={styles.explanation}>
            {concept.detailedExplanation}
          </Text>
        </View>

        {concept.codeExample && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Code Example</Text>
            <View style={styles.codeContainer}>
              <SyntaxHighlighter
                language="csharp"
                style={atomOneDark}
                customStyle={styles.codeBlock}
                fontSize={14}
                fontFamily="FiraCode-Regular"
              >
                {concept.codeExample}
              </SyntaxHighlighter>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keywords</Text>
          <View style={styles.keywordsContainer}>
            {concept.keywords.map((keyword, index) => (
              <View key={index} style={styles.keywordTag}>
                <Text style={styles.keywordText}>{keyword}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    padding: 24,
    paddingBottom: 16,
  },
  category: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#f97316',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    lineHeight: 36,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 12,
  },
  definition: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    lineHeight: 24,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
  },
  explanation: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    lineHeight: 24,
  },
  codeContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1e1e1e',
  },
  codeBlock: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    margin: 0,
    fontFamily: 'FiraCode-Regular',
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordTag: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  keywordText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#94a3b8',
  },
  highlighted: {
    backgroundColor: '#fbbf24',
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});