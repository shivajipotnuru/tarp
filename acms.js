//listing all required dependencies
var http = require('http');
var dataset = require("./final_dataset"); 
const fetch = require("node-fetch");
var request=require('request');
let {buildpath}=require('./pathbuild');
//an object for pathbuild.
let pathfind_object=new buildpath();


//variable for retrieving top 20 places.
var top20_places;


// a lookup table for place area name and their respective co-ords.
var place={
    'Adambakkam':'{"lat": 12.9880,"long":80.2047}',
    'Adayar':'{"lat": 13.0012,"long":80.2565}',
    'Alandur':'{"lat": 12.9975,"long":80.2006}',
    'Alapakkam':'{"lat": 13.0490,"long":80.1673}',
    'Alwarpet':'{"lat":13.0335,"long":80.2531}',
    'Alwarthirunagar':'{"lat":13.0426,"long":80.1840}',
    'Ambattur':'{"lat":13.1143,"long":80.1548}',
    'Aminjikarai':'{"lat":13.0698,"long":80.2245}',
    'Anna Nagar':'{"lat":13.0850,"long":80.2101}',
    'Annanur':'{"lat":13.1184,"long": 80.1246}',
    'Arumbakkam':'{"lat":13.0724,"long": 80.2102}',
    'Ashok Nagar':'{"lat":13.0373,"long":80.2123}',
    'Avadi':'{"lat":13.1067,"long":80.0970}',
    'Ayanavaram':'{"lat":13.0986,"long":80.2337}',
    'Besant Nagar':'{"lat":13.0003,"long":80.2667}',
    'Basin Bridge':'{"lat":13.1065,"long":80.2753}',
    'Chepauk':'{"lat":13.0633,"long":80.2812}',
    'Chetput':'{"lat":13.0714,"long":80.2417}',
    'Chintadripet':'{"lat":13.0750,"long":80.2698}',
    'Chitlapakkam':'{"lat":12.9370,"long":80.1389}',
    'Choolai':'{"lat":13.0919,"long":80.2642}',
    'Choolaimedu':'{"lat":13.0632,"long":80.2250}',
    'Chrompet':'{ "lat": 12.9516,"long": 80.1462}',
'Egmore':'{ "lat": 13.0732,"long": 80.2609}',
'Ekkaduthangal':'{ "lat": 13.0225,"long": 80.2032}',
'Eranavur':'{ "lat": 13.1896,"long": 80.3039}',
'Ennore':'{ "lat": 13.2146,"long": 80.3203}',
'Foreshore Estate':'{ "lat": 13.0247,"long": 80.2774}',
'Fort St. George':'{ "lat": 13.0796,"long": 80.2874}',
'George Town':'{ "lat": 13.0969,"long": 80.2865}',
'Gopalapuram':'{ "lat": 13.0489,"long": 80.2586}',
'Government Estate':'{ "lat": 13.0696,"long": 80.2728}',
'Guindy':'{ "lat": 13.0067,"long": 80.2206}',
'Gerugambakkam':'{ "lat": 13.0136,"long": 80.1353}',
'Injambakkam':'{ "lat": 12.9198,"long": 80.2511}',
'Iyyapanthangal':'{ "lat": 13.0381,"long": 80.1354}',
'Jafferkhanpet':'{ "lat": 13.0299,"long": 80.2048}',
'Karapakkam':'{ "lat": 12.9191,"long": 80.2300}',
'Kattivakkam':'{ "lat": 13.2161,"long": 80.3182}',
'Kattupakkam':'{ "lat": 13.0414,"long": 80.1267}',
'Kazhipattur':'{ "lat": 12.8236,"long": 80.2310}',
'K.K. Nagar':'{ "lat": 13.0410,"long": 80.1994}',
'Keelkattalai':'{ "lat": 12.9556,"long": 80.1869}',
'Kattivakkam':'{ "lat": 13.2161,"long": 80.3182}',
'Kilpauk':'{ "lat": 13.0828,"long": 80.2417}',
'Kodambakkam':'{ "lat": 13.0521,"long": 80.2255}',
'Kodungaiyur':'{ "lat": 13.1375,"long": 80.2478}',
'Kolathur':'{ "lat": 13.1240,"long": 80.2121}',
'Korattur':'{ "lat": 13.1082,"long": 80.1834}',
'Korukkupet':'{ "lat": 13.1186,"long": 80.2780}',
'Kottivakkam':'{ "lat": 12.9682,"long": 80.2599}',
'Kotturpuram':'{ "lat": 13.0180,"long": 80.2411}',
'Kottur':'{ "lat": 13.0180,"long": 80.2411}',
'Kovilambakkam':'{ "lat": 12.9409,"long": 80.1851}',
'Koyambedu':'{ "lat": 13.0694,"long": 80.1948}',
'Kundrathur':'{ "lat": 12.9977,"long": 80.0972}',
'Madhavaram':'{ "lat": 13.1488,"long": 80.2306}',
'Madhavaram Milk Colony':'{ "lat": 13.1505,"long": 80.2419}',
'Madipakkam':'{ "lat": 12.9647,"long": 80.1961}',
'Madambakkam':'{ "lat": 12.9033,"long": 80.1585}',
'Maduravoyal':'{ "lat": 13.0656,"long": 80.1608}',
'Manali':'{ "lat": 13.1779,"long": 80.2701}',
'Manali New Town':'{ "lat": 13.1933,"long": 80.2708}',
'Manapakkam':'{ "lat": 13.0213,"long": 80.1832}',
'Mandaveli':'{ "lat": 13.0279,"long": 80.2605}',
'Mangadu':'{ "lat": 13.0270,"long": 80.1107}',
'Mannady':'{ "lat": 13.0928,"long": 80.2893}',
'Mathur':'{ "lat": 13.1714,"long": 80.2455}',
'Medavakkam':'{ "lat": 12.9171,"long": 80.1923}',
'Meenambakkam':'{ "lat": 12.9875,"long": 80.1753}',
'MGR Nagar':'{ "lat": 13.0352,"long": 80.1973}',
'Minjur':'{ "lat": 13.2789,"long": 80.2623}',
'Mogappair':'{ "lat": 13.0837,"long": 80.1750}',
'MKB Nagar':'{ "lat": 13.1258,"long": 80.2622}',
'Mount Road':'{"lat": 13.069774  "long":  80.271227}',
'Moolakadai':'{ "lat": 13.1296,"long": 80.2416}',
'Moulivakkam':'{ "lat": 13.0215,"long": 80.1443}',
'Mugalivakkam':'{ "lat": 13.0210,"long": 80.1614}',
'Mudichur':'{ "lat": 13.0827,"long": 80.2707}',
'Mylapore':'{ "lat": 13.0368,"long": 80.2676}',
'Nandanam':'{ "lat": 13.0300,"long": 80.2421}',
'Nanganallur':'{ "lat": 12.9754,"long": 80.1901}',
'Nanmangalam':'{ "lat": 12.9403,"long": 80.1785}',
'Neelankarai':'{ "lat": 12.9492,"long": 80.2547}',
'Nemilichery':'{ "lat":  12.9486,"long": 80.1638}',
'Nesapakkam':'{ "lat": 13.0379,"long": 80.1920}',
'Nolambur':'{ "lat": 13.0754,"long": 80.1680}',
'Noombal':'{ "lat": 13.0528,"long": 80.1359}',
'Nungambakkam':'{ "lat": 13.0569,"long": 80.2425}',
'Otteri':'{ "lat": 13.0921,"long": 80.2510}',
'Padi':'{ "lat": 13.0965,"long": 80.1845}',
'Pakkam':'{ "lat": 13.1279,"long": 80.2560}',
'Palavakkam':'{ "lat": 12.9617,"long": 80.2562}',
'Pallavaram':'{ "lat": 12.9675,"long": 80.1491}',
'Pallikaranai':'{ "lat": 12.9349,"long": 80.2137}',
'Pammal':'{ "lat": 12.9749,"long": 80.1328}',
'Park Town':'{ "lat": 13.0796,"long": 80.2752}',
"Parry's Corner":'{ "lat": 13.0896,"long": 80.2882}',
'Pattabiram':'{ "lat": 13.1231,"long": 80.0593}',
'Pattaravakkam':'{ "lat": 13.1103,"long": 80.1673}',
'Pazhavanthangal':'{ "lat": 12.9890,"long": 80.1882}',
'Peerkankaranai':'{ "lat": 12.9048,"long": 80.0891}',
'Perambur':'{ "lat": 13.1210,"long": 80.2326}',
'Peravallur':'{ "lat": 13.1179,"long": 80.2316}',
'Perumbakkam':'{ "lat": 12.8923,"long": 80.1889}',
'Perungalathur':'{ "lat": 12.9048,"long": 80.0891}',
'Perungudi':'{ "lat": 12.9654,"long": 80.2461}',
'Pozhichalur':'{ "lat": 12.9898,"long": 80.1434}',
'Poonamallee':'{ "lat": 13.0473,"long": 80.0945}',
'Porur':'{ "lat": 13.0382,"long": 80.1565}',
'Pudupet':'{ "lat": 13.0691,"long": 80.2642}',
'Pulianthope':'{ "lat": 13.0982,"long": 80.2683}',
'Purasaiwalkam':'{ "lat": 13.0902,"long": 80.2543}',
'Puthagaram':'{ "lat": 13.1195,"long": 80.1893}',
'Puzhal':'{ "lat": 13.1585,"long": 80.2037}',
'Puzhuthivakkam/ Ullagaram':'{ "lat": 12.9698,"long": 80.1943}',
'Ramavaram':'{ "lat": 13.0317,"long": 80.1817}',
'Red Hills':'{ "lat": 13.1865,"long": 80.1999}',
'Royapettah':'{ "lat": 13.0540,"long": 80.2641}',
'Royapuram':'{ "lat": 13.1137,"long": 80.2954}',
'Saidapet':'{ "lat": 13.0213,"long": 80.2231}',
'Saligramam':'{ "lat": 13.0545,"long": 80.2011}',
'Santhome':'{ "lat": 13.0319,"long": 80.2788}',
'Sembakkam':'{ "lat": 12.9234,"long": 80.1588}',
'Selaiyur':'{ "lat": 12.9068,"long": 80.1425}',
'Shenoy Nagar':'{ "lat": 13.0695,"long": 80.2318}',
'Sholavaram':'{ "lat": 13.2360,"long": 80.1635}',
'Sholinganallur':'{ "lat": 12.9010,"long": 80.2279}',
'Sithalapakkam':'{ "lat": 12.8820,"long": 80.1925}',
'Sowcarpet':'{ "lat": 13.0987,"long": 80.2785}',
'St.Thomas Mount':'{ "lat": 13.0051,"long": 80.1933}',
'Tambaram':'{ "lat": 12.9249,"long": 80.1000}',
'Teynampet':'{ "lat": 13.0405,"long": 80.2503}',
'Tharamani':'{ "lat": 12.9863,"long": 80.2432}',
'T. Nagar':'{ "lat": 13.0418,"long": 80.2341}',
'Thirumangalam':'{ "lat": 13.0835,"long": 80.1945}',
'Thirumullaivoyal':'{ "lat": 13.1307,"long": 80.1314}',
'Thiruneermalai':'{ "lat": 12.9581,"long": 80.1192}',
'Thiruninravur':'{ "lat": 13.1181,"long": 80.0336}',
'Thiruvanmiyur':'{ "lat": 12.9830,"long": 80.2594}',
'Tiruverkadu':'{ "lat": 13.0734,"long": 80.1269}',
'Thiruvotriyur':'{ "lat": 13.1643,"long": 80.3001}',
'Thuraipakkam':'{ "lat": 12.9416,"long": 80.2362}',
'Tirusulam':'{ "lat": 12.9695,"long": 80.1704}',
'Tiruvallikeni':'{ "lat": 13.0588,"long": 80.2756}',
'Tondiarpet':'{ "lat": 13.1261,"long": 80.2880}',
'United India Colony':'{ "lat": 13.0527,"long": 80.2259}',
'Vandalur':'{ "lat": 12.8913,"long": 80.0810}',
'Vadapalani':'{ "lat": 13.0500,"long": 80.2121}',
'Valasaravakkam':'{ "lat": 13.0403,"long": 80.1723}',
'Vallalar Nagar':'{ "lat": 13.1328,"long": 80.1761}',
'Vanagaram':'{ "lat": 13.0576,"long": 80.1545}',
'Velachery':'{ "lat": 12.9815,"long": 80.2180}',
'Villivakkam':'{ "lat": 13.1086,"long": 80.2061}',
'Virugambakkam':'{ "lat": 13.0532,"long": 80.1922}',
'Vyasarpadi':'{ "lat": 13.1184,"long": 80.2594}',
'Washermanpet':'{ "lat": 13.1148,"long": 80.2872}',
'West Mambalam':'{ "lat": 13.0383,"long": 80.2209}'
  }
  //function to find distance between two co-ordinates.
function find_distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}

//a function to check if place falls in the opening times constraint.
function canvisitintime(place,curr_time_hour,curr_time_min,is_week_day){
    let can_add_point=false;
    if(is_week_day)
    { //console.log(dataset[i]);
        for(let j=0;j<place["week_open_time"].length;j++)
        {  let open=place["week_open_time"][j].split(":");
            let close=place["week_close_time"][j].split(":");
            
            if((curr_time_hour>parseInt(open[0])) || (curr_time_hour==parseInt(open[0] )&& curr_time_min>=parseInt(open[1])))
            {  if((curr_time_hour<parseInt(close[0])) || (curr_time_hour==parseInt(close[0] )&& curr_time_min<=parseInt(close[1])))
                {let time1=place["time"];
                let time_diff_hour=parseInt(close[0])-curr_time_hour;
                let time_diff_min=parseInt(close[1])-curr_time_min;
                time_diff_min+=(time_diff_hour*60);
                if(time_diff_min>time1)
                {
                    can_add_point=true;
                    break;
                }
            }
            }

        }
    }
    else
    {
        for(let j=0;j<place["weekend_open_time"].length;j++)
        {  let open=place["weekend_open_time"][j].split(":");
            let close=place["weekend_close_time"][j].split(":");
            
            if((curr_time_hour>parseInt(open[0])) || (curr_time_hour==parseInt(open[0])&& curr_time_min>=parseInt(open[1])))
            {  if((curr_time_hour<parseInt(close[0])) || (curr_time_hour==parseInt(close[0]) && curr_time_min<=parseInt(close[1])))
                {let time1=place["time"];
                let time_diff_hour=parseInt(close[0])-curr_time_hour;
                let time_diff_min=parseInt(close[1])-curr_time_min;
                time_diff_min+=(time_diff_hour*60);
                if(time_diff_min>time1)
                {
                    can_add_point=true;
                    break;
                }
            }
            }

        }
    }
    return can_add_point;
}
//a function to filter potential places around the origin co-ord that can be visited in time.
function topPlaces(dummy_lat,dummy_long,free,curr_time_hour,curr_time_min,is_week_day){
    
    let freetime=Math.min(1,free)*60; 
    let maxreach=freetime*(30/60); //considering a person's avg speed as 30kmph.
    var nearby_places={
        table:[]
    }
    //retrieving all nearby places.
    for(let i=0;i<dataset.length;i++)
{   let est_dist=find_distance(dummy_lat,dummy_long,dataset[i].latitude,dataset[i].longitude,"K");

    if(est_dist<=maxreach)
    { 
        nearby_places.table.push(dataset[i]);
        nearby_places.table[nearby_places.table.length-1]["dist"]=est_dist;
    }
}
//adding a score col. for sorting based on prominence of place.
for(let i=0;i<nearby_places.table.length;i++){
    var score=nearby_places.table[i].user_rating*nearby_places.table[i].num_user_rated;
    nearby_places.table[i]["score"]=score;
}
//sorting our nearby_places based on their score.
nearby_places.table.sort(function(a, b){
    return  b.score-a.score;
  
});
//taking top50 from the sorted list.
let near50_places=nearby_places.table.slice(0,Math.min(nearby_places.table.length,50));
//filtering top20 from top50 where atleast 3 places satisfies opening time constraint.
 top20_places=[];
 let k=0;
 for(let i=0;i<Math.min(near50_places.length,20);i++)
 {
     if(canvisitintime(near50_places[i],curr_time_hour,curr_time_min,is_week_day))
     {
         k++;
         top20_places.unshift(near50_places[i]);
     }
     else
     top20_places.push(near50_places[i]);
 }
 if(k>=3)
 { console.log(top20_places);
     return;
 }
 else
 {
     let x=3-k;
     top20_places.splice(top20_places.length-x,x);
     for(let i=21;i<near50_places.length;i++)
     {
        if(canvisitintime(near50_places[i],curr_time_hour,curr_time_min,is_week_day))
        {
            x--;
         top20_places.unshift(near50_places[i]);
        }
        if(x==0)
        break;
     }
    
     return;
 }
 
}

//an apikey from graphhopper
//graphhopper used to retrieve travel time matrix for all 20places+origin co ord with each other.
var defaultKey = "ec55bfa9-51e5-4825-918e-7d454bba5f94";

//a function to change float co-ord point to string.
function toNumberString(num) { 
    if (Number.isInteger(num)) { 
      return num + ".0"
    } else {
      return num.toString(); 
    }
  }
//function to get location co-ords from look up table
  function getlocation(locationname)
{
    let loc=JSON.parse(place[locationname]);   
    return loc;
}

let jsondata;   
//async function to wait and get traffic times matrix from request url.
async function getData(url) {
    try{
    const response = await fetch(url);
    return response.json()
    }catch(error)
    {}
}

//main function that returns built target path.
exports.final=async function(locationname,free_time) {
    try{ 
        // retrieving customer's location co-ords.
        let loc=await(getlocation(locationname));
    let dummy_lat=loc['lat']
    let dummy_long=loc['long'];
  
    // retrieving today's date and time details for opening times constraint.
var curr_date=new Date();
var today=curr_date.getDay();
var curr_time_hour=curr_date.getHours();
var curr_time_min=curr_date.getMinutes();
let is_week_day=true;
if(today==0 || today==6)
is_week_day=false;
let freetime=free_time*60;
//function to retrieve top 20 places.
     topPlaces(dummy_lat,dummy_long,freetime,curr_time_hour,curr_time_min,is_week_day);
     if(top20_places.length==0)
     { //if no places in opening times constraint, returning empty target path.
        let target_node={};
        target_node["curr_path"]=[];
        target_node["remaining_time"]=-1;
        target_node["time_travelled"]=100;
        target_node["time_spent"]=0;
        return target_node;
     }
     //request url to retrieve travel time matrix for all top 20 places
        var url="https://graphhopper.com/api/1/matrix?";
url+="point="+toNumberString(dummy_lat)+","+toNumberString(dummy_long);
for(let i=0;i<top20_places.length;i++)
{
    url+="&point="+toNumberString(top20_places[i].latitude)+","+toNumberString(top20_places[i].longitude);
}
url+="&type=json&vehicle=car&debug=true&out_array=times&out_array=distances&key=83aeb24d-488a-4900-836c-2e93fe94bc4a";
//url+="&type=json&vehicle=car&debug=true&out_array=times&out_array=distances&key=27662a8e-3233-4db9-8c41-b8e4672d12f1";
//retrieving the result matrix data from url   
jsondata = await getData(url);
// check (printing travel times)
   console.log(jsondata);
   //retrieving target path from the findpath function.
   var temp=await pathfind_object.findpath(jsondata,freetime,top20_places,dummy_lat,dummy_long,locationname,curr_time_hour,curr_time_min,is_week_day);
    return temp;
    }catch(error)
    {

    }
}
