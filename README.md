# LetsChat
A React Native example chat app using [Firebase](https://firebase.google.com/).

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/), [npm](https://www.npmjs.com/) and [cocoapods](https://cocoapods.org/) installed.

2. Clone down the repository

3. Install your dependencies

    ##### npm
    ```
    npm install
    ```
    ##### yarn
    ```
    yarn install
    ```
4. In `~./LetsChat/ios` folder

    ##### cocoapods
    ```
    pod install
    ```

5. Start the iOS app

    ```
    react-native run-ios
    ```

 ## Add Firebase to your iOS Project

Before you begin, you need a few things set up in your environment
To do this you'll need a Firebase project and a Firebase configuration file for your app.

1. Create a Firebase project in the [Firebase console](https://console.firebase.google.com/), if you don't already have one. If you already have an existing Google project associated with your mobile app, click `Import Google Project`. Otherwise, click `Add project`.
2. Click `Add Firebase to your iOS app` and follow the setup steps. If you're importing an existing Google project, this may happen automatically and you can just [download the config file](https://support.google.com/firebase/answer/7015592).
3. When prompted, enter your app's bundle ID. It's important to enter the bundle ID your app is using; this can only be set when you add an app to your Firebase project.
4. At the end, you'll download a `GoogleService-Info.plist` file. You can [download this file](https://support.google.com/firebase/answer/7015592) again at any time.
5. If you haven't done so already, add this file to your Xcode project root using the `Add Files` utility in Xcode (From the `File` menu, click `Add Files`). Make sure the file is included in your app's build target.

Visit [here](https://firebase.google.com/docs/ios/setup) for more information.

6. Then you need to enable `Phone Authentication` in [Firebase console](https://console.firebase.google.com/) `Authentication` section.

7. Open the `GoogleService-Info.plist` configuration file, and look for the `REVERSED_CLIENT_ID` key. Copy the value of that key, and paste it into the `Info.plist`'s `CFBundleURLSchemes`.


If you run into issues starting the apps please refer to the [React Native docs](https://facebook.github.io/react-native/docs/getting-started.html). It's most likely a problem with your environment.
