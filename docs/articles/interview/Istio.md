### **Istio 是什么？**
Istio 是一个 **服务网格（Service Mesh）** 解决方案，它为分布式微服务提供 **流量管理、安全性、可观察性** 和 **策略控制**。Istio 通过 **Sidecar（边车模式）** 的方式，把流量管理功能从应用程序中抽离出来，使得微服务可以专注于业务逻辑，而 Istio 负责通信管理。

---

### **Istio 可以用来干什么？**
Istio 主要提供以下核心功能：

#### **1. 流量管理（Traffic Management）**
+ **智能流量路由**：根据 **权重、请求头、Cookie、流量百分比** 进行流量分配，实现 **灰度发布、金丝雀发布、A/B 测试**。
+ **负载均衡**：支持 **轮询（Round Robin）、最少请求（Least Request）、随机（Random）** 等策略。
+ **超时 & 重试**：支持自动重试和超时策略，提升请求的可靠性。

#### **2. 安全（Security）**
+ **mTLS（双向 TLS 加密）**：Istio 在微服务间通信时默认启用 **mTLS**，确保数据传输加密。
+ **身份认证与授权（RBAC）**：提供 **基于角色的访问控制（RBAC）**，确保不同的微服务有正确的访问权限。
+ **服务身份管理**：自动为每个服务分配唯一身份，防止未经授权的访问。

#### **3. 可观察性（Observability）**
+ **日志 & 监控**：与 Prometheus、Grafana、Jaeger、Zipkin 等工具集成，提供 **服务间调用日志、监控指标、分布式追踪**。
+ **流量可视化**：提供 **Kiali** 仪表盘，实时查看流量拓扑、错误率、延迟等信息。

#### **4. 服务策略（Policy Control）**
+ **熔断 & 限流**：可以设定 **请求速率限制（Rate Limiting）、熔断策略（Circuit Breaking）**，防止雪崩效应。
+ **故障注入（Fault Injection）**：模拟 **高延迟、错误响应** 等异常情况，测试系统的容错能力。
+ **请求镜像（Traffic Mirroring）**：复制流量到新版本服务进行 **影子测试**，不影响生产环境。

---

### **Istio 适用于哪些场景？**
| 场景 | 说明 |
| --- | --- |
| **微服务架构** | 统一管理微服务间的流量、认证、监控，提高可观察性和安全性。 |
| **灰度发布 / A/B 测试** | 通过 Istio 的流量控制，精确地把部分流量引导到新版本进行测试。 |
| **零信任安全（Zero Trust Security）** | 强制双向 TLS（mTLS）加密，实现安全的服务通信。 |
| **分布式追踪 / 监控** | 结合 Prometheus + Grafana + Jaeger 实现完整的链路跟踪和可视化监控。 |
| **熔断与流量限制** | 避免单个服务故障影响整个系统，提高系统的可靠性。 |


---

## **1. 安装 Istio**
首先，你需要在 Kubernetes 集群中安装 Istio。

### **（1）下载 Istio**
```plain
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
export PATH=$PWD/bin:$PATH
```

### **（2）安装 Istio 控制面（Istio Control Plane）**
```plain
复制编辑
istioctl install --set profile=demo -y
```

### **（3）启用自动 Sidecar 注入**
```plain
kubectl label namespace default istio-injection=enabled
```

---

## **2. 流量管理示例**
### **（1）部署示例应用（Bookinfo）**
Istio 官方提供了一个 `Bookinfo` 应用，包含多个微服务：

```plain
kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml
```

等待 Pod 运行完毕：

```plain
kubectl get pods
```

### **（2）创建 Istio Ingress Gateway**
```plain
kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml
```

### **（3）获取访问地址**
```plain
export INGRESS_HOST=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')
export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT
echo "http://$GATEWAY_URL/productpage"
```

访问 `http://<GATEWAY_URL>/productpage`，查看 Bookinfo 应用。

---

## **3. 实现灰度发布**
### **（1）将所有流量发送到 **`**v1**`** 版本**
```plain
kubectl apply -f samples/bookinfo/networking/destination-rule-all.yaml
kubectl apply -f samples/bookinfo/networking/virtual-service-all-v1.yaml
```

现在所有流量都会路由到 `v1` 版本。

### **（2）按流量比例进行灰度发布**
将 `v3` 版本加入，并让 `50%` 的流量流向 `v3`：

```plain
kubectl apply -f samples/bookinfo/networking/virtual-service-reviews-50-v3.yaml
```

现在 `v3` 版本会接收 `50%` 的请求。

---

## **4. 实现 A/B 测试**
假设我们希望：

+ `user=john` 访问 `v2`
+ 其他用户访问 `v1`

创建如下 VirtualService：

```plain
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
  - reviews
  http:
  - match:
    - headers:
        end-user:
          exact: john
    route:
    - destination:
        host: reviews
        subset: v2
  - route:
    - destination:
        host: reviews
        subset: v1
```

```plain
kubectl apply -f virtual-service-ab-testing.yaml
```

测试：

```plain
curl -H "end-user: john" http://$GATEWAY_URL/productpage
```

John 会访问 `v2`，其他用户仍访问 `v1`。

---

## **5. 开启 mTLS 安全通信**
默认情况下，Istio 会以 **明文 HTTP** 方式通信。要启用 **双向 TLS（mTLS）**，应用 `PeerAuthentication`：

```plain
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT
```

```plain
kubectl apply -f mtls-strict.yaml
```

这样 Istio 内部流量都会加密。

---

## **6. 配置熔断**
设定 `reviews` 服务的最大连接数：

```plain
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: reviews-circuit-breaker
spec:
  host: reviews
  trafficPolicy:
    connectionPool:
      http:
        maxRequestsPerConnection: 1
    outlierDetection:
      consecutive5xxErrors: 3
      interval: 10s
      baseEjectionTime: 30s
```

```plain
kubectl apply -f circuit-breaker.yaml
```

如果 `reviews` 连续返回 5xx，Istio 将暂时熔断它。

---

## **7. 监控和可观察性**
安装 Prometheus、Grafana、Kiali 和 Jaeger：

```plain
kubectl apply -f samples/addons
kubectl rollout status deployment/kiali -n istio-system
```

访问：

+ **Grafana**（监控指标）：`kubectl port-forward -n istio-system svc/grafana 3000:3000`
+ **Kiali**（流量拓扑）：`kubectl port-forward -n istio-system svc/kiali 20001:20001`
+ **Jaeger**（分布式追踪）：`kubectl port-forward -n istio-system svc/tracing 16686:16686`

