import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import Header from '@/components/Header';
import { useCustomerStore } from '@/store/customerStore';
import { CustomerSegment } from '@/types';
import CustomerMetricsSection from '@/components/customers/CustomerMetricsSection';
import CustomerSegmentTabs from '@/components/customers/CustomerSegmentTabs';
import CustomerCard from '@/components/customers/CustomerCard';
import CustomerAutomationSection from '@/components/customers/CustomerAutomationSection';
import CustomerActionBar from '@/components/customers/CustomerActionBar';

export default function CustomersScreen() {
  const router = useRouter();
  const { 
    customers, 
    metrics,
    selectedSegment,
    isLoading,
    fetchCustomers, 
    fetchCustomerMetrics,
    filterCustomersBySegment,
    setSelectedSegment,
    addCustomerCampaign,
  } = useCustomerStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchCustomers();
    fetchCustomerMetrics();
  }, [fetchCustomers, fetchCustomerMetrics]);
  
  const handleAddCustomer = () => {
    router.push('/customers/new');
  };
  
  const handleCustomerPress = (customerId: string) => {
    router.push(`/customers/${customerId}`);
  };
  
  const handleSegmentChange = (segment: CustomerSegment) => {
    setSelectedSegment(segment);
  };
  
  const handleCreateCampaign = (campaignType: string, templateId?: string) => {
    // In a real app, this would open a campaign creation modal or navigate to a campaign creation screen
    // For now, we'll just create a campaign for the first customer in the selected segment
    const segmentCustomers = filterCustomersBySegment(selectedSegment);
    if (segmentCustomers.length > 0) {
      addCustomerCampaign(segmentCustomers[0].id, campaignType);
      console.log(`Creating ${campaignType} campaign${templateId ? ` with template ${templateId}` : ''}`);
    }
  };
  
  // Filter customers by search query and segment
  const filteredCustomers = searchQuery 
    ? customers.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        customer.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filterCustomersBySegment(selectedSegment);
  
  // Sort customers by name
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Customers" showAdd onAddPress={handleAddCustomer} />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            placeholderTextColor={colors.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Customer Metrics Section */}
          <CustomerMetricsSection metrics={metrics} />
          
          {/* Customer Segment Tabs */}
          <CustomerSegmentTabs 
            selectedSegment={selectedSegment}
            onSelectSegment={handleSegmentChange}
            metrics={metrics}
          />
          
          {/* Customer Automation Section */}
          <CustomerAutomationSection 
            onCreateCampaign={handleCreateCampaign}
            stats={metrics.campaignStats}
          />
          
          {/* Customer List */}
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>
              {selectedSegment === 'all' 
                ? 'All Customers' 
                : `${selectedSegment.charAt(0).toUpperCase() + selectedSegment.slice(1)} Customers`}
            </Text>
            
            {sortedCustomers.length > 0 ? (
              sortedCustomers.map((customer) => (
                <CustomerCard 
                  key={customer.id} 
                  customer={customer} 
                  onPress={() => handleCustomerPress(customer.id)} 
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No customers found</Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={handleAddCustomer}
                  activeOpacity={0.7}
                >
                  <Plus size={18} color={colors.white} />
                  <Text style={styles.emptyStateButtonText}>Add New Customer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: colors.gray[800],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    padding: theme.spacing.xl,
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
});