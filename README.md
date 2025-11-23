# 🏯 Final Destination – Logic-Based Ninja Prediction Game

![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404040?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)

![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-blue?style=flat-square)
![Project Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![Made with Love](https://img.shields.io/badge/Made%20With-Love-red?style=flat-square)



A lightweight, fun, and logical mobile game built using React Native (Expo).
Players must predict where the Ninja will land after performing a fixed number of jumps.
The game tests quick thinking, modular arithmetic, and timing — with animations, sounds, leaderboard, and multiplayer turns.

## 🧰 Tech Stack

| Category | Technologies |
|---------|--------------|
| **Frontend** | <img src="https://raw.githubusercontent.com/github/explore/main/topics/react-native/react-native.png" width="40" /> <img src="https://img.icons8.com/color/48/000000/expo.png" width="40"/> |
| **Backend** | <img src="https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png" width="48" /> <img src="https://raw.githubusercontent.com/github/explore/main/topics/express/express.png" width="48" /> |
| **Database** | <img src="https://raw.githubusercontent.com/github/explore/main/topics/mongodb/mongodb.png" width="40" /> |
| **Languages** | <img src="https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png" width="40" /> |
| **Mobile / Runtime** | <img src="https://img.icons8.com/color/48/android-os.png" width="40"/> |
| **Version Control** | <img src="https://raw.githubusercontent.com/github/explore/main/topics/git/git.png" width="40" /> <img src="https://raw.githubusercontent.com/github/explore/main/topics/github/github.png" width="40" /> |
| **Animations & UI** | Lottie, Confetti, Expo-AV Sounds, Custom Themes |



🎮 Gameplay Overview

Each round generates two random values:
Jump → how many blocks the ninja moves forward
Target → how many times he jumps
There are 5 blocks, arranged cyclically.

The final landing position is calculated as:
FinalBlock = (Jump × Target) % 5
If result = 0 → FinalBlock = 5
Players must guess the final block within the countdown timer.

Correct guess → gain points
Wrong guess → round ends + score saved to leaderboard



✨ Features
✔ Core Gameplay

Random Jump and Target generation
Predict final landing block using logic
Animated Ninja movement
Timer-based gameplay
Sounds for run, success, wrong answers

✔ Leaderboard (Persistent)

Stores player name and score
Ranks players in descending order
Fully scrollable
Top players marked visually

✔ Multi-Player Mode

New player enters after a wrong guess
Each player maintains their own score

✔ Rich UI

Background themes
Lottie animations
Confetti effects
Colorful game blocks
Restart and rules screen



> Install dependencies
npm install

> Start Expo
npx expo start

> Run on device
Scan QR using Expo Go (Android)

Or press:

w → open Web
a → launch Android emulator


## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Arkaghoshg">
        <img src="https://github.com/Arkaghoshg.png" width="100px;" alt="Arka Ghosh"/><br />
        <sub><b>Arka Ghosh</b></sub>
      </a>
      <br />
      🎨 Frontend Developer
    </td>
    <td align="center">
      <a href="https://github.com/<friend-username>">
        <img src="https://github.com/<Ari-web-des>.png" width="100px;" alt="Aritra Das"/><br />
        <sub><b>Aritra Das</b></sub>
      </a>
      <br />
      🛠 Backend & Testing
    </td>
  </tr>
</table>



**📜 License

This project is licensed under the MIT License.




