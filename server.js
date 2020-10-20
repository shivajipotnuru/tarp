//dependency modules. 
//using express to build proxy server.
var express = require('express');
var app = express();
var acms=require("./acms");
var final_path;
var bodyParser=require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//setting view engine to express' ejs module.
app.set('view engine','ejs');

//routing all paths to corresponding files as per requests.
app.get('/', function(req, res) {
    res.render("frontpage.ejs");
           });
app.get('/main',function(req,res){
res.render("main.ejs");
});
app.get('/cards',function(req,res){
  res.render("cards.ejs");
  });
app.get('/notopen',function(req,res){
  res.render("notopen.ejs");
  });
app.get('/front_page.jpg',function(req,res){
  res.sendFile(__dirname+"/"+"views/front_page.jpg");
});
app.get('/mainpage.jpeg',function(req,res){
  res.sendFile(__dirname+"/"+"views/mainpage.jpeg");
});
app.get('/cards.jpg',function(req,res){
  res.sendFile(__dirname+"/"+"views/cards.jpg");
});
app.get('/frontpage.css',function(req,res){
res.sendFile(__dirname+"/views/frontpage.css");
});
// app.get('/trip_path.css',function(req,res){
//   res.sendFile(__dirname+"/views/trip_path.css");
//   });
app.get('/main.css',function(req,res){
  res.sendFile(__dirname+"/views/main.css");
  });
  app.get('/cards.css',function(req,res){
    res.sendFile(__dirname+"/views/cards.css");
    });
app.post('/cards',urlencodedParser, function (req, res) {
    var time=req.body.time;
    var locationname=req.body.place_details;
    //retrieving trip path and templating it to be used in html side using ejs module.
    acms.final(locationname,time).then(x => { 
      try{
      var spent=x["time_spent"];
      var travel=x["time_travelled"];
      var rem=x["remaining_time"];
      x["time_spent"]=secondsToHms(spent);
      x["time_travelled"]=secondsToHms(travel);
      x["remaining_time"]=secondsToHms(rem);
      final_path=x;
      //checking the retrieved path's time spent. if 0, then rerouting to "no places open yet" webpage.
      if(spent==0){
           res.render("notopen.ejs");
      }else{
        res.render("cards.ejs",{path1:x});
      }
    }catch(error)
    { //if any errors caught, displaying internal server error webpage.
      res.render("internal_server.ejs");
    }
    });
})
// app.get('/trip_path',function(req,res){
//   res.render("trip_path.ejs",{path1:final_path});
// })

app.get('/sdk/map.css', function(req, res) {
    res.sendFile(__dirname + "/" + "sdk/map.css");
  });
  app.get('/sdk/tomtom.min.js', function(req, res) {
    res.sendFile(__dirname + "/" + "sdk/tomtom.min.js");
  });
  //listening for requests from corresponding port.
  //process.env.PORT is the heroku website's port. if it is not working, system automatically runs the website locally at port 3000. 
const PORT = 3200;
app.listen(PORT);
//function to simplify time for user's inference.
function secondsToHms(d) {
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay =  h + "hrs ";
  var mDisplay =m + "mins ";
  var sDisplay = s + "secs ";
  if(h==0 && m==0)
  return sDisplay;
  if(h==0)
  return mDisplay+sDisplay;
  if(m==0)
  {
    if(s==0)
    return hDisplay;
    return hDisplay+sDisplay;
  }
  if(s==0)
  {
    if(m==0)
    return hDisplay;
    return hDisplay+mDisplay;
  }
  return hDisplay + mDisplay + sDisplay; 
}