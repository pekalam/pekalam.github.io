function Rnlin()
{
    var _steps = [];
    
    this.steps = function(){return _steps;}
    
    this.solve = function(eq, eps, a, b)
    {      
        if(a === undefined)
        a = -1;
        if(b === undefined)
        b = 2;
        if(eps === undefined)
        eps = 0.001;
        c = 0;
        
        
        var lastY = null;
        var lastAY = null;
        var lastBY = null;
        
        if(Math.sign(evalEq(eq, a)) == Math.sign(evalEq(eq, b))){
            console.log("Brak pierwiastka");
            return NaN;
        }
        else{
            do
            {   
                c = (a+b)/2;
                
                var step = {
                    "c": c,
                    "a": a,
                    "b": b
                };
                
                var y = evalEq(eq, c);
                var ay = evalEq(eq, a);
                var by = evalEq(eq, b);
                
                if(lastAY == null && lastBY == null && lastY == null)
                {
                    lastAY = ay;
                    lastBY = by;
                    lastY = y;
                }
                else{
                    if(lastAY == ay && lastBY == by && lastY == y)
                    {
                        return NaN;
                    }
                    else{
                        lastAY = ay;
                        lastBY = by;
                        lastY = y;
                    }
                }
                
                step.wc = y;
                step.wa = ay;
                step.wb = by;
                
                if(Math.sign(ay) == Math.sign(y))
                {
                    a = c;
                    step.next = a;
                }
                else{
                    b = c;
                    step.next = b;
                }
                
                _steps.push(step);
            }
            while(Math.abs(evalEq(eq, c)) > eps)
        }
        console.log("rozwiazno " + c);
        return c;
        
    }
    
    function evalEq(eq, num)
    {
        try{
            var x = num;
            if(eq.indexOf("sqrt") != -1 && num < 0)
            {
                x = Math.abs(x);
                return eval(eq) * -1;
            }
            return eval(eq);
        }
        catch(err)
        {
            return NaN;        
        }
        
    }
}