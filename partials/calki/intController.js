app.controller("IntegralsDef", function($scope, $title, $state, $subTitle, $menuHide){
    
    $title.setTitle("Obliczanie całek oznaczonych");
    $subTitle.setTitle("Obliczanie całek oznaczonych")
    
    $scope.$emit("sideCont", [
        {
            name: "Całkowanie funkcji jednej zmiennej", 
            click: function(){
                if($("#bcalkowaniefunkcjijednejzmiennej").hasClass("sidebSelected"))
                    return;
                $('#contCol').animate({
                    scrollTop: $("#calkowaniefunkcjijednejzmiennej").offset().top
                }, 1000);
            }, 
            showCircle: true,
            contentID: "calkowaniefunkcjijednejzmiennej"
        },
        {
            name: "Oblicz całkę", click: function(){
                if($("#bobliczcalke").hasClass("sidebSelected"))
                    return;
                $('#contCol').animate({
                    scrollTop: $("#obliczcalke").offset().top
                }, 1000);
              
            }, 
            showCircle: true,
            contentID: "obliczcalke"
        },
        {
            name: "Powrót",
            click: function(){
                $state.go("nav");
                $scope.$emit("sideCont", []);
            
            }, 
            showCircle: false
        }
    ]);
    
    var lines = []; //linie
    var ibrd1;
    var fnc = null; ///funckja wyswietlana
    var pols = []; //trapezy
    var points = [];
    
    var a_text = "fadeIn";
   
    $scope.data = {};
    $scope.data.a = "-1.5";
    $scope.data.b = "1.5";
    $scope.data.odst = "4";
    $scope.data.fx = "abs(x*x*x)";
    $scope.showData = {};
    $scope.showData.P = 0;
    $scope.step = "";
    $scope.valid = "";
    $scope.showDef = true;
    
    $scope.solved = false;
    
    $scope.showInstr = function(){
       $.smkAlert({
            text: '<p style="font-size: 18px;">Obsługa edytora wzoru funkcji:</p><ul style="font-size: 15px;"><li>Mnożenie: znak mnożenia w edytorze to \'*\'. Pominięcie znaku mnożenia np. xy zamiast x*y spowoduje błąd.</li><li>Dzielenie: znak dzielenia w edytorze to \'/\'.</li><li>Potęgowanie: znak potęgowania w edytorze to \'^\'</li><li>Dodawanie i odejmowanie: znaki tych działań są standardowe</li><li>Nawiasy: edytor obsługuje nawiasy okrągłe \'()\'</li><li>Funkcje trygonometryczne należy wpisywać w postaci: sin(x), cos(x), tan(x), cot(x).</li><li>Wartość bezwzględną należy wpisywać w postaci abs(x).</li><li>Przykładowe wzory funkcji: <br>x^3-x^2<br> 2*sin(x)+x^2-10</li></ul>',
            type: 'info',
            position:'top-center',
            icon: 'glyphicon-info-sign',
            permanent: true
        });
    }

    $menuHide.onHide(resizeBoards);
    $menuHide.onShow(resizeBoards);
    
    $scope.clear = function(){
        clearBoard();
        $scope.step = "";
        $scope.showData.P = "";
        $scope.valid = "";
        $scope.solved = false;
    }
    
   
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
    
    function textAnim(id, str, styles)
    {
        var el = $(id);
        el.removeClass("animated " + a_text);
        if(styles !== undefined)
            el.css(styles);
        el.show().addClass("animated " + a_text).html(str);
        return el;
    }
    
    function clearBoard(){
        var llen = lines.length;
        
        for(var i = 0; i < llen; i++)
            ibrd1.removeObject(lines[i]);
        
        var poLen = pols.length;
        for(var i = 0; i < poLen; i++)
            ibrd1.removeObject(pols[i]);
        
        var poinLen = points.length;
        for(var i = poinLen - 1; i >= 0; i--)
            ibrd1.removeObject(points[i]);
        
        ibrd1.removeObject(fnc);
        
        lines = [];
        pols = [];
        points = [];
    }
 
    function zoomBoard(brd, min_x, max_x, min_y, max_y){
        brd.setBoundingBox([min_x - 1, max_y + 1, max_x + 1, min_y - 1], false);
    }
    
    function resizeBoards(){
        brd.needsFullUpdate = true;
        brd.resizeContainer($("#intGraph1").width(), $("#intGraph1").height());
        brd.update();
    }
    
    $scope.test = function(){

        var a = parseFloat($scope.data.a)
        var b = parseFloat($scope.data.b);
        var od = parseFloat($scope.data.odst);
        
        if(validateEq(convertEq($scope.data.fx)) == false){alert("Podany wzór funkcji jest nieprawidłowy"); return;}
        
        if(a == b || b < a)
        {
            $scope.valid = "Podany przedział [" + a + "," + b + "] jest błędny !";
            $scope.solved = false;
            return;
        }
        if(od <= 0)
        {
            $scope.valid = "Podana liczba węzłów jest błędna !";
            $scope.solved = false;
            return;
        }

      
        od = (b-a)/(od-1);
        
        $scope.valid = "";
            
        var t = 0;
        if(a <= 0 && b > 0)
        {
            t = ((Math.abs(a) + Math.abs(b))/od);
        }
        else if(a < 0 && b < 0){
            t = ((Math.abs(a) - Math.abs(b))/od);
        }
        else if(a > 0 && b > 0){
            t = ((b - a)/od);
        }
        
        if(t > 50)
        {
            $scope.valid = "Proszę podać mniejszą liczbę węzłów !";
            $scope.solved = false;
            return;
        }
        
        
        
        
        if(fnc != null){
            clearBoard();
        }
        
        var f = function(x)
        {
            return eval(convertEq($scope.data.fx));
        }

        fnc = ibrd1.create('functiongraph', [f, a, b], {strokeColor: "red", strokeWidth: 1.5});
        
        
        var P = 0;

        
        /*i1 = ibrd1.create('integral', [[$scope.data.a, $scope.data.b], fnc]);
        /*console.log(i1);
        i1.curveLeft.hideElement();
        i1.curveRight.hideElement(); */
       // i1.curveRight.childElements[Object.keys(i1.curveRight.childElements)[0]].hideElement();
        
        
        
        var i = a;
        
        //console.log('t ' + t)
        
        var max_y = 0;
        var max_x = 0;
        var min_x = i;
        var min_y = 0;
        
        for(var e = 0; e < t; e++)
        {
            var y = f(i);
            if(y < min_y)
                min_y = y;
            if(y > max_y)
                max_y = y;
            
            points.push(ibrd1.create("point", [i, 0], {"name": ""}));
            
            var l = ibrd1.create('line',[[i,0],[i,f(i)]], {straightFirst:false, straightLast:false, strokeWidth:1, strokeColor: "red", visible: false});
            
            var l2 = ibrd1.create('line',[[i,f(i)],[i+od,f(i+od)]], {straightFirst:false, straightLast:false, strokeWidth:1, strokeColor: "red", visible: false});
            
            lines.push(l);
            lines.push(l2);
            
            if(e == t-1)
            {
                var l3 = ibrd1.create('line',[[i+od,0],[i+od,f(i+od)]], {straightFirst:false, straightLast:false, strokeWidth:1, strokeColor: "red", visible: false});
                lines.push(l3);
            }
            
            i += od;
        }
        var y = f(i);
        if(y < min_y)
            min_y = y;
        if(y > max_y)
            max_y = y;
        points.push(ibrd1.create("point", [i, 0], {"name": ""}));
        
        max_x = i;
        
        var i = a+od;
       // console.log("b= " + b);
        for(var e = 0; e < t; e++)
        {
           // console.log("dla " + i)
            P += ((f(i-od) + f(i))/2)*od;  
            
            i += od;
        }
          $scope.solved = true;
       
        
        //console.log("P = " + P); 
        $scope.showData.P = Math.roundTo4(P);
        $scope.step = Math.roundTo4(od);
      
        
        zoomBoard(ibrd1, min_x, max_x, min_y, max_y);
        
        for(var i = 0; i < lines.length - 2; i++)
        {
            var pol = ibrd1.create('polygon', [lines[i].point1, lines[i].point2, lines[i+1].point2, lines[i+2].point1], {strokeOpacity: 1});
            for(var a = 0; a < pol.borders.length; a++)
            {
                pol.borders[a].setAttribute({visible: true})
                .point1.setAttribute({fixed: true})
            }
            pols.push(pol);
           // console.log(pol.borders)
        }
        
        
        
        
        
    };
    
    
    function start(){

         ibrd1 = JXG.JSXGraph.initBoard('intGraph1',{
            axis:true,
            showNavigation: true,
            showCopyright: false,
            boundingbox: [-2, 2, 2, -2]
            
        });
        ibrd1.defaultAxes.x.hideElement();
        ibrd1.defaultAxes.y.hideElement();
        xaxis = ibrd1.create('axis', [[0, 0], [1,0]], 
		  {name:'<p style="font-size: 14px">x</p>', 
			withLabel: true, 
			label: {position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
					 offset: [-15, 20]   // (in pixels)
					 }
			});
        yaxis = ibrd1.create('axis', [[0, 0], [0, 1]], 
		  {name:'<p style="font-size: 14px">y</p>', 
			withLabel: true, 
			label: {
			  position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
			  offset: [-25, 0]   // (in pixels)
				}
          });
        
        

        
        var anim = [
            new Step(function(){
textAnim("#def1Text", "Całkowanie funkcji jest ważnym zagadnieniem matematycznym. Mówiąc ogólnie, polega ono na znalezieniu tzw. <b>funkcji pierwotnej</b> do <b>funkcji podcałkowej</b>. Zadanie całkowania jest stosunkowo proste, jeżeli funkcja pierwotna jest łatwa do określenia. W różnych podręcznikach i poradnikach matematycznych istnieją odpowiednie tablice matematyczne, z których można określić funkcję pierwotną dla pewnych postaci funkcji podcałkowych. Przykładowo, jeżeli chcemy policzyć następującą całkę funkcji jednej zmiennej: $\\int a^xdx$, wówczas z tablic odczytujemy funkcję pierwotną  $a^x\\over ln \\ a $ i dzięki temu możemy napisać, że: $$\\int a^xdx={a^x \\over ln \\ a}, \\quad a > 0, \\quad a \\neq 1. \\quad \\quad \\quad (1)$$ <p>W przypadku obliczania całki oznaczonej, oprócz określenia funkcji pierwotnej należy dodatkowo obliczyć jej wartość w tzw. <b>granicach całkowania </b> $a$ oraz $b$.<br>Rozważmy przykład całki oznaczonej:", {"text-indent": "1.5em"})
.append("$$F = \\int_a^b x^ndx. \\quad \\quad (2)$$")
.append('Jeżeli ustalimy wartości poszczególnych parametrów jako: $n=3$, $a=1$, $b=4$ oraz wykorzystamy tablice matematyczne do określenia funkcji pierwotnej, to wartość całki (2) możemy obliczyć według wzoru:')
.append("$$F = \\int_1^4 x^3dx = {x^{3+1} \\over 3+1} \\Bigg\\lvert^4_1 = {4^4 \\over 4}-{1^4 \\over 4} = 63,75. \\quad \\quad (3)$$")
.append('<p> Powyższy przykład pokazuje, iż obliczając całkę oznaczoną otrzymujemy pewną wartość liczbową. Jak wskazuje teoria całkowania liczba ta jest <b>polem powierzchni</b>, która ograniczona jest krzywą reprezentującą wykres funkcji podcałkowej, prostymi o równaniach: $x=a$, $x=b$ oraz osią $x$, co pokazano na poniższym rysunku: ')
.append('<img style="width: 40%; height: auto; margin-left: calc(50% - 20%); margin-top: 25px; margin-bottom: 25px; display: block;" src="assets//calka.png"/>')
.append('<div class="text-center">Rysunek 1. Interpretacja geometryczna całki oznaczonej</div>')
.append('<br>Ta właściwość determinuje ogromne znaczenie praktyczne zagadnienia całkowania w obliczaniu pól figur płaskich. Należy dodać, iż bardziej skomplikowane metody, dotyczące całkowania funkcji wielu zmiennych umożliwiają także obliczanie objętości brył.')


MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                $("#calkiDefWell").scrollTop(0);
            }),
            
            
            new Step(function(back){
              
                
textAnim("#def1Text",' Jak wspomniano wcześniej i jak wynika z przykładu zadanego wzorem (2), obliczenie wartości całki oznaczonej nie powinno  stanowić problemu jeśli funkcja podcałkowa jest stosunkowo prosta. Niestety, bardzo często zdarza się, że wyznaczenie funkcji pierwotnej nie jest łatwe. Przeglądając odpowiednie podręczniki można dotrzeć do skomplikowanych i trudnych analitycznych metod całkowania. Autorzy różnych opracowań wskazują, iż są takie zadania, dla których zastosowanie tych metod jest wrecz niemożliwe. W takich przypadkach pozostaje jedynie obliczenie całki w sposób przybliżony. Dotyczy to rówież obliczania całek oznaczonych. <p>W teorii metod numerycznych stosuje się podejście, w którym trudną do obliczeń funkcję podcałkową $y=f(x)$ zastępuje się inną funkcją, która przybliża funkcję oryginalną. Inaczej możemy powiedzieć, że dokonuje się aproksymacji bądź interpolacji funkcji podcałkowej, przy czym chodzi o to, aby funkcja przybliżająca miała postać, którą dużo łatwiej poddać całkowaniu. W tym kontekście ujawnia się kolejne ważne znaczenie metod interpolacji i aproksymacji, które zostały zaprezentowane w jednej z opcji niniejszego serwisu.')
.append('<p>Jedną z możliwych funkcji przybliżających może być wielomian o znanej nam postaci: $$f(x)=a_0+a_1x+a_2x^2+a_3x^3+{...}+a_nx^n, \\quad \\quad (4) $$ gdzie $n$ to jego stopień.')
.append('W najprostszym przypadku można przyjąć przybliżenie funkcji podcałkowej za pomocą wielomianu stopnia pierwszego: $$f(x)=a_0+a_1x, \\quad \\quad(5)$$  którego wykresem jest linia prosta. Jak wiadomo, do otrzymania wzoru takiego wielomianu wymagane są jedynie dwa węzły. Aby jednak dobrze przybliżyć dowolną funkcję to zwykle jedna prosta nie wystarczy, dlatego w  przedziale całkowania $[a, b]$ należy wtedy uwzględnić dodatkowe węzły obliczeniowe. Wtedy przybliżenie wykresu funkcji bedzie wymagało wielokrotnej interpolacji pomiędzy poszczególnymi parami węzłów. W celu uproszczenia rozważań można przyjąć węzły równoodległe względem osi $x$. Takie rozwiązanie jest również pomocne do obliczania całek oznaczonych ponieważ sprawia, że w obszarze pod krzywą podcałkową można wyodrębnić trapezy o jednakowej wysokości, co zaprezentowano na poniższym rysunku: ')
.append('<img style="width: 45%; height: auto; margin-left: calc(50% - 20%); margin-top: 20px; margin-bottom: 20px; display: block;" src="assets//calkatrap.png"/>')
.append('<div class="text-center">Rysunek 2. Przybliżenie funkcji podcałkowej wielomianami stopnia pierwszego - trapezy w obszarze całkowania.</div>')
.append('<br><p>Całkowite pole pod oryginalną krzywą podcałkową $y=f(x)$ (kolor czerwony) może być przybliżone za pomocą sumy pól cząstkowych $P_1{...}P_4$. Z kolei każde pole cząstkowe może być wyliczone ze wzoru trapezu o podstawach równych dwóm odpowiednim wartościom funkcji podcałkowej oraz wysokości $\\Delta x$.');              
              

MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                $("#calkiDefWell").scrollTop(0);
            }),
            
            new Step(function(back){
                
textAnim("#def1Text",'W ogólnym przypadku można przyjąć dowolną liczbę pól składowych i wartość przybliżoną całki obliczyć według zależności zwanej <b>wzorem trapezów</b>: $$F={1\\over 2}\\Delta x [f(a)+f(b)+2f(a + \\Delta x)+2f(a + 2\\Delta x)+{...}+2f(b-\\Delta x)], \\quad \\quad (6)$$ przy czym odległość między węzłami $\\Delta x$ nazywana jest <b>krokiem całkowania</b>. <br><p> Wyprowadzenie powyższego wzoru wiąże się z sumowaniem wszystkich pól składowych. Jak można zauważyć, sąsiadujące ze sobą trapezy mają wspólne podstawy, dlatego odpowiednie składniki sumy są mnożone przez 2. <p>Postać wzoru trapezów pokazuje, że całkowanie numeryczne w swojej istocie sprowadza się do obliczania dyskretnych wartości funkcji podcałkowej. Zatem nie jest ważne, czy ta funkcja jest trudna czy łatwa - jeżeli całka istnieje, to jej wartość przybliżoną uzyskamy zawsze na drodze stosunkowo prostych obliczeń. <br><p> Analizując rysunek 2 można dostrzec jeszcze jeden aspekt całkowania. Widać na nim wyraźnie, iż przybliżanie funkcji - której wykresem jest skomplikowana krzywa -  za pomocą prostych wnosi pewien błąd. W celu jego zmniejszenia można byłoby próbować dobrać odpowiednio mniejszy krok całkowania $\\Delta x$. Intuicja podpowiada, że dobrze byłoby również próbować zastąpić odcinki proste krzywymi, które lepiej "dopasują się" do poszczególnych fragmentów wykresu funkcji podcałkowej. Właśnie tą ideę wykorzystuje <b>metoda Simpsona</b>. O ile w metodzie trapezów przybliżenia realizowane są wielomianami stopnia pierwszego, to w tej metodzie wykorzystuje się wielomiany stopnia drugiego, tj.: $$f(x)=a_0+a_1x+a_2x^2, \\quad \\quad(7)$$ których wykresem jest parabola. Jak wiadomo, utworzenie pojedynczego wielomianu wymaga przyjęcia jedynie 3 wezłów obliczeniowych. <br>W przypadku skomplikowanych kształtów funkcji podcałkowych liczba wielomianów zwykle powinna być większa. Tym samym zwiększa się ilość wezłów, przy czym zawsze musi to być liczba nieparzysta, uwzględniając również węzły położone w granicach całkowania $a$, $b$. Na Rysunku 3 zaprezentowano przykład, w którym funkcję podcałkową, przybliżono dowoma parabolami: ')
.append('<img style="width: 45%; height: auto; margin-left: calc(50% - 20%); margin-top: 20px; margin-bottom: 20px; display: block;" src="assets//calka2.png"/>')      
.append('<div class="text-center">Rysunek 3. Przybliżenie wykresu funkcji podcałkowej za pomocą parabol.</div>')                
.append('<br>Powyższy rysunek pokazuje, iż dla dwóch parabol należy przyjąć 5 węzłów obliczeniowych. Podobnie jak dla metody trapezów, tutaj również powstają pola składowe, w tym przypadku ograniczone między innymi przez dwie parabole $w_1$ i $w_2$, które dosyć dobrze "dopasowują się" do wykresu funkcji $f(x)$. <br><p>W podręcznikach do metod numerycznych można odnaleść wyprowadzenie <b>wzoru Simpsona</b> dla przypadku z dowolną liczbą pól składowych. Pamiętając o konieczności przyjęcia nieparzystej liczby węzłów, wzór ten możemy zapisać w następującej postaci: $$F={1\\over 3}\\Delta x [f(a)+f(b)+4f(a + \\Delta x)+2f(a + 2\\Delta x)+4f(a + 3\\Delta x)+2f(a + 4\\Delta x){...}+4f(b-\\Delta x)] \\quad \\quad (8),$$ gdzie $\\Delta x$ to krok całkowania. <br><p> W ramach tworzenia niniejszej aplikacji opracowano i zaimplementowano algorytmy pozwalające obliczać całki oznaczonne za pomocą obydwu prezentowanych powyżej metod. Wybierając opcję <b>Oblicz całkę</b> można nie tylko obliczyć wartości całek ale również wizualnie ocenić wpływ doboru kroku całkowania na dokładność przybliżenia funkcji podcałkowej. ');
                

MathJax.Hub.Queue(["Typeset",MathJax.Hub]);  
                $("#calkiDefWell").scrollTop(0);
            })
            
         
        ];
        
        var stepAnim = new StepAnim(null, anim);
        
        var bar1 = LBAR.create("#bar1", anim.length);
        

        
        
        $("#next").click(function(){
            stepAnim.nextStep();
            bar1.set(stepAnim.current() + 1);
            if(!stepAnim.hasNext())
            {
                $("#next").hide();
                $("#prev").show();
            }
            else if(stepAnim.hasPrevious())
            {
                $("#prev").show();
                $("#next").show();
            }
        });
        
        $("#prev").click(function(){
            stepAnim.previousStep();
            bar1.set(stepAnim.current() + 1);
            if(!stepAnim.hasPrevious())
            {
                $("#prev").hide();
                $("#next").show();
            }
            else if(stepAnim.hasNext())
            {
                $("#prev").show();
                $("#next").show();
            }
        });
        
        stepAnim.nextStep();
        bar1.set(1);
        $("#prev").hide();
        
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
   
    };
    
    
    $scope.$on("$viewContentLoaded", start); 
    $scope.$on('$destroy', function(){
        $menuHide.clear();
    });
});