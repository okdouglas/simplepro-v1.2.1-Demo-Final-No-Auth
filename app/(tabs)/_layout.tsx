import React from 'react';
import { Tabs } from 'expo-router';
import { Home, FileText, Briefcase, Users, BarChart3 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LOGO_URL } from '@/constants/logo';
import { Image } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
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
          fontSize: 12,
          fontWeight: '500',
        },
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Quotes',
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
          tabBarLabel: 'Quotes',
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color }) => <Briefcase size={24} color={color} />,
          tabBarLabel: 'Jobs',
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Customers',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          tabBarLabel: 'Customers',
        }}
      />
      <Tabs.Screen
        name="pipeline"
        options={{
          title: 'Financials',
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
          tabBarLabel: 'Financials',
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
});