import React, { useCallback, useMemo } from 'react';
import { Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { getHostname } from './config';

/**
 * Handles "new window" content (e.g. the Razorpay payment popup that the
 * web app opens with `window.open`). Android WebViews do not render popups
 * on their own, so `App.js` captures `onOpenWindow` events and presents the
 * target URL here in a dedicated modal WebView.
 *
 * The popup uses shared cookies / third-party storage so the session with the
 * main WebView stays consistent. Close the modal via the header button (or the
 * Android back button) once the payment flow completes.
 */
export default function PopupWebView({ visible, url, onClose }) {
  const hostname = useMemo(() => getHostname(url), [url]);

  const handleShouldStartLoad = useCallback((request) => {
    const { url: target } = request;
    if (!/^https?:\/\//i.test(target || '')) {
      if (/^(tel:|mailto:|sms:|geo:|whatsapp:|intent:)/i.test(target || '')) {
        Linking.openURL(target).catch(() => {});
      }
      return false;
    }
    return true;
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.host}>
          {hostname || 'Secure checkout'}
        </Text>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.close}>Done</Text>
        </TouchableOpacity>
      </View>
      {visible && url ? (
        <WebView
          source={{ uri: url }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          setSupportMultipleWindows={false}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
        />
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d1d5db',
  },
  host: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    marginRight: 12,
  },
  close: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e11d48',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});