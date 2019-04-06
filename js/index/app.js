/*jshint latedef: true */
String.prototype.removePolish = function()
{
    return this.replace(/ą/g, 'a').replace(/Ą/g, 'A')
        .replace(/ć/g, 'c').replace(/Ć/g, 'C')
        .replace(/ę/g, 'e').replace(/Ę/g, 'E')
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .replace(/ń/g, 'n').replace(/Ń/g, 'N')
        .replace(/ó/g, 'o').replace(/Ó/g, 'O')
        .replace(/ś/g, 's').replace(/Ś/g, 'S')
        .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
        .replace(/ź/g, 'z').replace(/Ź/g, 'Z');
}

Math.roundTo2 = function(i){return Math.round(i * 100) / 100;} 

Math.roundTo4 = function(i){return parseFloat(i.toFixed(4));}

Math.roundTo10 = function(i){return parseFloat(i.toFixed(10));}

Math.cot = function cot(aValue){return 1/Math.tan(aValue);}

Math.decimalPlaces = function(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       (match[1] ? match[1].length : 0)
       - (match[2] ? +match[2] : 0));
}


window["LAST_SELECTED"] = 1;


var app = angular.module('mathpage', ['ui.router']);

app.directive("repeatEnd", function(){
    return function(scope, element, attrs) {
         if (scope.$last){
           scope.repEnd();
         }
        };
});

app.factory("$title", function(){
    var title = "Wybrane metody numeryczne";
    return {
        getTitle : function(){return title;},
        setTitle : function(t){
 
            title = t;
        }
    }
});

app.factory("$subTitle", function(){
    var title = "Wybrane metody numeryczne";
    return{
        getTitle : function(){return title;},
        setTitle : function(t){
            title = t;
        }
    }
});

app.factory("$menuHide", function(){
    var fnc = [];
    var shfnc = [];
    
    return {
        onHide: function(f){
            fnc.push(f);
        },
        onShow: function(f){
            shfnc.push(f);
        },
        hide: function(){
            fnc.forEach(function(ob){
                ob();
            })
        },
        show: function(){
            shfnc.forEach(function(ob){
                ob();
            })
        },
        clear: function(){
            shfnc = [];
            fnc = [];
        }
    }
});


app.controller("TitleController", function($scope, $title){
    $scope.$title = $title;
});

app.controller("MainController", function($scope, $state, $subTitle, $menuHide){
    
    $scope.$subTitle = $subTitle;
    
    var isIE = /*@cc_on!@*/false || !!document.documentMode
    
    var watchDivs = [];
    
    
    $scope.hideMenu = false;
    $scope.toogleMenu = function(){
        $scope.hideMenu = !$scope.hideMenu;
        
        if($scope.hideMenu){
            
            $("#sideTab").addClass("hidden");
            $("#contCol").removeClass("col-md-9 col-xs-9 col-sm-9 col-lg-9");
            $("#contCol").addClass("col-md-12 col-xs-12 col-sm-12 col-lg-12");
            $menuHide.hide();
        }
        else{
            
            $("#sideTab").removeClass("hidden");
            $("#contCol").removeClass("col-md-12 col-xs-12 col-sm-12 col-lg-12");
            $("#contCol").addClass("col-md-9 col-xs-9 col-sm-9 col-lg-9");
            $menuHide.show();
        }
    }
    
    $scope.showMenuIfHidden = function(){
        if($scope.hideMenu){
            
            $("#sideTab").removeClass("hidden");
            $("#contCol").removeClass("col-md-12 col-xs-12 col-sm-12 col-lg-12");
            $("#contCol").addClass("col-md-9 col-xs-9 col-sm-9 col-lg-9");
            $menuHide.show();
        }
        $scope.hideMenu = false;
    }
    
    $scope.incompatible = false;
    
    var dlgShowed = false;
    
    window.onresize = function(){
        if(dlgShowed){return;}
        dlgShowed = true;
        $.smkConfirm({
            text:'Rozmiar ekranu uległ zmianie i niektóre elementy mogą być niepoprawnie wyświetlane. Czy odświeżyć stronę ?',
            accept:'Ok',
            cancel:'Anuluj'
        },function(res){
    // Code here
        if (res) {
            location.reload();
        }
            dlgShowed = false;
        });

    }
    
    if(isIE)
    {
        $.smkAlert({
            text: 'Internet Explorer nie jest kompatybilny z tą stroną. Aby w pełni korzystać z możliwości strony zalecane jest uruchomienie strony w jednej z podanych przeglądarek: Chrome, Mozilla Firefox, Opera.',
            type: 'danger',
            position:'top-center',
            permanent: true
        });
        $scope.incompatible = true;
    }
    //localStorage.removeItem("First");
    
    if(localStorage.getItem("First") === undefined || localStorage.getItem("First") == null)
    {
        localStorage.setItem("First", true);
        $.smkAlert({
            text: '<p style="font-size: 18px; text-align: justify;">Korzystanie z menu głównego:</p><p style="text-align: justify;">Wybór następnego/poprzedniego kafelka odbywa się przez kliknięcie odpowiednio w prawą lub lewą część ekranu. Aby otworzyć podstronę należy kliknąć w aktualnie wybrany kafelek. <br><br>Jeżeli rozdzielczość ekranu jest mniejsza niż 1280x1024 użytkownik może ukryć panel boczny, klikając w jego bieżący tytuł. (np. "Wybrane metody numeryczne").</p>',
            type: 'info',
            position:'top-center',
            icon: 'glyphicon-info-sign',
            permanent: true
        });
    }

    
   
   
    
    $scope.$on("sideCont", function(ev, arr){
       
        var len = arr.length;
        watchDivs = [];
        
        for(var i = 0; i < len; i++)
        {
            var id = arr[i].contentID;
            if(id !== undefined)
                watchDivs.push(id);
        }
        
        
        $scope.$broadcast("addSideButtons", arr);
    });
    
    
    
    function isElementInViewport (el) {

        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }
      
        var rect = el.getBoundingClientRect();
    
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight/2 || document.documentElement.clientHeight/2) && /*or $(window).height()  */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    };
    
    
    $scope.$on("$viewContentLoaded", function(){
        
       
        var el = document.getElementById("contCol");
        el.onscroll = function(e){
  
            //console.log(watchDivs)
            for(var i = 0; i < watchDivs.length; i++)
            {    
                if(isElementInViewport($("#" + watchDivs[i])))
                    {
                        $(".sidebSelected").removeClass("sidebSelected");
                        $("#b" + watchDivs[i]).addClass("sidebSelected");
                        break;
                    }
            }
        }
        
      
        
    }); 
      


    
});

app.controller("SidePanelController", function($scope, $state){
    
    
    
    
    $scope.buttons = [];
    
    $scope.home = function(){
        if($(window).width() <= 1280){
            $scope.$parent.toogleMenu();
        }
        else{
            $state.go("nav");
            $scope.buttons = [];
        }
    }
    
    
    
    
    $scope.more = false;
    
    $scope.toogleMore = function(){
        
        
        if($scope.more == false)
        {
            $("#sideTab").addClass("sideTabFull");
            $("#contCol").hide();
        }
        else{
            $("#sideTab").removeClass("sideTabFull");
            $("#contCol").show();
        }
        
        $scope.more = !$scope.more;
    }
    
    $scope.$on("addSideButtons", function(ev, arr){
        $scope.buttons = arr;
    });
    
});

app.controller("NavigationController2", function($scope, $title, $state, $subTitle, $menuHide){
    
    $scope.$emit("sideCont", []);
    $title.setTitle("Menu główne");
    $subTitle.setTitle("Wybrane metody numeryczne");
    
    $menuHide.clear();
    
    
    this.items = [
            {
                title: "Interpolacja wielomianowa",
                s1: "Co to jest interpolacja ?",
                s2: "Prezentacja działania metody",
                s3: "",
                s4: "",
                img: "img/inter.png",
                imgStyle: {},
                bgStyle: {"background-color": "rgb(201,201,201)"},
                url: "inter"
            }, 
            {
                title: "Metoda eliminacji Gaussa",
                s1: "Charakterystyka metody",
                s2: "Rozwiąż układ równań",
                img: "assets/gauss.png",
                imgStyle: {"width": "180px", "height": "125px", "margin-left": "calc(50% - 103px)"},
                bgStyle: {"background-color": "rgb(201,201,201)"},
                url: "gauss"
            }, 
            {
                title: "Rozwiazywanie równań nieliniowych",
                s1: "Charakterystyka zagadnienia",
                s2: "Rozwiąż równanie",
                s3: "",
                s4: "",
                img: "assets/bisection.png",
                imgStyle: {"width": "150px", "height": "150px", "margin-top": "-20px"},
                bgStyle: {"background-color": "rgb(201,201,201)"},
                url: "nieliniowe"
            },
            {
                title: "Obliczanie całek oznaczonych",
                s1: "Całkowanie funkcji jednej zmiennej",
                s2: "Oblicz całkę",
                s3: "",
                s4: "",
                img: "assets/integrals.png",
                imgStyle: {},
                bgStyle: {"background-color": "rgb(201,201,201)"},
                url: "calki"
            },
            
            {
                title: "Bibliografia",
                s1: "",
                s2: "",
                s3: "",
                s4: "",
                img: "assets/open-book1.png",
                imgContStyle: {"transition": "none", "transform": "none"},
                bgStyle: {"background-color": "rgb(201,201,201)"},
                url: "bibliografia"
            }, 
            {
                title: "O stronie",
                s1: "",
                s2: "",
                s3: "",
                s4: "",
                img: "assets/info.png",
                imgContStyle: {"transition": "none", "transform": "none"},
                bgStyle: {"background-color": "rgb(201,201,201)", "transition": "none"},
                url: "ostronie"
            }
            
        ];
    
    var animating = false;
    
    var i = window["LAST_SELECTED"];
    var clicked = false;
    
    $scope.next =  function()
    {
        if(clicked || animating){return;}
        deselect(i);
        i++;
        if(i == 7)
            i = 1;
        
        select(i);
    }
    
    $scope.prev = function()
    {
        if(clicked || animating){return;}
        deselect(i);
        i--;
        if(i == 0)
            i = 6;
        
        select(i);
    }
    
    function deselect(ind)
    {
        $(".carousel").removeClass("checked" + ind + "1");
        $(".carousel item:nth-child(" + ind + ")").removeClass("checked" + ind + "2");
        $(".carousel item:nth-child(" + ind + ") .content").removeClass("selected");
    }
    
    function select(ind){
        window["LAST_SELECTED"] = ind;
        clicked = true;
        $(".carousel").addClass("checked" + ind + "1");
        $(".carousel item:nth-child(" + ind + ")").addClass("checked" + ind + "2");
         setTimeout(function(){
            $(".carousel item:nth-child(" + ind + ") .content").addClass("selected");
             
            clicked = false;
        }, 500);
    }
    
    function getFsScale(w, h)
    {
        var vW = $("#contCol").width();
        var vH = $("#contCol").height();
       // console.log(vW + " " + vH);
        var i = 2;
        
        var mw = w;
        var mh = h;
        
        while(mw < vW && mh < vH)
        {
            mw = w;
            mh = h;
            mw *= i;
            mh *= i;
            i++;
        }
        
        return i;
    }
    
    function scaleMenuItem(item){
        $(item).parent().addClass("trans3d");
        
        $.keyframe.define([{
            name: "scale100",
            
            '100%': {"transform": "scale(" + getFsScale(400, 300) + ")"}
        }]);
        
        $(item).addClass("full");
    }
    
    function navClick(e){
        var pWidth = $("html").width(); 
        
        var contWidth = $(this).outerWidth();
        var relX = e.pageX - (pWidth - contWidth);
        
        if(relX > contWidth - ((contWidth - 390)/2))
        {
            $scope.next();
        }
        if(relX < (contWidth - 390)/2)
        {
            $scope.prev();
        }
    }
    
    $("#contCol").click(navClick);
    
    
    $scope.repEnd = function(){
       
        $(".content").click(function(){
        
            if($(this).hasClass("selected"))
            {
                    animating = true;
                    
                    scaleMenuItem(this);
                
                    //TEST ONLY    
                    setTimeout(function(){
                        var url = $(".selected").attr("url");
                        $scope.$parent.showMenuIfHidden();
                        $state.go(url);
             
                    }, 2000);
            }
            
        }); 
        $(".menuItem").click(function(event){
                
                if(!$(this).parent().parent().hasClass("selected"))
                {
                    return;
                }
                event.stopPropagation();
                animating = true;
                
                scaleMenuItem(".selected");
                
            
                var urlPart = $(this).html().toLowerCase().removePolish().replace(/\s/g,"");
                
                setTimeout(function(){
                                var selurl = $(".selected").attr("url");
                                         
                                selurl += "#" + urlPart;
                                $scope.$parent.showMenuIfHidden();
                                $(location).attr("href", $(location).attr("href") + selurl)
                }, 2000);
            
            });
        

        select(window["LAST_SELECTED"]);
        
        
        
    };
    
});

app.controller("BiblController", function($scope, $title, $state){
    
    $title.setTitle("Bibliografia")
    $scope.$emit("sideCont", [
        {
            name: "Powrót",
            click: function(){
                $state.go("nav");
                $scope.$emit("sideCont", []);
            
            }, 
            showCircle: false
        }
    ]);
    
});

app.controller("AboutController", function($scope, $title, $state){
    
    $title.setTitle("O stronie")
    $scope.$emit("sideCont", [
        {
            name: "Powrót",
            click: function(){
                $state.go("nav");
                $scope.$emit("sideCont", []);
            
            }, 
            showCircle: false
        }
    ]);
});

app.config(["$locationProvider","$stateProvider", "$urlRouterProvider",function($locationProvider,$stateProvider, $urlRouterProvider){
    

   // 
    
    $stateProvider
        .state('nav', {
            url: "/",
            templateUrl: "partials/navigation.html"
        })
        .state('inter', {
            url: "/inter",
            templateUrl: "partials/interpolacja/interpolacja.html"
        })
        .state('gauss', {
            url: "/gauss",
            templateUrl: function($stateParams){
                return "partials/gauss/gauss.html";                      
            }
        })
        .state('nieliniowe', {
            url: "/nieliniowe",
            templateUrl: "partials/nieliniowe/nieliniowe.html"
        })
        .state('calki', {
            url: "/calki",
            templateUrl: "partials/calki/calki.html"
        })
        .state('ostronie', {
            url: "/ostronie",
            templateUrl: "partials/ostronie/ostronie.html"
        })
        .state('bibliografia', {
            url: "/bibliografia",
            templateUrl: "partials/bibliografia/bibliografia.html"
        }) 
        
    $urlRouterProvider.otherwise("/");
    
    //$locationProvider.html5Mode(true);
    
}]);
    