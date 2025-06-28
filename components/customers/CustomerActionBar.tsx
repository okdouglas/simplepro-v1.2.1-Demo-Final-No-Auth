import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Plus, Mail, Filter, Download, Upload } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';

interface CustomerActionBarProps {
  onAddCustomer: () => void;
  onSendEmail: () => void;
  onFilter: () => void;
  onExport: () => void;
  onImport: () => void;
}

export default function CustomerActionBar({
  onAddCustomer,
  onSendEmail,
  onFilter,
  onExport,
  onImport,
}: CustomerActionBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.actionButton, styles.primaryButton]}
        onPress={onAddCustomer}
        activeOpacity={0.8}
      >
        <Plus size={18} color={colors.white} />
        <Text style={styles.primaryButtonText}>Add Customer</Text>
      </TouchableOpacity>
      
      <View style={styles.secondaryActions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onSendEmail}
          activeOpacity={0.7}
        >
          <Mail size={20} color={colors.gray[700]} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onFilter}
          activeOpacity={0.7}
        >
          <Filter size={20} color={colors.gray[700]} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onExport}
          activeOpacity={0.7}
        >
          <Download size={20} color={colors.gray[700]} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onImport}
          activeOpacity={0.7}
        >
          <Upload size={20} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  secondaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
    backgroundColor: colors.gray[100],
  },
});