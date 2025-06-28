import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Customer, CustomerSegment, CustomerMetrics, CustomerCampaign, ServiceArea, ClientLocation, JobLocation } from '@/types';
import { customers as initialCustomers, customerMetrics as initialMetrics } from '@/mocks/customers';
import { serviceAreas as initialServiceAreas, clientLocations as initialClientLocations, jobLocations as initialJobLocations } from '@/mocks/serviceAreas';

interface CustomerState {
  customers: Customer[];
  metrics: CustomerMetrics;
  selectedSegment: CustomerSegment;
  isLoading: boolean;
  error: string | null;
  
  // Map data
  serviceAreas: ServiceArea[];
  clientLocations: ClientLocation[];
  jobLocations: JobLocation[];
  
  // Actions
  fetchCustomers: () => Promise<void>;
  fetchCustomerMetrics: () => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
  searchCustomers: (query: string) => Customer[];
  filterCustomersBySegment: (segment: CustomerSegment) => Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Customer>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
  setSelectedSegment: (segment: CustomerSegment) => void;
  
  // Map data actions
  fetchServiceAreas: () => Promise<void>;
  fetchClientLocations: () => Promise<void>;
  fetchJobLocations: () => Promise<void>;
  getServiceAreaById: (id: string) => ServiceArea | undefined;
  getClientLocationById: (id: string) => ClientLocation | undefined;
  getJobLocationById: (id: string) => JobLocation | undefined;
  
  // CRM Actions
  getHighValueCustomers: () => Customer[];
  getRecurringCustomers: () => Customer[];
  getAtRiskCustomers: () => Customer[];
  getNewCustomers: () => Customer[];
  getCustomersByServiceArea: (area: string) => Customer[];
  calculateCustomerLifetimeValue: (customerId: string) => number;
  getCustomersNeedingFollowUp: () => Customer[];
  getCustomersByEquipmentType: (type: string) => Customer[];
  addCustomerCampaign: (customerId: string, campaignType: string) => Promise<void>;
  
  // Marketing Automation
  addCustomersToCampaign: (customerIds: string[], campaignType: string) => Promise<void>;
  removeCustomerFromCampaign: (customerId: string, campaignId: string) => Promise<void>;
  getCustomersByCampaign: (campaignType: string) => Customer[];
  getCustomersForAutomaticCampaigns: () => {
    newCustomers: Customer[];
    completedServiceCustomers: Customer[];
    inactiveCustomers: Customer[];
  };
  autoAddCustomersToCampaigns: () => Promise<void>;
  getCampaignStatistics: () => {
    totalCampaigns: number;
    activeCampaigns: number;
    completedCampaigns: number;
    scheduledCampaigns: number;
    campaignsByType: Record<string, number>;
    customerCoverage: number;
  };
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customers: initialCustomers,
      metrics: {
        totalCustomers: initialMetrics.totalCustomers,
        activeCustomers: initialMetrics.activeCustomers,
        inactiveCustomers: initialMetrics.totalCustomers - initialMetrics.activeCustomers,
        newCustomersThisMonth: Math.round(initialMetrics.totalCustomers * 0.1), // Assuming 10% are new
        growthRate: initialMetrics.growthRate,
        averageLifetimeValue: initialMetrics.averageLifetimeValue,
        repeatCustomerRate: initialMetrics.repeatCustomerRate,
        acquisitionCost: initialMetrics.acquisitionCost,
        segmentCounts: initialMetrics.segmentCounts,
        campaignStats: initialMetrics.campaignStats,
      },
      selectedSegment: 'all',
      isLoading: false,
      error: null,
      
      // Map data
      serviceAreas: initialServiceAreas,
      clientLocations: initialClientLocations,
      jobLocations: initialJobLocations,
      
      fetchCustomers: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we're just using the mock data
          set({ customers: initialCustomers, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      
      fetchCustomerMetrics: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          set({ 
            metrics: {
              totalCustomers: initialMetrics.totalCustomers,
              activeCustomers: initialMetrics.activeCustomers,
              inactiveCustomers: initialMetrics.totalCustomers - initialMetrics.activeCustomers,
              newCustomersThisMonth: Math.round(initialMetrics.totalCustomers * 0.1), // Assuming 10% are new
              growthRate: initialMetrics.growthRate,
              averageLifetimeValue: initialMetrics.averageLifetimeValue,
              repeatCustomerRate: initialMetrics.repeatCustomerRate,
              acquisitionCost: initialMetrics.acquisitionCost,
              segmentCounts: initialMetrics.segmentCounts,
              campaignStats: initialMetrics.campaignStats,
            }, 
            isLoading: false 
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      
      // Map data actions
      fetchServiceAreas: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          set({ serviceAreas: initialServiceAreas, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      
      fetchClientLocations: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          set({ clientLocations: initialClientLocations, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      
      fetchJobLocations: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          set({ jobLocations: initialJobLocations, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      
      getServiceAreaById: (id) => {
        return get().serviceAreas.find(area => area.id === id);
      },
      
      getClientLocationById: (id) => {
        return get().clientLocations.find(client => client.id === id);
      },
      
      getJobLocationById: (id) => {
        return get().jobLocations.find(job => job.id === id);
      },
      
      getCustomerById: (id) => {
        return get().customers.find(customer => customer.id === id);
      },
      
      searchCustomers: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().customers.filter(customer => 
          customer.name.toLowerCase().includes(lowerQuery) ||
          customer.phone.includes(query) ||
          (customer.email && customer.email.toLowerCase().includes(lowerQuery)) ||
          customer.address.toLowerCase().includes(lowerQuery) ||
          (customer.city && customer.city.toLowerCase().includes(lowerQuery)) ||
          (customer.zip && customer.zip.includes(query))
        );
      },
      
      filterCustomersBySegment: (segment) => {
        if (segment === 'all') {
          return get().customers;
        }
        return get().customers.filter(customer => customer.segment === segment);
      },
      
      addCustomer: async (customerData) => {
        set({ isLoading: true, error: null });
        try {
          const now = new Date().toISOString();
          const newCustomer: Customer = {
            id: Date.now().toString(),
            ...customerData,
            createdAt: now,
            updatedAt: now,
          };
          
          set(state => ({
            customers: [...state.customers, newCustomer],
            isLoading: false,
          }));
          
          // Automatically add new customers to the welcome campaign
          if (newCustomer.email || newCustomer.phone) {
            await get().addCustomerCampaign(newCustomer.id, 'new_customer');
          }
          
          return newCustomer;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      
      updateCustomer: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedCustomers = get().customers.map(customer => 
            customer.id === id 
              ? { 
                  ...customer, 
                  ...updates,
                  updatedAt: new Date().toISOString(),
                } 
              : customer
          );
          
          set({ customers: updatedCustomers, isLoading: false });
          
          const updatedCustomer = updatedCustomers.find(customer => customer.id === id);
          if (!updatedCustomer) {
            throw new Error('Customer not found');
          }
          
          // If this was a service completion update, check if we should add to campaigns
          if (updates.lastServiceDate) {
            // Auto-add to service reminder campaign
            await get().addCustomerCampaign(id, 'reminder');
            
            // Check season and add to seasonal campaign if appropriate
            const serviceDate = new Date(updates.lastServiceDate);
            const month = serviceDate.getMonth();
            
            // Spring (March-May)
            if (month >= 2 && month <= 4) {
              await get().addCustomerCampaign(id, 'seasonal');
            }
            // Summer (June-August)
            else if (month >= 5 && month <= 7) {
              await get().addCustomerCampaign(id, 'seasonal');
            }
            // Fall (September-November)
            else if (month >= 8 && month <= 10) {
              await get().addCustomerCampaign(id, 'seasonal');
            }
            // Winter (December-February)
            else {
              await get().addCustomerCampaign(id, 'seasonal');
            }
          }
          
          return updatedCustomer;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      
      deleteCustomer: async (id) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            customers: state.customers.filter(customer => customer.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      
      setSelectedSegment: (segment) => {
        set({ selectedSegment: segment });
      },
      
      // CRM Actions
      getHighValueCustomers: () => {
        return get().customers.filter(customer => customer.segment === 'vip');
      },
      
      getRecurringCustomers: () => {
        return get().customers.filter(customer => customer.segment === 'recurring');
      },
      
      getAtRiskCustomers: () => {
        return get().customers.filter(customer => customer.segment === 'at_risk');
      },
      
      getNewCustomers: () => {
        return get().customers.filter(customer => customer.segment === 'new');
      },
      
      getCustomersByServiceArea: (area) => {
        return get().customers.filter(customer => 
          customer.serviceArea === area || 
          customer.city === area
        );
      },
      
      calculateCustomerLifetimeValue: (customerId) => {
        const customer = get().getCustomerById(customerId);
        return customer?.lifetimeValue || 0;
      },
      
      getCustomersNeedingFollowUp: () => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        return get().customers.filter(customer => {
          if (!customer.lastServiceDate) return false;
          const lastServiceDate = new Date(customer.lastServiceDate);
          return lastServiceDate < sixMonthsAgo;
        });
      },
      
      getCustomersByEquipmentType: (type) => {
        return get().customers.filter(customer => 
          customer.property?.equipment?.some(equipment => 
            equipment.type.toLowerCase() === type.toLowerCase()
          )
        );
      },
      
      addCustomerCampaign: async (customerId, campaignType) => {
        set({ isLoading: true, error: null });
        try {
          const customer = get().getCustomerById(customerId);
          if (!customer) {
            throw new Error('Customer not found');
          }
          
          const now = new Date();
          const futureDate = new Date();
          futureDate.setDate(now.getDate() + 7); // Schedule for 7 days in the future
          
          const newCampaign: CustomerCampaign = {
            id: `camp${Date.now()}`,
            type: campaignType as any,
            status: 'scheduled',
            scheduledDate: futureDate.toISOString(),
          };
          
          // Check if customer already has this campaign type active
          const existingCampaign = customer.campaigns?.find(
            camp => camp.type === campaignType && 
            (camp.status === 'scheduled' || camp.status === 'sent')
          );
          
          if (existingCampaign) {
            // Customer already has this campaign type, no need to add again
            set({ isLoading: false });
            return;
          }
          
          const updatedCampaigns = [...(customer.campaigns || []), newCampaign];
          
          await get().updateCustomer(customerId, {
            campaigns: updatedCampaigns,
            lastContactDate: now.toISOString(),
          });
          
          set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      
      // Marketing Automation
      addCustomersToCampaign: async (customerIds, campaignType) => {
        set({ isLoading: true, error: null });
        try {
          const now = new Date();
          const futureDate = new Date();
          futureDate.setDate(now.getDate() + 7); // Schedule for 7 days in the future
          
          const campaignId = `camp${Date.now()}`;
          
          // Create a new campaign for each customer
          const updatedCustomers = get().customers.map(customer => {
            if (customerIds.includes(customer.id)) {
              // Check if customer already has this campaign type active
              const existingCampaign = customer.campaigns?.find(
                camp => camp.type === campaignType && 
                (camp.status === 'scheduled' || camp.status === 'sent')
              );
              
              if (existingCampaign) {
                // Customer already has this campaign type, don't add again
                return customer;
              }
              
              const newCampaign: CustomerCampaign = {
                id: campaignId,
                type: campaignType as any,
                status: 'scheduled',
                scheduledDate: futureDate.toISOString(),
              };
              
              return {
                ...customer,
                campaigns: [...(customer.campaigns || []), newCampaign],
                lastContactDate: now.toISOString(),
                updatedAt: now.toISOString(),
              };
            }
            return customer;
          });
          
          set({ customers: updatedCustomers, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      
      removeCustomerFromCampaign: async (customerId, campaignId) => {
        set({ isLoading: true, error: null });
        try {
          const customer = get().getCustomerById(customerId);
          if (!customer) {
            throw new Error('Customer not found');
          }
          
          const updatedCampaigns = (customer.campaigns || []).filter(
            campaign => campaign.id !== campaignId
          );
          
          await get().updateCustomer(customerId, {
            campaigns: updatedCampaigns,
          });
          
          set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      
      getCustomersByCampaign: (campaignType) => {
        return get().customers.filter(customer => 
          customer.campaigns?.some(campaign => 
            campaign.type === campaignType && 
            (campaign.status === 'scheduled' || campaign.status === 'sent')
          )
        );
      },
      
      getCustomersForAutomaticCampaigns: () => {
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        
        // New customers (added in the last 30 days)
        const newCustomers = get().customers.filter(customer => {
          const createdAt = new Date(customer.createdAt);
          return createdAt >= thirtyDaysAgo;
        });
        
        // Customers who completed a service recently
        const completedServiceCustomers = get().customers.filter(customer => {
          if (!customer.lastServiceDate) return false;
          const lastServiceDate = new Date(customer.lastServiceDate);
          return lastServiceDate >= thirtyDaysAgo;
        });
        
        // Inactive customers (no service in 6+ months)
        const inactiveCustomers = get().customers.filter(customer => {
          if (!customer.lastServiceDate) return true; // Never had service
          const lastServiceDate = new Date(customer.lastServiceDate);
          return lastServiceDate <= sixMonthsAgo;
        });
        
        return {
          newCustomers,
          completedServiceCustomers,
          inactiveCustomers,
        };
      },
      
      autoAddCustomersToCampaigns: async () => {
        try {
          const { 
            newCustomers, 
            completedServiceCustomers, 
            inactiveCustomers 
          } = get().getCustomersForAutomaticCampaigns();
          
          // Add new customers to welcome campaign
          for (const customer of newCustomers) {
            await get().addCustomerCampaign(customer.id, 'new_customer');
          }
          
          // Add recently serviced customers to reminder campaign
          for (const customer of completedServiceCustomers) {
            await get().addCustomerCampaign(customer.id, 'reminder');
          }
          
          // Add inactive customers to win-back campaign
          for (const customer of inactiveCustomers) {
            await get().addCustomerCampaign(customer.id, 'win_back');
          }
        } catch (error) {
          console.error('Error auto-adding customers to campaigns:', error);
          throw error;
        }
      },
      
      getCampaignStatistics: () => {
        const allCustomers = get().customers;
        const totalCustomers = allCustomers.length;
        
        // Count all campaigns
        let totalCampaigns = 0;
        let activeCampaigns = 0;
        let completedCampaigns = 0;
        let scheduledCampaigns = 0;
        const campaignsByType: Record<string, number> = {
          reminder: 0,
          seasonal: 0,
          win_back: 0,
          new_customer: 0,
          follow_up: 0,
        };
        
        // Count customers with at least one campaign
        let customersWithCampaigns = 0;
        
        allCustomers.forEach(customer => {
          if (customer.campaigns && customer.campaigns.length > 0) {
            customersWithCampaigns++;
            
            customer.campaigns.forEach(campaign => {
              totalCampaigns++;
              
              if (campaign.status === 'scheduled' || campaign.status === 'sent') activeCampaigns++;
              if (campaign.status === 'completed') completedCampaigns++;
              if (campaign.status === 'scheduled') scheduledCampaigns++;
              
              // Count by type
              if (campaignsByType[campaign.type] !== undefined) {
                campaignsByType[campaign.type]++;
              }
            });
          }
        });
        
        // Calculate customer coverage (percentage of customers with campaigns)
        const customerCoverage = totalCustomers > 0 
          ? Math.round((customersWithCampaigns / totalCustomers) * 100) 
          : 0;
        
        return {
          totalCampaigns,
          activeCampaigns,
          completedCampaigns,
          scheduledCampaigns,
          campaignsByType,
          customerCoverage,
        };
      },
    }),
    {
      name: 'customer-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);