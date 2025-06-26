import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Search, Code, Lightbulb } from 'lucide-react-native';
import { router } from 'expo-router';

const categories = [
  {
    id: 'csharp',
    title: 'C# Fundamentals',
    description: 'Core language features and syntax',
    icon: Code,
    color: '#3b82f6',
    count: 15
  },
  {
    id: 'oop',
    title: 'Object-Oriented Programming',
    description: 'The four pillars of OOP',
    icon: BookOpen,
    color: '#10b981',
    count: 12
  },
  {
    id: 'solid',
    title: 'SOLID Principles',
    description: 'Five principles of object-oriented design',
    icon: Lightbulb,
    color: '#f59e0b',
    count: 5
  },
  {
    id: 'patterns',
    title: 'Design Patterns',
    description: 'Common software design solutions',
    icon: Search,
    color: '#ef4444',
    count: 8
  }
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>C# Reference</Text>
          <Text style={styles.subtitle}>
            Quick access to C# and .NET concepts
          </Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => router.push('/search')}
          >
            <Search size={20} color="#ffffff" />
            <Text style={styles.searchButtonText}>Search concepts...</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, { borderLeftColor: category.color }]}
                  onPress={() => router.push({
                    pathname: '/categories',
                    params: { category: category.id }
                  })}
                >
                  <View style={styles.categoryHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
                      <IconComponent size={24} color={category.color} />
                    </View>
                    <Text style={styles.categoryCount}>{category.count}</Text>
                  </View>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>40+</Text>
              <Text style={styles.statLabel}>Concepts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Offline</Text>
            </View>
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
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    lineHeight: 24,
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    flex: 1,
  },
  categoriesSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  categoriesGrid: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderColor: '#334155',
    borderWidth: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    lineHeight: 20,
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#f97316',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#94a3b8',
  },
});