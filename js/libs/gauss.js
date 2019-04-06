/*jshint latedef: true */
function Gauss2(eqs, names){
    
    var _results = [];
    var _wsp = [];
    var _mn = [];
    var _wyn = [];
    
    this.names = names;
    
    this.results = function(){return _results;};
    this.wsp = function(){return _wsp;};
    this.mn = function(){return _mn;};
    this.wyn = function(){return _wyn;};
    
    this.solve = function(){
        var gauss = [];
    
        var eqslen = eqs.length;
        
        for(var a = 0; a < eqslen; a++)
        {
            var eq = eqToArr(eqs[a]);
            gauss.push(eq);
        }
        
        var nw = gauss.length;
        
       /* gauss.forEach(function(ob, num){   
            console.log(ob);
        }); 
        */
               
        
   //  console.log("nw: " + nw);
    
        var i = 1;
        var i1 = 0;
        var j = 0;
        
   //     console.log("start");
        
        
        for(var q = 0; q < nw; q++)
        {
           // console.log("powt " + q);
            while(i < nw)
            {
                var wsp = gauss[i][j] / gauss[i1][j];
                //_wsp.push(gauss[i][j] + "/" + gauss[i1][j]);
               // console.log("wsp" + gauss[i][j] + "/" + gauss[i1][j] + "(" + wsp + ")");
                var mn = [];
                
                for(var it = 0; it < gauss[i1].length; it++)
                {
                    var f = (gauss[i1][it] * wsp);
                    mn.push(f);
                }
                _mn.push(mn);
                
                //console.log("mn " + mn);
                
                for(var it = 0; it < gauss[i].length; it++)
                {
                    gauss[i][it] = (gauss[i][it] - mn[it]);
                   
                }
                _wyn.push(gauss[i]);
                
                i++;      
            }
            i1++;
            i = i1 + 1;
            j++;
            
        } 
        
   
        
        var res = [];
        var rlen = gauss[0].length;
        
        for(var it = nw-1; it >= 0; it--)
        {
            var wyn = gauss[it][rlen-1];
           
            var sum = 0;
            
            var reslen = res.length;
            for(var a = 0; a < reslen; a++)
            {
                var val = gauss[it][(rlen - 2) - a];
              //  console.log(val);
                wyn -= res[a] * val;
                gauss[it][(rlen - 2) - a] = 0;   
            }
           // console.log(gauss[it]);
            for(i = 0; i < rlen - 1; i++)
            {  
                sum += gauss[it][i];
            }
            
            // console.log("sum " + sum);
            
            res.push(wyn/sum);
        }
        
        //console.log("Gauss wynik: " + res);
        
        
        return res;
    }
    
    this.matdet = 0;
    
    this.solve = function(numEq){
        
        var numEq = [].concat(numEq);
        
        var gauss = [];
    
        var eqslen = numEq.length;
        
        var matArr = [];
        
        for(var a = 0; a < eqslen; a++)
        {
            matArr.push(numEq[a].slice(0, numEq[a].length - 1))
            gauss.push(numEq[a]);
        }
        

        /*gauss.forEach(function(ob, num){   
            console.log(ob);
        }); */
        
        var matr = math.matrix(matArr);
        var det = math.det(matr);
        //console.log("WYZNACZNIK: " + det);
        this.matdet = det;
        
        var nw = gauss.length;
        var i = 1;
        var i1 = 0;
        var j = 0;
           
        
        for(var q = 0; q < nw; q++)
        {
            while(i < nw)
            {
                var wsp = gauss[i][j] / gauss[i1][j];
                _wsp.push(round(gauss[i][j]) + "/" + round(gauss[i1][j]));
               // console.log("wsp" + gauss[i][j] + "/" + gauss[i1][j] + "(" + wsp + ")");
                var mn = [];
                
                for(var it = 0; it < gauss[i1].length; it++)
                {
                    var f = (gauss[i1][it] * wsp);
                    mn.push(f);
                }
                _mn.push(mn);
                
                //console.log("mn " + mn);
                
                for(var it = 0; it < gauss[i].length; it++)
                {
                    gauss[i][it] = (gauss[i][it] - mn[it]);
                   
                }
                _wyn.push(gauss[i].slice());
                
                i++;      
            }
            i1++;
            i = i1 + 1;
            j++;
            
        } 
        
        var res = [];
        var rlen = gauss[0].length;
        
        for(var it = nw-1; it >= 0; it--)
        {
            var wyn = gauss[it][rlen-1];
           
            var sum = 0;
            
            var reslen = res.length;
            for(var a = 0; a < reslen; a++)
            {
                var val = gauss[it][(rlen - 2) - a];
              //  console.log(val);
                wyn -= res[a] * val;
                gauss[it][(rlen - 2) - a] = 0;   
            }
           // console.log(gauss[it]);
            for(i = 0; i < rlen - 1; i++)
            {  
                sum += gauss[it][i];
            }
            
             //console.log("sum " + sum);
            
            res.push(wyn/sum);
        }
        
       // console.log(res);
        
        
        return res;
    }
    
    function eqToJax2(eq, inline){
        var ret = "";
        if(inline)
            ret += "$";
        else
            ret += "$$";
        
        var len = eq.length
        for(var i = 0; i < len - 1; i++)
        {
            if(i == 0)
            {
                ret += eq[i].toFixed(2) + names[i];
            }
            else
            {
                if(eq[i] < 0)
                    ret += eq[i].toFixed(2) + names[i];
                else
                    ret += "+" + eq[i].toFixed(2) + names[i];
            }
        }
        
        ret += "=" + eq[len - 1].toFixed(2);
        if(!inline)
            ret += "$$"
        else
            ret += "$";
        
        return ret;
    }
    
    function eqToArr(eqs)
    {
        eqs = cleanEqs(eqs);
        
        var pat = /[-]?[0-9]+(\.\d+)?/g;
        
        var ret = [];
        
        var match = eqs.match(pat);
        
        var len = match.length;
        
        for(var i = 0; i< len; i++)
        {
            //console.log(match[i]);
            ret.push(Number(match[i]));
        }
        
        return ret;
    }
    
    function round(i)
    {
        return Math.round(i * 100) / 100;
    }
    
}

function eqToJax(eq, inline)
{
    var ret = "";
    if(inline)
        ret += "$";
    else
        ret += "$$";
    
    var len = eq.length
    for(var i = 0; i < len - 1; i++)
    {
        if(i == 0)
            ret += "a" + eq[i].toFixed(2) + "^" + i;
        else
            ret += "a" + math.nthRoot(eq[i], i).toFixed(2) + "^" + i;
          
    }
    
    ret += "=" + eq[len - 1];
    if(!inline)
    ret += "$$"
    else
    ret += "$";
    
    return ret;
  
}



function cleanEqs(eq)
{
    var pat = /[0-9]?[a-z]/g;
    var pat2 = /[0-9]/;
    eq = eq.replace(pat, function(str){
        
        if(pat2.test(str))
        {
            return str;
        }
        else
        {
            return "1" + str;
        }
    });
    return eq;
}

