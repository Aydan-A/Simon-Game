# Simon Game

This project is a simple Simon Game, where users must replicate a sequence of colors and sounds in the correct order. As the game progresses, the sequence gets longer, and the user must continue to remember the correct order.

**Play it:** https://aydan-a.github.io/Simon-Game/

## Features
- Randomly generated color sequence that increases in length as the player progresses.
- Interactive buttons that light up and play sounds when clicked.
- Light, playful design with a round Simon board; on the start screen the colours light up and the center of the board is the Start button.
- Player name tag and a difficulty switch: Easy, Normal or Hard (how fast the sequence is shown).
- Play with the mouse, by tapping on a phone, or with the keyboard: `Q` `W` / `A` `S`.
- Clicks while the sequence is playing are ignored, so you can't lose by accident.
- Game over screen with the levels you completed and your best, which stays until you choose **Play Again** (`Space`) or **Menu** (`Esc`).
- 🏆 Leaderboard for each difficulty: a clear Top 10 with medals for the first three and your last game, saved in the browser.
- Sound on / off with the 🔊 button or `M`.

## Game Flow
**Sequence Generation:** The game randomly generates a sequence of colors that increases with each round.
**User Interaction:** When it says *Your turn*, the player repeats the sequence by clicking the corresponding buttons. The game checks the user's input for accuracy.
**Game Over:** If the user clicks an incorrect button, the game ends, the score is saved and they can start over.

## Controls
| Key | Action |
| --- | --- |
| `Space` / `Enter` | Start, or play again after a game over |
| `Q` `W` / `A` `S` | Green, Red / Yellow, Blue |
| `M` | Sound on / off |
| `Esc` | Quit to the menu, or close the leaderboard |

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

