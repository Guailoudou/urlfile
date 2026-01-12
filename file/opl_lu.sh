#!/bin/sh
getfilename(){
    sysType=$(uname -s)
    echo "system: ${sysType}"
    archType=$(uname -m)
    echo "arch: ${archType}"
    if [ "$sysType" = "Darwin" ]; then
        sysType="darwin-amd64"
        if [ "$archType" = "arm64" ]; then
            sysType="darwin-arm64"
        fi
        elif [ "$sysType" = "Linux" ]; then
        sysType="linux-amd64"
        case "$archType" in
            aarch64)
                sysType="linux-arm64"
            ;;
            arm*)
                sysType="linux-arm"
            ;;
            i*86)
                sysType="linux-386"
            ;;
        esac
    fi
}
dmopl(){

    url="https://gitee.com/guailoudou/urlfile/raw/main/file/console/opl-console-$sysType.tar.gz"
    echo "download $url start"

    if command -v curl >/dev/null; then
        curl -k -o ./opl.tar.gz "$url"
    else
        wget --no-check-certificate -O ./opl.tar.gz "$url"
    fi
    if [ $? -ne 0 ]; then
        echo "download error $?"
        exit 9
    fi
    echo "download ok"
    tar -xzvf ./opl.tar.gz
    chmod +x ./opl-console-$sysType
}

sysType=""
getfilename
echo "请注意，如果需要更新/重新下载主程序，请手动删除 opl-console-$sysType 文件 :rm opl-console-$sysType"
echo "程序将在2s后运行！"
sleep 2
if [ ! -f "opl-console-$sysType" ]; then
  dmopl
fi
./opl-console-$sysType