app.controller("NlinearExController", function($scope, $menuHide){

    $scope.eq = "";
    $scope.a = "-1";
    $scope.b = "2";
    $scope.eps = "0.001";
    
    $menuHide.onHide(resizeBoard);
    $menuHide.onShow(resizeBoard);
    
    var brdNeeds = false;
    
    function resizeBoard(){
        if(!solutionShowed)
        {
            brdNeeds = true;
        }
        else{
            nexbrd.needsFullUpdate = true;
            nexbrd.resizeContainer($("#nexbox").width(), $("#nexbox").height());
            nexbrd.update();
            brdNeeds = false;
        }
    }
    
    var solutionShowed = false;
    
    function showSol(s)
    {
        if(s)
        {
            $("#editor").hide(0);
            $("#solution").show(0);
        }
        else{
            $("#editor").show(0);
            $("#solution").hide(0);
            solutionShowed = false;
        }
      
    }
    
    $scope.changeVal = function(name, val)
    {
        $scope[name] = val;
    }
    $scope.changeEq = function(str){ 
        var len = str.length;
        
        if(str.charAt(len-1) == '^' || str.charAt(len-1) == '_')
            return;
            
        str = str.replace(/,/g, ".");
      
        $scope.eq = str;
        //$("#mathEditor").val(str);
        
        str = str.replace(/\^\d+/gi, function(rep){
            rep = rep.replace(/\^/gi, "");
            rep = "^{" + rep + "}";
            return rep;
        })

        $("#mathPrev").empty().html("$" + str + "=0$");
        
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
      
    };
    $scope.animStarted = false;
    $scope.repeatAnim = function(){
        $scope.animStarted = true;
        startAnim(convEq);
    }
    
    $scope.showInstr = function(){
       $.smkAlert({
            text: '<p style="font-size: 18px;">Obsługa edytora równań:</p><ul style="font-size: 15px;"><li>Mnożenie: znak mnożenia w edytorze to \'*\'. Pominięcie znaku mnożenia np. xy zamiast x*y spowoduje błąd.</li><li>Dzielenie: znak dzielenia w edytorze to \'/\'.</li><li>Potęgowanie: znak potęgowania w edytorze to \'^\'</li><li>Dodawanie i odejmowanie: znaki tych działań są standardowe</li><li>Nawiasy: edytor obsługuje nawiasy okrągłe \'()\'</li><li>Funkcje trygonometryczne należy wpisywać w postaci: sin(x), cos(x), tan(x), cot(x).</li><li>Przykładowe lewe strony równań: <br>x^3-x^2<br> 2*sin(x)+x^2-10</li></ul>',
            type: 'info',
            position:'top-center',
            icon: 'glyphicon-info-sign',
            permanent: true
        });
    }
    
    var solAnim;
    var nexbrd;
    var p1 = null;
    var p2 = null;
    var p3 = null;
    var a = null;
    var b = null;
    var c = null;
    var roz;
    var convEq
    
    var showedFunc = null;
    
    
    
    function startAnim(eq){
            clearInterval(solAnim);
            clearBoard();
        
            var i = 0;
            
            setTimeout(function(){
                
                showedFunc = nexbrd.create('functiongraph', [function(x){
                    return eval(eq);
                }]);
                
                
        
                p1 = addPoint(roz[i].a, roz[i].wa, {name: "f(a)"});
                p2 = addPoint(roz[i].b, roz[i].wb, {name: "f(b)"});
                p3 = addPoint(roz[i].c, roz[i].wc, {fillColor: "green", strokeColor: "green", name: "f(c)"});
                a = addPoint(roz[i].a, 0, {name: "a"});
                b = addPoint(roz[i].b, 0, {name: "b"});
                c = addPoint(roz[i].c, 0, {fillColor: "green", strokeColor: "green", name: "c"});

                
                zoomToPoints([p1,p2,p3], nexbrd, false);
                i++;
            }, 500);
               
        
            solAnim = setInterval(function(){
                if(i == roz.length)
                {
                    /*i = 0;
                    p1.moveTo([roz[i].a, roz[i].wa]);
                    p2.moveTo([roz[i].b, roz[i].wb]);
                    p3.moveTo([roz[i].c, roz[i].wc]);
                    a.moveTo([roz[i].a, 0]);
                    b.moveTo([roz[i].b, 0]);
                    c.moveTo([roz[i].c, 0]);
                    
                    
                    zoomToPoints([p1,p2,p3], nexbrd, false); */
                    
                    $scope.animStarted = false;
                    $scope.$apply();
                    clearInterval(solAnim);
                }
                else{
                    p1.moveTo([roz[i].a, roz[i].wa], 800);
                    p2.moveTo([roz[i].b, roz[i].wb], 800);
                    p3.moveTo([roz[i].c, roz[i].wc], 800, {callback: function(){   
                            zoomToPoints([p1,p2,p3], nexbrd, false);
                        
                    }});    
                    a.moveTo([roz[i].a, 0]);
                    b.moveTo([roz[i].b, 0]);
                    c.moveTo([roz[i].c, 0]);
                    
                }
                i++;  
            }, 2000);
    }
    
    
    function convertEq(str)
    {
        str = str.replace(/X/g, "x");
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
    
    function zoomToPoints(elements, brd, fixed, val)
    {
        if(val === undefined)
            val = 1;
        
        
        var len = elements.length;
        var mx = elements[0].X();
        var m_x = elements[0].X();
        var m_y = elements[0].Y();
        var my = elements[0].Y();
        for(var i = 1; i < len; i++)
        {
            if(elements[i].X() > mx)
                mx = elements[i].X();
            if(elements[i].X() < m_x)
                m_x = elements[i].X();
            if(elements[i].Y() > my)
                my = elements[i].Y();
            if(elements[i].Y() < m_y)
                m_y = elements[i].Y();
        }
        
        if(Math.abs(mx - m_x) < 0.06)
        {
            if(fixed === undefined || fixed == true)
                brd.setBoundingBox([m_x - val, my + val, mx + val, m_y - val], false);
            else
                brd.setBoundingBox([m_x - $scope.zoomCache , my + $scope.zoomCache , mx + $scope.zoomCache , m_y - $scope.zoomCache ], false);
            
            return;
        }
        
        if(fixed === undefined || fixed == true)
            brd.setBoundingBox([m_x - val, my + val, mx + val, m_y - val], false);
        else
        {
            brd.setBoundingBox([m_x - (mx-m_x) , my + (mx-m_x) , mx + (mx-m_x) , m_y - (mx-m_x) ], false);
            $scope.zoomCache = (mx-m_x);
        }

    }
    
    function clearBoard()
    {
        nexbrd.removeObject(showedFunc)
        nexbrd.removeObject(a)
        nexbrd.removeObject(b)
        nexbrd.removeObject(c);
        nexbrd.removeObject(p1);
        nexbrd.removeObject(p2);
        nexbrd.removeObject(p3);
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
    
    $scope.showSolution = function()
    {
            var rn = new Rnlin();
            convEq = convertEq($scope.eq);
            if(convEq == ""){return;}
            if(validateEq(convEq) == false){alert("Podane równanie jest nieprawidłowe"); return;}
            
        
            var eps = Number($scope.eps);
            var va = Number($scope.a);
            var vb = Number($scope.b);    
            if(isNaN(eps) || isNaN(va) || isNaN(vb))
            {
                alert("Podane równanie jest nieprawidłowe");
                return;
            }
        
            var wyn = rn.solve(convEq, eps, va, vb);
            roz = rn.steps();
        
        
            
            
            if(isNaN(wyn))
            {
                $("#exInfo").empty();
                $("#x").html("Brak pierwiastka w podanym przedziale $[a,b]$");
                clearBoard();
                showSol(true);
                
                setTimeout(function(){
                    
                    
                    showedFunc = nexbrd.create('functiongraph', [function(x){
                        return eval(convEq);
                    }]);
                    
                    a = addPoint(Number($scope.a), 0, {name: "a"});
                    b = addPoint(Number($scope.b), 0, {name: "b"});
                    zoomToPoints([a,b], nexbrd);
                }, 200);
                
                $scope.animStarted = true;
                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                
                return;
            }
            else
            {
                var len = roz.length;
                var fc = roz[len-1].wc;
                if(isNaN(fc))
                {
                    $("#exInfo").html("Wystąpił błąd obliczeń. Proszę zmienić dane.");
                    $("#x").empty();
                    showSol(true);
                    return;
                }
                else{
                    $("#exInfo").html("Liczba cykli obliczeniowych: " + len + "<br>$f(c)=" + Math.roundTo10(fc) + "$");
                
                    $("#x").html("<b>Przybliżona wartość pierwiastka wynosi: $$x = " + wyn.toFixed(Math.decimalPlaces($scope.eps)) + "$$</b>");
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                }
                
            }
            $scope.animStarted = true;
           
        
            startAnim(convEq);
        
        
            showSol(true);
            solutionShowed = true;
            if(brdNeeds)
            {
                nexbrd.needsFullUpdate = true;
                nexbrd.resizeContainer($("#nexbox").width(), $("#nexbox").height());
                nexbrd.update();
            }
    }
    
    $scope.hideSolution = function(){
        showSol(false);
        clearInterval(solAnim);
    }
    
    
    
    function start(){
        nexbrd = JXG.JSXGraph.initBoard('nexbox',{
            axis:true,
            showNavigation: true,
            showCopyright: false,
            boundingbox: [-100, 100, 100, -100]
        });
        
        nexbrd.defaultAxes.x.hideElement();
        nexbrd.defaultAxes.y.hideElement();
        xaxis = nexbrd.create('axis', [[0, 0], [1,0]], 
		  {name:'x', 
			withLabel: true, 
			label: {position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
					 offset: [-15, 20]   // (in pixels)
					 }
			});
        yaxis = nexbrd.create('axis', [[0, 0], [0, 1]], 
		  {name:'f(x)', 
			withLabel: true, 
			label: {
			  position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
			  offset: [-25, 0]   // (in pixels)
				}
          });
        
        
        
        $("#mathPrev").empty().html("$=0$");
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        
        showSol(false);
    }
    
    function addPoint(x,y, attr)
    {
        return nexbrd.create("point", [x,y], attr);
    }
    
    
    $scope.$on("$viewContentLoaded", start);
    $scope.$on('$destroy', function(){
        $menuHide.clear();
        clearInterval(solAnim);
    });
});