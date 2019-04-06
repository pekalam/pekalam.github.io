app.controller("Integrals2", function($scope, $menuHide){

    var ibrd2;
    
    $scope.data = {};
    
    $scope.data.a = "-1.5";
    $scope.data.b = "1.5";
    $scope.data.delta = "9";
    $scope.data.fx = "abs(x*x*x)";
    $scope.valid = "";
    $scope.solved = false;
    $scope.P = "";
    $scope.step = "";
    var mainfunc;
    
    function resizeBoards(){
        ibrd2.needsFullUpdate = true;
        ibrd2.resizeContainer($("#intGraph2").width(), $("#intGraph2").height());
        ibrd2.update();
    }
    
    $menuHide.onHide(resizeBoards);
    $menuHide.onShow(resizeBoards);
    
    var points = [];
    
    function convertEq(str)
    {
        str = str.replace(/X/g, "x");
        str = str.replace(/,/g, ".");
        str = str.replace(/(x|\w+)\^\d+/gi, function(s){
            var len = s.length;
            var pre = s.match(/x/);
            var suff;
            if(pre !== undefined && pre != null)
            {
                pre = pre[0];
                suff = s.match(/\d+/)[0];
            }
            else
            {
                var m = s.match(/\d+/gi);
               
                pre = m[0];
                suff = m[1];       
            }
            
            return "Math.pow(" + pre + "," + suff + ")";
        });
        
        str = str.replace(/tan/gi, "Math.tan");
        str = str.replace(/cot/gi, "Math.cot");
        str = str.replace(/cos/gi, "Math.cos");
        str = str.replace(/sin/gi, "Math.sin");
        str = str.replace(/abs/gi, "Math.abs");
        
        return str;
    }
    
    function zoomBoard(brd, min_x, max_x, min_y, max_y){
        brd.setBoundingBox([min_x - 1, max_y + 1, max_x + 1, min_y - 1], false);
    }
    
    
    function f(x)
    {
        return Math.abs(x/(Math.pow(x,4) + 1));
    }
    
    function start(){
        ibrd2 = JXG.JSXGraph.initBoard('intGraph2',{
            axis:true,
            showNavigation: true,
            showCopyright: false,
            zoom:{
                wheel: true
            },
            boundingbox: [-2, 2, 2, -2]
        });
        ibrd2.defaultAxes.x.hideElement();
        ibrd2.defaultAxes.y.hideElement();
        xaxis = ibrd2.create('axis', [[0, 0], [1,0]], 
		  {name:'<p style="font-size: 14px">x</p>', 
			withLabel: true, 
			label: {position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
					 offset: [-15, 20]   // (in pixels)
					 }
			});
        yaxis = ibrd2.create('axis', [[0, 0], [0, 1]], 
		  {name:'<p style="font-size: 14px">y</p>', 
			withLabel: true, 
			label: {
			  position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
			  offset: [-25, 0]   // (in pixels)
				}
          });
        
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
      
    };
    
    
    var functions = [];
    var brdFnc = [];
    var lines = [];
    var wspLen = 0;
    
    function clearBoard(){
        ibrd2.removeObject(mainfunc);
        for(var i = 0; i < points.length; i++)
            ibrd2.removeObject(points[i]);
        
        for(var i = 0; i < brdFnc.length; i++)
            ibrd2.removeObject(brdFnc[i]);
        
        var linesLen = lines.length;
        for(var i = linesLen - 1; i >= 0; i--)
            ibrd2.removeObject(lines[i]);
        
        wspLen = 0;
        functions = [];
        brdFnc = [];
        points = [];
        lines = [];
    }
    
    function validateEq(eq)
    {
        try{
            var x = 1;
            eval(eq);
            return true;
        }
        catch(err)
        {
            return false;
        }
    }
    
    $scope.clear = function(){
        clearBoard();
        $scope.P = "";
        $scope.step = "";
        $scope.valid = "";
        $scope.solved = false;
    }
    
    $scope.solve = function(){
        
        var a = parseFloat($scope.data.a);
        var b = parseFloat($scope.data.b);
        var delt = parseFloat($scope.data.delta);
        if(validateEq(convertEq($scope.data.fx)) == false){alert("Podany wzór funkcji jest nieprawidłowy"); return;}
        
        if(a == b || b < a)
        {
            $scope.valid = "Podany przedział [" + a + "," + b + "] jest błędny !";
            $scope.solved = false;
            return;
        }
        if(delt <= 0)
        {
            $scope.valid = "Podana liczba węzłów jest błędna !";
            $scope.solved = false;
            return;
        }
        if(delt%2 == 0)
        {
            $scope.valid = "Liczba węzłów musi być nieparzysta !";
            $scope.solved = false;
            return; 
        }
        
        delt = (b-a)/(delt-1);
        
        $scope.valid = "";
        
        if(mainfunc != null){
            clearBoard();
        }
        
        var f = function(x){
            return eval(convertEq($scope.data.fx));
        } 
        mainfunc = ibrd2.create('functiongraph', [f, a, b], {strokeWidth: 1.1});
        
        
        
        var t = 0;
        
        if(a <= 0 && b > 0)
        {
            t = ((Math.abs(a) + Math.abs(b))/delt)+1;
        }
        else if(a < 0 && b < 0){
            t = ((Math.abs(a) - Math.abs(b))/delt)+1;
        }
        else if(a > 0 && b > 0){
            t = ((b - a)/delt)+1;
        }
        
        
        
        
        var i = a;
        
        var minX = i;
        var maxX = 0;
        var minY = f(i);
        var maxY = f(i);
        
        for(var e = 0; e < t; e++)
        {
            if(i == 0)
               points.push(ibrd2.create('point', [0.00001, 0], {"name": ""})); 
            else
                points.push(ibrd2.create('point', [i, 0], {"name": ""}));
            i += delt;
            
            var y = f(i);
            if(y > maxY)
                maxY = y;
            if(y < minY)
                minY = y;
        }
        
        maxX = i;
        
       // zoomBoard(ibrd2, minX, maxX, minY, maxY)
      
        //console.log("point len " + points.length)
        var pLen = points.length;
        
        
        
        for(var aa = 0, bb = 1, cc = 2; cc < pLen; aa = cc, bb+=2, cc+=2)
        {
            
            
            var r1 = [Math.pow(points[aa].X(), 2), Math.pow(points[aa].X(), 1), Math.pow(points[aa].X(), 0), f(points[aa].X())];
            var r2 = [Math.pow(points[bb].X(), 2), Math.pow(points[bb].X(), 1), Math.pow(points[bb].X(), 0), f(points[bb].X())];
            var r3 = [Math.pow(points[cc].X(), 2), Math.pow(points[cc].X(), 1), Math.pow(points[cc].X(), 0), f(points[cc].X())];
            
            var r = [r1,r2,r3];
        
            var g = new Gauss2();
            
            var roz = g.solve(r);
            
            var a0 = roz[0];
            var a1 = roz[1];
            var a2 = roz[2];
            
            wspLen += 3;
            
            
            var fx = (function(body){
                return new Function("x", "return (" + body + ");");
            })(String(a0) + "* 1 + " + String(a1) + "* x + " + String(a2) + "* (x*x)");
            
            functions.push(fx);
   

        }
        
          
        var a = parseFloat($scope.data.a);
        var b = parseFloat($scope.data.b);
        
        var P = 0;
        var mn = 4;
        var dx = delt;
        
        var s = 0;
        
        var str = "";
        
        var func = 0;
        
        for(var i = 0; i < wspLen; i+= 3)
        {
            
            
            var fnc = functions[func];
            var color = "red";
            if(func%2 == 0)
            {
                color = "green";
            }
            
            
            var bfnc = ibrd2.create("functiongraph", [functions[func], points[s].X(), points[s + 2].X()], {strokeColor: color, doAdvancedPlot:false, strokeWidth: 1.2});
            
            for(var j = s; j < s+2; j++)
            {
                var x = points[j].X();
                var y = f(x);
                lines.push(ibrd2.create('line',[[x,0],[x, y]], {straightFirst:false, straightLast:false, strokeWidth:1, strokeColor: "black"}))
            }
            
            
            brdFnc.push(bfnc);
            func++;
            
            s += 2;
            
            var pow = 2;
            
            if(i == 0)
            {
                P += fnc(a);
                //console.log("f(a) " + fnc(a));
                str += " f(a) "
              
            }
            if(i == wspLen - 3)
            {
                P += fnc(b);
              //  console.log("f(b) " + fnc(b));
                str += " f(b) "
                pow = 1;
            }

            for(var w = 0; w < pow; w++)
            {
                str += " f(a+ " + dx/delt + ") ";
                P += (fnc(a + dx) * mn);
                dx += delt;
                
                if(mn == 4)
                    mn = 2;
                else
                    mn = 4;
            }
            
        }
        var x = points[s].X();
        var y = f(x);
        lines.push(ibrd2.create('line',[[x,0],[x, y]], {straightFirst:false, straightLast:false, strokeWidth:1, strokeColor: "black"}))
        
        
        
        
        P = P*(delt/3);
        
      //  console.log(P);
      //  console.log(str);
        
        $scope.P = Math.roundTo4(P);
        $scope.step = Math.roundTo4(delt);
        $scope.solved = true;
    };
 
    $scope.$on("$viewContentLoaded", start); 
    $scope.$on('$destroy', function(){
        $menuHide.clear();
    });
});