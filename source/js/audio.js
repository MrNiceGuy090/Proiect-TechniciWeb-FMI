var player = document.getElementsByClassName('player')[0];
var playBtn = document.getElementById('play');
var stopBtn = document.getElementById('stop');

var audio = document.getElementById('mainAudio');

function stopAllAudio(){
  var audios = document.getElementsByTagName("audio");
  for(var i=0 ; i<audios.length-1;i++){
    var stpBtn = audios[i].parentNode.getElementsByTagName("button")[1];
    if(stpBtn!==undefined){
      stopSingle(stpBtn)
    }
  }
stopTrack();
}

/////// single audio

function playSingle(btn){
  stopAllAudio();
  var audioSingle = btn.parentNode.parentNode.getElementsByTagName("audio")[0];
  audioSingle.play();
  btn.style.display="none";
  var stopBtn = btn.parentNode.getElementsByClassName("stopSingle")[0];
  stopBtn.style.display = "block";
}

function stopSingle(btn){
  var audioSingle = btn.parentNode.parentNode.getElementsByTagName("audio")[0];
  audioSingle.pause();
  btn.style.display="none";
  var playBtn = btn.parentNode.getElementsByClassName("playSingle")[0];
  playBtn.style.display = "block";
}


myStorage = window.localStorage;
if(myStorage.getItem("trackList") === null){
  trackList = [];
}
else {
  trackList = JSON.parse(localStorage.getItem('trackList'));
}


function addToTrackList(btn){
  var name = btn.parentNode.parentNode.getElementsByTagName("p")[0].innerHTML;
  var audioSrc = btn.parentNode.parentNode.getElementsByTagName("audio")[0].getElementsByTagName("source")[0].getAttribute("src");
  if(localStorage.getItem("trackList") === null ){
    trackList.push({name, audioSrc});
    nexTrack();
  }
  else{
  trackList.push({name, audioSrc});
}
  myStorage.setItem("trackList", JSON.stringify(trackList) );
  console.log(localStorage.getItem("trackList") );

}

window.onload = window.onload.extend(function(){
  player.getElementsByTagName("p")[0].innerHTML =  trackList[0].name;
  var sursaNoua = player.parentNode.getElementsByTagName("audio")[0].getElementsByTagName("source")[0].cloneNode(true);
  sursaNoua.setAttribute("src", trackList[0].audioSrc);
  player.parentNode.getElementsByTagName("audio")[0].getElementsByTagName("source")[0].remove();
  player.parentNode.getElementsByTagName("audio")[0].appendChild(sursaNoua);
  trackList.shift();
  myStorage.setItem("trackList", JSON.stringify(trackList) );
  console.log(trackList);
  audio.load();
  playTrack();
});

// main audio controls

function playTrack(){
  stopAllAudio();
  audio.play();
  playBtn.style.display = "none";
  stopBtn.style.display="block";
}

function stopTrack(){
  audio.pause();
  stopBtn.style.display = "none";
  playBtn.style.display="block";
}

function nextTrack(){
  stopAllAudio();
  player.getElementsByTagName("p")[0].innerHTML =  trackList[0].name;
  var sursaNoua = player.parentNode.getElementsByTagName("audio")[0].getElementsByTagName("source")[0].cloneNode(true);
  sursaNoua.setAttribute("src", trackList[0].audioSrc);
  player.parentNode.getElementsByTagName("audio")[0].getElementsByTagName("source")[0].remove();
  player.parentNode.getElementsByTagName("audio")[0].appendChild(sursaNoua);
  trackList.shift();
  myStorage.setItem("trackList", JSON.stringify(trackList) );
  console.log(trackList);
  audio.load();
  playTrack();
}
