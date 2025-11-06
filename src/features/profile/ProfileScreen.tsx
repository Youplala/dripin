import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useWardrobe } from '../../hooks/useWardrobe';
import { theme } from '../../theme';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { items, getStats } = useWardrobe({ userId: user?.id || '' });

  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const handleLoadStats = async () => {
    setLoadingStats(true);
    const wardrobeStats = await getStats();
    setStats(wardrobeStats);
    setLoadingStats(false);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    { id: 'stats', title: 'Wardrobe Stats', icon: '📊', action: handleLoadStats },
    { id: 'settings', title: 'Settings', icon: '⚙️', action: () => setShowSettings(true) },
    { id: 'help', title: 'Help & Support', icon: '❓', action: () => {} },
    { id: 'about', title: 'About DripIn', icon: 'ℹ️', action: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.[0].toUpperCase() || '👤'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.email}</Text>
          <Text style={styles.subtitle}>Member since {new Date(user?.created_at || '').toLocaleDateString()}</Text>
        </View>

        <GlassCard style={styles.statsCard}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{items.length}</Text>
              <Text style={styles.statLabel}>Items</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {items.reduce((sum, item) => sum + item.times_worn, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Wears</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {new Set(items.flatMap(item => item.colors)).size}
              </Text>
              <Text style={styles.statLabel}>Colors</Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.menu}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                item.action();
              }}
            >
              <GlassCard style={styles.menuItemCard}>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>
                <Text style={styles.menuItemArrow}>›</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="glass"
          style={styles.signOutButton}
        />

        <Text style={styles.version}>DripIn v1.0.0</Text>
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        variant="sheet"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Settings</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Daily Notifications</Text>
            <Text style={styles.settingValue}>8:00 AM</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Theme</Text>
            <Text style={styles.settingValue}>Dark</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Language</Text>
            <Text style={styles.settingValue}>English</Text>
          </View>

          <Button
            title="Close"
            onPress={() => setShowSettings(false)}
            variant="primary"
            style={styles.modalButton}
          />
        </View>
      </Modal>

      {/* Stats Modal */}
      <Modal
        visible={!!stats}
        onClose={() => setStats(null)}
        variant="sheet"
      >
        {stats && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wardrobe Statistics</Text>

            <View style={styles.detailStats}>
              <View style={styles.detailStatItem}>
                <Text style={styles.detailStatLabel}>By Category</Text>
                {Object.entries(stats.byCategory).map(([key, value]) => (
                  <Text key={key} style={styles.detailStatText}>
                    {key}: {value as number}
                  </Text>
                ))}
              </View>

              <View style={styles.detailStatItem}>
                <Text style={styles.detailStatLabel}>Most Worn</Text>
                {stats.mostWorn.slice(0, 3).map((item: any) => (
                  <Text key={item.id} style={styles.detailStatText}>
                    {item.subcategory || item.category}: {item.times_worn}x
                  </Text>
                ))}
              </View>

              <View style={styles.detailStatItem}>
                <Text style={styles.detailStatLabel}>Unworn Items</Text>
                <Text style={styles.detailStatText}>
                  {stats.leastWorn.length} items never worn
                </Text>
              </View>
            </View>

            <Button
              title="Close"
              onPress={() => setStats(null)}
              variant="primary"
              style={styles.modalButton}
            />
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  name: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  statsCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statsTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  menu: {
    marginBottom: theme.spacing.lg,
  },
  menuItem: {
    marginBottom: theme.spacing.md,
  },
  menuItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  menuItemIcon: {
    fontSize: 24,
  },
  menuItemTitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },
  menuItemArrow: {
    fontSize: 24,
    color: theme.colors.text.tertiary,
  },
  signOutButton: {
    marginBottom: theme.spacing.lg,
  },
  version: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  modalContent: {
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },
  settingValue: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  modalButton: {
    marginTop: theme.spacing.lg,
  },
  detailStats: {
    marginBottom: theme.spacing.lg,
  },
  detailStatItem: {
    marginBottom: theme.spacing.md,
  },
  detailStatLabel: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  detailStatText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    textTransform: 'capitalize',
  },
});
