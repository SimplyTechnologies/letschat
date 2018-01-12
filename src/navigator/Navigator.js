// @flow

import { Navigation } from 'react-native-navigation';
import {
  LOGIN_SCENE,
  MESSAGE_SCENE,
  SPLASH_SCREEN,
} from './constants';
import registerScreens from './registerScreens';

registerScreens();

export function startLoginScene() {
  Navigation.startSingleScreenApp({
    screen: {
      screen: LOGIN_SCENE,
      navigatorStyle: {
        navBarHidden: true,
        navBarButtonColor: 'white',
        statusBarHidden: false,
      },
      overrideBackPress: true,
    },
    appStyle: {
      orientation: 'portrait'
    },
    animationType: 'fade',
  });
}

export function startApp(passProps?: {}) {
  Navigation.startSingleScreenApp({
    screen: {
      screen: MESSAGE_SCENE,
      navigatorStyle: {
        navBarHidden: false,
        navBarButtonColor: 'black',
      },
      title: 'Chat',
      navigatorButtons: {
        rightButtons: [
          {
            title: '+',
            id: 'add',
            buttonColor: 'black',
            buttonFontSize: 40,
            buttonFontWeight: '200',
          }
        ],
        leftButtons: [
          {
            title: 'Sign Out',
            id: 'cancel',
            buttonColor: 'black',
            buttonFontSize: 14,
            buttonFontWeight: '600',
          }
        ]
      },
    },
    passProps,
    appStyle: {
      orientation: 'portrait'
    },
    animationType: 'fade',
  });
}

export function startSplashScreen() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: SPLASH_SCREEN,
        navigatorStyle: {
          navBarHidden: true,
          navBarButtonColor: 'white',
          statusBarHidden: true,
        }
      },
      appStyle: {
        orientation: 'portrait'
      },
      animationType: 'fade',
    });
  }
