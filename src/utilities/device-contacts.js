// @flow

import Contacts from 'react-native-contacts';

export const getContacts = () => {
  return new Promise((resolve, reject) => {
    return Contacts.getAll((err, contacts) => {
      if (err) {
        return reject(err);
      }
      return resolve(contacts);
    });
  });
}
