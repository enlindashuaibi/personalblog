安装nvidia-docker

```plain
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)  && \
curl -x http://10.11.13.32:1082 -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - && \
export https_proxy="http://10.11.13.32:1082" && \
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -    && curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list  && \
apt-get -o Acquire::http:proxy="http://10.11.13.32:1082/" update  && \
yes | apt-get -o Acquire::http:proxy="http://10.11.13.32:1082/" install -y nvidia-docker2  && \
unset https_proxy && \
rm -rf /etc/apt/sources.list.d/nvidia-container-runtime.list


```

配置docker

```bash
sed -i 's/ExecStart.*/ExecStart=\/usr\/bin\/dockerd -H tcp:\/\/0.0.0.0:2375 -H unix:\/\/var\/run\/docker.sock -H fd:\/\/ --containerd=\/run\/containerd\/containerd.sock/'  /lib/systemd/system/docker.service
cat << EOF > /etc/docker/daemon.json
{
"registry-mirrors": ["https://6kx4zyno.mirror.aliyuncs.com"],
"insecure-registries":["https://harbor.dubhe.club"],
"exec-opts": ["native.cgroupdriver=systemd"],
"default-runtime": "nvidia",
"runtimes": {
"nvidia": {
"path": "/usr/bin/nvidia-container-runtime",
"runtimeArgs": []
          }
             }
}
EOF
systemctl daemon-reload
systemctl restart docker
```

启动测试容器

```bash
docker run -d --restart=always --name="test-1" harbor.dubhe.club/terminal/0/ubuntu20.04-cuda11.4.1-cudnn8-ssh:base && \
docker run -d --restart=always --name="test-2" harbor.dubhe.club/terminal/0/ubuntu20.04-cuda11.4.1-cudnn8-ssh:base && \
docker run -d --restart=always --name="test-3" harbor.dubhe.club/terminal/0/ubuntu20.04-cuda11.4.1-cudnn8-ssh:base && \
docker run -d --restart=always --name="test-4" harbor.dubhe.club/terminal/0/ubuntu20.04-cuda11.4.1-cudnn8-ssh:base && \
docker run -d --restart=always --name="test-5" harbor.dubhe.club/terminal/0/ubuntu20.04-cuda11.4.1-cudnn8-ssh:base 
```

