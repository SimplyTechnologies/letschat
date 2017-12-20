import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info'; 

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

    userRef = (path) => {
      if (!path) {
        return this.firebaseApp().database().ref(`users/${DeviceInfo.getUniqueID()}`);
      }
      return this.firebaseApp().database().ref(`users/${DeviceInfo.getUniqueID()}/${path}`);
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
      const id = DeviceInfo.getUniqueID();
      this.firebaseApp().database().ref(`users/${id}`).set(info);
      return Promise.resolve({ ...info, id });
    };

    getOwnUser = () => {
      return new Promise((resolve, reject) => {
        this.firebaseApp().database().ref(`users/${DeviceInfo.getUniqueID()}`)
        .once('value', (snapshot) => {
          const val = snapshot.val();
          if (!val) {
            return resolve(null);
          }
          return resolve({ ...val, id: snapshot.key });
        })
      });
    };

    checkUserExists = (phone) => {
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

    addRoomIdToUser = (roomId, contacts = []) => {
      const userIds = contacts.map(contact => contact.id);
      userIds.push(DeviceInfo.getUniqueID());
      userIds.forEach(id => {
        this.firebaseApp().database().ref(`users/${id}/roomIds/${roomId}`).set(true);
      });
    };

    signOut = () => {
      Firebase.app.auth().signOut();
    };
}

export default new Firebase();