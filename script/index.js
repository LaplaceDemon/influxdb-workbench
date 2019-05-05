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
      list: []
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
    el: '#query',
    data: {
        sql:"",
        results:[]
    }
});

function query() {
    console.log(queryer.sql);
    var url = "http://127.0.0.1:8086/query?";

    url += "db=" +  "testdb";
    url += "&q=" + queryer.sql;

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            results = data.results;
        } else {
            console.error(error);
        }
    });

}


// const request = net.request('https://github.com');

// request.on('response', (response) => {
//     console.log(`STATUS: ${response.statusCode}`)
//     console.log(`HEADERS: ${JSON.stringify(response.headers)}`)

//     response.on('data', (chunk) => {
//         console.log(`BODY: ${chunk}`)
//         alert(chunk);
//     })

//     response.on('end', () => {
//         console.log('No more data in response.')
//     })
// })

// request.end();