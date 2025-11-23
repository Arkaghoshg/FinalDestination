🏯 Final Destination – Logic-Based Ninja Prediction Game

A lightweight, fun, and logical mobile game built using React Native (Expo).
Players must predict where the Ninja will land after performing a fixed number of jumps.
The game tests quick thinking, modular arithmetic, and timing — with animations, sounds, leaderboard, and multiplayer turns.



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


**📜 License

This project is licensed under the MIT License.
