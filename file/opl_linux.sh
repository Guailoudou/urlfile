#!/bin/sh
dmopl(){
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
            s390x)
                sysType="linux-s390x"
            ;;
            mips)
                num=$(printf '\x01\x02\x03\x04' | hexdump | awk '{print $2}')
                echo "num is $num"
                if [ "$num" = "0102" ]; then
                    sysType="linux-mips"
                    echo "endian: big"
                else
                    sysType="linux-mipsle"
                    echo "endian: little"
                fi
                
            ;;
        esac
    fi

    url="https://openp2p.cn/download/v1/latest/openp2p-latest.$sysType.tar.gz"
    echo "download $url start"

    if command -v curl >/dev/null; then
        curl -k -o openp2p.tar.gz "$url"
        mv openp2p.tar.gz /opt/opl
    else
        wget --no-check-certificate -O openp2p.tar.gz "$url"
        mv openp2p.tar.gz /opt/opl
    fi
    if [ $? -ne 0 ]; then
        echo "download error $?"
        exit 9
    fi
    echo "download ok"
    tar -xzvf /opt/opl/openp2p.tar.gz -C /opt/opl
    chmod +x /opt/opl/openp2p
    echo "install start"
}
if [ ! -d "/opt/opl" ]; then
  mkdir /opt/opl
fi
strToken="11602319472897248650"
filename="/opt/opl/node.txt"
oplname="/opt/opl/openp2p"
if [ ! -f "$oplname" ]; then
  dmopl
fi

if [ ! -f "$filename" ]; then
  touch "$filename"
  node=$(od -vAn -N3 -tux1 /dev/urandom | tr -cd '0-9a-f')
  echo $node > "$filename"
else
  node=$(cat "$filename")
fi
echo -----------------------------------
echo 主程序将在2s后运行，暂只支持被连接！
echo 关闭请使用 sudo killall -9 openp2p 
echo 目前仅只是勉强可用
echo 你的uid为: $node 
echo -----------------------------------
sleep 2
nohup /opt/opl/openp2p -token $strToken -node $node >/dev/null 2>&1 & 