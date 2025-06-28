import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Users, FileText, Briefcase, BarChart } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { View, StyleSheet } from 'react-native';

// Custom component for the Quotes icon with green square background
const QuotesIcon = ({ color, size }) => (
  <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
    <FileText size={size * 0.8} color={colors.white} />
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarShowLabel: false, // Hide tab labels
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Customers',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Quotes',
          tabBarIcon: ({ size }) => <QuotesIcon size={size} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pipeline"
        options={{
          title: 'Financials',
          tabBarIcon: ({ color, size }) => <BarChart size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  }
});