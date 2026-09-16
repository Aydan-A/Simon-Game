# Simon Game

This project is a simple Simon Game, where users must replicate a sequence of colors and sounds in the correct order. As the game progresses, the sequence gets longer, and the user must continue to remember the correct order.

**Play it:** https://aydan-a.github.io/Simon-Game/

## Features
- Randomly generated color sequence that increases in length as the player progresses.
- Interactive buttons that light up and play sounds when clicked.
- Start screen with a player name and a difficulty: Easy, Normal or Hard (how fast the sequence is shown).
- Play with the mouse, by tapping on a phone, or with the keyboard: `Q` `W` / `A` `S`.
- Clicks while the sequence is playing are ignored, so you can't lose by accident.
- Game over state with your score, and Space or **Play Again** to restart.
- Records screen with a Top 10 and recent games for each difficulty, saved in the browser.
- Sound on / off with the 🔊 button or `M`.

## Game Flow
**Sequence Generation:** The game randomly generates a sequence of colors that increases with each round.
**User Interaction:** When it says *Your turn*, the player repeats the sequence by clicking the corresponding buttons. The game checks the user's input for accuracy.
**Game Over:** If the user clicks an incorrect button, the game ends, the score is saved and they can start over.

## Controls
| Key | Action |
| --- | --- |
| `Space` / `Enter` | Start or restart |
| `Q` `W` / `A` `S` | Green, Red / Yellow, Blue |
| `M` | Sound on / off |
| `Esc` | Quit to the menu, or leave Records |

## Screenshot

![image](https://github.com/user-attachments/assets/764a1af5-3eb5-41e3-a065-dd1e88b3132b)


## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Aydan-A/Simon-Game.git
   ```
2. Open `index.html` in your browser.

## Contributing
Contributions are welcome! If you find any bugs or have suggestions for improvements, feel free to open an issue or submit a pull request.

