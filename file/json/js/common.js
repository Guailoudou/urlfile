//鉴权函数
function checkPassword() {
    if (localStorage.getItem('passwordVerified') === 'true') {
        const lastAccessTime = localStorage.getItem('lastAccessTime');
        if (Date.now() - parseInt(lastAccessTime) < timeLimit) {
            console.log("密码已验证，无需再次输入");
            return true;
        } else {
            localStorage.removeItem('passwordVerified');
            localStorage.removeItem('lastAccessTime');
            localStorage.removeItem('gh_token');
        }
    }

    let attempts = parseInt(localStorage.getItem('attempts')) || 0;
    let lastAttemptTime = localStorage.getItem('lastAttemptTime');

    if (lastAttemptTime && Date.now() - parseInt(lastAttemptTime) < timeLimit && attempts >= maxAttempts) {
        console.log("尝试次数过多，1小时内无法访问");
        document.body.innerHTML = "<h1>尝试次数过多，1小时内无法访问</h1>";
        return false;
    }

    let input = prompt("请输入密码：");
    let inputHash = CryptoJS.MD5(input).toString();
    if (inputHash === passwordHash) {
        localStorage.setItem('passwordVerified', 'true');
        localStorage.setItem('lastAccessTime', Date.now());
        localStorage.setItem('gh_token', input);
        localStorage.removeItem('attempts');
        localStorage.removeItem('lastAttemptTime');
        console.log("密码正确，页面加载成功");
        return true;
    } else {
        attempts++;
        localStorage.setItem('attempts', attempts);
        localStorage.setItem('lastAttemptTime', Date.now());
        alert("密码错误，剩余尝试次数：" + (maxAttempts - attempts));
        checkPassword();
    }
}
//将文本下载
function downloadNode(Node,name){
    const dataStr = JSON.stringify(Node);
    const dataUri = 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataUri);
    downloadAnchorNode.setAttribute("download", name);
    document.body.appendChild(downloadAnchorNode); // required for firefox browser
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

//读取文件
async function getfile(url){
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load config file.');
        return await response.json();
    } catch (error) {
        console.error(`Error loading config: ${error.message}`);
    }
}
//获取文件sha值（上传GitHub需要的）
async function getFileSha() {
    sha = getfile(git_url).sha;
}
//提交到GitHub
document.getElementById('submit-github').addEventListener('click', function () {
    var encoder = new TextEncoder();
    fetch(git_url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token '+ localStorage.getItem('gh_token')
        },
        body: JSON.stringify({
            'message': git_message,
            'committer': {
            'name': git_name,
            'email': git_email
            },
            'content': btoa(String.fromCharCode.apply(null, encoder.encode(JSON.stringify(config)))),
            'sha': sha
        })
    })
    .then(response => {
        if (response.ok){
            alert('提交上传成功');
            response.json();
            getFileSha();
        }
        
    }
    )
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
        alert('提交上传失败');
    });
});

function loadScript(url) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    // 将script元素添加到head中
    document.getElementsByTagName("head")[0].appendChild(script);
}

//等待页面加载完毕后运行

document.addEventListener('DOMContentLoaded', function () {
    loadScript('js/script.js')
});
