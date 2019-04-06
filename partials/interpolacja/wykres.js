/*jshint latedef: true */

/*
var a_text = "flipInY";
var lines = [];
var funcgraph = null;

function startB(){
    brd = JXG.JSXGraph.initBoard('box',{
        axis:true,
        showNavigation: false,
        showCopyright: false,
        boundingbox: [-2, 10, 20, -2]

    });
    
    
    
    var points = [];
    drawPoints(points);
    var anim = false;
    
    
    
    var anims = [
    new Step(function(back){
        if(back)
        {
            lines.forEach(function(ob){
                brd.removeObject(ob);
            });
            lines = [];
        }
        setPoints(points, [[4.12, 4.09], [8.20, 1.66], [15, 3.40]]).then(function(){anim = false;});
        textAnim('Interpolacja jest to metoda numeryczna, która związana jest z obliczeniami zmierzającymi do znalezienia analitycznego zapisu (czyli wzoru) pewnej funkcji w przypadku, kiedy dany jest skończony zbiór jej wartości. Przykład takiegio zagadnienia jest prezentowany między innymi w podreczniku do fizyki dla drugich klas szkół ponadgimnazjalnych w zakresie rozszerzonym.</br>&nbsp&nbspW przykładzie tym rozważa się cieżarek zawieszony na spreżynie. Jak wiadomo, odchylenie tego obiektu od stanu równowagi (naciągniecie sprężyny), a następnie jego uwolnienie jest przyczyną ruchu ciężarka, który w pewnej chwili czasowej przechodzi przez położenie stanu równowagi.</br>&nbsp&nbspNastępnie rozważane są dwie wartości położenia obiektu, zarejestrowane za pomoca kamery tuż przed oraz po przejściu przez stan równowagi. Ponadto dla tych dwóch położeń zarejestrowano odpowiednie wartości czasu. Autorzy prezentują obliczenia pozwalające na podstawie zalezności analitycznej znaleść chwilę czasową, w której cieżarek przechodzi przez położenie równowagi.</br>&nbsp&nbspJest to zatem przykład zagadnienia interpolacji funkcji $f(x)=y$, gdzie $x$ reprezentuje położenie cieżarka, zaś $y$ to czas zmierzony w danym położeniu. Wartości uzyskane z pomiarów wyznaczają dwuelementowy zbiór wartości funkcji (czas) okreslonych dla dwóch zmiennych niezależnych (położenie). Na ich podstawie kreowana jest zależność analityczna, pozwalająca, obliczyć trzecią, nieznaną wartość funkcji y dla określonego x. Tego typu zagadnienia obliczeniowe mają ogromne znaczenie w rozwiązywaniu problemów z różnych dziedzin. Jednakże w zastosowaniach praktycznych najczęściej skala problmów jest dużo bardziej złozona niż w rozpatrywanym powyżej przykładzie, ponieważ początkowe zbiory danych wartości funkcji są większe. Wtedy problem interpolacji sprowadza się przede wszystkim do przyjęcia odpowiedniej klasy oraz postaci funkcji y=f(x). Bardzo często zakłada sie, że poszukiwana funkcja bedzie miała postac wielomianu - stąd nazwa interpolacji wielomianowej.   ', {"text-indent": "0.50em"});
        
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }, 5000),
    new Step(function(back){
        if(back)
        {
            if(funcgraph != null)
             brd.removeObject(funcgraph); 
        }
        slowLines(points).then(function(){anim = false;});
        textAnim("Interpolacja jest często stosowana w naukach doświadczalnych, gdzie dysponuje się zazwyczaj skończoną liczbą danych do określenia zależności między wielkościami.Zgodnie z twierdzeniem Weierstrassa dowolną funkcję");
        
            var r1 = "$$\\begin{cases}\\begin{align} a_3*" + Math.round(points[1].X()) + "^3" + "+a_2*" + Math.round(points[1].X()) + "^2" + "+a_1*" + Math.round(points[1].X()) + "^1+" + "2=" + Math.round(points[1].Y()) + "\\\\" +
        "a_3*" + Math.round(points[2].X()) + "^3" + "+a_2*" + Math.round(points[2].X()) + "^2" + "+a_1*" + Math.round(points[2].X()) + "^1+" + "2=" + Math.round(points[2].Y()) + "\\\\" +
        "a_3*" + Math.round(points[3].X()) + "^3" + "+a_2*" + Math.round(points[3].X()) + "^2" + "+a_1*" + Math.round(points[3].X()) + "^1+" + "2=" + Math.round(points[3].Y()) + "\\end{align}\\end{cases}$$"; 
        
        $("#r1").html(r1);
        
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }, 5000)
];
    
    var stepAnim = new StepAnim("#text", anims);
    
    
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

    });
    
    $("#prev").click(function(){
        if(anim){return;}
       // anim = true;
        stepAnim.previousStep();
    });
    
    stepAnim.nextStep();

};

$(document).ready(function(){
    startB();
});


function resetBoard(board){
    JXG.JSXGraph.freeBoard(board);
    brd = JXG.JSXGraph.initBoard('box',{
        axis:true,
        showNavigation: false,
        showCopyright: false,
        boundingbox: [-2, 10, 20, -2]

    });
    
};

function drawPoints(points)
{
        var startY = 2;
      for(var i = 0; i < 4; i++)
    {
       points.push(brd.create('point', [i + (4 * i), startY], {name: ""}));   
    }
}

function randomizePoints(points)
{
    var promise = new Promise(function(resolve, reject){
        var len = points.length;
    for(var i = 1; i < len; i++)
    {
        var x = Math.floor(Math.random() * 5) + points[i].X();
        var y = Math.floor(Math.random() * 6) + points[i].Y();
        if(i == len - 1)  
         points[i].moveTo([x,y], 2000, {effect: "--",
                                           callback: function()
                                           {
                                            resolve();   
                                           }
                                          });
        else
          points[i].moveTo([x,y], 2000, {effect: "--"});
    }
    });
    return promise;
}

function setPoints(points, xyarr)
{
    var promise = new Promise(function(resolve, reject){
        var len = points.length;
    for(var i = 1; i < len; i++)
    {
        var x = xyarr[i-1][0];
        var y = xyarr[i-1][1];
        if(i == len - 1)  
         points[i].moveTo([x,y], 2000, {effect: "--",
                                           callback: function()
                                           {
                                            resolve();   
                                           }
                                          });
        else
          points[i].moveTo([x,y], 2000, {effect: "--"});
    }
    });
    return promise;
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

function elementBlink(el, color, delay, t)
{
    if(t  % 2 == 0){t = t + 1;}
    var f = el.getAttribute("strokeColor");

    el.setAttribute({
     fillColor: color
    });   
    
    var n = false;
    
    for(var i = 0; i < t; i++)
    {
        console.log(delay * (i + 1));
        n = !n;
        if(n)
        {
        setTimeout(function(){
            el.setAttribute({
            fillColor: f
            });
          
            }, delay * (i + 1));
        }
        else
        {
            setTimeout(function(){
            el.setAttribute({
            fillColor: color
            });
            }, delay * (i + 1));
        }
    }
}
*/


