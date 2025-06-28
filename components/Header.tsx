import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Plus, Download, Filter, Calendar, Menu, Search, LayoutGrid, List } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { LOGO_URL } from '@/constants/logo';

interface HeaderProps {
  title?: string;
  businessName?: string;
  showAdd?: boolean;
  onAddPress?: () => void;
  showLogo?: boolean;
  showExport?: boolean;
  onExportPress?: () => void;
  showFilter?: boolean;
  onFilterPress?: () => void;
  showCalendar?: boolean;
  onCalendarPress?: () => void;
  showMenu?: boolean;
  onMenuPress?: () => void;
  showSearch?: boolean;
  onSearchPress?: () => void;
  showViewToggle?: boolean;
  viewMode?: 'grid' | 'list';
  onViewToggle?: () => void;
  rightComponent?: React.ReactNode;
}

export default function Header({ 
  title, 
  businessName,
  showAdd = false, 
  onAddPress, 
  showLogo = true,
  showExport = false,
  onExportPress,
  showFilter = false,
  onFilterPress,
  showCalendar = false,
  onCalendarPress,
  showMenu = false,
  onMenuPress,
  showSearch = false,
  onSearchPress,
  showViewToggle = false,
  viewMode = 'grid',
  onViewToggle,
  rightComponent
}: HeaderProps) {
  const router = useRouter();

  const handleNotificationsPress = () => {
    // Navigate to notifications
    router.push('/notifications');
  };

  // Display business name if provided, otherwise fall back to title
  const displayTitle = businessName || title;

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.card, 
      borderBottomColor: colors.border 
    }]}>
      <View style={styles.leftSection}>
        {showMenu && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={onMenuPress}
            activeOpacity={0.7}
          >
            <Menu size={22} color={colors.tertiary} />
          </TouchableOpacity>
        )}
        
        <View style={styles.titleContainer}>
          {showLogo && (
            <Image 
              source={{ uri: LOGO_URL }} 
              style={styles.logo} 
              resizeMode="contain"
            />
          )}
          <Text style={[styles.title, { color: colors.text }]}>{displayTitle}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        {showSearch && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <Search size={22} color={colors.tertiary} />
          </TouchableOpacity>
        )}
        
        {showViewToggle && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={onViewToggle}
            activeOpacity={0.7}
          >
            {viewMode === 'grid' ? (
              <LayoutGrid size={22} color={colors.tertiary} />
            ) : (
              <List size={22} color={colors.tertiary} />
            )}
          </TouchableOpacity>
        )}
        
        {showCalendar && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={onCalendarPress}
            activeOpacity={0.7}
          >
            <Calendar size={22} color={colors.tertiary} />
          </TouchableOpacity>
        )}
        
        {showFilter && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={onFilterPress}
            activeOpacity={0.7}
          >
            <Filter size={22} color={colors.tertiary} />
          </TouchableOpacity>
        )}
        
        {showExport && (
          <TouchableOpacity
            style={[styles.exportButton]}
            onPress={onExportPress}
            activeOpacity={0.7}
          >
            <Download size={22} color={colors.white} />
          </TouchableOpacity>
        )}
        
        {showAdd && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={onAddPress}
            activeOpacity={0.7}
          >
            <Plus size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
        
        {rightComponent}
        
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.card }]}
          onPress={handleNotificationsPress}
          activeOpacity={0.7}
        >
          <Bell size={22} color={colors.tertiary} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    height: 64, // Fixed height for consistency
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    ...theme.shadows.xs,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    backgroundColor: colors.quickbooks,
    ...theme.shadows.xs,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1,
    borderColor: colors.white,
  },
});