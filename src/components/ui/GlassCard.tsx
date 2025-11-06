import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'card';
  intensity?: number;
}

export function GlassCard({
  children,
  style,
  variant = 'default',
  intensity = 80
}: GlassCardProps) {
  const glassStyle = theme.glass[variant];

  return (
    <View style={[styles.container, glassStyle, glassStyle.shadow, style]}>
      <BlurView intensity={intensity} style={styles.blur}>
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: theme.borderRadius.lg,
  },
  blur: {
    flex: 1,
    padding: theme.spacing.md,
  },
});
