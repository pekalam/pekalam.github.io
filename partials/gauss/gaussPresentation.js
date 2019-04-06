/*jshint latedef: true */

var def_anim = "fadeIn";

var stepAnim;

function start(){
  
    var anim = [
        new Step(function(back){
        
        var g1 = '$$\\begin{cases}\\begin{align} a_{11}x_1 + a_{12}x_2 + {...} + a_{1n}x_n = b_1\\\\a_{21}x_1 + a_{22}x_2 + {...} + a_{2n}x_n = b_2\\\\{...............................}\\\\a_{n1}x_1 + a_{n2}x_2 + {...} + a_{nn}x_n = b_n \\end{align}\\end{cases} \\quad \\quad\\quad (1)$$';
        
        setText("#gaussText",'W szkole średniej uczymy się podstawowych metod rozwiązywania układów równań. W zadaniach rozważamy zwykle układy równań liniowych      z dwiema niewiadomymi. Posługiwanie się poznanymi metodami, np. metodą podstawiania czy też metodą wyznacznikową nie powinno dla nas stanowić większych trudności. Jednak inaczej jest wtedy, kiedy mamy do czynienia z układami z dużo wiekszą ilością równań i niewiadomych. <br> <p>Okazuje się, że tego typu skomplikowane układy równań tworzone są między innymi przez projektantów, konstruktorów i inżynierów różnych dziedzin i specjalności. Realizują oni często projekty, które uwzględniają wiele powiązanych ze sobą wielkości, tworzących rozbudowane układy wielu równań z wieloma niewiadomymi. W takich przypadkach uzyskanie rozwiązania tradycyjnymi metodami "na kartce papieru" staje się żmudne i czasochłonne. Stąd też niezwykle pomocnym może być zastosowanie programów komputerowych, które bardzo często wykorzystują metodę numeryczną zwaną <b>metodą eliminacji Gaussa</b>. Można nią rozwiązać układy składające się np. z kilkunastu, kilkudziesięciu lub więcej równań. <br> <p>W niniejszym serwisie skupiono sie na układach $n$-równań z $n$-niewiadomymi, dla których zapis ogólny można przedstawić w następującej postaci:', {"text-indent": "1.5em", "margin-top": "20px"}).append('<p id="gaussCont">' + g1 + "</p>")
            .append('gdzie: $x_1{...}x_n$ oznaczają niewiadome, $a_{11}{...}a_{nn}$ - współczynniki przy niewiadomych, zaś $b_1{...}b_n$ to wyrazy wolne. ');
        
         MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            
        }, 2000),
        new Step(function(back){
            
            
        
            
            var mat = "$$\\begin{bmatrix}a_{11} & a_{12} & {...} & a_{1n}\\\\a_{21} & a_{22} & {...} & a_{2n}\\\\{...} & {...} & {...} & {...}\\\\a_{n1} & a_{n2} & {...} & a_{nn}\\end{bmatrix}\\cdot \\begin{bmatrix}x_1\\\\x_2 \\\\ {...} \\\\x_n \\end{bmatrix}=\\begin{bmatrix}b_1\\\\b_2 \\\\ {...} \\\\b_n \\end{bmatrix} \\quad  (2)$$";
            
            
    

            
            setText("#gaussText", "Układ równań (1) daje się również zapisać w formie macierzowej jako: $\\mathbf A \\cdot \\mathbf x = \\mathbf b$, czyli:")
            .append('<p id="gaussCont">' + mat + "</p>")
            .append(" gdzie $\\mathbf A$ to macierz współczynników, $\\mathbf x$ - macierz niewiadomych, $\\mathbf b$ - macierz wyrazów wolnych.<br><br><p>Analizując zapis macierzowy można zauważyć, iż stosując znane nam zasady mnożenia macierzy łatwo otrzymamy układ w postaci (1). Ponadto, zapis ten jest istotny z punktu widzenia badania istnienia rozwiązania układu równań. Jak wiadomo, układ może być sprzeczny, może mieć nieskończenie wiele rozwiązań (układ nieoznaczony) lub może mieć dokładnie jedno rozwiązanie (układ oznaczony). Nas interesuje przede wszystkim ten ostatni przypadek, zatem jeżeli zamierzamy rozwiązywać układ równań na komputerze, to należy na wstępie poddać go badaniu pod tym kątem. Do tego celu pomocne jest twierdzenie szwajcarskiego matematyka Gabriela Cramera w którym dowiódł on, że <b> układ oznaczony</b> to taki, dla którego wartość wyznacznika macierzy współczynników $\\mathbf A$ jest różna od zera. Można to zapisać za pomocą następującej formuły:")
            .append('<p id="" class="text-center">' + "$\\det (\\mathbf A)\\neq 0 \\quad\\quad\\quad(3)$" + '</p>')
            .append(" W niniejszym serwisie dokonano implementacji metody Gaussa z jednoczesnym badaniem układów równań pod kątem spełnienia zależności (3). " )

            
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            
        }, 2000),
        new Step(function(back){
            
            if(back)
            {
                $("#leftCol").removeClass("col-md-7").addClass("col-md-12");
                $("#rightCol").hide()
            }
            
                
            var g1 = '$\\begin{cases}\\begin{align} a_{11}x_1 + a_{12}x_2 + {...} + a_{1n}x_n = b_1\\\\ a_{21}x_1 + a_{22}x_2 + {...} + a_{2n}x_n = b_2\\\\{...............................}\\\\ a_{n1}x_1 + a_{n2}x_2 + {...} + a_{nn}x_n = b_n \\end{align}\\end{cases} \\iff$';
            
            
            
            var g2 = '$\\begin{cases}\\begin{align} a_{11}x_1 + a_{12}x_2 + {...} + a_{1n}x_n = b_1\\\\ a_{22}&#39x_2 + {...} + a_{2n}&#39x_n = b_2&#39\\\\ {...............................} \\\\ a_{nn}&#39x_n = b_n&#39 \\end{align}\\end{cases} \\quad \\quad (4)$';
            
            g1 += g2;
            
            setText("#gaussText", ' Istotą metody elimninacji Gaussa jest systematyczna realizacja pewnych stosunkowo prostych przekształceń  w taki sposób, aby  w ostateczności układ pierwotny (1) doprowadzić do postaci równorzędnej, w której $n$-te równanie jest równaniem z jedną niewiadomą: ')
            .append('<p id="gaussCont" class="text-center">' + g1 + '</p>')
            .append(' Biorąc pod uwagę przyjęte oznaczenia w prawej części (4) możemy stwierdzić, że ostatnie równanie układu przekształconego (równanie $n$) jest równaniem z jedną niewiadomą ${x_n}$. Mówimy wtedy, że ta zmienna została <b>wyizolowana</b>, zaś jej wartość może być z tego równania bardzo łatwo obliczona. Z kolei równanie przedostatnie  (równanie $n-1$) w układzie przekształconym będzie zawierać dwie niewiadome, tj ${x_n}$ oraz $x_{n-1}$, przy czym wartość pierwszej z nich może być wcześniej obliczona z równania ostatniego. Zatem zmienna $x_{n-1}$ daje się również łatwo obliczyć z równania $n-1$. <br><br><p>Postępując systematycznie w ten sposób można wyznaczyć wszystkie niewiadome układu równań. Ten proces obliczeniowy nazwany został <b>podstawianiem wstecz</b>. Jak widać, jest on możliwy dzięki uprzedniej eliminacji odpowiednich zmiennych z poszczególnych równań - stąd właśnie pochodzi nazwa metody. Aby zobaczyć szczegółowy schemat obliczeń procesu eliminacji należy wybrać <b>Dalej</b>.')
            
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            
            
            
        }, 2000),
        
        /////****************************************** FAZA 1 **************************
        
        
        new Step(function(back){
             
                    $("#leftCol").removeClass("col-md-12").addClass("col-md-7");
                    $("#rightCol").show();
                   
              
              
                     var g1 = '$$\\begin{cases}\\begin{align} \\color{firebrick}a_{11}x_1 + a_{12}x_2 + a_{13}x_3 + a_{14}x_4 = b_1\\\\a_{21}x_1 + a_{22}x_2 + a_{23}x_3 + a_{24}x_4 = b_2\\\\a_{31}x_1 + a_{32}x_2 + a_{33}x_3 + a_{34}x_4 = b_3\\\\ a_{41}x_1 + a_{42}x_2 + a_{43}x_3 + a_{44}x_4 = b_4 \\end{align}\\end{cases}$$';
            
                  
                    
                     setText("#gaussText",'<p>Pierwotny układ równań: ', {"line-height": "25px", "text-indent": "1.0em"})
                    .append('<p id="gaussContB">' + g1 + "</p>")
                
                     
                     
                    setText("#rText",'<p>Przebieg obliczeń związanych z eliminacją niewiadomych zostanie przedstawiony dla przypadku układu czterech równań, czyli kiedy $n$=4. Jest oczywiste, że dla większego $n$ idea obliczeń nie ulega zmianie. <br>Proces eliminacji przedstawiono w poszczególnych fazach obliczeniowych. ', {"line-height": "25px", "text-indent": "0.50em"})
                    .append('</br><b>Faza 1 - eliminacja niewiadomej $x_1$</b><br><br><p>Traktujemy równanie pierwsze jako tzw. równanie bazowe (kolor czerwony). Nastepnie od każdego  $i$-tego równania odejmujemy równanie bazowe, pomnożone przez współczynnik $m={a_{i1}\\over a_{11}}$, przy czym $i$ zmienia się jako: $i=2,3,4$. <br><p> Wybierając <b>Dalej</b> można śledzić poszczególne kroki obliczeniowe fazy 1, aż do wyeliminowania zmiennej $x_1$.');

                    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                    
                
                }),
                
                new Step(function(back){
                    
                    var r1 = '$$\\begin{cases}\\begin{align} \\color{firebrick}a_{11}x_1 + a_{12}x_2 + a_{13}x_3 + a_{14}x_4 = b_1\\\\ \\color{midnightblue}a_{21}x_1 + a_{22}x_2 + a_{23}x_3 + a_{24}x_4 = b_2\\\\a_{31}x_1 + a_{32}x_2 + a_{33}x_3 + a_{34}x_4 = b_3\\\\ a_{41}x_1 + a_{42}x_2 + a_{43}x_3 + a_{44}x_4 = b_4 \\end{align}\\end{cases}$$';
                    setText("#gaussText", '<p id="gaussContB">' + r1 + "</p>")
                    setText("#rText",'Mnożymy <span class="atred">równanie bazowe</span> przez $m = {a_{21}\\over a_{11}}$.  Następnie odejmujemy je od <span class="atblue">równanie drugiego</span>. W wyniku tych działań <span class="atblue">równanie drugie</span> przybiera postać: $0 + a_{22}&#39x_2 + a_{23}&#39x_3 + a_{24}&#39x_4 = b_2&#39$');
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                    
                }),
               
                new Step(function(back){
                
                     var r1 = '$$\\begin{cases}\\begin{align} \\color{firebrick}a_{11}x_1 + a_{12}x_2 + a_{13}x_3 + a_{14}x_4 = b_1\\\\0 + a_{22}&#39x_2 + a_{23}&#39x_3 + a_{24}&#39x_4 = b_2&#39\\\\ \\color{midnightblue}a_{31}x_1 + a_{32}x_2 + a_{33}x_3 + a_{34}x_4 = b_3\\\\ a_{41}x_1 + a_{42}x_2 + a_{43}x_3 + a_{44}x_4 = b_4 \\end{align}\\end{cases}$$';
                    
                    setText("#gaussText", '<p id="gaussContB">' + r1 + "</p>")
                    setText("#rText",'Mnożymy <span class="atred">równanie bazowe</span> przez $m = {a_{31}\\over a_{11}}$. Następnie odejmujemy je od <span class="atblue">równania trzeciego</span>. W wyniku tych działań <span class="atblue">równanie trzecie</span> przybiera postać: $0 + a_{32}&#39x_2 + a_{33}&#39x_3 + a_{34}&#39x_4 = b_3&#39$');
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                }),
                new Step(function(back){
                
                     var r1 = '$$\\begin{cases}\\begin{align} \\color{firebrick}a_{11}x_1 + a_{12}x_2 + a_{13}x_3 + a_{14}x_4 = b_1\\\\0 + a_{22}&#39x_2 + a_{23}&#39x_3 + a_{24}&#39x_4 = b_2&#39\\\\ 0 + a_{32}&#39x_2 + a_{33}&#39x_3 + a_{34}&#39x_4 = b_3&#39\\\\ \\color{midnightblue}a_{41}x_1 + a_{42}x_2 + a_{43}x_3 + a_{44}x_4 = b_4 \\end{align}\\end{cases}$$';
                    
                    var r2 = '$$\\begin{cases}\\begin{align} a_{11}x_1 + a_{12}x_2 + a_{13}x_3 + a_{14}x_4 = b_1\\\\a_{22}&#39x_2 + a_{23}&#39x_3 + a_{24}&#39x_4 = b_2&#39\\\\a_{32}&#39x_2 + a_{33}&#39x_3 + a_{34}&#39x_4 = b_3&#39 \\\\a_{42}&#39x_2 + a_{43}&#39x_3 + a_{44}&#39x_4 = b_4&#39 \\end{align}\\end{cases} \\quad \\quad (5)$$';
                    
                    setText("#gaussText", '<p id="gaussContB">' + r1 + "</p>")
                    .append("Układ równań po eliminacji zmiennej $x_1$:</br>" + '<p id="gaussContB">' + r2 + "</p>");
                    setText("#rText",'Mnożymy <span class="atred">równanie bazowe</span> przez $m = {a_{41}\\over a_{11}}$.  Następnie odejmujemy je od <span class="atblue">równania czwartego</span>. W wyniku tych działań <span class="atblue">równanie czwarte</span> przybiera postać: $0 + a_{42}&#39x_2 + a_{43}&#39x_3 + a_{44}&#39x_4 = b_4&#39$</br></br>')
                    .append('Jak można zauważyć, obliczenia w ramach fazy 1 doprowadzą układ równań do nowej równoważnej formy (5), w której zmienna $x_1$ występuje jedynie w równaniu bazowym dla tej fazy. <br><br> Aby prześledzić przebieg obliczeń fazy 2 należy wybrać <b>Dalej</b>.')
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                }),
        
        ////KONIEC FAZY 1
        
        
        
        
        ////****************************************** FAZA 2 **************************
                new Step(function(back){
                
                    var r1 = '$$\\begin{cases}\\begin{align} a_{11}x_1 + a_{12}x_2 + a_{13}x_3 + a_{14}x_4 = b_1\\\\\\color{firebrick}a_{22}&#39x_2 + a_{23}&#39x_3 + a_{24}&#39x_4 = b_2&#39\\\\a_{32}&#39x_2 + a_{33}&#39x_3 + a_{34}&#39x_4 = b_3&#39 \\\\a_{42}&#39x_2 + a_{43}&#39x_3 + a_{44}&#39x_4 = b_4&#39 \\end{align}\\end{cases}$$';
              
                    setText("#gaussText", '<p id="gaussContB">' + r1 + "</p>")
                    setText("#rText",'<br><b>Faza 2 - eliminacja niewiadomej $x_2$</b>. <br><br><p>W tej fazie równaniem bazowym staje się równanie drugie (kolor czerowny) układu równań (5) uzyskanego z obliczeń fazy 1. Tym razem od każdego  $i$-tego równania odejmujemy równanie bazowe, pomnożone przez współczynnik $m={a_{i2}&#39\\over a_{22}&#39}$, przy czym $i$ zmienia się teraz jako: $i=3,4$. <br><p>Wybierając <b>Dalej</b> można śledzić poszczególne kroki obliczeniowe fazy 2, aż do wyeliminowania zmiennej $x_2$.');
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                }),
        
                new Step(function(back){
                    
                    var r1 = '$$\\begin{cases}\\begin{align} a_{11}x_1 + a_{12}x_2 + a_{13}x_3 + a_{14}x_4 = b_1\\\\\\color{firebrick}a_{22}&#39x_2 + a_{23}&#39x_3 + a_{24}&#39x_4 = b_2&#39\\\\\\color{midnightblue}a_{32}&#39x_2 + a_{33}&#39x_3 + a_{34}&#39x_4 = b_3&#39 \\\\a_{42}&#39x_2 + a_{43}&#39x_3 + a_{44}&#39x_4 = b_4&#39 \\end{align}\\end{cases}$$';
                    
                    setText("#gaussText", '<p id="gaussContB">' + r1 + "</p>")
                    setText("#rText", 'Mnożymy <span class="atred">równanie bazowe</span> przez $m = {a_{32}&#39\\over a_{22}&#39}$. Następnie odejmujemy je od <span class="atblue">równania trzeciego</span>. W wyniku tych działań <span class="atblue">równanie trzecie</span> przyjmie postać: $0 + 0 + a_{33}&#39&#39x_3 + a_{34}&#39&#39x_4 = b_3&#39&#39$');
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                }),
        
                new Step(function(back){
                
                     var r1 = '$$\\begin{cases}\\begin{align} a_{11}x_1 + a_{12}x_2 + a_{13}x_3 + a_{14}x_4 = b_1\\\\\\color{firebrick}0 + a_{22}&#39x_2 + a_{23}&#39x_3 + a_{24}&#39x_4 = b_2&#39\\\\0 + 0 + a_{33}&#39&#39x_3 + a_{34}&#39&#39x_4 = b_3&#39&#39 \\\\\\color{midnightblue}0 + a_{42}&#39x_2 + a_{43}&#39x_3 + a_{44}&#39x_4 = b_4&#39 \\end{align}\\end{cases}$$';
                    
                    var r2 = '$$\\begin{cases}\\begin{align} a_{11}x_1 + a_{12}x_2 + a_{13}x_3 + a_{14}x_4 = b_1\\\\a_{22}&#39x_2 + a_{23}&#39x_3 + a_{24}&#39x_4 = b_2&#39\\\\a_{33}&#39&#39x_3 + a_{34}&#39&#39x_4 = b_3&#39&#39 \\\\a_{43}&#39&#39x_3 + a_{44}&#39&#39x_4 = b_4&#39&#39 \\end{align}\\end{cases} \\quad \\quad (6)$$';
                    
                    
                    setText("#gaussText", '<p id="gaussContB">' + r1 + "</p>")
                    .append("Układ równań po eliminacji zmiennej $x_2$:</br>" + '<p id="gaussContB">' + r2 + "</p>");
                    setText("#rText",'Mnożymy <span class="atred">równanie bazowe</span> przez $m = {a_{42}&#39\\over a_{22}&#39}$. Następnie odejmujemy je od <span class="atblue">równania czwartego</span>. W wyniku tych działań <span class="atblue">równanie czwarte</span> przybiera postać: $0 + 0 + a_{43}&#39&#39x_3 + a_{44}&#39&#39x_4 = b_4&#39&#39$')
                .append('<br><br>Zatem obliczenia w ramach fazy 2 doprowadziły układ równań do kolejnej równoważnej formy, w której zmienna $x_2$ występuje w równaniu bazowym dla tej fazy oraz w równaniu pierwszym. <br><br> Aby prześledzić przebieg obliczeń fazy 3 należy wybrać <b>Dalej</b>.')
                    
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                }),
        
        
        ////KONIEC FAZY 2
        
        
        
        
        ///****************************************** FAZA 3 **************************
        
        
                
                new Step(function(back){
                
                    var r1 = '$$\\begin{cases}\\begin{align} a_{11}x_1 + a_{12}x_2 + a_{13}x_3 + a_{14}x_4 = b_1\\\\a_{22}&#39x_2 + a_{23}&#39x_3 + a_{24}&#39x_4 = b_2&#39\\\\\\color{firebrick}a_{33}&#39&#39x_3 + a_{34}&#39&#39x_4 = b_3&#39&#39 \\\\\\color{midnightblue}a_{43}&#39&#39x_3 + a_{44}&#39&#39x_4 = b_4&#39&#39 \\end{align}\\end{cases}$$';
                    
                    var r2 = '$$\\begin{cases}\\begin{align} a_{11}x_1 + a_{12}x_2 + a_{13}x_3 + a_{14}x_4 = b_1\\\\a_{22}&#39x_2 + a_{23}&#39x_3 + a_{24}&#39x_4 = b_2&#39\\\\a_{33}&#39&#39x_3 + a_{34}&#39&#39x_4 = b_3&#39&#39 \\\\a_{44}&#39&#39x_4 = b_4&#39&#39 \\end{align}\\end{cases} \\quad \\quad (7)$$';
              
                    setText("#gaussText", '<p id="gaussContB">' + r1 + "</p>")
                    .append('<p id="gaussContB">' + r2 + "</p>")
                    setText("#rText",'</br><b>Faza 3 - eliminacja niewiadomej $x_3$ </b></br></br>W tej fazie układem wyjściowym jest układ równań (6), zaś równaniem bazowym staje się <span class="atred">równanie trzecie</span>. Mnożymy <span class="atred">równanie bazowe</span> przez $m = {a_{43}&#39&#39\\over a_{33}&#39&#39}$, co oznacza, że index $i$ w tej fazie przyjmuje jedynie wartość $i=4$. Następnie odejmujemy je od <span class="atblue">równania czwartego</span>. W wyniku tych działań <span class="atblue">równanie czwarte</span> przyjmuje postać: $0 + 0 + 0 + a_{44}&#39&#39x_4 = b_4&#39&#39$')
                    .append('</br></br>Mając układ (7) z wyizolowanym pierwiastkiem $x_4$ możemy zrealizować wspomniane wcześniej obliczenia podstawiania wstecz i w ten sposób wyznaczyć wartości wszystkich niewiadomych. <br><br><p> Przedstawiona analiza obliczeń według metody Gaussa pozwala zauważyć pewne charakterystyczne prawidłowości, które można wykorzystać w implementacji docelowego algorytmu. W ramach niniejszego serwisu taki algorytm został opracowany, uwzględniając dodatkowo badanie układów równań pod kątem istnienia rozwiązania. Skuteczność metody można sprawdzić wybierając opcję <b>Rozwiąż układ równań</b>.')
                    
                    
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                })
        
    ];
    
    stepAnim = new StepAnim(null,anim);
    
    var bar1 = LBAR.create("#bar1", anim.length);
    

    
    var next = function(){
        stepAnim.nextStep();
        if(!stepAnim.hasNext())
            $("#next").hide();
        else if(stepAnim.hasPrevious())
        {
            $("#prev").show();
            $("#next").show();
        }
        bar1.set(stepAnim.current() + 1);
        toogleStepAnim(def_anim);
    };
    var prev = function(){
        stepAnim.previousStep();
        if(!stepAnim.hasPrevious())
            $("#prev").hide();
        else if(stepAnim.hasNext())
        {
            $("#prev").show();
            $("#next").show();
        }
       
        bar1.set(stepAnim.current() + 1);
        toogleStepAnim(def_anim);
    };
    
    $("#next").click(next);
    $("#prev").click(prev);
    
    
    next();
    bar1.set(1);
    $("#prev").hide();
}

$(document).ready(start);

function toogleStepAnim(anim)
{
 
    
    $("#gaussText").addClass(anim + " animated").one('animationend webkitAnimationEnd oAnimationEnd', function() {
        $("#gaussText").removeClass(anim + " animated");
    });
    $("#gaussCont").addClass(anim + " animated").one('animationend webkitAnimationEnd oAnimationEnd', function() {
        $("#gaussCont").removeClass(anim + " animated");
    });;
}

function setText(selector, str, styles)
{
    var el = $(selector);
    if(styles !== undefined)
        el.css(styles);
    el.show().html(str);
    return el;
}



function changeOnHover(element, changeElement, data, func){
    var $el = $(changeElement).clone();
    
    $(element).hover(function(){
        $(changeElement).empty().html(data);
        if(func !== undefined){func(false);}
    });
    $(element).mouseleave(function(){
        $(changeElement).replaceWith($el.clone());
        if(func !== undefined){func(true);}
    });
}



