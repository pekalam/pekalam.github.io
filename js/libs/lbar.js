function Lbar(){
    this.create = function(id, max){
        if(id.charAt(0) !== "#")
        {
            id = "#" + id;
        }
        if(max === undefined)
            max = 100;
        
        $(id).append(
            '<div class="lbarBck"><div class="lbarProg"></div></div>'
        
        );
        
        return new LbarObject(id, max);
    }
}

function LbarObject(id, max){
    
    
    
    this.textSuffix = "%";
    
    this.set = function(prog){
        $(id + " .lbarProg").css("width", (prog * 100 / max) + "%");
        $(id + " .lbarText").html(prog + this.textSuffix);
    }
}

var LBAR = new Lbar();
