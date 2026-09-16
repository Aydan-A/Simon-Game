var buttonColours = ["red", "blue", "green", "yellow"];
var buttonKeys = { q: "green", w: "red", a: "yellow", s: "blue" };
// gap: time between two colours of the sequence, flash: how long a colour lights up (ms)
var difficulties = {
  easy: { label: "Easy", gap: 850, flash: 420 },
  normal: { label: "Normal", gap: 600, flash: 280 },
  hard: { label: "Hard", gap: 380, flash: 170 },
};
var RECORDS_KEY = "simonGame.records";
var SETTINGS_KEY = "simonGame.settings";
var DEFAULT_NAME = "Player";
var MAX_SAVED_GAMES = 100;

var gamePattern = [];
let userClickedPattern = [];
var started = false;
var level = 0;
var acceptingInput = false; // false while the sequence is playing, so early clicks don't count
var timers = [];
var settings = loadSettings();

var sounds = {};
buttonColours.concat("wrong").forEach(function (name) {
  sounds[name] = new Audio(name + ".mp3");
  sounds[name].preload = "auto";
});

$(".name-input")
  .val(settings.name)
  .on("input", function () {
    settings.name = $(this).val();
    saveSettings();
  });

$('input[name="difficulty"]').each(function () {
  this.checked = this.value === settings.difficulty;
});
$('input[name="difficulty"]').on("change", function () {
  settings.difficulty = this.value;
  saveSettings();
  updateBestLine();
});

$(".start-button").click(startGame);
$(".records-button").click(showRecords);
$(".back-button").click(function () {
  showMenu();
});
$(".sound-button").click(toggleSound);
$(".filter-button").click(function () {
  fillRecords($(this).data("difficulty"));
});

$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  handlePress(userChosenColour);
});

$(document).keydown(function (e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  var typing = $(e.target).is("input[type=text]");
  var key = e.key.toLowerCase();

  if (key === "escape") {
    if (!$(".records").hasClass("hide")) showMenu();
    else if (started) quitGame();
    return;
  }

  // Enter in the name field starts the game, other keys are just typing
  if (typing && key !== "enter") return;

  if (key === "m") {
    toggleSound();
    return;
  }

  // Space or Enter starts from the menu, and right after a game over too
  if (!started && (key === " " || key === "enter") && $(".records").hasClass("hide")) {
    // A focused button handles Enter itself
    if (key === "enter" && $(e.target).is("button")) return;
    e.preventDefault();
    startGame();
    return;
  }

  if (started && buttonKeys[key]) {
    e.preventDefault();
    if (!e.repeat) handlePress(buttonKeys[key]);
  }
});

updateSoundButton();
showMenu();

function isTouchScreen() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function difficulty() {
  return difficulties[settings.difficulty];
}

function playerName() {
  return settings.name.trim() || DEFAULT_NAME;
}

function later(fn, ms) {
  timers.push(setTimeout(fn, ms));
}

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function setStatus(text) {
  $(".status").text(text);
}

function showMenu(lines) {
  $(".records").addClass("hide");
  $(".container").addClass("hide");
  $(".menu").removeClass("hide");
  var message = $(".message").empty();
  (lines || []).forEach(function (line) {
    $("<p>").text(line[0]).addClass(line[1]).appendTo(message);
  });
  if (!lines) {
    $("#level-title").text(isTouchScreen() ? "Press Start to Play" : "Press Space Key to Start");
  }
  setStatus("");
  $(".start-button").text(lines ? "Play Again" : "Start");
  $(".help").text(
    isTouchScreen()
      ? "Watch the colours, then tap them in the same order."
      : "Watch the colours, then repeat them with the mouse or Q W / A S. Space to start, M for sound, Esc to quit.",
  );
  updateBestLine();
}

function updateBestLine() {
  var best = bestScore(settings.difficulty);
  var label = difficulty().label;
  $(".best-line").text(best > 0 ? "Best on " + label + ": level " + best : "No " + label + " games yet. Set the first record!");
}

function startGame() {
  if (started) return;
  clearTimers();
  startOver();
  $("body").removeClass("game-over");
  $(".menu, .records").addClass("hide");
  $(".container").removeClass("hide");
  if (document.activeElement) document.activeElement.blur();
  started = true;
  nextSequence();
}

function quitGame() {
  clearTimers();
  startOver();
  showMenu();
}

function handlePress(userChosenColour) {
  if (!started || !acceptingInput) return;
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour, 150);
  checkAnswer(userClickedPattern.length - 1);
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      acceptingInput = false;
      setStatus("Well done!");
      later(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    gameOver();
  }
}

function nextSequence() {
  userClickedPattern = [];
  acceptingInput = false;
  level++;
  $("#level-title").text("Level " + level);
  setStatus("Watch...");
  var randomChosenColour = buttonColours[Math.floor(Math.random() * 4)];
  gamePattern.push(randomChosenColour);
  var speed = difficulty();
  gamePattern.forEach((color, i) => {
    later(() => {
      animatePress(color, speed.flash);
      playSound(color);
    }, 500 + speed.gap * i);
  });
  later(() => {
    acceptingInput = true;
    setStatus("Your turn");
  }, 500 + speed.gap * (gamePattern.length - 1) + speed.flash);
}

function gameOver() {
  var score = level - 1; // the levels that were fully repeated
  var previousBest = bestScore(settings.difficulty);
  clearTimers();
  startOver();
  playSound("wrong");
  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 1000);
  $("#level-title").text(isTouchScreen() ? "Game Over" : "Game Over, Press Space to Restart");
  setStatus("");
  saveGame(score);

  later(function () {
    showMenu(
      [
        [playerName() + ", you completed " + score + (score === 1 ? " level" : " levels") + " on " + difficulty().label + ".", "hint"],
        score > previousBest ? ["New best score!", "new-best"] : null,
      ].filter(Boolean),
    );
  }, 1000);
}

function playSound(name) {
  if (!settings.sound) return;
  // A copy of the sound, so fast presses of the same colour can overlap
  var audio = sounds[name].cloneNode();
  audio.play().catch(function () {});
}

function animatePress(currentColor, duration) {
  $("#" + currentColor).addClass("pressed");
  later(function () {
    $("#" + currentColor).removeClass("pressed");
  }, duration || 100);
}

function startOver() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  acceptingInput = false;
  $(".btn").removeClass("pressed");
}

function toggleSound() {
  settings.sound = !settings.sound;
  saveSettings();
  updateSoundButton();
}

function updateSoundButton() {
  $(".sound-button")
    .text(settings.sound ? "🔊" : "🔇")
    .attr("aria-pressed", String(settings.sound))
    .attr("aria-label", settings.sound ? "Sound on (M)" : "Sound off (M)");
}

function showRecords() {
  fillRecords(settings.difficulty);
  $(".menu").addClass("hide");
  $(".records").removeClass("hide");
  $("#level-title").text("Records");
  $(".back-button").focus();
}

function fillRecords(level) {
  var records = loadRecords().filter((record) => record.difficulty === level);
  var top = records.slice().sort((a, b) => b.score - a.score).slice(0, 10);
  var recent = records.slice().sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 10);
  fillList($(".top-list"), top, true);
  fillList($(".recent-list"), recent, false);
  $(".filter-button").each(function () {
    $(this).attr("aria-pressed", String($(this).data("difficulty") === level));
  });
}

function fillList(list, records, numbered) {
  list.empty();
  if (records.length === 0) {
    $("<li>").addClass("empty").text("No games yet.").appendTo(list);
    return;
  }
  records.forEach((record, index) => {
    var who = $("<span>").addClass("who");
    $("<span>").addClass("player").text((numbered ? index + 1 + ". " : "") + record.name).appendTo(who);
    $("<span>").addClass("when").text(formatDate(record.date)).appendTo(who);
    var score = $("<span>").addClass("score").text("Level " + record.score);
    $("<li>").append(who, score).appendTo(list);
  });
}

function formatDate(date) {
  return new Date(date).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function loadRecords() {
  try {
    var records = JSON.parse(localStorage.getItem(RECORDS_KEY) || "[]");
    if (!Array.isArray(records)) return [];
    return records.filter(
      (record) =>
        record &&
        Number.isFinite(record.score) &&
        !Number.isNaN(Date.parse(record.date)) &&
        typeof record.name === "string" &&
        Object.hasOwn(difficulties, record.difficulty),
    );
  } catch {
    return [];
  }
}

function saveGame(score) {
  var game = { score: score, date: new Date().toISOString(), name: playerName(), difficulty: settings.difficulty };
  var records = loadRecords().concat(game).slice(-MAX_SAVED_GAMES);
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch {
    // Storage can be blocked (private mode); the games just won't be kept
  }
}

function bestScore(level) {
  return loadRecords()
    .filter((record) => record.difficulty === level)
    .reduce((best, record) => Math.max(best, record.score), 0);
}

function loadSettings() {
  var saved = { name: "", difficulty: "normal", sound: true };
  try {
    var stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    if (typeof stored.name === "string") saved.name = stored.name.slice(0, 12);
    if (Object.hasOwn(difficulties, stored.difficulty)) saved.difficulty = stored.difficulty;
    if (typeof stored.sound === "boolean") saved.sound = stored.sound;
  } catch {
    // Use the defaults
  }
  return saved;
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be blocked; the choice just won't be remembered
  }
}
