let buttons = document.querySelectorAll(".l-btn .btn");

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    let dropdown = this.closest(".dropdown");
    let menu = dropdown.querySelector(".m-btn");
    let down = dropdown.querySelector(".down");
    let up = dropdown.querySelector(".up");

    let isOpen = menu.classList.contains("show");

    // Close all dropdowns
    document.querySelectorAll(".m-btn").forEach(function (menu) {
      menu.classList.remove("show");
    });

    // Reset all arrows
    document.querySelectorAll(".down").forEach(function (icon) {
      icon.classList.remove("dd");
    });

    document.querySelectorAll(".up").forEach(function (icon) {
      icon.classList.remove("uu");
    });

    // Open only if it was not already open
    if (!isOpen) {
      menu.classList.add("show");
      down.classList.add("dd");
      up.classList.add("uu");
    }
  });
});

// --- Element Selection ---
const tracks = document.querySelectorAll(".media");
const playBtn = document.getElementById("play");
const progressBar = document.getElementById("progress");
const audioPlayer = document.getElementById("audioPlayer");

let currentTrackIndex = -1;

// --- Helper function to handle active UI highlight classes ---
function highlightActiveTrack(index) {
  // Clear the active class styling from whichever track currently has it
  const currentActive = document.querySelector(".media.active-track");
  if (currentActive) {
    currentActive.classList.remove("active-track");
  }

  // Paint the beautiful border glow onto the newly selected track
  if (tracks[index]) {
    tracks[index].classList.add("active-track");
  }
}

// --- Audio Controller Core Functions ---
function loadAndPlayTrack(index) {
  if (index < 0 || index >= tracks.length) return;

  currentTrackIndex = index;

  // Assign path dynamically to your native HTML5 audio element source
  audioPlayer.src = "sounds/m" + (index + 1) + ".m4a";

  // Reset progress slider visual state
  progressBar.value = 0;

  // Sync the thick glowing active border
  highlightActiveTrack(index);

  // Trigger Playback
  playAudio();
}

function playAudio() {
  if (!audioPlayer.src) return;
  audioPlayer
    .play()
    .then(() => {
      playBtn.textContent = "⏸"; // Swaps symbol to Pause icon
    })
    .catch((err) => console.error("Playback interrupted:", err));
}

function pauseAudio() {
  audioPlayer.pause();
  playBtn.textContent = "▶"; // Swaps symbol back to Play icon
}

// --- Live Progress Stream Updates ---
audioPlayer.addEventListener("timeupdate", () => {
  if (!isNaN(audioPlayer.duration)) {
    // Track progress slider ratio position (0 to 100)
    const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = percentage;
  }
});

// Auto-advance loop tracking when song reaches the finish mark
audioPlayer.addEventListener("ended", () => {
  let nextIndex = currentTrackIndex + 1;
  if (nextIndex >= tracks.length) nextIndex = 0; // loops back to beginning
  loadAndPlayTrack(nextIndex);
});

// --- User Interaction Hooks ---

// 1. Linking individual Playlist tracklist selections
for (let i = 0; i < tracks.length; i++) {
  tracks[i].addEventListener("click", function () {
    if (currentTrackIndex === i) {
      // If user clicks the currently active song, toggle play/pause state
      if (audioPlayer.paused) {
        playAudio();
      } else {
        pauseAudio();
      }
    } else {
      loadAndPlayTrack(i);
    }
  });
}

// 2. Master Center Toggle Action Button
playBtn.addEventListener("click", () => {
  if (!audioPlayer.src) {
    loadAndPlayTrack(0); // If nothing is loaded, default to song #1
    return;
  }
  if (audioPlayer.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
});

// 3. Timeline Dragging Progress Tracking Change
progressBar.addEventListener("input", () => {
  if (audioPlayer.src && !isNaN(audioPlayer.duration)) {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
  }
});
