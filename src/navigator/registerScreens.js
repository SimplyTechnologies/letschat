// @flow

import * as React from 'react';
import { Navigation } from 'react-native-navigation';
import * as AppScenes from 'AppScenes';
import * as ScreenNames from './constants';

const Scenes = { ...AppScenes };

export default function initializeScreens() {
  const hasOwn = Object.prototype.hasOwnProperty;

  for (const key in ScreenNames) {
    if (!hasOwn.call(ScreenNames, key)) {
      continue;
    }
    const name: string = ScreenNames[key];
    const screen: string = name.replace(/app\./, '');
    const Scene: React.Element<*> = Scenes[screen];

    if ((!name || !screen || !Scene) && __DEV__) {
      console.error({
        name,
        screenName: screen,
        screen: Scene
      });
    }
    Navigation.registerComponent(name, () => Scene);
  }
}
