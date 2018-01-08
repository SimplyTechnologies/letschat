// @flow

import firebase from 'react-native-firebase';

class Firebase {
    static app = null;

    firebaseApp = () => {
      if (!Firebase.app) {
        Firebase.app = firebase.app();
      }
      return Firebase.app;
    };

    roomsRef = (path) => {
      if (!path) {
        return this.firebaseApp().database().ref('rooms');
      }
      return this.firebaseApp().database().ref(`rooms/${path}`);
    };

    messagesRef = (path) => {
      if (!path) {
        return this.firebaseApp().database().ref(`messages`);
      }
      return this.firebaseApp().database().ref(`messages/${path}`);
    };

    usersRef = (path) => {
      if (!path) {
        return this.firebaseApp().database().ref('users');
      }
      return this.firebaseApp().database().ref(`users/${path}`);
    };

    isAuthenticated = () => {
      return new Promise((resolve, reject) => {
        return firebase.auth().onAuthStateChanged((state) => {
          if (!state) {
            return reject()
          }
          return resolve(state);
        });
      })
    };

    requestAuthenticationCode = (code, number) => {
        return firebase.auth().signInWithPhoneNumber(code+number)
    };

    setUserInfo = (info) => {
      if (info.id) {
        const data = { ...info };
        delete data.id;
        this.usersRef(info.id).set(data);
        return Promise.resolve({ ...info });
      }

      const userRef = this.usersRef().push();
      userRef.set(info);
      return Promise.resolve({ ...info, id: userRef.key });
    };

    getUserByPhoneNumber = (phone) => {
      return new Promise((resolve, reject) => {
        this.firebaseApp().database().ref('users')
        .orderByChild('phone')
        .equalTo(phone)
        .once('value', (snapshot) => {
          const val = snapshot.val();
          if (!snapshot) {
            return reject();
          }
          var items = [];
          snapshot.forEach(child => {
            items.push({
              ...child.val(),
              id: child.key
            });
          })
          return resolve(items.length > 0 ? items[0] : null);
        })
      });
    };

    addRoomIdToUser = (roomId, users = []) => {
      users.forEach(id => {
        this.firebaseApp().database().ref(`users/${id}/roomIds/${roomId}`).set(true);
      });
    };

    signOut = () => {
      Firebase.app.auth().signOut();
    };
}

export default new Firebase();
