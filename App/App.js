import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Linking,
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

import { WEB_APP_URL, getHostname, isAllowedHost, isWebAppPage } from './src/config';
import ErrorScreen from './src/ErrorScreen';
import LoadingScreen from './src/LoadingScreen';
import PopupWebView from './src/PopupWebView';

/**
 * Rskiaa's — React Native wrapper.
 *
 * Loads the (deployed) React web app in a full-screen WebView and reuses the
 * existing backend exactly as the website does. The web frontend already talks
 * to the same API (VITE_PRODUCTION_URL) and persists its cart in
 * localStorage, which is enabled here via `domStorageEnabled`.
 */
export default function App() {
  const webViewRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [popupUrl, setPopupUrl] = useState(null);

  // ── Navigation guard ──────────────────────────────────────────────────────
  const handleShouldStartLoad = useCallback((request) => {
    const { url, isTopFrame } = request || {};

    // Non-web schemes → hand off to the OS
    if (!/^https?:\/\//i.test(url || '')) {
      if (/^(tel:|mailto:|sms:|geo:|whatsapp:|intent:)/i.test(url || '')) {
        Linking.openURL(url).catch(() => {});
      }
      return false;
    }

    const host = getHostname(url);

    // Known hosts (web app, API, Razorpay, image CDNs) always load in-app
    if (isAllowedHost(host)) {
      return true;
    }

    // Subframes / sub-resources from unknown hosts → allow so the SPA renders
    if (isTopFrame === false) {
      return true;
    }

    // Top-level navigation to an external site → open in the system browser
    Linking.openURL(url).catch(() => {});
    return false;
  }, []);

  // ── Razorpay / popup windows (Android WebViews can't render popups itself) ──
  const handleOpenWindow = useCallback((syntheticEvent) => {
    const { nativeEvent } = syntheticEvent || {};
    const target = nativeEvent?.targetUrl || nativeEvent?.url || '';
    if (target) {
      setPopupUrl(target);
    }
  }, []);

  const closePopup = useCallback(() => setPopupUrl(null), []);

  // ── Android hardware back button ───────────────────────────────────────────
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (popupUrl) {
        closePopup();
        return true;
      }
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true;
      }
      // Let the app exit when there's nothing left to go back to
      return false;
    });
    return () => subscription.remove();
  }, [canGoBack, popupUrl, closePopup]);

  const retry = useCallback(() => {
    setFatalError(false);
    setLoading(true);
    webViewRef.current?.reload();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="auto" translucent />

      <WebView
        ref={webViewRef}
        source={{ uri: WEB_APP_URL }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        setSupportMultipleWindows
        originWhitelist={['http://*', 'https://*']}
        onOpenWindow={handleOpenWindow}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        onLoadStart={() => setFatalError(false)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setFatalError(true);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent || {};
          const code = nativeEvent?.statusCode;
          if (code && code >= 400 && isWebAppPage(nativeEvent?.url)) {
            setLoading(false);
            setFatalError(true);
          }
        }}
        onNavigationStateChange={(nav) => setCanGoBack(!!nav.canGoBack)}
        overScrollMode="never"
      />

      {loading && !fatalError ? <LoadingScreen /> : null}
      {fatalError ? <ErrorScreen onRetry={retry} /> : null}

      <PopupWebView visible={!!popupUrl} url={popupUrl} onClose={closePopup} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#14161a',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});