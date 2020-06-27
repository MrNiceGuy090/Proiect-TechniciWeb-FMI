window.onload=function(){

	var ajaxRequest = new XMLHttpRequest();

	ajaxRequest.onreadystatechange = function() {
			//daca am primit raspunsul (readyState==4) cu succes (codul status este 200)
			if (this.readyState == 4 && this.status == 200) {
					//in proprietatea responseText am contintul fiserului JSON
					// document.getElementById("afisJson").innerHTML=this.responseText;
					var obJson = JSON.parse(this.responseText);
					afiseajaJsonTemplate(obJson);
					document.getElementById("inputArtist").value = localStorage.getItem("artistFilter")
					document.getElementById("inputArtist").onchange()
			}
	};
	ajaxRequest.open("GET", "../melodii.json", true);
	ajaxRequest.send();

	function afiseajaJsonTemplate(obJson) {
			//in acets div voi afisa template-urile
			let container=document.getElementById("afisTemplate");

			//in textTemplate creez continutul (ce va deveni innerHTML-ul) divului "afisTemplate"
			let textTemplate ="";
			//parcurg vetorul de studenti din obJson
			for(let i=0;i<obJson.melodii.length;i++){
				//creez un template ejs (primul parametru al lui ejs.render)
				//acesta va primi ca parametru un student din vectorul de studenti din json {student: obJson.studenti[i]}
				//practic obJson.studenti[i] e redenumit ca "student" in template si putem sa ii accesam proprietatile: student.id etc
				textTemplate+=ejs.render("<div class='templ_melodie unselected' onclick='selectTrack(this)'>\
				<p>Id: <%= melodie.id %></p>\
				<p>Nume: <%= melodie.nume %></p>\
				<p>Artist: <%= melodie.artist %></p>\
				<p>Durata(secunde): <%= melodie.durata %></p>\
				<p>Data lansarii: <%= melodie.data_lansarii %></p>\
				<p>Gen muzical: <%= melodie.gen_muzical %></p>\
				<p>Original: <%= melodie.original %></p>\
				<p>Ascultari(milioane): <%= melodie.ascultari %></p>\
				</div>",
				{melodie: obJson.melodii[i]});
			}
			//adaug textul cu afisarea studentilor in container
			container.innerHTML=textTemplate;
	}

}

function ajaxReq(){
	var ajaxRequest = new XMLHttpRequest();
	ajaxRequest.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
					var obJson = JSON.parse(this.responseText);
          var tabel = document.getElementById("ajaxTable");
        if( tabel.childElementCount<2 ){
          for(let i=0; i<obJson["lastId"];i++){
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            td1.innerHTML = obJson["melodii"][i]["nume"];
            tr.appendChild(td1);

            var td2 = document.createElement("td");
            td2.innerHTML = obJson["melodii"][i]["artist"];
            tr.appendChild(td2);

            var td3 = document.createElement("td");
            td3.innerHTML = obJson["melodii"][i]["durata(secunde)"];
            tr.appendChild(td3);

            var td4 = document.createElement("td");
            td4.innerHTML = obJson["melodii"][i]["data_lansarii"];
            tr.appendChild(td4);

            var td5 = document.createElement("td");
            td5.innerHTML = obJson["melodii"][i]["gen_muzical"];
            tr.appendChild(td5);

            tabel.appendChild(tr);

          }
        }
			}
	};
	//deschid o conexiune cu o cerere de tip get catre server
	//json e pus in folderul static "resurse" deci calea e relativa la acel folder (fisierul e la calea absoluta /resurse/json/studenti.json)
	ajaxRequest.open("GET", "../melodii.json", true);
	//trimit catre server cererea
	ajaxRequest.send();

}


function upvote(button){
	console.log(button.id);
	var req = new XMLHttpRequest();
	req.open("POST", "/upvote/"+button.id, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.send(JSON.stringify({
	    value: button.id
	}));

	var req2 = new XMLHttpRequest();
	req2.onreadystatechange = function() {
			//daca am primit raspunsul (readyState==4) cu succes (codul status este 200)
			if (this.readyState == 4 && this.status == 200) {
					//in proprietatea responseText am contintul fiserului JSON
					// document.getElementById("afisJson").innerHTML=this.responseText;
					var obJson = JSON.parse(this.responseText);
					var num = button.id.substr(button.id.length - 1);
					button.parentNode.getElementsByClassName("upvotes")[0].innerHTML =
					obJson.feedbacks[num].upvotes;

			}
	};
	req2.open("GET", "../feedback.json",true)
	req2.send()
}

function downvote(button){
	var req = new XMLHttpRequest();
	req.open("POST", "/downvote/"+button.id, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.send(JSON.stringify({
	    value: button.id
	}));

	var req2 = new XMLHttpRequest();
	req2.onreadystatechange = function() {
			//daca am primit raspunsul (readyState==4) cu succes (codul status este 200)
			if (this.readyState == 4 && this.status == 200) {
					//in proprietatea responseText am contintul fiserului JSON
					// document.getElementById("afisJson").innerHTML=this.responseText;
					var obJson = JSON.parse(this.responseText);
					var num = button.id.substr(button.id.length - 1);
					button.parentNode.getElementsByClassName("downvotes")[0].innerHTML =
					obJson.feedbacks[num].downvotes;

			}
	};
	req2.open("GET", "../feedback.json",true)
	req2.send()
}

function hideCom(obj){
	obj.parentNode.style.display="none";

}
