const ipc = require('electron').ipcRenderer

var influxdbConnector = new Vue({
    el: '#influxdbConnector',
    data: {
      url: "",
      username:"",
      password:""
    },
    methods:{
        clean: function(event) {
            this.url = "";
            this.username = "";
            this.password = "";
        },
        connect: function(event) {
            var queryString = "url=" + this.url + "&username=" + this.username + "&password=" + this.password;
            var subwin = window.open('./influxdb-work.html?' + queryString, 'TSDB 工作台', "_blank", 'width=1280,height=900')
            // ipc.send("openInfluxdb");
        }
    }
});