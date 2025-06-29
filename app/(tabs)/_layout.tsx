import React from 'react';
import { Tabs } from 'expo-router';
import { Home, FileText, Briefcase, Users, BarChart3, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LOGO_URL } from '@/constants/logo';
import { Image } from 'react-native';

// Custom tab bar icon component for the Quotes tab with green bubble
const TabBarIcon = ({ name, color, size }) => {
  const isQuotes = name === 'quotes';
  
  if (isQuotes) {
    return (
      <View style={styles.quotesIconContainer}>
        <FileText size={size - 4} color={colors.white} />
      </View>
    );
  }
  
  // Regular icons for other tabs
  switch (name) {
    case 'index':
      return <Home size={size} color={color} />;
    case 'customers':
      return <Users size={size} color={color} />;
    case 'jobs':
      return <Briefcase size={size} color={color} />;
    case 'pipeline':
      return <BarChart3 size={size} color={color} />;
    case 'profile':
      return <User size={size} color={color} />;
    default:
      return null;
  }
};

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray[200],
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 0, // Hide labels by setting font size to 0
          height: 0,
        },
        tabBarShowLabel: false, // Explicitly hide labels
        headerStyle: {
          backgroundColor: colors.white,
          borderBottomWidth: 1,
          borderBottomColor: colors.gray[200],
          height: 64, // Fixed height for consistency
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: colors.text,
          fontSize: 18,
        },
        headerShadowVisible: false,
        headerTitle: ({ children }) => {
          // Always show logo with title
          return (
            <View style={styles.headerTitleContainer}>
              <Image source={{ uri: LOGO_URL }} style={styles.logo} />
              {children ? (
                <>
                  <View style={[styles.titleSeparator, { backgroundColor: colors.gray[300] }]} />
                  <Text style={[styles.headerText, { color: colors.text }]}>{children}</Text>
                </>
              ) : (
                <Text style={[styles.headerText, { color: colors.text }]}>SimplePro</Text>
              )}
            </View>
          );
        },
        headerRight: () => (
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <View style={styles.notificationIcon}>
              <View style={styles.notificationBadge} />
            </View>
          </TouchableOpacity>
        ),
        tabBarIcon: ({ color, size }) => {
          const name = route.name;
          return <TabBarIcon name={name} color={color} size={size} />;
        },
      })}
    >
      {/* Tab order: Dashboard, Customers, Quotes, Jobs, Pipeline, Profile */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Customers',
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Quotes',
          tabBarActiveTintColor: colors.white, // White text for quotes tab when active
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
        }}
      />
      <Tabs.Screen
        name="pipeline"
        options={{
          title: 'Financials',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  titleSeparator: {
    width: 1,
    height: 16,
    marginHorizontal: 8,
  },
  notificationButton: {
    padding: 8,
    marginRight: 8,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  quotesIconContainer: {
    backgroundColor: '#4CAF50', // Green color for the bubble
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -4, // Adjust position to align with other icons
  },
});