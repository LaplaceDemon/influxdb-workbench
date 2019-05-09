
var urlUtil = {
    parseCurrentQueryStringMap:function() {
        //取得查询字符串并去掉开头的问号
        var str = (location.search.length>0?location.search.substring(1):"");
        var args = {};//保存数据的对象
        items = str.length?str.split('&'):[];//取得每一项
        var item = null;
        var name = null;
        var value = null;
        for(var i=0; i<items.length;i++){
            item = items[i].split('=');
            name = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);
            if(name.length){
                args[name] = value;
            }
        }
        return args;
    },
    getQueryString:function(map) {
        var queryString = "";
        var strlist = [];
        for(var key in map) {
            strlist.push(key + "=" + map[key]);
        }
        return queryString =  strlist.join("&");
    }
}
