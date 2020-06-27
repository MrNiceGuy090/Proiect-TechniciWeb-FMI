var express = require('express');/*include modulul express
memorand in variabila express obiectul asociat modulului(exportat de modul)*/
var path  = require('path');
var formidable = require('formidable');
var session = require('express-session');

var fs = require('fs');//file system
var crypto = require('crypto')

var app = express();

app.use(session(
	{
		secret:"cheie_sesiune",
		resave: true,
		saveUninitialized:false
	}
)); // crreaza campul session in request: req.session (req.session e acelasi obiect pentru toate cererile)

// pentru folosirea ejs-ului
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'source')));

// metode post

app.post('/register',function(req,res) {
  var dateForm=new formidable.IncomingForm()
	dateForm.parse(req, function(err, fields, files){
		//<input type="file" name="fis1" /> ----> files.fis1
		//fields e pentru restul de inputuri <input name="ceva" ---> fields.ceva
		var textJson=fs.readFileSync("source/useri.json","utf8"); //cale relativa la fisierul index.js
		var obJson=JSON.parse(textJson);
		var parolaCriptata;
		var algoritmCriptare=crypto.createCipher("aes-128-cbc", "cheie_criptare")
		parolaCriptata=algoritmCriptare.update(fields.parola, "utf-8","hex");
		parolaCriptata+=algoritmCriptare.final("hex");

		var userNou={
      id: obJson.lastId,
      username: fields.username,
      nume: fields.nume,
      email: fields.email,
      parola: parolaCriptata,
      dataInreg: new Date(),
      rol: "user",
      tara: fields.tara,
      telefon: fields.telefon
    }
    console.log(userNou);
		obJson.useri.push(userNou);
		obJson.lastId+=1;
		//JSON.stringify opusul lui JSON.parse --->  din obiect imi face string
		var jsonNou=JSON.stringify(obJson);
		fs.writeFileSync("source/useri.json",jsonNou);
		res.redirect("/");
	})
})

app.post('/feedback', function(req,res){
	var usrn=req.session ? (req.session.utilizator? req.session.utilizator.username : null) : null;
	var dateForm=new formidable.IncomingForm()
	dateForm.parse(req, function(err, fields, files){
		var textJson=fs.readFileSync("source/feedback.json","utf8"); //cale relativa la fisierul index.js
		var obJson=JSON.parse(textJson);
		var newFeedback = {
			user: usrn,
			title: fields.title,
			description: fields.description,
			upvotes: 0,
			downvotes:0,
			upvoters: [],
			downvoters: []
		}
		obJson.feedbacks.push(newFeedback);
		obJson.nr+=1;
		var jsonNou=JSON.stringify(obJson);
		fs.writeFileSync("source/feedback.json", jsonNou)
		console.log("feedback recieved")
		res.redirect("/sugestii")
	})

});


app.post('/login',function(req,res) {
  var dateForm=new formidable.IncomingForm()
	dateForm.parse(req, function(err, fields, files){
		//<input type="file" name="fis1" /> ----> files.fis1
		//fields e pentru restul de inputuri <input name="ceva" ---> fields.ceva
		var textJson=fs.readFileSync("source/useri.json","utf8"); //cale relativa la fisierul index.js
		var obJson=JSON.parse(textJson);
		var parolaCriptata;
		var algoritmCriptare=crypto.createCipher("aes-128-cbc", "cheie_criptare")
		parolaCriptata=algoritmCriptare.update(fields.parola, "utf-8","hex");
		parolaCriptata+=algoritmCriptare.final("hex");
    var user= obJson.useri.find(function(elem){
			return elem.username == fields.username &&  elem.parola==parolaCriptata
		})
		if(user){
			console.log("Exista utilizatorul")
			req.session.utilizator=user;
			res.redirect("/")
		}

	})
})




// cand se face o cerere get catre pagina de index
app.get('/', function(req, res) {
	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
  	var usrn=req.session ? (req.session.utilizator? req.session.utilizator.username : null) : null;
    res.render('html/index', {username:usrn});
});



app.get('/logout', function(req, res) {
	req.session.destroy();
	res.redirect("/")
});

app.get('/sugestii', function(req,res){
	var usrn=req.session ? (req.session.utilizator? req.session.utilizator.username : null) : null;
	console.log(usrn);
	var textJson=fs.readFileSync("source/feedback.json","utf8"); //cale relativa la fisierul index.js
	var obJson=JSON.parse(textJson);
	var comments = obJson.feedbacks;
	res.render("html/sugestii", {username: usrn, comments:comments})
});

app.post('/upvote/*', function(req,res){
	var usrn=req.session ? (req.session.utilizator? req.session.utilizator.username : null) : null;
	var url = req.url;
	var number = url.charAt( url.length - 1 );

	var textJson=fs.readFileSync("source/feedback.json","utf8"); //cale relativa la fisierul index.js
	var obJson=JSON.parse(textJson);
	if(!obJson.feedbacks[number].upvoters.includes(usrn) || usrn==null )
		{obJson.feedbacks[number].upvotes += 1;
		 obJson.feedbacks[number].upvoters.push(usrn);
		}

	var jsonNou=JSON.stringify(obJson);

	fs.writeFileSync("source/feedback.json", jsonNou)
	console.log(usrn);


});

app.post('/downvote/*', function(req,res){
	var usrn=req.session ? (req.session.utilizator? req.session.utilizator.username : null) : null;
	var url = req.url;
	var number = url.charAt( url.length - 1 );

	var textJson=fs.readFileSync("source/feedback.json","utf8"); //cale relativa la fisierul index.js
	var obJson=JSON.parse(textJson);
	console.log(usrn);
	if(!obJson.feedbacks[number].downvoters.includes(usrn) || usrn==null )
		{obJson.feedbacks[number].downvotes += 1;
		 obJson.feedbacks[number].downvoters.push(usrn);
		}
	console.log(number, obJson.feedbacks[number]);

	var jsonNou=JSON.stringify(obJson);
	fs.writeFileSync("source/feedback.json", jsonNou)

});

app.post('/addConcert', function(req,res){
	var usrn=req.session ? (req.session.utilizator? req.session.utilizator.username : null) : null;
if(!usrn){
	var dateForm=new formidable.IncomingForm()
	dateForm.parse(req, function(err, fields, files){
		var textJson=fs.readFileSync("source/concerteAll.json","utf8"); //cale relativa la fisierul index.js
		var obJson=JSON.parse(textJson);
		var newConcert = {
			titlu: fields.titlu,
			desc: fields.desc,
			prioritate: fields.prioritate,
			day: fields.day,
			month: fields.month
		}
		obJson.concerte.push(newConcert);
		var jsonNou=JSON.stringify(obJson);
		fs.writeFileSync("source/concerteAll.json", jsonNou)
		console.log("eveniment inregistrat")
		res.redirect("/")
	})
}
else{
	console.log("da")
	var dateForm=new formidable.IncomingForm()
	dateForm.parse(req, function(err, fields, files){
		var textJson=fs.readFileSync("source/concerteUsers.json","utf8"); //cale relativa la fisierul index.js
		var obJson=JSON.parse(textJson);
		var newConcert = {
			titlu: fields.titlu,
			desc: fields.desc,
			prioritate: fields.prioritate,
			day: fields.day,
			month: fields.month
		}
		console.log(obJson[usrn]);
		if(!obJson[usrn])
			obJson[usrn] = [];
		console.log(obJson[usrn]);
		obJson[usrn].push(newConcert);
		var jsonNou=JSON.stringify(obJson);
		fs.writeFileSync("source/concerteUsers.json", jsonNou)
		console.log("eveniment inregistrat pt user "+usrn)
		res.redirect("/")
	})

}
});

app.get('/*', function(req, res) {
		console.log(usrn);
		var usrn=req.session ? (req.session.utilizator? req.session.utilizator.username : null) : null;
	res.render('html/'+req.url, {username: usrn}, function(err, rezultatRender){
		if (err) {
			if (err.message.includes("Failed to lookup view"))
        res.status(404).render("html/404", {username: usrn});
      else {
        throw err;
      }

		}
		else res.send(rezultatRender)

	});
});

app.listen(8080);
console.log('Aplicatia se va deschide pe portul 8080.');
