var luni = [["Ianuarie",31],["Februarie",29],["Martie",31],["Aprilie",30],["Mai",31],["Iunie",30],["Iulie",31],["August",31],["Septembrie",30],["Octombrie",31],["Noiembrie",30],["Decembrie",31] ];

function nextMonth(){
  var currentMonth = document.getElementsByClassName("month")[0].innerHTML;
  if(currentMonth !== "Decembrie"){
  var nextMon = document.getElementsByClassName("next-mon")[0];
  if(nextMon){
    console.log(currentMonth);
    var lastWeek = nextMon.parentNode;
    var firstWeek = lastWeek.cloneNode(true);

    for(let tab of firstWeek.children){
      if(tab.classList.contains("next-mon"))
        tab.classList.remove("next-mon");
      else
        tab.classList.add("prev-mon");
        tab.getElementsByTagName("span")[0].classList.remove("galben");
        tab.getElementsByTagName("span")[0].classList.remove("rosu");
        tab.getElementsByTagName("span")[0].classList.remove("verde");
    }
  }
  else{
    var lastWeek = document.getElementsByClassName("week")[0];
    var firstWeek = document.getElementsByClassName("week")[0];
    var index = 1;
    for(let tab of firstWeek.children){
      if(tab.classList.contains("prev-mon"))
        tab.classList.remove("prev-mon");
      tab.getElementsByTagName("span")[0].innerHTML = index;
      index+=1;
      tab.getElementsByTagName("span")[0].classList.remove("galben");
      tab.getElementsByTagName("span")[0].classList.remove("rosu");
      tab.getElementsByTagName("span")[0].classList.remove("verde");
    }
  }
  /// sterge taote sapt din luna
  var month = lastWeek.parentNode;
  console.log(month);
  month.innerHTML="";
  //
  month.appendChild(firstWeek);
  console.log(month.innerHTML)
  dayCount = Number(firstWeek.children[firstWeek.children.length-1].getElementsByTagName("span")[0].innerHTML);
  console.log(dayCount);
  var currentMonthIndex ;
  for(let i=0; i<luni.length;i++){
    if(luni[i][0]===currentMonth)currentMonthIndex = i;
  }
  var monthIndex = currentMonthIndex+1;
  document.getElementsByClassName("month")[0].innerHTML = luni[monthIndex][0];

  var maxDays = luni[monthIndex][1];

  while(dayCount<maxDays){
    var week = firstWeek.cloneNode(true);
    for( let tab of week.children){
      tab.classList.remove("prev-mon");
    }
    for(let day of week.children){
      dayCount+=1;
      day.getElementsByTagName("span")[0].innerHTML=dayCount;
      if(dayCount>maxDays){
        day.classList.add("next-mon");
        day.getElementsByTagName("span")[0].innerHTML=dayCount-maxDays;
      }
    }
    month.appendChild(week);
  }
setTimeout(refreshConcerte(),4000);
}
else{alert("Acest calendar este doar pentru anul 2020")}
}


function prevMonth(){

  var currentMonth = document.getElementsByClassName("month")[0].innerHTML;
  if(currentMonth!=="Ianuarie"){
  var prevMon = document.getElementsByClassName("prev-mon")[0];
  if(prevMon){
    console.log(currentMonth);
    var firstWeek = prevMon.parentNode;
    var lastWeek = firstWeek.cloneNode(true);

    for(let tab of lastWeek.children){
      if(tab.classList.contains("prev-mon"))
        tab.classList.remove("prev-mon");
      else
        tab.classList.add("next-mon");
      tab.getElementsByTagName("span")[0].classList.remove("galben");
      tab.getElementsByTagName("span")[0].classList.remove("rosu");
      tab.getElementsByTagName("span")[0].classList.remove("verde");
    }
  }
  else{
    var firstWeek = document.getElementsByClassName("week")[0];
    var lastWeek = document.getElementsByClassName("week")[0];

    var y ;
    for(let i=0; i<luni.length;i++){
      if(luni[i][0]===currentMonth)y = i;
    }
    var index = luni[y-1][1];
    index-=6
    for(let tab of lastWeek.children){
      if(tab.classList.contains("prev-mon"))
        tab.classList.remove("prev-mon");
      tab.getElementsByTagName("span")[0].innerHTML = index;
      index+=1;
      tab.getElementsByTagName("span")[0].classList.remove("galben");
      tab.getElementsByTagName("span")[0].classList.remove("rosu");
      tab.getElementsByTagName("span")[0].classList.remove("verde");
    }
  }
  /// sterge taote sapt din luna
  var month = firstWeek.parentNode;
  month.innerHTML="";
  //
  month.appendChild(lastWeek);
  console.log(lastWeek.innerHTML);
  var currentMonthIndex ;
  for(let i=0; i<luni.length;i++){
    if(luni[i][0]===currentMonth)currentMonthIndex = i;
  }
  var monthIndex = currentMonthIndex-1;
  document.getElementsByClassName("month")[0].innerHTML = luni[monthIndex][0];

  if(monthIndex){
    var maxDays = luni[monthIndex-1][1];
  }
  else {
    maxDays=31;
  }

  dayCount = Number(lastWeek.children[0].getElementsByTagName("span")[0].innerHTML)-1;
  console.log(dayCount);
  var firstDay = 0;
  while(dayCount>0){
    var daysMinus = 0;
    dayCount-=7;
    var week = lastWeek.cloneNode(true);
    for( let tab of week.children){
      tab.classList.remove("next-mon");
    }
    for(let day of week.children){
      dayCount+=1;
      day.getElementsByTagName("span")[0].innerHTML=dayCount;
      if(dayCount<1){
        day.classList.add("prev-mon");
        day.getElementsByTagName("span")[0].innerHTML=maxDays-(7-firstDay)+daysMinus;
        daysMinus+=1;
      }
    }
    dayCount-=7;
    firstDay = Number(week.getElementsByTagName("td")[0].getElementsByTagName("span")[0].innerHTML);
    month.insertBefore(week,month.firstChild);
  }
setTimeout(refreshConcerte(),4000);
}
else{alert("Acest calendar este doar pentru anul 2020")}
}


function addConcert(day){
  var user = document.getElementById("username");
  if(user){
  var form = document.getElementById("calendar-form");
  form.style.display="inline-block";
  console.log( Number(day.getElementsByTagName("span")[0].innerHTML)   );
  console.log( document.getElementsByClassName("month")[0].innerHTML);

  var formDay = document.getElementById("form-day");
  formDay.value=  Number(day.getElementsByTagName("span")[0].innerHTML) ;
  var formMonth = document.getElementById("form-month");
  formMonth.value = document.getElementsByClassName("month")[0].innerHTML;
}
}


window.onload=function(){
  refreshConcerte();
}

function refreshConcerte(){
  var usrn = document.getElementById("username");
  if(!usrn){
    var ajaxRequest = new XMLHttpRequest();

  	ajaxRequest.onreadystatechange = function() {
  			//daca am primit raspunsul (readyState==4) cu succes (codul status este 200)
  			if (this.readyState == 4 && this.status == 200) {
  					//in proprietatea responseText am contintul fiserului JSON
  					// document.getElementById("afisJson").innerHTML=this.responseText;
  					var obJson = JSON.parse(this.responseText);
            console.log(document.getElementsByClassName("month")[0].innerHTML)
            	for(let concert of obJson.concerte){


              if(concert.month===document.getElementsByClassName("month")[0].innerHTML){
                var tabel = document.getElementsByClassName("calendar")[0].getElementsByTagName("tbody")[0];

                for(let week of tabel.getElementsByClassName("week")  ){
                  for(let day of week.getElementsByClassName("day") ){
                    if(day.getElementsByTagName("span")[0].innerHTML === concert.day && !day.classList.contains("prev-mon") && !day.classList.contains("next-mon") ){
                      day.getElementsByTagName("span")[0].classList.add(concert.prioritate)
                      day.getElementsByTagName("span")[0].setAttribute("title","Titlu: "+concert.titlu +"\nDescriere: "+concert.desc);
                    }
                  }
                }
              }

            }
  			}
  	};
  	ajaxRequest.open("GET", "../concerteAll.json", true);
  	ajaxRequest.send();
  }
  else {
    usrn = usrn.innerHTML.split(" ")[1];
    console.log(usrn);
    var ajaxRequest = new XMLHttpRequest();

  	ajaxRequest.onreadystatechange = function() {
  			//daca am primit raspunsul (readyState==4) cu succes (codul status este 200)
  			if (this.readyState == 4 && this.status == 200) {
  					//in proprietatea responseText am contintul fiserului JSON
  					// document.getElementById("afisJson").innerHTML=this.responseText;
  					var obJson = JSON.parse(this.responseText);
            console.log(obJson[usrn]);
            if(obJson[usrn]){
              console.log(document.getElementsByClassName("month")[0].innerHTML)
              	for(let concert of obJson[usrn]){


                if(concert.month===document.getElementsByClassName("month")[0].innerHTML){
                  var tabel = document.getElementsByClassName("calendar")[0].getElementsByTagName("tbody")[0];

                  for(let week of tabel.getElementsByClassName("week")  ){
                    for(let day of week.getElementsByClassName("day") ){
                      if(day.getElementsByTagName("span")[0].innerHTML === concert.day && !day.classList.contains("prev-mon") && !day.classList.contains("next-mon") ){
                        day.getElementsByTagName("span")[0].classList.add(concert.prioritate);
                        day.getElementsByTagName("span")[0].setAttribute("title","Titlu: "+concert.titlu +"\nDescriere: "+concert.desc);
                      }
                    }
                  }
                }
              }
            }
  			}
  	};
  	ajaxRequest.open("GET", "../concerteUsers.json", true);
  	ajaxRequest.send();
  }
}
