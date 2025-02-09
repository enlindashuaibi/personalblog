# Flannel vs. Calico
Flannel 和 Calico 是 Kubernetes 集群中常见的网络方案，它们在实现方式、性能和适用场景上有所不同。

---

## 1. Flannel vs. Calico 概述
| 特性 | Flannel | Calico |
| --- | --- | --- |
| **网络模式** | 基于 overlay（VXLAN、host-gw） | 基于 BGP 或 IP-in-IP |
| **数据转发** | 依赖底层 overlay 技术 | 直接路由，无需额外封装 |
| **性能** | 相对较低，因封装增加开销 | 高性能，无需额外封装 |
| **网络策略** | 不支持 | 支持网络策略（Network Policy） |
| **适用场景** | 适用于小规模集群，易于配置 | 适用于大规模集群，性能要求高 |
| **依赖组件** | 仅 Flannel Daemon | 需要 BGP 或 etcd |


---

## 2. Flannel 网络模式及部署
### **Flannel 支持的网络模式**
| 模式 | 说明 | 适用场景 |
| --- | --- | --- |
| **VXLAN（默认）** | 通过 VXLAN 隧道封装流量 | 适用于不同子网的节点 |
| **host-gw** | 直接使用主机路由，不进行封装 | 适用于所有节点在同一二层网络 |
| **WireGuard** | 使用 WireGuard 进行加密 | 适用于需要加密的环境 |
| **UDP** | 通过 UDP 进行封装（较旧，不推荐） | 适用于不支持 VXLAN 的网络 |



### **Flannel 部署步骤**
1. **准备 Kubernetes 集群**

```shell
kubeadm init --pod-network-cidr=10.244.0.0/16
```

2. **安装flannel**

```shell
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

3. **修改flanel后端模式**

```shell
编辑 ConfigMap 配置：
kubectl edit cm -n kube-flannel flannel-config

修改 net-conf.json：
{
  "Network": "10.244.0.0/16",
  "Backend": {
    "Type": "vxlan"
  }
}

可选模式：
VXLAN（默认）："Type": "vxlan"
host-gw："Type": "host-gw"
WireGuard："Type": "wireguard"
UDP："Type": "udp"
```

4. **重启 Flannel Pod  **

```shell
kubectl delete pod -n kube-flannel --all
```



## 3. Calico 网络模式及部署
### **Calico 支持的网络模式**
Calico 主要支持三种模式：

| 模式 | 说明 | 适用场景 |
| --- | --- | --- |
| **BGP 模式** | 使用 BGP 在节点之间分发路由，支持公网和大规模集群 | 适用于数据中心、物理机集群 |
| **IP-in-IP** | 通过 IP-in-IP 隧道封装流量，适用于 BGP 不可用的场景 | 适用于云环境，如 AWS |
| **VXLAN** | 通过 VXLAN 进行封装，适用于不支持 BGP 的环境 | 适用于公有云或复杂网络架构 |


### **Calico 部署步骤**
1. **准备 Kubernetes 集群**

```shell
kubeadm init --pod-network-cidr=192.168.0.0/16
```

2. **安装calico**

```shell
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/calico.yaml
```

3. **修改calico后端模式**

```shell
编辑 ConfigMap 配置：
kubectl edit cm -n kube-system calico-config

修改 calico_backend：
data:
  calico_backend: "bird"


可选模式：
BGP（默认）："bird"
IP-in-IP："ipip"
VXLAN："vxlan"
```

4. **重启 Flannel Pod  **

```shell
kubectl delete pod -n kube-system -l k8s-app=calico-node
```

  


## 4. Flannel 详细介绍
Flannel 是 CoreOS 开发的一个简单易用的 Kubernetes 网络方案，主要通过 VXLAN 或 host-gw 进行 Pod 之间的通信。

### **优点**
+ 简单易用，易于部署
+ 适用于小规模 Kubernetes 集群
+ 兼容性好，适用于不同的云环境

### **缺点**
+ 仅提供基础的 Pod 网络连通性，不支持网络策略
+ 由于使用 VXLAN 进行封装，增加了 CPU 和带宽开销，性能较低

## 5. Calico 详细介绍
Calico 是一个高性能的 Kubernetes 网络方案，支持 BGP 和 IP-in-IP 隧道，提供原生的网络策略控制。

### **优点**
+ 性能优越，直接基于路由，无需封装
+ 内置网络策略，支持安全访问控制
+ 适用于大规模 Kubernetes 集群，支持 BGP 互联

### **缺点**
+ 配置较复杂，依赖 BGP 或 etcd
+ 需要对底层网络有一定的理解

## 6. 选择建议
+ **如果是小规模集群，或者需要一个简单的网络方案**，Flannel 是更好的选择。
+ **如果是大规模集群，或者有高性能需求**，Calico 更适合。
+ **如果需要网络策略（NetworkPolicy）来控制流量**，必须使用 Calico。

## 7. 总结
| 方案 | 适用场景 | 主要优点 | 主要缺点 |
| --- | --- | --- | --- |
| **Flannel** | 小规模集群，易部署 | 简单易用，兼容性好 | 不支持网络策略，性能较低 |
| **Calico** | 大规模集群，高性能需求 | 高性能，支持网络策略 | 依赖 BGP/etcd，配置复杂 |


两者可以结合使用，例如使用 Flannel 负责网络通信，再结合 Calico 实现网络策略控制。  


