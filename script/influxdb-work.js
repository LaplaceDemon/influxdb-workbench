var request = require('request');


// init ---------------------------------------------------------------------------------------------------------------------------------------------------------
var currentQueryStringMap = urlUtil.parseCurrentQueryStringMap();

var influxdbURL = "http://"+currentQueryStringMap["url"];
var influxdbUsername = currentQueryStringMap["username"];
var influxdbPassword = currentQueryStringMap["password"];

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

{
    var queryStrMap = {};
    if(StringUtil.isNotEmpty(influxdbUsername)) {
        queryStrMap["u"] = influxdbUsername;
    }
    if(StringUtil.isNotEmpty(influxdbPassword)) {
        queryStrMap["p"] = influxdbPassword;
    }
    queryStrMap["q"] = "show databases";

    var url = influxdbURL + "/query?" + urlUtil.getQueryString(queryStrMap)
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            var values = result.results[0].series[0].values;
            for(var i in values) {
                databases.list.push(values[i][0]);
            }
        } else {
            alert(body);
        }
    });
}

// query
// ---------------------------------------------------------------------------------------------------------------------------------------------------------
var queryer = new Vue({
    el: '#queryer',
    data: {
        sql:"",
        results:[],
        timeFormat:"",
        log:""
    }
});



function querySQL() {
    console.log(queryer.sql);
    var sql = queryer.sql.trim();
    var method = "";
    
    if(StringUtil.stringStartWithIgnoreCase(sql, "show") || StringUtil.stringStartWithIgnoreCase(sql, "select")) {
        url += "/query?"
        method = "GET";
    } else {
        url += "/write?"
        method = "POST";
    }

    var qsMap = {};
    if(databases.useDatabase) {
        qsMap["db"] = databases.useDatabase;
    }
    if(StringUtil.isNotEmpty(influxdbUsername)) {
        qsMap["u"] = influxdbUsername;
    }
    if(StringUtil.isNotEmpty(influxdbPassword)) {
        qsMap["p"] = influxdbPassword;
    }
    qsMap["q"] = queryer.sql;
    if(StringUtil.stringStartWithIgnoreCase(sql, "select")) {
        if(queryer.timeFormat!="" && queryer.timeFormat!="normarl") {
            qsMap["epoch"] = queryer.timeFormat;
        }
    }

    var url = influxdbURL + "/query?" + urlUtil.getQueryString(qsMap);
    var requestTimestamp = new Date().getTime();
    request (
        {
            "method":method,
            "uri":url
        },
        function (error, response, body) {
            var responseTimestamp = new Date().getTime();
            var dt = (responseTimestamp - requestTimestamp)/1000.0;
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
                        queryer.log = ("success: cost " + dt + " s");
                    }

                } else if(response.statusCode == 204) {
                    queryer.log = "sucess: cost " + dt + " s" + ", no content";
                } else {
                    queryer.log = "error: " + body;
                    queryer.results = [];
                }
            } else {
                queryer.log = "error:" + body + "/nerror:" + (error);
                queryer.results = [];
            }
        }
    );

}


// sql template ------------------------------------------------------------------------------------------------------

function fillInShowDatabasesSqlTemplate() {
    queryer.sql = "show databases;";
}

function fillInShowMeasurementsSqlTemplate() {
    queryer.sql = "show measurements;";
}

function fillInSelectSqlTemplate() {
    queryer.sql = "SELECT <field_key>[,<field_key>,<tag_key>] FROM <measurement_name>[,<measurement_name>]";
}

function fillInWhereSqlTemplate() {
    queryer.sql += " WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]";
}

function fillInGroupBySqlTemplate() {
    queryer.sql += " GROUP BY [* | <tag_key>[,<tag_key]]";
}

function fillInShowSubscriptionsSqlTemplate() {
    queryer.sql = "show subscriptions";
}

function fillInShowRetentionPoliciesSqlTemplate() {
    queryer.sql = 'show retention policies [on "<database>"]';
}