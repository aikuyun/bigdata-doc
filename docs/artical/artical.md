# 技术文章集合

## kafka

1.kafka offset 介绍 [查看文章](https://blog.csdn.net/qq_37502106/article/details/80409748)

2.zookeeper + kafka 的leader机制 [查看文章](https://blog.csdn.net/qq_37502106/article/details/80260415)

3.kafka 一致性的重要机制 ISR，leader会维护一个与其基本保持同步的Replica列表，该列表称为ISR(in-sync Replica)，每个Partition都会有一个ISR，而且是由leader动态维护。如果一个follower比一个leader落后太多，或者超过一定时间未发起数据复制请求，则leader将其重ISR中移除. 当ISR中所有Replica都向Leader发送ACK时，leader才commit [查看文章](https://blog.csdn.net/qq_37502106/article/details/80271800)


## JAVA

1.ConcurentHashMap 在JDK7 和 JDK8中的区别。JDK7中采用**分段锁**的机制，JDK8中采用了 CAS算法。[查看文章](https://blog.csdn.net/woaiwym/article/details/80675789)

2.Java7/8 中的 HashMap 和 ConcurrentHashMap 全解析 [查看文章](http://www.importnew.com/28263.html)

## Spark

0.Spark SQL 官方文章，必看。[查看文章](http://spark.apache.org/docs/1.6.3/sql-programming-guide.html)

1.Spark Sql 的二次排序取 Top N [查看文章](https://blog.csdn.net/wangpei1949/article/details/66978412)

2.Spark Sql 使用hiveContext [查看文章](https://blog.csdn.net/qq_41455420/article/details/79515511)

3.Spark 分组TopN [查看文章](https://blog.csdn.net/luofazha2012/article/details/80636858)

4.Spark中foreachPartition和mapPartitions的区别 [查看文章](https://blog.csdn.net/u010454030/article/details/78897150)

5.谓词下推 [查看文章](https://blog.csdn.net/zxm1306192988/article/details/80255747)

6.Spark 数据本地化。 [查看文章](https://www.cnblogs.com/jxhd1/p/6702224.html?utm_source=itdadao&utm_medium=referral)

## HDFS

0.HDFS 的知识点总结 [查看文章](https://www.cnblogs.com/caiyisen/p/7395843.html)

1.初识 HDFS [查看文章](https://www.cnblogs.com/wxplmm/p/7239342.html)

2.Hadoop 集群里面的端口 [查看文章](https://www.cnblogs.com/waterfish/articles/4533076.html)
## 系统

0.Ubuntu 18.04 网络配置，改动了。[查看文章](https://help.ubuntu.com/lts/serverguide/network-configuration.html.zh-CN)

## zookeeper

0.查看集群的状态。[查看文章](https://blog.csdn.net/luoww1/article/details/76078772)
