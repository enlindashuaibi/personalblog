在 Kubernetes (K8s) 的 YAML 配置文件中，`apiVersion` 定义了**资源的 API 组和版本**，不同的资源类型对应不同的 `apiVersion`。出现 `v1` 和 `apps/v1` 这样的不同版本，是因为 Kubernetes 根据资源的类型和 Kubernetes 版本，**将 API 分成了不同的组**。

---

## **1. **`apiVersion`** 结构**
`apiVersion` 由 **API 组** 和 **版本号** 组成：

```plain
[API 组]/[版本]
```

如果是 **核心 API 组 (Core API)**，则 `apiVersion` 只有版本号：

```plain
v1
```

如果是 **非核心 API 组 (扩展 API)**，则 `apiVersion` 需要指定 API 组：

```plain
apps/v1
```

---

## **2. **`v1`**（核心 API 组 Core API）**
`v1` 代表 Kubernetes 的**核心 API 组**，不需要额外的 API 组前缀。它包含了一些 Kubernetes 最基本的资源，例如：

```plain
apiVersion: v1
kind: Pod
```

### **常见 **`v1`** 资源**
| 资源 | 说明 |
| --- | --- |
| `Pod` | 单个容器或多个容器组成的最小部署单元 |
| `Service` | 负载均衡和服务发现 |
| `ConfigMap` | 存储配置数据 |
| `Secret` | 存储敏感信息，如密码、密钥 |
| `PersistentVolume`(PV) | 定义存储资源 |
| `PersistentVolumeClaim`(PVC) | Pod 申请存储 |
| `Namespace` | 命名空间隔离 |
| `Node` | 代表 Kubernetes 集群中的节点 |


**示例：创建 Pod**

```plain
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: nginx
      image: nginx
```

---

## **3. **`apps/v1`**（非核心 API 组）**
`apps/v1` 属于 **Apps API 组**，用于管理控制多个 Pod 的资源，如 Deployment、StatefulSet、DaemonSet 等。

### **常见 **`apps/v1`** 资源**
| 资源 | 说明 |
| --- | --- |
| `Deployment` | 负责无状态应用的管理，支持滚动更新 |
| `StatefulSet` | 负责有状态应用的管理，如数据库 |
| `DaemonSet` | 让每个节点都运行一个 Pod，如日志收集 |
| `ReplicaSet` | 维护指定数量的 Pod 副本 |


**示例：创建 Deployment**

```plain
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: nginx
          image: nginx
```

---

## **4. 其他 API 组**
除了 `v1` 和 `apps/v1`，Kubernetes 还有其他 API 组，如 `batch/v1`、`networking.k8s.io/v1` 等：

| API 组 | 示例 `apiVersion` | 资源 |
| --- | --- | --- |
| **批处理 API (**`**batch**`<br/>**)** | `batch/v1` | `Job`<br/>, `CronJob` |
| **自动扩缩容 (**`**autoscaling**`<br/>**)** | `autoscaling/v2` | `HorizontalPodAutoscaler` |
| **存储 (**`**storage.k8s.io**`<br/>**)** | `storage.k8s.io/v1` | `StorageClass`<br/>, `CSINode` |
| **网络 (**`**networking.k8s.io**`<br/>**)** | `networking.k8s.io/v1` | `Ingress`<br/>, `NetworkPolicy` |
| **角色权限 (**`**rbac.authorization.k8s.io**`<br/>**)** | `rbac.authorization.k8s.io/v1` | `Role`<br/>, `ClusterRole`<br/>, `RoleBinding` |


**示例：创建一个 CronJob**

```plain
apiVersion: batch/v1
kind: CronJob
metadata:
  name: my-cronjob
spec:
  schedule: "*/5 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: myjob
              image: busybox
              command: ["echo", "Hello Kubernetes"]
          restartPolicy: OnFailure
```

---

## **5. 如何查询 API 版本**
如果不确定某个资源的 `apiVersion`，可以使用 `kubectl api-resources` 查询：

```plain
kubectl api-resources
```

示例输出：

```plain
NAME               SHORTNAMES   APIVERSION             KIND
pods              po           v1                     Pod
services          svc          v1                     Service
deployments       deploy       apps/v1                Deployment
statefulsets      sts          apps/v1                StatefulSet
daemonsets        ds           apps/v1                DaemonSet
jobs                           batch/v1               Job
cronjobs                       batch/v1               CronJob
ingresses         ing          networking.k8s.io/v1   Ingress
```

---

## **6. 总结**
| `apiVersion` | 适用资源 | 说明 |
| --- | --- | --- |
| `v1` | `Pod`<br/>, `Service`<br/>, `ConfigMap`<br/>, `Secret`<br/>, `PersistentVolume` | 核心 API 组，适用于基础资源 |
| `apps/v1` | `Deployment`<br/>, `StatefulSet`<br/>, `DaemonSet`<br/>, `ReplicaSet` | 适用于管理多个 Pod |
| `batch/v1` | `Job`<br/>, `CronJob` | 适用于批量任务 |
| `networking.k8s.io/v1` | `Ingress`<br/>, `NetworkPolicy` | 适用于网络管理 |
| `autoscaling/v2` | `HorizontalPodAutoscaler` | 适用于自动扩缩容 |


