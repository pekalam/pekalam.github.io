app.controller("NlinearDefController", function($scope, $title, $state, $subTitle, $menuHide){
    
    $title.setTitle("Rozwiązywanie równań nieliniowych");
    $subTitle.setTitle("Rozwiązywanie równań nieliniowych");
    $scope.$emit("sideCont", [
        {
            name: "Charakterystyka zagadnienia", 
            click: function(){
                if($("#bcharakterystykazagadnienia").hasClass("sidebSelected"))
                    return;
                $('#contCol').animate({
                    scrollTop: $("#charakterystykazagadnienia").offset().top
                }, 1000);
            }, 
            showCircle: true,
            contentID: "charakterystykazagadnienia"
        },
        {
            name: "Rozwiąż równanie", click: function(){
                
                if($("#brozwiazrownanie").hasClass("sidebSelected"))
                    return;    
                $('#contCol').scrollTo("#rozwiazrownanie", 1000);
              
            }, 
            showCircle: true,
            contentID: "rozwiazrownanie"
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
    
    $menuHide.onHide(resizeBoards);
    $menuHide.onShow(resizeBoards);
    
    var defbrd;
    var defbrd2;
    var stepAnim;
    var a,b,c,a1,b2,c3;
    
    
    var animation;
    
    var a_text = "fadeIn"

    var animRoz;
    
    
    this.next = function(){
        stepAnim.nextStep(); 
        bar.set(stepAnim.current() + 1)
        if(!stepAnim.hasNext())
            $("#next").hide();
        else if(stepAnim.hasPrevious())
        {
            $("#prev").show();
            $("#next").show();
        }
    }
    this.prev = function(){
        stepAnim.previousStep();
        bar.set(stepAnim.current() + 1)
        if(!stepAnim.hasPrevious())
            $("#prev").hide();
        else if(stepAnim.hasNext())
        {
            $("#prev").show();
            $("#next").show();
        }
    }
     
    $scope.startAnim = function(){
        an(animRoz);
        $scope.animStarted = true;
    }
    
    $scope.animStarted = false;
    
    
    function an(roz){
        var i = 0;
        a.moveTo([roz[i].a, roz[i].wa]);
        b.moveTo([roz[i].b, roz[i].wb]);
        c.moveTo([roz[i].c, roz[i].wc]);
        a1.moveTo([roz[i].a, 0]);
        b2.moveTo([roz[i].b, 0]);
        c3.moveTo([roz[i].c, 0]);
        $("#animCycle").html("Cykl " + (i + 1));
        zoomToPoints([a,b,c], defbrd2)
        i++;
        
        animation = setInterval(function(){
            
            if(i == roz.length)
            {
                i = 0;
                a.moveTo([roz[i].a, roz[i].wa]);
                b.moveTo([roz[i].b, roz[i].wb]);
                c.moveTo([roz[i].c, roz[i].wc]);
                a1.moveTo([roz[i].a, 0]);
                b2.moveTo([roz[i].b, 0]);
                c3.moveTo([roz[i].c, 0]);
                
                zoomToPoints([a,b,c], defbrd2, false)
                $scope.animStarted = false;
                $scope.$apply();
                clearInterval(animation);
                
            }
            else{
          
                c.moveTo([roz[i].c, roz[i].wc], 800);
                a.moveTo([roz[i].a, roz[i].wa], 800);
                b.moveTo([roz[i].b, roz[i].wb], 800);
                c3.moveTo([roz[i].c, 0], 800);
                a1.moveTo([roz[i].a, 0], 800);
                b2.moveTo([roz[i].b, 0], 800);
                
                zoomToPoints([a,b,c], defbrd2, false)
                $("#animCycle").html("Cykl " + (i + 1));
            }
            i++;  
        }, 2700);
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
        
        if(fixed === undefined || fixed == true)
            brd.setBoundingBox([m_x - val, my + val, mx + val, m_y - val], false);
        else
            brd.setBoundingBox([m_x - (mx-m_x), my + (mx-m_x), mx + (mx-m_x), m_y - (mx-m_x)], false);

    }
    
    var defBrdNeeds = false;
    var rozwSteps = false;
    
    function resizeBoards(){
        if(!rozwSteps)
        defBrdNeeds = true;
        else{
            defbrd.needsFullUpdate = true;
            defbrd.resizeContainer($("#defbrd").width(), $("#defbrd").height());
            defbrd.update();
            defBrdNeeds = false;
        }
        
        defbrd2.needsFullUpdate = true;
        defbrd2.resizeContainer($("#defbrd2").width(), $("#defbrd2").height());
        defbrd2.update(); 
    }
    
    function initBoards(){
        defbrd = JXG.JSXGraph.initBoard('nlinbox',{
            axis:true,
            showNavigation: true,
            showCopyright: false,
            boundingbox: [-3, 15, 4, -4]
        });
        defbrd.defaultAxes.x.hideElement();
        defbrd.defaultAxes.y.hideElement();
        xaxis = defbrd.create('axis', [[0, 0], [1,0]], 
		  {name:'x', 
			withLabel: true, 
			label: {position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
					 offset: [-15, 20]   // (in pixels)
					 }
			});
        yaxis = defbrd.create('axis', [[0, 0], [0, 1]], 
		  {name:'f(x)', 
			withLabel: true, 
			label: {
			  position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
			  offset: [-25, 0]   // (in pixels)
				}
          });

        
        defbrd2 = JXG.JSXGraph.initBoard('nlinbox2',{
            axis:true,
            grid: true,
            showNavigation: true,
            showCopyright: false,
            boundingbox: [-30, 30, 30, -30]
        });
        defbrd2.defaultAxes.x.hideElement();
        defbrd2.defaultAxes.y.hideElement();
        xaxis = defbrd2.create('axis', [[0, 0], [1,0]], 
		  {name:'x', 
			withLabel: true, 
			label: {position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
					 offset: [-15, 20]   // (in pixels)
					 }
			});
        yaxis = defbrd2.create('axis', [[0, 0], [0, 1]], 
		  {name:'f(x)', 
			withLabel: true, 
			label: {
			  position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
			  offset: [-25, 0]   // (in pixels)
				}
          });

    }
    
    
    function start(){
        
        var eq = "2*Math.pow(x,3)-Math.pow(x,2)+1";
        
        initBoards();
        
        var rn = new Rnlin();
        var wyn = rn.solve(eq);
        var roz = rn.steps();
        var i = -1;
        var len = roz.length;
        
        defbrd.create('functiongraph', [function(x){
            return eval(eq);
        }]);
        defbrd2.create('functiongraph', [function(x){
            return eval(eq);
        }]);
        
        var p1 = addPoint(roz[0].a, roz[0].wa, {name: "f(a)", fillColor: "blue", strokeColor: "blue"});
        var p2 = addPoint(roz[0].b, roz[0].wb, {name: "f(b)"});
        var p3 = addPoint(roz[0].c, roz[0].wc, {fillColor: "green", strokeColor: "green", name: "f(c)"});
        var pa = addPoint(roz[0].a, 0, {name: "a", strokeColor: "blue", fillColor: "blue"});
        var pb = addPoint(roz[0].b, 0, {name: "b"});
        var pc = addPoint(roz[0].c, 0, {name: "c",  strokeColor: "green", fillColor: "green"});
        
      
        zoomToPoints([p1, p2, p3], defbrd);
            
        var anim = [
            new Step(function(back){
                
                
                setText("#charText", '<p>Co to znaczy rozwiązać równanie? Ogólnie można powiedzieć, iż polega to na znalezieniu jednej lub wielu liczb zwanych <b>pierwiastkami</b>, które wstawione do równania w miejsce zmiennej powodują, że prawa i lewa strona tego równania są sobie równe. Podejmując problematykę rozwiązywania równań w niniejszym serwisie bedziemy rozważać równania z jedną zmienną, dla których ogólna postać może być zapisana jako: $$f(x)=0 \\quad\\quad \\quad \\quad (1)$$W najprostszym przypadku zmienna $x$ może wystąpić samoistnie w pierwszej lub drugiej potędze, np. $2x^2-6x+1=0$ i wtedy znajdowanie pierwiastków nie powinno stanowić dla nas większego problemu. <br>Jednak może się zdarzyć, że staniemy przed koniecznością rozwiązania zagadnień dużo bardziej skomplikowanych, jak chociażby takich, które dane są poniżej: $$x^3+x^2+x-2=0 \\quad \\quad \\quad \\quad(2) $$ <p class="text-center">lub</p> $${x\\over 2 tg(x)} \\cdot {tg(x)-x\\over 2 tg({x \\over 2})-x}=0 \\quad \\quad \\quad \\quad (3)$$ <br> <p>Patrząc na powyższe równania, a zwłaszcza na równanie (3) trudno jest sobie nawet wyobrazić jaką przyjąć startegię ich  rozwiązywania - wydaje się, że jest to wręcz niemożliwe. Dlatego z pomocą przychodzą metody numeryczne, dzięki którym można uzyskać przybliżone wartości pierwiastków. <br>Dla ciekawości dodam, że równanie (2) posiada pierwaistek przybliżony $x$=0.81, zaś równanie (3) posiada kilka pierwiastków, między innymi $x$=4.49.') 
                
                
                
                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            }),
            new Step(function(back){
                if(back)
                {
                    //$scope.rozwStep = false;
                    $("#nlinTeo").show(0);
                    $(".rozwStep").hide(0);
                    rozwSteps = false;
                    i = -1;
                }
                
                
                setText("#charText",'Rozwiązywanie tego typu równań nieliniowych wiąże się przede wszystkim z koniecznością wyboru konkretnej metody numerycznej. Metody służące przybliżonemu rozwiązywaniu równań nieliniowych można ogólnie podzielić na <b>iteracyjne</b> oraz <b>przedziałowe</b>. Autorzy opracowań z tego zakresu wskazują, iż ta druga grupa metod jest częściej stosowana, dlatego w niniejszym serwisie zaprezentowano jedną z nich, zwaną <b>metodą bisekcji</b>. <br><p> Obliczenia przy użyciu tej metody wymagają poczynienia pewnych wstępnych przygotowań. Przede wszystkim należy oszacować ile rozwiązywane równanie może posiadać pierwiastków w interesującym nas zakresie zmiennej $x$. W tym celu można sporządzić wykres lewej cześci równanania (1), który umożliwi zgrubną ich lokalizację. Ponadto, dla każdego z pierwiastków należy przyjąć pewien przedział tak, aby dany pierwiastek się w nim znajdował - jest to tzw. <b>przedział ufności</b>. Na rysunku poniżej przedstawiono przykład pewnego równania, dla którego sporządzono odpowiedni wykres i oszacowano 3 przedziały ufności.')
                .append('<br><img style="width: 60%; height: auto; display: block; margin-left: calc(50% - 30%);" src="assets//wykres_rn.png"/><br>')
                .append('W każdym z nich znajduje się jeden z poszukiwanych pierwiastków. Trzeba zaznaczyć, iż w takim przypadku należy trzykrotnie zastosować metodę bisekcji, oddzielnie dla każdego z przedziałów.<br><p>Nazwa rozważanej metody bierze się stąd, iż wyznaczone przedziały są zwykle wielokrotnie dzielone na połowy - szczegóły obliczeń można zobaczyć po wybraniu opcji Dalej. ')
                
                
                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            }),
            new Step(function(back){
                if(back == false)
                {
                   // $scope.rozwStep = true;
                    $("#nlinTeo").hide(0);
                    $(".rozwStep").show(0);
                    rozwSteps = true;
                   
                    i = 0;
                    
                    if(defBrdNeeds){
                        defbrd.needsFullUpdate = true;
                        defbrd.resizeContainer($("#defbrd").width(), $("#defbrd").height());
                        defbrd.update();
                        defBrdNeeds = false;
                    }
                }
                
                
                
           
                
                setText("#ndefText",'<p>Analizę funkcjonowania metody bisekcji przeprowadzimy biorąc pod uwagę równanie o postaci: $2x^3-x^2+1=0$. Dla ułatwienia rozważań sporządzono właściwy wykres (widoczny z lewej strony), natomiast odpowiednio punktami: niebieskim i czerwonym na osi $x$ zaznaczo przedział ufności $[a, b]$ jako [-1, 2]. Wartości te można odczytać poprzez najechanie kursorem na punkty. <br><br><p>Należy zwrócić uwagę, że dla prawidłowo przyjętego przedziału, wartości lewej cześci równania $f(x)=0$ dla $x=a$ oraz $x=b$ będą miały zawsze przeciwne znaki. To oznacza, że wtedy będzie spełniona nierówność: $f(a)f(b)<0$, która powinna być uwzględniona w konstrukcji algorytmu dla metody bisekcji. Jeżeli nierówność nie będzie spełniona, to oznacza, że zostały źle wprowadzone dane lub w przedziale $[a, b]$ nie ma pierwiastka.  <br><br> <p>Jak już wspomiano wcześniej, w metodzie bisekcji przedział ufności dzielony jest na połowę. W tym celu należy wprowadzić wartość $x=c={a+b \\over2}$ - punkt zielony na osi $x$, której odpowiada wartość $f(c)$ na osi pionowej.');
                
                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            }, 5000),
            new Step(function(back){
                
                
                
                
                setText("#ndefText", 'Patrząc na wykres i na zaznaczone na nim wartości zmiennych można zadać sobie następujace pytanie: co by było, gdyby przedział $[a, b]$ był tak przesunięty w lewą stronę, że po jego podzieleniu na połowę zmienna $x=c$ "trafiłaby" mniej bądź bardziej dokładnie w pierwistek równania ? <br> Odpowiedź wydaje się być oczywista - to oznaczałoby, że wartość $f(c)$ jest bliska zeru, a to z kolei pozwoliłoby na potraktowanie liczby $c$ jako przybliżenia szukanego pierwiastka. Na dobrą sprawę to samo może dotyczyć wartości $x=a$ lub $x=b$, które również mogą być bardzo blisko pierwiastka rzeczywistego. <br><p>Jednak zadajmy sobie jeszcze jedno pytanie - co to znaczy bardzo blisko? <br>Aby to rozstrzygnąć należy wprowadzić dodatkowe pojęcie - <b>dokładność obliczeń </b>$\\epsilon$. To własnie za pomocą tej zmiennej możemy sprecyzować tą "bliskość". Jeżeli przykładowo ustalimy, że interesuje nas znalezienie przybliżenia pierwiastka z dokładnością $\\epsilon$=0.001, to możemy rozważyć następującą nierówność: $|f(c)| \\le \\epsilon $. Istotnym jest w niej wprowadzenie wartości bezwzględnej, ponieważ nas interesuje, czy $f(c)$ jest bardzo małe, nieważne czy jest ono dodatnie czy ujemne. <br><br> Spróbujmy teraz wyjasnić istotę metody bisekcji - proszę wybrać <b>Dalej</b>.');
                
                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            }),
            new Step(function(back){
                
                if(back)
                {
                    i--;
                    p1.moveTo([roz[i].a, roz[i].wa]);
                    p2.moveTo([roz[i].b, roz[i].wb]);
                    p3.moveTo([roz[i].c, roz[i].wc]);
                    
                    pa.moveTo([roz[i].a, 0]);
                    pb.moveTo([roz[i].b, 0]);
                    pc.moveTo([roz[i].c, 0]);
                    zoomToPoints([p1, p2, p3], defbrd);
                }
                
                
                
                setText("#ndefText",'Mechanizmy obliczeń metody można ująć w algorytmie, którego opis słowny prezentowany jest poniżej: <br><ol>'
                +'<li>Wprowadź $f(x), a, b, \\epsilon$</li>' 
                +'<li>Sprawdź czy $f(a)f(b)<0$. Jeżeli nie, to wypisz komunikat "ZŁE DANE" i wróć do punktu 1</li>' 
                +'<li>Oblicz $c={a+b \\over2}$ oraz $f(c)$</li>' 
                +'<li>Sprawdź czy $|f(c)| \\le \\epsilon $ Jeżeli tak, to wypisz "Pierwiastek przybliżony ma wartość równą c", następnie zakończ algorytm</li>'
                +'<li>Oblicz $f(a)$, $f(b)$</li>'
                +'<li>Sprawdź czy znak $f(a)$ jest taki sam jak $f(c).$ Jeżeli tak, to wykonaj podstawienie: $a=c$. Jeżeli nie, to wykonaj podstawienie: $b=c$</li>'
                +'<li>Idź do punktu 3.</li></ol>' + '<br><p>Załóżmy, że do algorytmu zostały wprowadzone niezbedne dane z punktu 1.  Na podstawie wykresu wnioskujemy, że warunek z punktu 2 będzie spełniony, wobec tego w punkcie 3 zostanie wyliczone: $c={a+b \\over2}= {-1+2\\over2}={1\\over2}.$ Wartość tą można odczytać poprzez najechanie kursorem na punkt $c$. <br> Jeżeli do obliczeń przyjęto wartość $\\epsilon$=0.001, wówczas warunek w punkcie 4 nie będzie spełniony i dlatego w dalszej kolejności wykonają się punkty 5, 6 oraz 7. Aby zaobserwować na wykresie, jak wpłynie to na wartości odpowiednich zmiennych należy wybrać <b> Dalej</b>. ')
               
                
                
                
                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            }),
            new Step(function(back){
                
                if(!back)
                    i++;
                else
                    i--;
                
                
               
                
               if(back){
                    p1.moveTo([roz[i-1].a, roz[i-1].wa]);
                    p2.moveTo([roz[i-1].b, roz[i-1].wb]);
                    p3.moveTo([roz[i-1].c, roz[i-1].wc]);
                    zoomToPoints([p1, p2, p3], defbrd);
                    p1.moveTo([roz[i].a, roz[i].wa]);
                    p2.moveTo([roz[i].b, roz[i].wb]);
                    p3.moveTo([roz[i].c, roz[i].wc]);
                  
                   pa.moveTo([roz[i].a, 0]);
                    pb.moveTo([roz[i].b, 0]);
                    pc.moveTo([roz[i].c, 0]);
               }
                else{
                    p1.moveTo([roz[i].a, roz[i].wa]);
                    p2.moveTo([roz[i].b, roz[i].wb]);
                    p3.moveTo([roz[i].c, roz[i].wc]);
                    pa.moveTo([roz[i].a, 0]);
                    pb.moveTo([roz[i].b, 0]);
                    pc.moveTo([roz[i].c, 0]);
                }
                
                setText("#ndefText", "Jeżeli przyglądnąć się poprzedniemu wykresowi (wybierz <b>Wstecz</b>) to można zauważyć, że badany warunek w punkcie 6 nie jest spełniony, ponieważ wartość $f(a)$ jest ujemna, zaś $f(c)$ jest dodatnia. Zatem zgodnie z algorytmem wykonane zostanie podstawienie: $b=c$, dzięki temu otrzymamy nową wartość $b$ oraz nową wartość $c$ równe odpowiednio: $b={1\\over2}$,  $c={" + roz[i].a.toFixed(2) + "+" + roz[i].b.toFixed(2) + "\\over2}=" + roz[i].c.toFixed(2) +"$" + ".</br></br> W ten sposób dalasze obliczenia zostały sprowadzone do nowego - mniejszego o połowę  - przedziału $[a, b]$ wraz z nową wartością środka $c$. Należy zauważyć, że również tym razem znaki wartości $f(a)$ oraz $f(c)$ są różne. Ponadto $|f$(-0.25$)|>\\epsilon$ więc warunek z punktu 4 jest niespełniony i obliczenia bedą kontynuowane - wybierz <b>Dalej</b>.");
                
                
                
                
                
                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            }, 5000),
            new Step(function(back){
                if(!back)
                    i++;
                else
                    i--;
                
                p1.moveTo([roz[i].a, roz[i].wa]);
                p2.moveTo([roz[i].b, roz[i].wb]);
                p3.moveTo([roz[i].c, roz[i].wc]);
                pa.moveTo([roz[i].a, 0]);
                pb.moveTo([roz[i].b, 0]);
                pc.moveTo([roz[i].c, 0]);
                
                zoomToPoints([p1, p2, p3], defbrd);
                defbrd.zoomIn(p1.X(), p1.Y());
                
                setText("#ndefText",'W wyniku wykonania się punktów 6, 7 oraz 3 został wyznaczony nowy przedział $[a, b]$ oraz obliczony jego środek jako: </br></br>$c={' + roz[i].a.toFixed(2) + "+(" + roz[i].b.toFixed(2) + ")\\over2}=" + roz[i].c.toFixed(2) + "$</br></br>Na wykresie widać wyraźnie, iż nowa wartość $c$ zbliżyła się do pierwiastka, jednak nie na tyle, aby zapewnić warunek z punktu 4. <br> W dalszym ciagu ")
                .append('$f(a)$ i $f(c)$ mają różne znaki, więc nastąpi podstawienie: $b=c$.</br></br> Wyniki kolejnych obliczeń można zaobserwować wybierając <b>Dalej</b>');
                
                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            }, 5000),
            
            new Step(function(back){
                if(!back)
                    i++;
                else
                    i--;
                
                
                p1.moveTo([roz[i].a, roz[i].wa]);
                p2.moveTo([roz[i].b, roz[i].wb]);
                p3.moveTo([roz[i].c, roz[i].wc]);
                pa.moveTo([roz[i].a, 0]);
                pb.moveTo([roz[i].b, 0]);
                pc.moveTo([roz[i].c, 0]);
                
                zoomToPoints([p1, p2, p3], defbrd, false);

                setText("#ndefText", "Algorytm kolejny raz wyznaczył nową wartość $c$ jako: </br><br>$c={" + roz[i].a.toFixed(2) + "+(" + roz[i].b.toFixed(2) + ")\\over2}=" + roz[i].c.toFixed(2) + "$</br>" +
                       "<br>Tym razem wartości $f(a)$ i $f(c)$ mają jednakowe znaki, więc nowy przedział zostanie wyznaczony w oparciu o podstawienie: $a=c$.</br></br><p><p>");
                
                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            }, 5000),
            new Step(function(back){
                i++;
                var a = len - 1;
                
                p1.moveTo([roz[a].a, roz[a].wa]);
                p2.moveTo([roz[a].b, roz[a].wb]);
                p3.moveTo([roz[a].c, roz[a].wc]);
                pa.moveTo([roz[a].a, 0]);
                pb.moveTo([roz[a].b, 0]);
                pc.moveTo([roz[a].c, 0]);
                zoomToPoints([p1, p2, p3], defbrd, false);
                
                
                
                
                
                setText("#ndefText", '<p>Systematyczna realizacja tego typu obliczeń doprowadzi do sytuacji jak na rysunku obok, w której zostanie spełniony warunek zakończenia algorytmu z punktu 4. W przypadku analizowanego równania oraz przyjętej wartości $\\epsilon$ nastąpi to po 10 cyklach obliczeniowych. Wtedy to:')
                .append("$|f(c)|=" + roz[a].wc.toFixed(6) +  "$, czyli spełniony jest warunek: ")
                .append("$|f(c)| \\le 0.001$. </br><br>")
                .append('Środek przedziału, a zarazem przybliżony pierwiastek analizowanego równania osiaga wartość $c={' + roz[a].a.toFixed(2) + "+(" + roz[a].b.toFixed(2) + ")\\over2}=" + roz[a].c.toFixed(4) + "$.</br>")
                 .append('<br><p>Powyższa analiza metody bisekcji pokazuje, iż pierwotny przedział ufności $[a, b]$ jest w każdym cyklu obliczeniowym zmniejszany o połowę w ten sposób, że tworzone nowe przedziały "zacieśniają się" coraz bardziej wokół pierwiastka rzeczywistego. <br>Tą cechę metody można zaobserwować wyraźnie podczas animacji, która dostępna jest poprzez kliknięcie na poniższy link.')   
                .append('</br><a id="showAn" style="cursor: pointer;">Kliknij, aby uruchomić animację  </a>')
                .append("<br><br><p>W niniejszym serwisie przewidziano dodatkowo możliwość rozwiązywania równań nieliniowych za pomocą metody bisekcji. <br> W tym celu należy wybrać opcję <b>Rozwiąż równanie.</b>")
                
                $("#showAn").click(function(){
                    $('#contCol').scrollTo("#animacja", 1000);
                });
                
                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            }, 5000)
        ];
        
        stepAnim = new StepAnim(null, anim);
        
        
        
        a = addPoint2(roz[0].a, roz[0].wa, {name: "f(a)"});
        b = addPoint2(roz[0].b, roz[0].wb, {name: "f(b)"});
        c = addPoint2(roz[0].c, roz[0].wc, {fillColor: "green", strokeColor: "green", name: "f(c)"});
        a1 = addPoint2(roz[0].a, 0, {name: "a"});
        b2 = addPoint2(roz[0].b, 0, {name: "b"});
        c3 = addPoint2(roz[0].c, 0, {name: "c", fillColor: "green", strokeColor: "green"});
     
        
        zoomToPoints([a,b,c], defbrd2)
        
        animRoz = roz;
        
        $scope.rozwStep = false;
        bar = LBAR.create("bar1", anim.length);
        bar.set(1);
        stepAnim.nextStep();
       
        
        $(".rozwStep").hide(0);
        $("#prev").hide(); 
    };
    
    function setText(el, text)
    {
        $(el).removeClass("animated " + a_text);
        $(el).show().addClass("animated " + a_text).html(text);
        return $(el);
    }
    
    function addPoint(x,y, attr)
    {
        return defbrd.create("point", [x,y], attr);
    }
    
    function addPoint2(x,y,attr)
    {
        return defbrd2.create("point", [x,y], attr);
    }
    
    
    $scope.$on("$viewContentLoaded", start);
    $scope.$on('$destroy', function(){
        clearInterval(animation);
        $menuHide.clear();
    });
});