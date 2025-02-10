## 项目背景
单个请求有60条日志，日活用户约2w5，每个用户一分钟一个请求保底，日志有审计要求需要保留180天，研发排查问题需要查看七天内的日志。



## 优化<font style="color:rgb(24, 24, 24);">Logstore数据保存时间</font>
从需求出发，确定好日志需要多久可以让研发查看，比如我这里是七天，我就会设置日志保存时间在七天。

但如果需要更多的日志查询范围，可以采用日志存储分层，将日志分成热存储/低频存储/归档存储，做好分层之后在SLS中依然可以进行直接查询。



如何设置保存时间   官网链接[https://www.alibabacloud.com/help/zh/sls/user-guide/manage-a-logstore?spm=a2c63.p38356.help-menu-28958.d_2_0_3.26be32ceuPXKnu&scm=20140722.H_48990._.OR_help-T_intl~zh-V_1](https://www.alibabacloud.com/help/zh/sls/user-guide/manage-a-logstore?spm=a2c63.p38356.help-menu-28958.d_2_0_3.26be32ceuPXKnu&scm=20140722.H_48990._.OR_help-T_intl~zh-V_1)

如何设置数据分层  官网链接[https://www.alibabacloud.com/help/zh/sls/user-guide/data-tiered-storage-overview?spm=a2c63.p38356.0.i9](https://www.alibabacloud.com/help/zh/sls/user-guide/data-tiered-storage-overview?spm=a2c63.p38356.0.i9)



## 优化日志索引
SLS的Logstore默认开启的是全文索引，会造成索引占用空间过大，所以在有日志以后可以重建索引。



如何重建索引 官网链接[https://help.aliyun.com/zh/sls/user-guide/reindex-logs-for-a-logstore?spm=a2c4g.11186623.help-menu-28958.d_2_5_0_4.2a3d2925bStfy4](https://help.aliyun.com/zh/sls/user-guide/reindex-logs-for-a-logstore?spm=a2c4g.11186623.help-menu-28958.d_2_5_0_4.2a3d2925bStfy4)



## 日志归档
不再需要的日志可以使用OSS投递功能，将日志投递到存储费用更低的OSS中，OSS甚至可以设置深度归档冷存储



如何创建OSS投递任务  官网链接[https://help.aliyun.com/zh/sls/user-guide/create-an-oss-shipping-job?spm=a2c4g.11186623.0.0.63627c5eWLA5zK#task-2156382](https://help.aliyun.com/zh/sls/user-guide/create-an-oss-shipping-job?spm=a2c4g.11186623.0.0.63627c5eWLA5zK#task-2156382)

OSS存储类型介绍  官网链接[https://help.aliyun.com/zh/oss/user-guide/overview-53/?spm=a2c4g.11174283.help-menu-31815.d_2_1.d2f87959OLxkNA](https://help.aliyun.com/zh/oss/user-guide/overview-53/?spm=a2c4g.11174283.help-menu-31815.d_2_1.d2f87959OLxkNA)





## OSS定期清理
使用OSS生命周期管理，清理超过180天的日志



如何使用OSS生命周期管理  官网链接[https://help.aliyun.com/zh/oss/user-guide/configuration-examples?spm=a2c4g.11186623.help-menu-31815.d_2_11_2_1_4.759e5eaeki8NUc&scm=20140722.H_160576._.OR_help-T_cn~zh-V_1](https://help.aliyun.com/zh/oss/user-guide/configuration-examples?spm=a2c4g.11186623.help-menu-31815.d_2_11_2_1_4.759e5eaeki8NUc&scm=20140722.H_160576._.OR_help-T_cn~zh-V_1)

