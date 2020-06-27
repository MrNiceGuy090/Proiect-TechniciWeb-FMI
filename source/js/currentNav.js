var url = window.location.href.split("/")[3];

var tabs = document.getElementById("menu").getElementsByTagName("ul")[0].children;

for(let tab of tabs){

  if(!url && tab.getElementsByTagName("a")[0]){
    if( tab.getElementsByTagName("a")[0].innerHTML==="Acasa") tab.classList.add("menuSelect")
  }
  else if(url==="genuri_de_muzica" && tab.getElementsByTagName("a")[0]){
    if( tab.getElementsByTagName("a")[0].innerHTML==="Genuri de muzica")tab.classList.add("menuSelect");
  }
  else if(tab.getElementsByTagName("a")[0]){
    if( tab.getElementsByTagName("a")[0].innerHTML.toLowerCase() ===url.toLowerCase())tab.classList.add("menuSelect");
  }

}
