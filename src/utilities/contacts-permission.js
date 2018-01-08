// @flow

import { Alert, Linking, Platform, PermissionsAndroid } from 'react-native';
const isIOS = Platform.OS === 'ios';

const showAlert = (onSuccess = () => {}, onCancel = () => {}) => {
  Alert.alert(
    'App does not have access to your Contacts',
    'To enable access, tap Settings and turn on Contacts.',
    [
      { text: 'Cancel', style: 'cancel', onPress: onCancel },
      { text: 'Settings', onPress: () => {
        onSuccess();
        Linking.openURL('app-settings:');
      } }
    ]
  );
};

export function requestContactsPermission() {
  return new Promise((resolve, reject) => {
    if (isIOS) {
      showAlert(resolve, reject);
      return;
    }
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Chat App Contacts Permission',
        message: 'App needs access to your contacts'
      })
      .then(granted => {
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
            return resolve();
        }
        showAlert(resolve, reject);
      })
      .catch(err => reject(err));
  });
};
