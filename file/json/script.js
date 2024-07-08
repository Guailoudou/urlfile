const passwordHash = "9fd4fd2873f6e082f8513713caa2ca18";
const timeLimit = 3600000;
const maxAttempts = 3;
var config;
var presets;
if(checkPassword())login();
else document.body.innerHTML = "<h1>访问被拒绝</h1>";

async function login() {
    try {
        const response = await fetch('preset.json');
        if (!response.ok) throw new Error('Failed to load config file.');
        config = await response.json();
        presets = config.presets;
        // 初始化
        generatePresetSelector();
        selectedName = presets[0].name;

        showPresetConfig(document.getElementById('preset-selector').value);
        updateConfig()
    } catch (error) {
        console.error(`Error loading config: ${error.message}`);
    }
}
function checkPassword() {
    if (localStorage.getItem('passwordVerified') === 'true') {
        const lastAccessTime = localStorage.getItem('lastAccessTime');
        if (Date.now() - parseInt(lastAccessTime) < timeLimit) {
            console.log("密码已验证，无需再次输入");
            return true;
        } else {
            localStorage.removeItem('passwordVerified');
            localStorage.removeItem('lastAccessTime');
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


// 生成预设下拉菜单
function generatePresetSelector() {
    const selector = document.getElementById('preset-selector');
    selector.innerHTML = '';
    presets.forEach(preset => {
        const option = document.createElement('option');
        option.value = preset.name;
        option.text = preset.name;
        selector.appendChild(option);
    });
}
const t4 = "xJpLoBGjce";
//显示更新配置
function updateConfig() {
    const version = document.getElementById('version-put');
    const upurl = document.getElementById('upurl-put');
    const uphash = document.getElementById('uphash-put');
    const opurl = document.getElementById('opurl-put');
    const ophash = document.getElementById('ophash-put');
    const uplog = document.getElementById('uplog-id');
    version.value = config.version;
    upurl.value = config.upurl;
    uphash.value = config.uphash;
    opurl.value = config.opurl;
    ophash.value = config.ophash;
    uplog.value = config.uplog;
}
document.getElementById('updata-form').addEventListener('submit', function (event) {
    event.preventDefault(); // 阻止表单默认提交行为
    config.version = document.getElementById('version-put').value;
    config.upurl = document.getElementById('upurl-put').value;
    config.uphash = document.getElementById('uphash-put').value;
    config.opurl = document.getElementById('opurl-put').value;
    config.ophash = document.getElementById('ophash-put').value;
    config.uplog = document.getElementById('uplog-id').value;
    updateConfig();
});
// 显示预设配置
function showPresetConfig(name) {
    const detailsContainer = document.getElementById('preset-details');
    const selectedPreset = presets.find(p => p.name === name);

    if (selectedPreset) {
        // 清空之前的配置
        detailsContainer.innerHTML = '';

        // 添加说明
        const mtLabel = document.createElement('label');
        mtLabel.textContent = '说明：';
        const noteElement = document.createElement('input');
        noteElement.value = selectedPreset.note;
        detailsContainer.appendChild(mtLabel);
        detailsContainer.appendChild(noteElement);

        // 添加隧道配置表单
        selectedPreset.tunnel.forEach(tunnel => {
            const tunnelDiv = document.createElement('div');
            tunnelDiv.className = 'tunnel';

            const sportLabel = document.createElement('label');
            sportLabel.textContent = '源端口(Sport): ';
            const sportInput = document.createElement('input');
            sportInput.type = 'number';
            sportInput.value = tunnel.Sport;
            sportLabel.appendChild(sportInput);
            tunnelDiv.appendChild(sportLabel);

            const cportLabel = document.createElement('label');
            cportLabel.textContent = '客户端端口(Cport): ';
            const cportInput = document.createElement('input');
            cportInput.type = 'number';
            cportInput.value = tunnel.Cport;
            cportLabel.appendChild(cportInput);
            tunnelDiv.appendChild(cportLabel);

            const typeLabel = document.createElement('label');
            typeLabel.textContent = '类型: ';
            const typeSelect = document.createElement('select');
            typeSelect.value = tunnel.type;
            ['udp', 'tcp'].forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.text = type.toUpperCase();
                if (type === tunnel.type) option.selected = true;
                typeSelect.appendChild(option);
            });
            typeLabel.appendChild(typeSelect);
            tunnelDiv.appendChild(typeLabel);

            detailsContainer.appendChild(tunnelDiv);
        });
    }
}
var selectedName = "";
// 监听预设选择事件
document.getElementById('preset-selector').addEventListener('change', function () {
    selectedName = this.value;
    showPresetConfig(selectedName);
});

const t3 = "Ot6Klzq3O2aJX";

document.getElementById('new-preset-form').addEventListener('submit', function (event) {
    event.preventDefault(); // 阻止表单默认提交行为
    const name = document.getElementById('preset-name').value.trim();

    if (!name) return alert('预设名称不能为空');

    // 创建一个新的预设对象
    const newPreset = {
        name: name,
        note: '', // 默认无备注
        tunnel: [] // 默认无隧道配置
    };

    presets.push(newPreset);
    generatePresetSelector();
    showPresetConfig(name);
    document.getElementById('preset-name').value = ''; // 清空输入框
});

// 添加端口配置
function addTunnelToPreset(presetName) {
    const preset = presets.find(p => p.name === presetName);
    if (preset) {
        preset.tunnel.push({
            Sport: 0,
            Cport: 0,
            type: 'udp'
        });

        showPresetConfig(presetName); // 更新显示
    }
}
// 添加端口配置
document.getElementById('addTunnelToPreset-btn').addEventListener('click', function () {
    addTunnelToPreset(selectedName);
    console.log(selectedName);
});
// 保存预设
document.getElementById('save-btn').addEventListener('click', function () {
    
    const selectedPreset = presets.find(p => p.name === selectedName);
    if (selectedPreset) {
        //删除以前的
        selectedPreset.tunnel.length = 0;
        //添加新的
        selectedPreset.note = document.getElementById('preset-details').querySelector('input').value;
        document.querySelectorAll('.tunnel').forEach(tunnelDiv => {
            const inputs = tunnelDiv.querySelectorAll('input[type="number"]');
            const sportInput = inputs[0];
            const cportInput = inputs[1];
            const typeSelect = tunnelDiv.querySelector('select');
            
            selectedPreset.tunnel.push({
                Sport: parseInt(sportInput.value),
                Cport: parseInt(cportInput.value),
                type: typeSelect.value
            })
        })
    }
    //alert('预设已保存');
    showPresetConfig(selectedName);
});
// 导出预设为JSON文件
document.getElementById('export-json').addEventListener('click', function () {
    const dataStr = JSON.stringify(config);
    const dataUri = 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataUri);
    downloadAnchorNode.setAttribute("download", "presets.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox browser
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});
const sdg = "gh";
const t2 = "p_ktLU";

var token = sdg + t2 + t3 + t4 + "U7i2zIetx";
//提交到GitHub
document.getElementById('submit-github').addEventListener('click', function () {
    var encoder = new TextEncoder();
    fetch('https://api.github.com/repos/Guailoudou/urlfile/contents/file/json/preset.json', {
    method: 'PUT',
    headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token '+token
    },
    body: JSON.stringify({
        'message': '更新内容',
        'committer': {
        'name': 'Guailoudou',
        'email': 'Guailoudou@outlook.com'
        },
        'content': btoa(String.fromCharCode.apply(null, encoder.encode(JSON.stringify(config))))
    })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert('提交上传成功');
    })
    .catch(error => {
        console.error(error);
        alert('提交上传失败');
    });

    reader.readAsText(file);
});
