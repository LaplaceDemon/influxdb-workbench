var request = require('request');

function reflush() {
    alert("点击刷新");
}

var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    }
});

var databases = new Vue({
    el: '#databases',
    data: {
      list: [],
      useDatabase:""
    },
    methods:{
        clickUseDatabase:function(event) {
            databases.useDatabase = event.target.value;
        }
    }
});

setTimeout(function(){
    app.message="hello Electron"
}, 2000);

request("http://127.0.0.1:8086/query?q=show databases", function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);
        var values = result.results[0].series[0].values;
        for(var i in values) {
            databases.list.push(values[i][0]);
        }
    } else {
        console.error(error);
    }
});

var queryer = new Vue({
    el: '#queryer',
    data: {
        sql:"",
        results:[],
        timeFormat:"",
        log:""
    }
});

function fillInShowDatabasesSqlTemplate() {
    queryer.sql = "show databases;";
}

function fillInShowMeasurementsSqlTemplate() {
    queryer.sql = "SHOW MEASUREMENTS;";
}

function querySQL() {
    console.log(queryer.sql);
    var sql = queryer.sql.trim();

    var url = "http://127.0.0.1:8086";
    var method = "";

    
    if(StringUtil.stringStartWithIgnoreCase(sql, "show") || StringUtil.stringStartWithIgnoreCase(sql, "select")) {
        url += "/query?"
        method = "GET";
    } else {
        url += "/write?"
        method = "POST";
    }

    var queryStringList = [];
    if(databases.useDatabase) {
        queryStringList.push("db=" + databases.useDatabase);
    }

    if(sql.startsWith("select")) {
        if(queryer.timeFormat!="" && queryer.timeFormat!="normarl") {
            queryStringList.push("epoch=" + queryer.timeFormat);
        }
    }

    queryStringList.push("q=" + queryer.sql);

    url += queryStringList.join("&");

    request (
        {
            "method":method,
            "uri":url
        },
        function (error, response, body) {
            if (!error) {
                if (response.statusCode == 200) {
                    var data = JSON.parse(body);
                    queryer.results = data.results;

                    // check
                    var errorMessage = "";
                    var hasError = false;
                    for(var i in data.results) {
                        var result = data.results[i];
                        if (result.error) {
                            hasError = true;
                            errorMessage += ("\n" + result.error);
                        }
                    }
                    
                    if (hasError) {
                        queryer.log = ("error:" + errorMessage);
                    } else {
                        queryer.log = ("success:");
                    }

                } else if(response.statusCode == 204) {
                    queryer.log = "sucess: " + "no content";
                } else {
                    queryer.log = "error: " + body;
                }
            } else {
                queryer.log = "error:" + body + "/nerror:" + (error);
            }
        }
    );

}

