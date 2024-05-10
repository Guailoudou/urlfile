function getjson(){
    document.getElementById("info").innerHTML = "";
    //显示class为dot-spinner的元素
    document.getElementsByClassName("dot-spinner")[0].style.display = "block";
    document.getElementById("info").innerHTML = "正在获取数据...";
    var url = "https://file.gldhn.top/file/json/thank.json";
    
    //var url = "thank.json";
    $.ajax({
        url: url,
        type: "GET",
        header: {
            "Content-Type": "application/json; charset=utf-8"
        },
        success: function(data) {
            var json = data;
            var thank = json.thank;
            var info = "<tr><th>用户名</th><th>金额</th></tr>";
            for (var i = 0; i < thank.length; i++) {
                info += "<tr><td>" + thank[i].name + "</td><td>" + thank[i].num + "</td></tr>";
            }
            document.getElementsByClassName("dot-spinner")[0].style.display = "none";
            document.getElementById("info").innerHTML = info;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("请求失败，状态：", textStatus, "错误：", errorThrown);
        }
    });
}
window.onload = function() {
    getjson();
    
};