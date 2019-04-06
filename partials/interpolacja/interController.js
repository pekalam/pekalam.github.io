app.controller("InterDefController", function($scope, $title,  $subTitle, $menuHide){
    
    $title.setTitle("Interpolacja wielomianowa");
    $scope.showingAnim = true;
    
    $subTitle.setTitle("Interpolacja wielomianowa");
    
    ///SLAJDY
    $menuHide.onHide(function(){
        
        brd.needsFullUpdate = true;
        brd.resizeContainer($("#graphWell").width(), $("#graphWell").height());
        brd.update();
        
    });
    $menuHide.onShow(function(){
        brd.needsFullUpdate = true;
        brd.resizeContainer($("#graphWell").width(), $("#graphWell").height());
        brd.update();
    });
    
    var a_text = "flipInY";
    var lines = [];
    var funcgraph = null;
    
    var points = [];
    var anim = false;
    var brd;
    
    function setPoints(points, xyarr)
    {
        var len = xyarr.length;
        for(var i = 0; i < len - 1; i++)
        {
            var x = xyarr[i][0];
            var y = xyarr[i][1];
            points.push(brd.create('point', [x,y], {name: '<p style="font-size: 15px;">(x<sub>' + (i + 1) + '</sub>, y<sub>' + (i + 1) + '</sub>)</p>', frozen: true, showInfobox: false}));  
            var line = brd.create('line',[[x,y], [x, 0]] ,{
                 straightFirst:false,
                 straightLast:false,
                 dash: 2,
                 strokeWidth: 1,
                 highlight: false,
                frozen: true,
                strokeColor: "#000000"
             });
            var liney = brd.create('line',[[0,y], [x, y]] ,{
                 straightFirst:false,
                 straightLast:false,
                 dash: 2,
                 strokeWidth: 1,
                 highlight: false,
                 frozen: true,
                strokeColor: "#0044ff"
             });
            lines.push(line);
            lines.push(liney);
        }
        
        var x = xyarr[len-1][0];
        var y = xyarr[len-1][1];
        brd.create('point', [x,y], {name: "" , frozen: true, strokeColor: "#0000ff", fillColor: "#0000ff", showInfobox: false})
  
}
    
    function clearPoints()
    {
        var len = points.length;
        var lenli = lines.length;
        
        for(var i = 0; i < len; i++)
            brd.removeObject(points[i]);
        for(var i = 0; i < lenli; i++)
            brd.removeObject(lines[i]);
    }

    function slowLines(points){
    
    var promise = new Promise(function(resolve, reject){
        slowl_i = 0;
    var move = function(){
            if(slowl_i + 1 < points.length)
            {
             var line = brd.create('line',[points[slowl_i], points[slowl_i + 1]] ,{
                 straightFirst:false,
                 straightLast:false,
                 dash: 2,
                 strokeWidth: 1,
                 highlight: false,
             }); 
                lines.push(line);
                slowl_i++;
                setTimeout(move, 700);
            }
            else
                resolve();
        }
        move();

    });
             return promise;     
}

    function textAnim(str, styles)
    {
        $("#text").empty();
        $("#text").removeClass("animated " + a_text);
        if(styles !== undefined)
            $("#text").css(styles);
        $("#text").show().addClass("animated " + a_text).html(str);
        
    }

    function startDef(){
    brd = JXG.JSXGraph.initBoard('box',{
        axis:false,
        showNavigation: false,
        showCopyright: false,
        boundingbox: [-2, 10, 20, -2]

    });
     
    xaxis = brd.create('axis', [[0, 0], [1,0]], 
	{      
        name:'<p style="font-size: 14px;">x</p>', 
	       withLabel: true, 
	       label: {position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
			 offset: [-15, 20]   // (in pixels)
                  }
    });
yaxis = brd.create('axis', [[0, 0], [0, 1]], 
                   {name:'<p style="font-size: 14px;">y</p>', 
                    withLabel: true, 
                    label: {
                        position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
                        offset: [-20, 0]   // (in pixels)
                    }
                   });		
  
    
    
    
    
    
       
    
    var anims = [
    new Step(function(back){
        if(back)
        {
            lines.forEach(function(ob){
                brd.removeObject(ob);
            });
            lines = [];
            $scope.showingAnim = true;
            $scope.$apply();
        }
        
        textAnim('Interpolacja jest to metoda numeryczna, która związana jest z obliczeniami zmierzającymi do znalezienia analitycznego zapisu (czyli wzoru) pewnej funkcji w przypadku, kiedy dany jest zbiór jej wartości dyskretnych. Przykład takiego zagadnienia jest prezentowany między innymi w podręczniku do fizyki dla drugich klas szkół ponadgimnazjalnych w zakresie rozszerzonym. Rozważa się w nim ciężarek zawieszony na sprężynie. Jak wiadomo, odchylenie tego obiektu od stanu równowagi $r$ (naciągnięcie sprężyny), a następnie jego uwolnienie jest przyczyną ruchu ciężarka, który w pewnej chwili czasowej przechodzi przez położenie stanu równowagi.</br><p>Przyjmując oś $x$ zgodnie z kierunkiem ruchu ciężarka, uwzględniono dwa położenia obiektu: $a$ oraz $b$ dla których - za pomocą kamery - zarejestrowano  wartości odchyleń odpowiednio: $x_a$ oraz $x_b$. Ponadto  zarejestrowano wartości czasu przejścia przez te punkty. Następnie Autorzy podręcznika prezentują obliczenia, pozwalające na podstawie liniowej zależności analitycznej znaleść chwilę czasową, w której cieżarek przechodzi przez położenie równowagi $x_r$. Jest to zatem przykład zagadnienia interpolacji funkcji $y=f(x)$, gdzie $x$ reprezentuje położenie ciężarka, zaś $y$ to czas zmierzony w danym położeniu.', {"text-indent": "1.5em"});
        
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }, 5000),
    new Step(function(back){
        if(back){
            $("#r1").empty();
            $scope.showingAnim = true;
        $scope.$apply();
        }
        textAnim('Wartości uzyskane z pomiarów kamerą wyznaczają dwuelementowy zbiór dyskretnych wartości funkcji (czas), określonych dla dwóch wartości zmiennej niezależnej (położenie). Na tej podstawie kreowana jest zależność analityczna, pozwalająca obliczyć trzecią, nieznaną wartość funkcji $y$ dla określonego $x$, znajdującego się "pomiędzy" wartościami zadanymi. </br><p>Tego typu zagadnienia obliczeniowe mają ogromne znaczenie w rozwiązywaniu problemów dla różnych dziedzin nauki i techniki. Jednakże w zastosowaniach praktycznych najczęściej skala problemów jest dużo bardziej złożona niż w rozpatrywanym przykładzie. Zwykle dyskretne zbiory wartości funkcji są obszerniejsze, zaś zależności pomiędzy zmiennymi są nieliniowe. Wtedy problem interpolacji sprowadza się przede wszystkim do przyjęcia odpowiedniej klasy poszukiwanej funkcji $y=f(x)$. Bardzo często zakłada się, że będzie ona miała postać wielomianu - i stąd wywodzi się nazwa <b>interpolacji wielomianowej</b>.</br>Postać ogólną wielomianu można zapisać jako: $$ f(x) = a_nx^n+a_{n-1}x^{n-1}+...+a_1x+a_0 \\quad(1)$$ gdzie $a$ to współczynniki, zaś $n$ to stopień wielomianu. ', {"text-indent": "1.5em"});
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }),
    new Step(function(back){
        if(back)
        {
            $("#r1").empty();
            funcgraph.hideElement();
        }
        $scope.showingAnim = false;
        $scope.$apply();
        
        clearPoints();
        setPoints(points, [[1, 5],[4.00, 4.00], [8.00, 1.50], [15, 3.00], [12, 0]]);
        
        textAnim('Zadany zbiór dyskretnych wartości funkcji to tzw. <b>węzły interpolacji</b> (kolor czerwony). Każdy węzeł posiada dwie współrzędne - jedną na osi x, drugą na osi y. Zadanie interpolacji polega na określeniu wartości współczynników wielomianu, którego stopień zależy od liczby węzłów według zależności: $n=m-1$. W niniejszym przykładzie liczba zadanych węzłów wynosi $m=4$, stąd wielomian przyjmuje postać ogólną jako: $$f(x) = a_3x^3+a_{2}x^{2}+a_1x+a_0 \\quad(2)$$ Jeżeli przyjąć, że wartości współrzędnych poszczególnych węzłów reprezentują np. dokładne dane pomiarowe pewnego zjawiska, wówczas wyznaczenie wielomianu pozwoli zbadać to zjawisko tam, gdzie nie były dokonywane jego pomiary - np. dla wartości $x$ w punkcie niebieskim.</br><p>Znajdowanie wartości współczynników wielomianu jest podstawowym problemem obliczeniowym interpolacji. Funadamentalną zasadą metody jest przyjęcie założenia, że poszukiwana funkcja (wielomian) we wszystkich węzłach osiąga te wartości, które są zadane. Oznacza to, że jeżeli we wzorze (2) za $x$ przyjmiemy współrzędną węzła pierwszego, czyli $x_1$, to wielomian powinien osiagnąć wartość $y_1$, dla $x_2$ wielomian powinien przyjąć wartość $y_2$, itd.', {"text-indent": "1.5em"});
        
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }, 5000),
    new Step(function(back){
        
     
        
        textAnim('Takie rozumowanie pozwala utworzyć układ równań o następującej postaci: <p id="r1">$$\\begin{cases}\\begin{align} a_3x_1^3+a_2x_1^2+a_1x_1+a_0=y_1 \\\\ a_3x_2^3+a_2x_2^2+a_1x_2+a_0=y_2 \\\\ a_3x_3^3+a_2x_3^2+a_1x_3+a_0=y_3 \\\\ a_3x_4^3+a_2x_4^2+a_1x_4+a_0=y_4 \\end{align}\\end{cases} \\quad (3)$$</p> Pierwiastki powyższego układu równań jednoznacznie określają wielomian, który spełnia wszystkie zadane wartości węzłowe. Pozwala on wyznaczyć dowolne wartości $y$ z przedziału $[$x1, x4$]$. Można także sporządzić wykres wielomianu, który będzie przechodził przez wszystkie węzły. </br><p>Obliczanie współczynników wielomianu w oparciu o rozwiązywanie układu równań jest odrębnym, bardzo interesującym zagadnieniem. Zostało ono zaprezentowane w innej części niniejszego serwisu o nazwie "Metoda eliminacji Gaussa". Należy jednak zauważyć, iż nie jest to jedyne podejście. Do znajdowania wielomianu mogą służyć wzory interpolacyjne: Lagrange\'a, Newtona, Bessela lub Stirlinga. Dla dużej ilości węzłów znana jest metoda tzw. funkcji sklejanych. Widać zatem, że interpolacja to bardzio szerokie zagadnienie, które może być podstawą do opracowania dedykowanego serwisu matematycznego. <br><p>Należy przy tej okazji wspomnieć o <b>aproksymacji wielomianowej</b>, jako metodzie stanowiącej uogólnienie zagadnienia interpolacji. Chociaż dla obydwu metod zadanie formułowane jest podobnie, to w przypadku aproksymacji nie żąda się, aby poszukiwany wielomian w węzłach osiągał te same wartości. Do znalezienia funkcji aproksymującej nie muszą być wykorzystane wszystkie wezły, dlatego może ona być wielomianem niższego stopnia niż funkcja interpolująca. W metodzie aproksymacji budowana jest zatem funkcja, krórej wykres zwykle przechodzi obok węzłów, jednak reprezentuje ona charakter opisywanego zjawiska w sposób bardziej ogólny. ', {"text-indent": "1.5em"});
        
        
        if(funcgraph == null)
        {
            
        
        var g = new Gauss2(null, null);
        
        var gd = [];
        var len = points.length;
        for(var i = 0; i < len; i++)
        {
            var t = [];
            for(var a = len-1; a >= 0; a--)
            {
                t.push(Math.pow(points[i].X(), a));
            }
            t.push(points[i].Y());
            gd.push(t);
        }
        
        var res = g.solve(gd);
        
        var fx = function(x){
            var ret = 0;

            for(var i = 0; i < res.length; i++)
            {
                ret += (res[i]*Math.pow(x, i));
            }           
            return ret;
        }
        
        funcgraph = brd.create('functiongraph', [fx, points[0].X(), points[len-1].X()]);
        }
        else
            {
                   funcgraph.showElement();
            }
        
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }, 5000)
];
    
    var stepAnim = new StepAnim(null, anims);
    
        
    var bar1 = LBAR.create("bar1", anims.length);
     
    
    $("#start").click(function(){
        
        if(anim){return;}
        console.log("reset");
        resetBoard(brd);
        points = [];
        drawPoints(points);
        anim = true;
      
      
        stepAnim.play();

	});
    
    $("#clear").click(function(){
        if(anim){return;}
        resetBoard(brd);
        points = [];
        drawPoints(points);
        
    });
    
    $("#next").click(function(){
        if(anim){return;}
        //anim = true;
        stepAnim.nextStep();
        bar1.set(stepAnim.current() + 1);
        if(!stepAnim.hasNext())
            $("#next").hide();
        else if(stepAnim.hasPrevious())
        {
            $("#prev").show();
            $("#next").show();
        }
    });
    
    $("#prev").click(function(){
        if(anim){return;}
       // anim = true;      
        stepAnim.previousStep();
        bar1.set(stepAnim.current() + 1);
        if(!stepAnim.hasPrevious())
            $("#prev").hide();
        else if(stepAnim.hasNext())
        {
            $("#prev").show();
            $("#next").show();
        }
    });
    
    stepAnim.nextStep();
    bar1.set(1);
   $("#prev").hide();
    
};
    
    
    $scope.$on("$viewContentLoaded",startDef); 
    
});