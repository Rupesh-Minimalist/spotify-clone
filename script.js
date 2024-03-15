console.log("Let's Start Javacript");

async function getSongs() {
  let SongData = await fetch("http://127.0.0.1:5500/songs/");
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
async function main() {
  //   get audio
  let songs = await getSongs();
  console.log(songs);

  //push audio to html
  let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  for (let song of songs) {
    songUl.innerHTML += `<li class="b2 hovering">
                            <div class="songPoster b2">
                                <img class="b2" src="src/songPoster.png" alt="">
                            </div>
                            <div class="artist b2">
                                <div class="b2 c1">${song.replaceAll("%20"," ")}</div>
                            </div>
                            <div></div>
                            <div class="playnow b2 ">
                                <span class="b2 c1">Play Now</span>
                                <img class="b2" src="src/playnow.png" alt="" width="24px">
                            </div>
                        </li>`;
  }

  // plays audio
  var audio = new Audio(songs[1]); 
  audio.play();


  //adding event listener to hamburger 
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="2%";
  })

  // adding event listener to close
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100%";
  })
}
main();
