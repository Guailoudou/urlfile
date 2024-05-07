function getjson(){
    document.getElementById("info").innerHTML = "";
    //显示class为dot-spinner的元素
    document.getElementsByClassName("dot-spinner")[0].style.display = "block";
    document.getElementById("info").innerHTML = "正在获取数据...";
    var url = "https://file.gldhn.top/file/json/preset.json";
    $.ajax({
        url: url,
        type: "GET",
        header: {
            "Content-Type": "application/json; charset=utf-8"
        },
        success: function(data) {
            var json = data;
            var preset = json.presets;
            console.log(json);
            //打印preset数组内每个元素的name和note
            var info = "";
            for (var i = 0; i < preset.length; i++) {
                info += "<p>" + preset[i].name + "<br>" + preset[i].note + "</p>";
            }
            //隐藏class为dot-spinner的元素
            document.getElementsByClassName("dot-spinner")[0].style.display = "none";
            //打印信息到页面
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