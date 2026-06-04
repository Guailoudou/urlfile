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
            var log = json.uplog;
            var info = "";
            if (type == "preset")
            for (var i = 0; i < preset.length; i++) {
                info += "<p>" + preset[i].name + "<br>" + preset[i].note + "</p>";
            }
            if (type == "uplog")
                info = "<textarea style='width:100%;height:200px;' readonly>"+log+"</textarea>";
            document.getElementsByClassName("dot-spinner")[0].style.display = "none";
            document.getElementById("info").innerHTML = info;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("请求失败，状态：", textStatus, "错误：", errorThrown);
        }
    });
}
function getQueryParamValue(name) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
}

const type = decodeURIComponent(getQueryParamValue("type")); 
window.onload = function() {
    getjson();
    
};