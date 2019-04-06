
app.controller('GaussExampleController', function($scope, $title, $state, $subTitle, $menuHide){
    
    $title.setTitle("Metoda eliminacji Gaussa");
    $subTitle.setTitle("Metoda eliminacji Gaussa");
    
    $menuHide.clear();
    
    $scope.$emit("sideCont", [
        {
            name: "Charakterystyka metody", 
            click: function(){
                if($("#bcharakterystykametody").hasClass("sidebSelected"))
                    return;
                $('#contCol').animate({
                    scrollTop: $("#charakterystykametody").offset().top
                }, 1000);
            }, 
            showCircle: true,
            contentID: "charakterystykametody"
        },
        {
            name: "Rozwiąż układ równań", click: function(){
                if($("#brozwiazukladrownan").hasClass("sidebSelected"))
                    return;
                $('#contCol').animate({
                    scrollTop: $("#rozwiazukladrownan").offset().top
                }, 1000);
              
            }, 
            showCircle: true,
            contentID: "rozwiazukladrownan"
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
    
    $scope.eqSize = 3;  
    $scope.round = function(i){return Math.roundTo4(i)}  
    $scope.getNumber = function(s){ return new Array(s); };
    $scope.matdet = 0;

    this.solved = false;
    this.hasSolution = false;
    this.solution = [];
    
    var a_text = "flash"
    
    var stepAnim = null;
     
    this.addEq = function(){ 
        if($scope.eqSize == 7){return;}
        $scope.eqSize++; 
        drawEq();
    };
    this.remEq = function(){ 
        if($scope.eqSize == 3){return;} $scope.eqSize--; 
        drawEq();
    };
    
    function drawEq(){
        
        var html = '<table>';
        var len = $scope.eqSize;
        
        for(var i = 0; i < len; i++)
        {           
            html += '<tr><td style="white-space: nowrap;">';
            for(var a = 1; a <= len; a++)
            {
                if(a != len)
                    html += '<input style="display: inline;" class="eqInput" type="text"/>'+
                    '<span style="display: inline; position: relative; top: 0px;" class="htmlMath">x<sub>' + a + '</sub>&nbsp;&nbsp;+&nbsp;</span>';
                else{
                    html += '<input style="display: inline;" class="eqInput" size="4" type="text"/>'
                    + '<span style="display: inline; position: relative; top: 0px;" class="htmlMath">x<sub>' + a + '</sub>&nbsp;&nbsp;=&nbsp;</span>'
                    + '<input style="display: inline; clear: both;" class="eqInput" type="text"/>';
                }
            }
            html += "</td></tr>"
        }
        html += "</table>"
        
        $("#eqContainer").html(html);
        
    }
    
    
    
    
    this.clear = function(){
        
        var eqs = $(".eqInput");
        $.each(eqs, function(i, obj){
             $(obj).val("");
        });
               
        $("#exampleWell").css("min-height", "");
        this.solved = false;
        $("#solveError").empty();
    };
    this.random = function(){
             var eqs = $(".eqInput");
        $.each(eqs, function(i, obj){
             $(obj).val(Math.floor((Math.random() * 41) - 20));
        }
    )};
    this.solve = function(){
        var geq = [];
        
        var eqs = $(".eqInput");
        
        var eq = [];
        var original = [];
        
        var a = 0;
        
        $.each(eqs, function(i, obj){
            
            if(a != $scope.eqSize)
            {
                var val = $(obj).val().replace(/,/g, ".");;
                eq.push(Number(val));
                a++;
                
            }
            else
            {
                var val = $(obj).val().replace(/,/g, ".");
                eq.push(Number(val));
                geq.push(eq); 
                original.push(eq.slice());
                a = 0;
                eq = [];
            }
        });
            
        
        var gauss = new Gauss2();
        
        var sol = gauss.solve(geq);
        var det = gauss.matdet;
        
        for(var i = 0; i < sol.length; i++)
        {
            if(isNaN(sol[i]))
            {
                if(det == 0)
                {
                textAnim("#solveError", "Podany układ równań nie jest układem oznaczonym !");
                }
                else
                {
                    textAnim("#solveError", "Podany układ równań posiada rozwiązanie, lecz obecna kolejność równań powoduje dzielenie przez 0. Proszę zmienić kolejność odpowiednich równań.");
                }
                
                
                this.solved = false;
                $("#exampleWell").css("min-height", "");
                return;
            }
        }
        
        $scope.matdet = det;
       
        
        this.solution = sol.reverse();
        
        showSol(gauss.wyn(), original, gauss.wsp());
        
        $("#solveError").empty();
        this.solved = true;
         $("#prev2").hide();
        
        
    };
    this.next = function(){
        if(stepAnim == null){return;} 
        stepAnim.nextStep();
        if(!stepAnim.hasNext())
            $("#next2").hide();
        else if(stepAnim.hasPrevious())
        {
            $("#prev2").show();
            $("#next2").show();
        }
    }
    this.previous = function(){
        if(stepAnim == null){return;} 
        stepAnim.previousStep();
        if(!stepAnim.hasPrevious())
            $("#prev2").hide();
        else if(stepAnim.hasNext())
        {
            $("#prev2").show();
            $("#next2").show();
        }
    }
    
    var showSol = function(arr, org, wsp){
        
        var i1 = 0;
        var i = 1;
        
        var l = 0;
        
        var anim = [];
        
        var lastX = $scope.eqSize;
        
        var len = arr.length;
        var olen = org.length;
        
        var text = [];
        
        
        var eq = "$$\\begin{cases}\\begin{align}";
            
        for(var c = 0; c < olen; c++)
        {
            if(c == 0)
            {
                eq += eqToHtml(org[c], c+1, "firebrick") + "\\\\";
                continue;
            }
            if(c == 1)
            {
                eq += eqToHtml(org[c], c+1, "midnightblue") + "\\\\";
                continue;
            }
            eq += eqToHtml(org[c], c+1) + "\\\\";
        }
        
        eq += "\\end{align}\\end{cases}$$"; 
        
        text.push(eq);
        
        var ri = 2;
        var ri1 = 0;
        
        for(var a = 0; a < len; a++)
        {
            var eq2 = "$$\\begin{cases}\\begin{align}";
            
            for(var c = 0; c < org.length; c++)
            {
                if(c == ri1 && c != olen - 1)
                {
                    //$("#eqShow").append(eqToHtml(org[c]) + " PIERWSZE" + "<br/>");
                    
                    eq2 += eqToHtml(org[c], c+1, "firebrick") + "\\\\";
              
                    
                    continue;
                }
                if(c == i)
                {
                   // $("#eqShow").append(eqToHtml(arr[l]) + " OBECNE " + "wsp: " + wsp[l] + "<br/>");
                    org[c] = arr[l];
                    
                    if(ri1 == olen - 2 && c == olen -1)
                        eq2 += eqToHtml(org[c], c+1, "midnightblue") + " \\\\";
                    else                    
                        eq2 += eqToHtml(arr[l], c+1) + " \\\\";

                    l++;
                    continue;
                }
                if(c == ri)
                {
                    eq2 += eqToHtml(org[c], c+1, "midnightblue") + " \\\\";
                    continue;
                }

                eq2 += eqToHtml(org[c], c+1) + " \\\\";
                   // $("#eqShow").append(eqToHtml(org[c]) + "<br/>");
            }
            
            eq2 += " \\end{align}\\end{cases}$$";
  
            text.push(eq2);
            
            i++;
            ri++;
            if(i == olen)
            {
                i1 ++;
                i = i1 + 1;
            }
            if(ri == olen)
            {
                ri1++;
                ri = ri1 + 1;
                if(ri == olen){ri--;}
            }
        }

        var a = 0;
        var eqIndex = 1;
        
        for(var o = 0; o < text.length; o++)
        {
            if(eqIndex == this.eqSize)
            {
                eqIndex = 1;
            }
            
            if(o == text.length - 1)
            {
                ///ostatnie - rozwiazane
                var f = function(back, data){
                    $("#eqShow").html(data);
                    
                    var text = "Mając postać z wyizolowanym pierwiastkiem $x_" + lastX + "$ możemy zrealizować proces podstawiania wstecz wstawiając $x_" + lastX + "$ do równania drugiego obliczając w ten sposób $x_" + (lastX-1) + "$" + ". Powtarzając ten proces dla kolejnych obliczanych pierwiastków obliczymy wartości wszystkich niewiadomych.";
                    $("#eqSolText").empty().html(text);
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                    
                };  
                var step = new Step(f, 3000, text[o]);
                anim.push(step);
            }
            else{
                var m = wsp[a];
                var txt = "Mnożymy równanie bazowe przez $m=" + m + "$. Następnie odejmujemy je od równania niebieskiego. W wyniku tych działań równanie niebieskie przyjmuje postać: $" + eqToHtml(arr[o], eqIndex) + "$";
                
                var f = function(back, data){
                    $("#eqShow").html(data.eq);
                    $("#eqSolText").empty().html(data.txt);
                    
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub, function(){
                        var h = $("#exampleWell").outerHeight();
                      
                        $("#exampleWell").css("min-height", h);
                    }]);
                };  
                var step = new Step(f, 3000, {'eq': text[o], 'txt': txt});
                anim.push(step);
                
                a++;
            }
            
            eqIndex++;
        }
        
        
        stepAnim = new StepAnim(null, anim);
        
        stepAnim.nextStep();
    };
    
    var eqToHtml = function(arr, num, color){
        var ret = "";
        var len = arr.length;
        var n = 0;
        if(num !== undefined){n = num;}
        if(color !== undefined)
        {
                ret += "\\color{" + color + "}";
        }
        
        for(var i = 0; i < len - 1; i++)
        {
            var val = $scope.round(arr[i]);
            
            if(i == len - 2)
            {
                if(val < 0)
                {
                    val = "(" + val + ")";
                }
                if(val != 0)          
                    ret += val + "x_" + (i+1) + " = ";
                else
                    ret += val + " = ";
            }
                
            else
            {
                if(val < 0 && i != 0)
                {
                    val = "(" + val + ")";
                }
                if(val != 0)   
                    ret += val + "x_" + (i+1) + " + ";
                else
                    ret += val + " + ";
            }
                
        }
        ret += $scope.round(arr[i]);
        
        return ret;
    };
    
    $scope.repEnd = function(){MathJax.Hub.Queue(["Typeset",MathJax.Hub]);};
    
    function textAnim(id,str, styles)
    {
        $(id).empty();
        $(id).removeClass("animated " + a_text);
        if(styles !== undefined)
            $(id).css(styles);
        $(id).show().addClass("animated " + a_text).html(str);
        
    }

    
    drawEq();
    
});