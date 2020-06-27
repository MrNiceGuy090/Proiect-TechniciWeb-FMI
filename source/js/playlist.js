function reset(){
  var tracks=document.getElementsByClassName("templ_melodie");
  var vtracks=Array.prototype.slice.call(tracks);
  for( let track of tracks){
    track.style.display="inline-block";
    track.classList.remove("selected");
    track.classList.add("unselected");
    track.style.backgroundColor = "transparent";
  }
  vtracks.sort(function(a,b){
    if( Number(a.getElementsByTagName("p")[0].innerHTML.split(":")[1].trim() ) > Number( b.getElementsByTagName("p")[0].innerHTML.split(":")[1].trim() ) )
        return 1;
    else return -1;
  });
  var divMare = document.getElementById("afisTemplate");
  for(let track of vtracks){
  divMare.appendChild(track);
  localStorage.clear();
}}


function getGenre(obj){
  var tracks=document.getElementsByClassName("templ_melodie");

  for( let track of tracks){
    if(obj.value){
      if(track.getElementsByTagName("p")[5].innerHTML.split(":")[1].trim()!==obj.value  )
        {track.style.display="none";}
      else {track.style.display="inline-block";}
    }
    else track.style.display="inline-block";
  }
};

function sortAsc(){
  var tracks=document.getElementsByClassName("templ_melodie");
  var vtracks=Array.prototype.slice.call(tracks);
  vtracks.sort(function(a,b){
    if( Number(a.getElementsByTagName("p")[7].innerHTML.split(":")[1].trim() ) > Number( b.getElementsByTagName("p")[7].innerHTML.split(":")[1].trim() ) )
        return -1;
    else return 1;
  });
  var divMare = document.getElementById("afisTemplate");
  var nr=1;
  for(let track of vtracks){
    track.setAttribute("title","Locul "+nr);
    nr+=1;
    divMare.appendChild(track);
}}

function medDurata(){
  var tracks=document.getElementsByClassName("templ_melodie");
  var durataMedie=0;
  var numTotal=0;
  for( let track of tracks){

    if(track.style.display!=="none")
      {durataMedie += Number(track.getElementsByTagName("p")[3].innerHTML.split(":")[1].trim() );
       numTotal+=1;}

  }
  var paragrafs = document.getElementById("medDurata").getElementsByTagName("p");
  for(let x of paragrafs) document.getElementById("medDurata").removeChild(x);
  var parag = document.createElement("p");
  parag.innerHTML = Math.round(durataMedie/numTotal);
  document.getElementById("medDurata").appendChild(parag);
}


setTimeout(function(){reset()},30000);


setInterval(function(){
  var tracks=document.getElementsByClassName("templ_melodie");
  for( let track of tracks){

track.getElementsByTagName("p")[7].innerHTML =
    track.getElementsByTagName("p")[7].innerHTML.split(":")[0].trim() +
    ": " + Math.round( Number(track.getElementsByTagName("p")[7].innerHTML.split(":")[1].trim())*
    (Math.random()/1000+1)+Math.random()*5 )
  }
}, 10000);

function filterArtist(obj){

  localStorage.setItem("artistFilter",obj.value.toString().toLowerCase() )
  var tracks=document.getElementsByClassName("templ_melodie");
  console.log(tracks);
  var found=false;
  for( let track of tracks){
    if(obj.value){
      if( track.getElementsByTagName("p")[2].innerHTML.split(":")[1].trim().toLowerCase() !==
          obj.value.toLowerCase() ) track.style.display="none";
      else {track.style.display="inline-block"; found=true;}
    }
    else track.style.display="inline-block";
  }
  console.log(!found, obj.value)
  if(!found && obj.value){
    var found = document.getElementById("found");
    found.innerHTML = "Nu s-a gasit artist";
    setTimeout(function(){
      let found = document.getElementById("found");
      found.innerHTML = "";
    }, 4000)
  }
}

function selectTrack(track){
    track.onclick = function(e){
      if(e.ctrlKey){
        if(track.classList.contains("unselected") ){
          track.classList.remove("unselected");
          track.classList.add("selected");
          track.style.backgroundColor = "grey";
        }
      }
      else if(e.shiftKey){
        while( track.classList.contains("unselected") )
          {track.classList.add("selected");
            track.classList.remove("unselected");
            track.style.backgroundColor = "grey";
            track = track.previousSibling;
          }

      }
    }

}

function select(){
  var tracks=document.getElementsByClassName("templ_melodie");
  for(let track of tracks){
    if (track.classList.contains("selected")){
      track.classList.add("unselected");
      track.classList.remove("selected");
      track.style.backgroundColor = "transparent";
    }
    else {track.style.display="none";}
  }
}

window.onkeypress = function(e) {
     if(e.key==="1") {
       sortAsc();
     }
     else if(e.key==="2"){
       reset();
     }
     else if(e.key==="3"){
        select();
     }
   };
