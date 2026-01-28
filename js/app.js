const contanir = document.querySelector('.contanir');
const musicImage = document.querySelector('.img-area img');
const musicName = document.querySelector('.song-name');
const musicArtist = document.querySelector('.song-artist');
const musicAudio = document.getElementById('main-audio');
const palyPause = document.querySelector('.play-pause');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const progressArea = document.querySelector('.progress-area');
const progressBar = document.querySelector('.progress-bar');
const currentTimeTag = document.querySelector('.current-time');
const maxTimeTag = document.querySelector('.max-time');
const repeatPlis = document.getElementById('repeat-plis');
const moreMusic = document.getElementById('more-music');
const musicList = document.querySelector('.music-list');
const closeBtn = document.querySelector('#close');
const ulTag = musicList.querySelector('ul');
const searchInput = document.getElementById('search');

let musicIndex = 0;
let isMusicPaused = true;

// Load Event
window.addEventListener('load', () => {
  loadMusic(musicIndex);
  loadMusicList();
});

// Load Music Function
function loadMusic(indexNum) {
  const song = allMusic[indexNum];
  musicName.textContent = song.name;
  musicArtist.textContent = song.artist;
  musicImage.src = `img/${song.img}.jpg`;
  musicAudio.src = `song/${song.src}.mp3`;
  highlightPlaySong();
}

// Play / Pause Functions
function playMusic() {
  musicAudio.play();
  isMusicPaused = false;
  palyPause.querySelector('i').innerText = "pause";
  document.querySelector('.img-area').classList.add('playing');
  highlightPlaySong();
}

function pauseMusic() {
  musicAudio.pause();
  isMusicPaused = true;
  palyPause.querySelector('i').innerText = "play_arrow";
  document.querySelector('.img-area').classList.remove('playing');
  highlightPlaySong();
}

palyPause.addEventListener('click', () => isMusicPaused ? playMusic() : pauseMusic());

// Next / Previous
function nextMusic() {
  musicIndex = (musicIndex + 1) % allMusic.length;
  loadMusic(musicIndex);
  playMusic();
}
function prevMusic() {
  musicIndex = (musicIndex - 1 + allMusic.length) % allMusic.length;
  loadMusic(musicIndex);
  playMusic();
}

nextBtn.addEventListener('click', nextMusic);
prevBtn.addEventListener('click', prevMusic);

// Progress Update
musicAudio.addEventListener('timeupdate', e => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  if(duration){
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    updateCurrentTime(currentTime);
  }
});

function updateCurrentTime(time){
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60).toString().padStart(2,"0");
  currentTimeTag.textContent = `${min}:${sec}`;
}

musicAudio.addEventListener('loadeddata', () => {
  const duration = musicAudio.duration;
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration % 60).toString().padStart(2,"0");
  maxTimeTag.textContent = `${min}:${sec}`;
});

// Seek on click
progressArea.addEventListener('click', e => {
  const width = progressArea.clientWidth;
  const offsetX = e.offsetX;
  const duration = musicAudio.duration;
  musicAudio.currentTime = (offsetX / width) * duration;
  playMusic();
});

// Repeat / Shuffle
repeatPlis.addEventListener('click', () => {
  const txt = repeatPlis.innerText;
  if(txt === "repeat"){
    repeatPlis.innerText = "repeat_one";
    repeatPlis.setAttribute("title","Song looped");
  } else if(txt === "repeat_one"){
    repeatPlis.innerText = "shuffle";
    repeatPlis.setAttribute("title","Playback shuffled");
  } else {
    repeatPlis.innerText = "repeat";
    repeatPlis.setAttribute("title","Playlist looped");
  }
});

musicAudio.addEventListener('ended', () => {
  const txt = repeatPlis.innerText;
  if(txt === "repeat") nextMusic();
  else if(txt === "repeat_one"){
    musicAudio.currentTime = 0;
    loadMusic(musicIndex);
    playMusic();
  }
  else shuffleMusic();
});

function shuffleMusic(){
  let randIndex;
  do{
    randIndex = Math.floor(Math.random()*allMusic.length);
  } while(randIndex === musicIndex);
  musicIndex = randIndex;
  loadMusic(musicIndex);
  playMusic();
}

// Music List
moreMusic.addEventListener('click', () => musicList.classList.toggle('active'));
closeBtn.addEventListener('click', () => musicList.classList.remove('active'));

function loadMusicList(){
  ulTag.innerHTML = "";
  allMusic.forEach((song,index)=>{
    const li = document.createElement('li');
    li.setAttribute('li-index',index);
    li.innerHTML = `
      <div class="row">
        <span>${song.name}</span>
        <span>${song.artist}</span>
      </div>
      <span class="audio-duration" id="audio-${index}">00:00</span>
      <audio src="song/${song.src}.mp3" id="song-${index}"></audio>
    `;
    ulTag.appendChild(li);

    // Load duration
    const audioTag = li.querySelector(`#song-${index}`);
    const durationTag = li.querySelector(`#audio-${index}`);
    audioTag.addEventListener('loadeddata', ()=>{
      const min = Math.floor(audioTag.duration / 60);
      const sec = Math.floor(audioTag.duration % 60).toString().padStart(2,"0");
      durationTag.innerText = `${min}:${sec}`;
      durationTag.setAttribute('t-duration',`${min}:${sec}`);
    });

    // Click to play
    li.addEventListener('click',()=>{
      musicIndex = index;
      loadMusic(musicIndex);
      playMusic();
      musicList.classList.remove('active');
    });
  });
  highlightPlaySong();
}

// Highlight Playing Song
function highlightPlaySong(){
  const allLi = ulTag.querySelectorAll('li');
  allLi.forEach(li => li.classList.remove('playing'));
  if(allLi[musicIndex]) allLi[musicIndex].classList.add('playing');
}

// Search Feature
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  ulTag.querySelectorAll('li').forEach(li => {
    const name = li.querySelector('.row span').innerText.toLowerCase();
    const artist = li.querySelector('.row span:nth-child(2)')?.innerText.toLowerCase() || '';
    li.style.display = name.includes(query) || artist.includes(query) ? 'flex' : 'none';
  });
});
