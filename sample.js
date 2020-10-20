let dataset=require('./final_dataset');
let i=0;
var curr_date=new Date();
var today=curr_date.getDay();
var curr_time_hour=12;
var curr_time_min=00;
let is_week_day=true;
if(today==0 || today==6)
is_week_day=false;
let can_add_point=false;
console.log(dataset[i]);
if(is_week_day)
    {
        for(let j=0;j<dataset[i]["week_open_time"].length;j++)
        {  let open=dataset[i]["week_open_time"][j].split(":");
            let close=dataset[i]["week_close_time"][j].split(":");
            
            if((curr_time_hour>parseInt(open[0])) || (curr_time_hour==parseInt(open[0]) && curr_time_min>=parseInt(open[1])))
            {  if((curr_time_hour<parseInt(close[0])) || (curr_time_hour==parseInt(close[0]) && curr_time_min<=parseInt(close[1])))
                {let time1=dataset[i]["time"];
                let time_diff_hour=parseInt(close[0])-curr_time_hour;
                let time_diff_min=parseInt(close[1])-curr_time_min;
                time_diff_min+=(time_diff_hour*60);
                console.log(time_diff_min);
                if(time_diff_min>time1)
                {
                    can_add_point=true;
                    break;
                }
            }
            }

        }
    }
    console.log(can_add_point);