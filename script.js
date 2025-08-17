const songs = [
  { title: "Song 1", artist: "Artist 1", src: "songs/song1.mp3" },
  { title: "Song 2", artist: "Artist 2", src: "songs/song2.mp3" },
  { title: "Song 3", artist: "Artist 3", src: "songs/song3.mp3" },
  { title: "Song 4", artist: "Artist 4", src: "songs/song4.mp3" }
];

let songIndex = 0;
const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeControl = document.getElementById("volume");
const playlist = document.getElementById("playlist");
const togglePlaylistBtn = document.getElementById("togglePlaylist");

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  highlightActiveSong();
}

function playSong() {
  audio.play();
  playBtn.textContent = "⏸️";
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶️";
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

nextBtn.addEventListener("click", () => {
  nextSong();
});

prevBtn.addEventListener("click", () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
});

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

// Update progress
audio.addEventListener("timeupdate", (e) => {
  const { currentTime, duration } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) currentSec = `0${currentSec}`;
  currentTimeEl.textContent = `${currentMin}:${currentSec}`;

  if (duration) {
    let durationMin = Math.floor(duration / 60);
    let durationSec = Math.floor(duration % 60);
    if (durationSec < 10) durationSec = `0${durationSec}`;
    durationEl.textContent = `${durationMin}:${durationSec}`;
  }
});

// Seek functionality
progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

// Volume control
volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value;
});

// Autoplay next song
audio.addEventListener("ended", () => {
  nextSong();
});

// Playlist UI
function buildPlaylist() {
  songs.forEach((song, index) => {
    const songEl = document.createElement("div");
    songEl.textContent = `${song.title} - ${song.artist}`;
    songEl.addEventListener("click", () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    });
    playlist.appendChild(songEl);
  });
}

// Highlight active song
function highlightActiveSong() {
  const items = playlist.querySelectorAll("div");
  items.forEach((item, index) => {
    item.classList.remove("active");
    if (index === songIndex) {
      item.classList.add("active");
    }
  });
}

// Toggle playlist visibility
togglePlaylistBtn.addEventListener("click", () => {
  playlist.classList.toggle("hidden");
  if (playlist.classList.contains("hidden")) {
    togglePlaylistBtn.textContent = "📂 Show Playlist";
  } else {
    togglePlaylistBtn.textContent = "📂 Hide Playlist";
  }
});

// Initialize
buildPlaylist();
loadSong(songs[songIndex]);
