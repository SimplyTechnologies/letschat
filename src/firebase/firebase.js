import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info'; 

class Firebase {
    static app = null;

    firebaseApp = () => {
      if (!Firebase.app) {
        console.log('init', Firebase.app);
        const firebaseConfig = {
          apiKey: "AIzaSyCpTQM8s7T8VszSt_Rm2Qe1SjCWoVNsuYQ",
          authDomain: "lets-chat-dd894.firebaseapp.com",
          databaseURL: "https://lets-chat-dd894.firebaseio.com",
        };
        Firebase.app = firebase.app();
        // Firebase.app = firebase.initializeApp(firebaseConfig);
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
      this.firebaseApp().database().ref(`users/${DeviceInfo.getUniqueID()}`)
      .set(info);
      return new Promise((resolve, reject) => {
        const data = { ...info, id: DeviceInfo.getUniqueID() };
        AsyncStorage.setItem('user', JSON.stringify(data))
        .then(() => resolve(data))
        .catch((err) => reject(err));
      });
    };

    getOwnUser = () => {
      return new Promise((resolve, reject) => {
        this.firebaseApp().database().ref(`users/${DeviceInfo.getUniqueID()}`)
        .once('value', (snapshot) => {
          const val = snapshot.val();
          console.log('own', val);
          if (!val) {
            return reject();
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
        const ref = this.firebaseApp().database().ref(`users/${id}/roomIds`)
        .push();
        ref.set(roomId)
      });
    };

    signOut = () => {
      Firebase.app.auth().signOut();
      AsyncStorage.removeItem('user');
    };
}

export default new Firebase();