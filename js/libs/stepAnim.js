/*jshint latedef: true */
function StepAnim(elementSel, steps)
{
    var timEx = new TimeExec();
    timEx.setEachEnd(function(){currStep++;});
   
    
    if(elementSel !== undefined && elementSel != null)
        var $el = $(elementSel).clone();
    
    var isPlaying = false;
    var currStep = -1;
    var len = steps.length;
    
    this.steps = steps;
    this.current = function(){return currStep;}
    
    this.hasNext = function(){
        if(currStep == len - 1)
            return false;
        else
            return true;
    }
    
    this.hasPrevious = function(){
        if(currStep > 0){return true;}
        if(currStep == 0)
        {
            if($el !== undefined && $el != null)
                return true;
            else
                return false;
        }
        return false;
    }
    
    this.addStep = function(step){
        steps.push(step);
        len++;
    }
    
    this.play = function(){
        if(isPlaying){console.log("StepAnim (" + elementSel + ")" + " is running."); return;}
        
        var start = 1;
        
        if($el !== undefined && $el != null)
            start = 0;
        else
        {
            steps[0].func();
            currStep = 0;
        }
        
        
        
        for(var i = start; i < len; i++)
        {
            timEx.setNext(steps[i].func, steps[i-1].time);  
        }
         timEx.setEndFunc(function(){

            isPlaying = false;
            currStep = -1;
        });
        
        isPlaying = true;
        
    };
    
    this.stop = function(){  
        timEx.stopAll(); 
        isPlaying = false;
    };
    
    this.nextStep = function(){
        if(isPlaying){this.stop();}
        if(currStep == len - 1){
            return;
        }
        else{
            currStep++; 
            steps[currStep].func(false, steps[currStep].cont);
                   
        } 
    };
    
    this.previousStep = function(){
        if(isPlaying){this.stop();}
        if(currStep > 0)
        {
            currStep--;
            steps[currStep].func(true, steps[currStep].cont);
       
        }
        else
        {
            this.reset();
        }
        
    };
    
    this.reset = function(){
        if($el !== undefined && $el != null)
        {
            $(elementSel).replaceWith($el.clone());
            currStep = -1;
        }  
    };
}

function Step(func, stime, context)
{
    this.func = func;
    this.time = stime;
    this.cont = context;
}

function TimeExec(){
    
    var totTime = 0;
    var tims = [];
    var eachEnd = null;
    
    this.setNext = function(func, time){
        tims.push(setTimeout(function(){
            func(); eachEnd();
        }, totTime + time));
        totTime += time;
    };
    
    this.stopAll = function(){
        var len = tims.length;
        for(var i = 0; i < len; i++)
        {
            clearTimeout(tims[i]);   
        }
        totTime = 0;
        tims = [];
    };
    
    this.setEachEnd = function(func){
        eachEnd = func;
    };
    
    this.setEndFunc = function(func)
    {
        setTimeout(func, totTime);
        totTime = 0;
        tims = [];
    }
}
/*
$(document).ready(function(){
    var tab = [
        new Step(function(){chT("Test1");}, 1000),
        new Step(function(){chT("Test2");}, 1000),
        new Step(function(){chT("Test3");}, 1000),
        new Step(function(){chT("Test4");}, 1000),
        new Step(function(){chT("Test5");}, 1000),
        new Step(function(){chT("Test6");}, 1000)
    ];
    
    var steps = new StepAnim("#t", tab);
    

    
    $("#stop").click(function(){
        steps.stop();
    });
    $("#start").click(function(){
        steps.play();
    });
    $("#next").click(function(){
        steps.nextStep();
    });
    $("#prev").click(function(){
        steps.previousStep();
    });
});


function chT(str)
{
     $("#t").html(str);
}
*/




