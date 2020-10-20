//dependency modules.
var clonedeep = require('lodash.clonedeep');
//variables
let time_matrix;
let freetime;
let top20_places;
let queue=[];
let curr_time_hour;
let curr_time_min;
let is_week_day;

// class to build path that we export as module.
class buildpath{
    //function to build path.
 findpath(jsondata,freet,topplaces,dummy_lat,dummy_long,locationname,currtime_hour,currtime_min,isweek_day)
 {  //retrieving current date time details
     curr_time_hour=currtime_hour;
    curr_time_min=currtime_min;
    is_week_day=isweek_day;
     console.log(locationname);
     time_matrix=jsondata.times;
     freetime=freet*60;
     // since our path runs in n! complexity, if time is greater than 10 hours, building path with top 8 places since at most, we can only visit 6 places in a day.
    if(freetime>60*60*10)
     top20_places=topplaces.slice(0,8);
     else
     top20_places=topplaces;

     for(let i=0;i<top20_places.length;i++)
     {  let curr_node={};
        let curr_path1=[];
        let origin_path={};
        origin_path["idx"]=-1;
        origin_path["lastidx"]=-1;
        var loca={};
        loca["latitude"]=dummy_lat;
        loca["longitude"]=dummy_long;
        loca["name"]=locationname;
        origin_path["place_details"]=loca;
        let curr_path={};
        curr_path["idx"]=i;
        curr_path["lastidx"]=-1;
        curr_path["timetakentoreachfromprev"]=time_matrix[0][i+1];
        //we need to check from prev place
        // that if from there+timespent ll b the curr start time.
        // then from this curr start time, it falls inside the opening time category and 
        // if time travelled to reach and time spent here== tot time
        // if this tot time is less or equal to the diff btween closin time n currtime.
        origin_path["curr_end_time_hour"]=curr_time_hour;
        origin_path["curr_end_time_min"]=curr_time_min;
        curr_path1.push(origin_path);
        let time_travelled=time_matrix[0][i+1];
        let tot_time=time_travelled/60;
        tot_time+=top20_places[i].time;
        let can_add_point=false;
    //function to check if place fits in open time constraint.
    if(is_week_day)
    { 
        for(let j=0;j<top20_places[i]["week_open_time"].length;j++)
        {  let open=top20_places[i]["week_open_time"][j].split(":");
            let close=top20_places[i]["week_close_time"][j].split(":");
            
            if((curr_time_hour>parseInt(open[0])) || (curr_time_hour==parseInt(open[0] )&& curr_time_min>=parseInt(open[1])))
            {  if((curr_time_hour<parseInt(close[0])) || (curr_time_hour==parseInt(close[0] )&& curr_time_min<=parseInt(close[1])))
                {
                let time_diff_hour=parseInt(close[0])-curr_time_hour;
                let time_diff_min=parseInt(close[1])-curr_time_min;
                time_diff_min+=(time_diff_hour*60);
                if(time_diff_min>=tot_time)
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
        for(let j=0;j<top20_places[i]["weekend_open_time"].length;j++)
        {  let open=top20_places[i]["weekend_open_time"][j].split(":");
            let close=top20_places[i]["weekend_close_time"][j].split(":");
            
            if((curr_time_hour>parseInt(open[0])) || (curr_time_hour==parseInt(open[0] )&& curr_time_min>=parseInt(open[1])))
            {  if((curr_time_hour<parseInt(close[0])) || (curr_time_hour==parseInt(close[0] )&& curr_time_min<=parseInt(close[1])))
                {
                let time_diff_hour=parseInt(close[0])-curr_time_hour;
                let time_diff_min=parseInt(close[1])-curr_time_min;
                time_diff_min+=(time_diff_hour*60);
                if(time_diff_min>=tot_time)
                {
                    can_add_point=true;
                    break;
                }
            }
            }

        }
    }
    //if yes, then we push this place into our node as one possible path.
    if(can_add_point)
    {curr_path1.push(curr_path);
        let time_spent=top20_places[i].time*60;
        curr_path["curr_end_time_hour"]=curr_time_hour;
        curr_path["curr_end_time_min"]=curr_time_min+(Math.floor(time_travelled/60)+Math.floor((time_spent/60)));
        curr_path["curr_end_time_hour"]+=Math.floor(curr_path["curr_end_time_min"]/60);
        curr_path["curr_end_time_min"]-=(Math.floor(curr_path["curr_end_time_min"]/60)*60);
        let remaining_time=freetime-time_matrix[0][i+1]-(top20_places[i].time*60);
        if(remaining_time>=0 && time_spent/time_travelled>1)
         {  
             curr_node["curr_path"]=curr_path1;
            curr_node["remaining_time"]=remaining_time;
            curr_node["time_travelled"]=time_travelled;
            curr_node["time_spent"]=time_spent;
            //adding a constraint to have only one restaurant in the path.
            if(top20_places[i]["category"]=="restaurant"){
                curr_node["food"]=1;
            }else{
                curr_node["food"]=0;
            }
             queue.push(curr_node);
    }
     }
    }
   
 //doing a bfs to determine best path.
    var a=bfs();
    return a;
 }
}
// a function to find if this node already exists in the path. we don't want redundant places in our path.
function find_if_node_exists(index,curr_path)
{
    for(let j=0;j<curr_path.length;j++)
    {
        if(curr_path[j]["idx"]==index)
        return true;
    }
    return false;
}
//function to check if we can visit this place within opening times constraint.
function canvisitintime(curr_node,i,lastindex)
{  let currenttimehour=curr_node["curr_path"][curr_node["curr_path"].length-1]["curr_end_time_hour"];
    let currenttimemin=curr_node["curr_path"][curr_node["curr_path"].length-1]["curr_end_time_min"];
    let can_add_point=false;
    if(is_week_day)
    { 
        for(let j=0;j<top20_places[i]["week_open_time"].length;j++)
        {  let open=top20_places[i]["week_open_time"][j].split(":");
            let close=top20_places[i]["week_close_time"][j].split(":");
           
            if((currenttimehour>parseInt(open[0])) || (currenttimehour==parseInt(open[0] )&& currenttimemin>=parseInt(open[1])))
            {  if((currenttimehour<parseInt(close[0])) || (currenttimehour==parseInt(close[0] )&& currenttimemin<=parseInt(close[1])))
                {let time1=top20_places[i]["time"];   //min
                let timetoreach=time_matrix[lastindex+1][i+1];  //sec
                time1+=Math.floor(timetoreach/60);
                let time_diff_hour=parseInt(close[0])-currenttimehour;
                let time_diff_min=parseInt(close[1])-currenttimemin;
                time_diff_min+=(time_diff_hour*60)
               
                if(time_diff_min>=time1)
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
      
       for(let j=0;j<top20_places[i]["weekend_open_time"].length;j++)
       {  let open=top20_places[i]["weekend_open_time"][j].split(":");
           let close=top20_places[i]["weekend_close_time"][j].split(":");
           
           if((currenttimehour>parseInt(open[0])) || (currenttimehour==parseInt(open[0] )&& currenttimemin>=parseInt(open[1])))
           {  if((currenttimehour<parseInt(close[0])) || (currenttimehour==parseInt(close[0] )&& currenttimemin<=parseInt(close[1])))
               {let time1=top20_places[i]["time"];
               let timetoreach=time_matrix[lastindex+1][i+1];
               time1+=Math.floor(timetoreach/60);
               let time_diff_hour=parseInt(close[0])-currenttimehour;
               let time_diff_min=parseInt(close[1])-currenttimemin;
               time_diff_min+=(time_diff_hour*60)
               if(time_diff_min>=time1)
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
//adding possible paths into our queue.
function addpossiblepath(currnode,i)
{ 
     let deadend=false;
    let curr_node=clonedeep(currnode);
    let lastindex=curr_node["curr_path"][curr_node["curr_path"].length-1]["idx"];
    let timetoreach=time_matrix[lastindex+1][i+1];
    let rem_time=curr_node["remaining_time"]-timetoreach-(top20_places[i].time*60);
    // if remaining time > 0 and the timespent/timetoreach ratio is >1 and if this place fits in opening times constraint, we add this point and mark deadend as false.else, after all possible are exhausted, we mark this place as deadend.
    if(rem_time>=0 && (top20_places[i]["time"]*60)/timetoreach>=1 && canvisitintime(currnode,i,lastindex)==true)
    {if(!(curr_node["food"]==1 && top20_places[i]["category"]=="restaurant"))
    {   
        curr_node["time_travelled"]+=timetoreach;
        curr_node["time_spent"]+=top20_places[i].time*60;
      
       let curr_path1={};
       //updating the current path variables after adding this datapoint.
        curr_path1["idx"]=i;
        curr_path1["lastidx"]=lastindex;
        curr_path1["timetakentoreachfromprev"]=timetoreach;
        curr_path1["curr_end_time_hour"]=curr_node["curr_path"][curr_node["curr_path"].length-1]["curr_end_time_hour"];
        curr_path1["curr_end_time_min"]=curr_node["curr_path"][curr_node["curr_path"].length-1]["curr_end_time_min"]+(Math.floor(timetoreach/60)+top20_places[i].time);
        curr_path1["curr_end_time_hour"]+=Math.floor(curr_path1["curr_end_time_min"]/60);
        curr_path1["curr_end_time_min"]-=(Math.floor(curr_path1["curr_end_time_min"]/60)*60);
        curr_node["remaining_time"]=rem_time;
        curr_node["curr_path"].push(curr_path1);
        if(top20_places[i]["category"]=="restaurant"){
            curr_node["food"]=1;
        }
     
        deadend=true;
        //pushing this node into our queue.
        queue.push(curr_node);
     
    }
}
    return deadend;
}
let k=0;
//bfs function to determine our target path.
function bfs(){
    //defining target node.
    let target_node={};
 target_node["curr_path"]=[];
 target_node["remaining_time"]=-1;
 target_node["time_travelled"]=100;
 target_node["time_spent"]=0;

    //while our queue has paths,
        while(queue.length>0)
        {  //we pop first one.
           let currnode=queue.shift();
          //we mark deadend as true initially.
           let deadend=true;
           //with all top20 places,
           for(let i=0;i<top20_places.length;i++)
           { //if this particular place doesn't exist in path,we can consider this place for further filter. else,we continue.
               if(find_if_node_exists(i,currnode["curr_path"])==false)
               {  // we check if we can add this point into our path.
                   if(addpossiblepath(currnode,i)==true)
                    {
                  //if yes, we mark deadend for this node as false.
                   deadend=false;
                   }
            }
        }
        //if deadend is true, we need to compare and update our target path. 
           if(deadend==true)
           {  
               let targettime=target_node["time_spent"]/target_node["time_travelled"];
               let currtime=currnode["time_spent"]/currnode["time_travelled"];
              //cond 1: check if timespent/timetravelled ratio with this path is more than target path's timespent/timetravelled ratio. if yes, update. 
               if(targettime<currtime)
               {  
                  
                    target_node=  clonedeep(currnode);
               }
               //cond2 : check if the overall rating scores in this path is higher than target path. if yes,update.
               else if(targettime==currtime)
               {
                   let target_rate_tot=0;
                   let curr_node_rate_tot=0;
                   for(let i=1;i<target_node["curr_path"].length;i++)
                   {
                       target_rate_tot+=top20_places[target_node["curr_path"][i]["idx"]].score;
                   }
                   for(let i=1;i<currnode["curr_path"].length;i++)
                   {
                       curr_node_rate_tot+=top20_places[currnode["curr_path"][i]["idx"]].score;
                   }
                   if(target_rate_tot<curr_node_rate_tot)
                   {
                       target_node=currnode;
                   }
                   //cond3: check if the no. of places visit through this path is greater than target path.
                   else if(target_rate_tot==curr_node_rate_tot)
                   {
                       if(target_node["curr_path"].length<currnode["curr_path"].length)
                       {
                           target_node=clonedeep(currnode);
                       }
                   }
               }
               
           }
        }
        //once queue is empty, we have retrieved our potential target path.
        //add the place details based on their indices starting from 1 since 0 is the person's start location details.
        for(let i=1;i<target_node["curr_path"].length;i++)
        {
            let currindex=target_node["curr_path"][i]["idx"];
            target_node["curr_path"][i]["place_details"]=top20_places[currindex];
        }
  //return this target path.
    return target_node;
}
 //exporting the whole class as module.
module.exports.buildpath=buildpath;