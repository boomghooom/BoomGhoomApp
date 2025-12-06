/**
 * Wallet Screen
 * Dues, commissions, and transaction history
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text, Card, IconButton, Badge, Divider } from '@components/base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';
import { Transaction, TransactionType } from '@domain/entities';

const { width } = Dimensions.get('window');

// Mock data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'commission_earned',
    status: 'completed',
    amount: 850,
    currency: 'INR',
    description: 'Commission from Street Food Crawl',
    eventTitle: 'Street Food Crawl',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    type: 'due_added',
    status: 'completed',
    amount: 25,
    currency: 'INR',
    description: 'Due for Sunday Football Match',
    eventTitle: 'Sunday Football Match',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    type: 'due_cleared',
    status: 'completed',
    amount: 25,
    currency: 'INR',
    description: 'Due cleared via UPI',
    paymentMethod: 'upi',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '4',
    type: 'withdrawal_completed',
    status: 'completed',
    amount: 2000,
    currency: 'INR',
    description: 'Withdrawn to HDFC Bank',
    gatewayFee: 40,
    gst: 7.2,
    netAmount: 1952.8,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: '5',
    type: 'referral_reward',
    status: 'completed',
    amount: 100,
    currency: 'INR',
    description: 'Referral bonus for Amit Kumar',
    createdAt: new Date(Date.now() - 864000000).toISOString(),
  },
];

interface WalletScreenProps {
  onBack: () => void;
  onWithdraw: () => void;
  onClearDues: () => void;
  onTransactionPress: (transaction: Transaction) => void;
}

const getTransactionIcon = (type: TransactionType): keyof typeof Ionicons.glyphMap => {
  const icons: Record<TransactionType, keyof typeof Ionicons.glyphMap> = {
    due_added: 'add-circle-outline',
    due_cleared: 'checkmark-circle-outline',
    commission_earned: 'trending-up-outline',
    commission_available: 'wallet-outline',
    withdrawal_requested: 'time-outline',
    withdrawal_completed: 'card-outline',
    withdrawal_failed: 'close-circle-outline',
    referral_reward: 'gift-outline',
  };
  return icons[type];
};

const getTransactionColor = (type: TransactionType): string => {
  const positiveTypes: TransactionType[] = ['commission_earned', 'commission_available', 'due_cleared', 'referral_reward', 'withdrawal_completed'];
  const negativeTypes: TransactionType[] = ['due_added', 'withdrawal_failed'];

  if (positiveTypes.includes(type)) return themeColors.semantic.success;
  if (negativeTypes.includes(type)) return themeColors.semantic.error;
  return themeColors.semantic.warning;
};

const TransactionItem: React.FC<{
  transaction: Transaction;
  onPress: () => void;
  index: number;
}> = ({ transaction, onPress, index }) => {
  const { colors } = useTheme();
  const iconColor = getTransactionColor(transaction.type);
  const isPositive = !['due_added', 'withdrawal_requested', 'withdrawal_completed'].includes(transaction.type);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <TouchableOpacity
        style={[styles.transactionItem, { borderBottomColor: colors.border }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.transactionIcon, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={getTransactionIcon(transaction.type)} size={20} color={iconColor} />
        </View>
        <View style={styles.transactionContent}>
          <Text variant="bodyMedium" numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text variant="caption" color="tertiary">
            {formatDate(transaction.createdAt)}
          </Text>
        </View>
        <Text variant="bodyMedium" style={{ color: isPositive ? themeColors.semantic.success : colors.text }}>
          {isPositive ? '+' : ''}₹{transaction.amount}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const WalletScreen: React.FC<WalletScreenProps> = ({
  onBack,
  onWithdraw,
  onClearDues,
  onTransactionPress,
}) => {
  const { colors, primary, gradients } = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'commissions' | 'dues'>('all');

  // Mock wallet data
  const wallet = {
    availableBalance: 3500,
    pendingCommission: 1250,
    dues: 0,
    totalEarned: 15000,
    minWithdrawal: 1000,
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const filteredTransactions = MOCK_TRANSACTIONS.filter((t) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'commissions') return ['commission_earned', 'commission_available', 'withdrawal_completed', 'withdrawal_requested', 'referral_reward'].includes(t.type);
    if (selectedTab === 'dues') return ['due_added', 'due_cleared'].includes(t.type);
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <IconButton icon="arrow-back" variant="ghost" onPress={onBack} />
        <Text variant="h3">Wallet</Text>
        <IconButton icon="help-circle-outline" variant="ghost" onPress={() => {}} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing['3xl'] }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={primary.purple} />
        }
      >
        {/* Balance Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.balanceSection}>
          <LinearGradient
            colors={[themeColors.primary.purple, themeColors.primary.blue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <View style={styles.balanceHeader}>
              <Text variant="bodyMedium" style={styles.balanceLabel}>
                Available Balance
              </Text>
              <Ionicons name="wallet" size={24} color="rgba(255,255,255,0.8)" />
            </View>
            <Text variant="display2" style={styles.balanceAmount}>
              ₹{wallet.availableBalance.toLocaleString()}
            </Text>
            <View style={styles.balanceFooter}>
              <View style={styles.balanceItem}>
                <Text variant="caption" style={styles.balanceItemLabel}>
                  Pending
                </Text>
                <Text variant="bodyMedium" style={styles.balanceItemValue}>
                  ₹{wallet.pendingCommission.toLocaleString()}
                </Text>
              </View>
              <View style={styles.balanceDivider} />
              <View style={styles.balanceItem}>
                <Text variant="caption" style={styles.balanceItemLabel}>
                  Total Earned
                </Text>
                <Text variant="bodyMedium" style={styles.balanceItemValue}>
                  ₹{wallet.totalEarned.toLocaleString()}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Withdraw button */}
          <TouchableOpacity
            style={[styles.withdrawButton, { backgroundColor: colors.surface }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onWithdraw();
            }}
            disabled={wallet.availableBalance < wallet.minWithdrawal}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-up-circle-outline" size={24} color={primary.purple} />
            <Text variant="bodyMedium" style={{ marginLeft: spacing.sm }}>
              Withdraw
            </Text>
            <Text variant="caption" color="tertiary" style={styles.minWithdrawal}>
              Min ₹{wallet.minWithdrawal}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Dues Card */}
        {wallet.dues > 0 && (
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.duesSection}>
            <Card variant="default" style={[styles.duesCard, { borderColor: themeColors.semantic.error }]}>
              <View style={styles.duesContent}>
                <View style={styles.duesLeft}>
                  <View style={[styles.duesIcon, { backgroundColor: themeColors.semantic.errorLight }]}>
                    <Ionicons name="alert-circle" size={24} color={themeColors.semantic.error} />
                  </View>
                  <View>
                    <Text variant="bodyMedium">Outstanding Dues</Text>
                    <Text variant="caption" color="secondary">
                      Clear to join more events
                    </Text>
                  </View>
                </View>
                <View style={styles.duesRight}>
                  <Text variant="h3" style={{ color: themeColors.semantic.error }}>
                    ₹{wallet.dues}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.clearDuesButton, { backgroundColor: themeColors.semantic.error }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onClearDues();
                }}
              >
                <Text variant="bodyMedium" style={{ color: '#FFFFFF' }}>
                  Clear Dues
                </Text>
              </TouchableOpacity>
            </Card>
          </Animated.View>
        )}

        {/* How it works */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.infoSection}>
          <Card variant="glass" style={styles.infoCard}>
            <Text variant="label" color="secondary" style={styles.infoTitle}>
              HOW COMMISSIONS WORK
            </Text>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: `${primary.purple}20` }]}>
                <Text variant="caption" style={{ color: primary.purple }}>
                  1
                </Text>
              </View>
              <Text variant="bodySmall" color="secondary" style={styles.infoText}>
                Create events and get participants
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: `${primary.purple}20` }]}>
                <Text variant="caption" style={{ color: primary.purple }}>
                  2
                </Text>
              </View>
              <Text variant="bodySmall" color="secondary" style={styles.infoText}>
                Participants pay ₹25 due per event
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: `${primary.purple}20` }]}>
                <Text variant="caption" style={{ color: primary.purple }}>
                  3
                </Text>
              </View>
              <Text variant="bodySmall" color="secondary" style={styles.infoText}>
                Earn 80% commission when all dues clear
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['all', 'commissions', 'dues'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                {
                  backgroundColor: selectedTab === tab ? primary.purple : 'transparent',
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedTab(tab);
              }}
            >
              <Text
                variant="bodySmall"
                style={{ color: selectedTab === tab ? '#FFFFFF' : colors.textSecondary }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <Text variant="label" color="secondary" style={styles.sectionTitle}>
            RECENT TRANSACTIONS
          </Text>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onPress={() => onTransactionPress(transaction)}
                index={index}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
              <Text variant="body" color="tertiary" align="center">
                No transactions yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  balanceSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  balanceCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
  },
  balanceAmount: {
    color: '#FFFFFF',
    marginBottom: spacing.lg,
  },
  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceItem: {
    flex: 1,
  },
  balanceItemLabel: {
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 2,
  },
  balanceItemValue: {
    color: '#FFFFFF',
  },
  balanceDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: spacing.lg,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  minWithdrawal: {
    marginLeft: 'auto',
  },
  duesSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  duesCard: {
    borderWidth: 1,
    padding: spacing.md,
  },
  duesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  duesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duesIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  duesRight: {},
  clearDuesButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  infoSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  infoCard: {
    padding: spacing.md,
  },
  infoTitle: {
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  infoText: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  transactionsSection: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionContent: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.md,
  },
});

export default WalletScreen;

