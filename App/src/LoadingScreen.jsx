import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

/**
 * Branded loading overlay shown while the web app is booting inside the WebView.
 */
export default function LoadingScreen({ appName = "Rskiaa's" }) {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <Image
        source={require('../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>{appName}</Text>
      <ActivityIndicator size="large" color="#e11d48" style={styles.spinner} />
      <Text style={styles.subtitle}>Loading…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#14161a',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  spinner: {
    marginTop: 28,
  },
  subtitle: {
    color: '#9ca3af',
    marginTop: 10,
    fontSize: 13,
  },
});