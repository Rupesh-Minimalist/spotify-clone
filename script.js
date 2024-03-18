console.log("Let's Start Javacript");
let currSong = new Audio();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(Math.floor(seconds % 60)).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let SongData = await fetch("/songs/");
  let response = await SongData.text(); // because of non json format

  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track) => {
  // plays audio
  currSong.src = "/songs/" + track;
  currSong.play();

  let play = document.querySelector(".player-play-img");
  play.src = "src/pause.png";

  document.querySelector(".NowSong").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML="00:00/00:00";
};
async function main() {
  //   get audio
  let songs = await getSongs();
  console.log(songs);

  //push audio to html
  let songUl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  for (let song of songs) {
    songUl.innerHTML += `<li class="b2 hovering">
                            <div class="songPoster b2">
                                <img class="b2" src="src/songPoster.png" alt="">
                            </div>
                            <div class="artist b2">
                                <div class="b2 c1">${song.replaceAll(
                                  "%20",
                                  " "
                                )}</div>
                            </div>
                            <div></div>
                            <div class="playnow b2 ">
                                <span class="b2 c1">Play Now</span>
                                <img class="b2" src="src/playnow.png" alt="" width="24px">
                            </div>
                        </li>`;
  }

  //attaching event listner to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playMusic(e.querySelector(".artist").firstElementChild.innerHTML.trim());
    });
  });

  // event listner to prev play next
  let play = document.querySelector(".player-play-img");
  play.addEventListener("click", () => {
    if (currSong.paused) {
      currSong.play();
      play.src = "src/pause.png";
    } else {
      currSong.pause();
      play.src = "src/player-play.png";
    }
  });

  //listen for time update event
  currSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currSong.currentTime
    )} / ${secondsToMinutesSeconds(currSong.duration)}`;
    document.querySelector(".SeekCircle").style.left =
      (currSong.currentTime / currSong.duration) * 100 + "%";
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".SeekCircle").style.left = percent + "%";
    currSong.currentTime = (currSong.duration * percent) / 100;
  });

  // Add an event listener to previous
  let previous=document.querySelector(".previous");
  previous.addEventListener("click", () => {
    currSong.pause();
    console.log("Previous clicked");
    let index = songs.indexOf(currSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Add an event listener to next
  let next=document.querySelector(".next");
  next.addEventListener("click", () => {
    currSong.pause();
    console.log("Next clicked");

    let index = songs.indexOf(currSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Add an event to volume
  document.querySelector(".volume-seekbar").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currSong.volume = parseInt(e.target.value) / 100
    if (currSong.volume >0){
        document.querySelector(".VolImg").src = document.querySelector(".VolImg").src.replace("src/mute.svg", "src/volume.svg")
    }
})

  

  //adding event listener to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "2%";
  });

  // adding event listener to close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });
}
main();
