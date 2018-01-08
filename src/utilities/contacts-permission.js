import { Alert, Linking, Platform, PermissionsAndroid } from 'react-native';
const isIOS = Platform.OS === 'ios';

export function requestContactsPermission() {
  const showAlert = (onSuccess = () => {}, onCancel = () => {}) => {
    return Alert.alert(
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

  return new Promise((resolve, reject) => {
    if (isIOS) {
      showAlert(resolve, reject);
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
