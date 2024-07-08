//全局变量
var config; //根列表
var presets; //预设根（congig.presets）
var selectedName = ""; //选中预设的名称

//git参数
const git_url = 'https://api.github.com/repos/Guailoudou/urlfile/contents/file/json/preset.json';
const git_message = '文件更新';
const git_name = 'Guailoudou';
const git_email = 'guailoudou@outlook.com';

if(checkPassword()){
    login();
    getFileSha();
}
else document.body.innerHTML = "<h1>访问被拒绝</h1>";

   // 初始化
async function login() {
    config = await getfile('https://file.gldhn.top/file/json/preset.json')
    presets = config.presets;
 
    generatePresetSelector();
    selectedName = presets[0].name;

    showPresetConfig(document.getElementById('preset-selector').value);
    updateConfig()
 
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
//保存
document.getElementById('updata-form').addEventListener('submit', function (event) {
    event.preventDefault(); // 阻止表单默认提交行为
    config.version = document.getElementById('version-put').value;
    config.upurl = document.getElementById('upurl-put').value;
    config.uphash = document.getElementById('uphash-put').value;
    config.opurl = document.getElementById('opurl-put').value;
    config.ophash = document.getElementById('ophash-put').value;
    config.uplog = document.getElementById('uplog-id').value;
    updateConfig();
    alert('已保存');
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

// 监听预设选择事件
document.getElementById('preset-selector').addEventListener('change', function () {
    selectedName = this.value;
    showPresetConfig(selectedName);
});

//新建预设
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
    selectedName = name;
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
   
    showPresetConfig(selectedName);
    alert('预设已保存');
});
//删除预设
document.getElementById('delete-btn').addEventListener('click', function () {
    const index = presets.findIndex(p => p.name === selectedName);
    if (index !== -1) {
        presets.splice(index, 1);
        generatePresetSelector();
        selectedName = presets[0].name; //加载第一个预设
        showPresetConfig(selectedName);
        alert('预设已删除');
    }
});


