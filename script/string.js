
var StringUtil = {
    stringStartWithIgnoreCase:function(str, start) {
        for(var i = 0; i < start.length; i++) {
            var c1 = str.charCodeAt(i);
            var c2 = start.charCodeAt(i);
    
            // A (65) ~ Z (90)
            if(c1 >= 65 && c1 <= 90 ) {
                c1 += 32;
            }
    
            if(c2 >= 65 && c2 <= 90) {
                c2 += 32;
            }
    
            if(c1 != c2) {
                return false;
            }
        }
    
        return true;
    }


}

