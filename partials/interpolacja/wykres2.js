/*jshint latedef: true */
/*var expoints = [];


    
function start(){
    brd2 = JXG.JSXGraph.initBoard('graph2',{
        axis:false,
        showNavigation: true,
        showCopyright: false,
        boundingbox: [-2, 10, 20, -2]

    });
         
   xaxis = brd2.create('axis', [[0, 0], [1,0]], 
		  {name:'x', 
			withLabel: true, 
			label: {position: 'rt', 
					 offset: [-15, 20]   
					 }
			});
yaxis = brd2.create('axis', [[0, 0], [0, 1]], 
		  {name:'y', 
			withLabel: true, 
			label: {
			  position: 'rt',   
			  offset: [-20, 0] 
				}
			});		
    
    expoints[0] = brd2.create('point', [2, 0], {name: ""});
    expoints[1] = brd2.create('point', [3, 2], {name: ""});
    expoints[2] = brd2.create('point', [6, 3], {name: ""});
    brd2.zoomElements(expoints);
    var anim = [];
    var funcgraph;
    var solved = false;
    
    function showInstr(){
        $("#exInstruction").show();
        $("#exEq").empty();
        $("#exEqShowRow").hide();
    }
    
    function showEq(eq){
        //$("#exInstruction").hide();
        $("#exEq").html(eq);
        $("#exEqShowRow").show();
        $('#contCol').scrollTo("#exEq", 500);
    }
    
    function minPoint(){
        var l = expoints.length;
        var min = expoints[0].X();
        for(var i =1; i < l; i++)
        {
            if(expoints[i].X() < min)
                min = expoints[i].X();
        }
        
        return min;
    } 
    function maxPoint(){
        var l = expoints.length;
        var max = expoints[0].X();
        for(var i =1; i < l; i++)
        {
            if(expoints[i].X() > max)
                max = expoints[i].X();
        }
        
        return max;
    }
    
    $("#clearFnc").click(function(){
        brd2.removeObject(funcgraph);
        solved = false;
        brd2.zoomElements(expoints);
        showInstr();
    });
    $("#addPoint").click(function(){
        var len = expoints.length;
        if(len == 7){return;}
        var lx;
        var ly;
        if(len > 0)
        {
            lx = expoints[len-1].X();
            ly = expoints[len-1].Y(); 
        }
        expoints.push(brd2.create('point', [lx+2, ly], {name: ""}));
        brd2.removeObject(funcgraph);
        solved = false;
        showInstr();
        brd2.zoomElements(expoints);
    });
    $("#removePoint").click(function(){
        var len = expoints.length;
        if(len == 2){return;}
        
        brd2.removeObject(expoints[len-1]);
        brd2.removeObject(funcgraph);
        solved = false;
        expoints.pop();
        showInstr();
        brd2.zoomElements(expoints);
    });
    $("#solveBtn").click(function(){
        
        if(solved){return;}
        
        var g = new Gauss2(null, null);
        
        var gd = [];
        var len = expoints.length;
        for(var i = 0; i < len; i++)
        {
            var t = [];
            for(var a = len-1; a >= 0; a--)
            {
                //console.log(expoints[i].X() + " do potegi " + a)
                t.push(Math.pow(expoints[i].X(), a));
            }
            t.push(expoints[i].Y());
            gd.push(t);
        }
        
        var res = g.solve(gd);
        
        var a0 = res[0];
        var a1 = res[1];
        var a2 = res[2];
        
        var wiel = "Wzór poszukiwanego wielomianu: </br></br>$f(x)=";
        
        var len = res.length;
        for(var a = len - 1; a >= 0; a--)
        {
            if(res[a] < 0 || a == len - 1)
                wiel += Math.roundTo4(res[a])
            else
                wiel += "+" + Math.roundTo4(res[a])
                
            if(a != 0 && a != 1)
                wiel += "*x^" + a;
            else if(a == 1)
                wiel += "*x";
            
        }
        
        wiel += "$";
        
        var fx = function(x){
            var ret = 0;

            for(var i = 0; i < res.length; i++)
            {
                ret += (res[i]*Math.pow(x, i));
            }           
            return ret;
        }
        
        
        var last = expoints[len - 1].X();
   
        
        
        
        funcgraph = brd2.create('functiongraph', [fx, minPoint(), maxPoint()]);
        solved = true;
        
        brd2.zoomElements([funcgraph]);
        
     
        
        var eq = "Układ równań do rozwiązania: $$\\begin{cases}\\begin{align}";
        
        for(var i = 0; i < len; i++)
            
        {
            for(var a = len-1; a >= 0; a--)
            {
                if(a != 0 && a != 1)
                    eq += "a_" + a + "*" + Math.roundTo4(expoints[i].X()) + "^" + a + "+"; 
                else if (a == 1)
                    eq += "a_" + a + "*" + Math.roundTo4(expoints[i].X()) + "+";
                else
                    eq += "a_" + a;   
            }
            
            eq += "=" +  Math.roundTo4(expoints[i].Y()) + "\\\\";
        }
        
        eq += "\\end{align}\\end{cases}$$ </br>";
        
        showEq(eq + wiel);
        
        
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        
        //0, expoints[expoints.length - 1].X()
    });
};



$(document).ready(start); */

