var config;
//git参数
const git_url = 'https://api.github.com/repos/Guailoudou/urlfile/contents/file/json/thank.json';
const git_message = '文件更新';
const git_name = 'Guailoudou';
const git_email = 'guailoudou@outlook.com';

if(checkPassword()){
    login();
    getFileSha();
}
else document.body.innerHTML = "<h1>访问被拒绝</h1>";
async function login(){
    config = await getfile('https://file.gldhn.top/file/json/thank.json');
    showlist();
}
//渲染列表数据
function showlist(){
    const detailsContainer = document.getElementById('thank-list');
    detailsContainer.innerHTML = '';
    config.list.forEach(p => {
        const thankDiv = document.createElement('div');
        thankDiv.className = 'thankList';

        const idLabel = document.createElement('label');
        idLabel.textContent = 'id: ';
        const idInput = document.createElement('input');
        idInput.type = 'text';
        idInput.value = p.name;

        const numLabel = document.createElement('label');
        numLabel.textContent = '金额: ';
        const numInput = document.createElement('input');
        numInput.type = 'text';
        numInput.value = p.num;

        const platformLabel = document.createElement('label');
        platformLabel.textContent = '平台: ';
        const platformInput = document.createElement('input');
        platformInput.type = 'text';
        if(p.platform != null)
            platformInput.value = p.platform;
        else
            platformInput.value = '';
        
        const hr = document.createElement('hr');
        thankDiv.appendChild(idLabel);
        thankDiv.appendChild(idInput);
        thankDiv.appendChild(numLabel);
        thankDiv.appendChild(numInput);
        thankDiv.appendChild(platformLabel);
        thankDiv.appendChild(platformInput);

        detailsContainer.appendChild(thankDiv);
        detailsContainer.appendChild(hr);
    })
}
//添加(先保存)
document.getElementById('add-btn').addEventListener('click', function () {
    //删除以前的
    config.list.length = 0;
    //添加新的
    document.querySelectorAll('.thankList').forEach(p => {
        const inputs = p.querySelectorAll('input[type="text"]');
        const idInput = inputs[0];
        const numInput = inputs[1];
        const platformInput = inputs[2];

        config.list.push({
            name: idInput.value,
            num: numInput.value,
            platform: platformInput.value
        })
    });
    config.list.unshift({
        name: '张三',
        num: '0',
        platform: ''
    });
    showlist();
});

//保存
document.getElementById('save-btn').addEventListener('click', function () {

        //删除以前的
        config.list.length = 0;
        //添加新的
        document.querySelectorAll('.thankList').forEach(p => {
            const inputs = p.querySelectorAll('input[type="text"]');
            const idInput = inputs[0];
            const numInput = inputs[1];
            const platformInput = inputs[2];

            config.list.push({
                name: idInput.value,
                num: numInput.value,
                platform: platformInput.value
            })
        });
    showlist();
    alert('赞助列表已保存');
});