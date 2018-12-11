# 数据倾斜
## 什么是数据倾斜

> 数据在集群上处理时,会被分配到各个节点上,当数据分配不均匀时,个别节点的数据量特别多,会导致整个任务变慢,甚至出现内存溢出程序失败的情况。

## Map端倾斜(比较少见)

* Map端每个节点处理的数据量由InputFormat决定.
* 对于输入数据是HDFS上的文件,FileInputFormat已经做好了分片.
* 自定义的InputFormat注意要在getSplit方法中将数据均匀分片.

##  Reduce端倾斜

* Map端输出的几个Key值的数据量特别大

    * 根据业务场景,过滤掉一些没有用的Key值,比如空值.
    * 当Reduce端要聚合成一个值的运算(比如累加),可以先在Map端设置Combine操作,提前将数据聚合.
    * 自定义Partition类,编写特定的getPartition函数使Key值分配均匀.

## 关联Join数据倾斜

* 将Reducer Join转化为Map Join.



![ReduceJoin转MapJoin | left](https://github.com/jiaoqiyuan/163-bigdate-note/raw/master/%E6%97%A5%E5%BF%97%E8%A7%A3%E6%9E%90%E5%8F%8A%E8%AE%A1%E7%AE%97%EF%BC%9AMR/img/ReduceJoin%E8%BD%ACMapJoin.png "")


> 注意只有在一个小表和一个大表做Join的时候才能这样优化.

* 将Key值加上N以内的随机数前缀进行扩容(比较常用的方法)



![关联数据倾斜2 | left](https://github.com/jiaoqiyuan/163-bigdate-note/raw/master/%E6%97%A5%E5%BF%97%E8%A7%A3%E6%9E%90%E5%8F%8A%E8%AE%A1%E7%AE%97%EF%BC%9AMR/img/Key%E5%80%BC%E5%8A%A0N%E4%BB%A5%E5%86%85%E9%9A%8F%E6%9C%BA%E6%95%B0.png "")


## 解决

__补充：__

1.<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">参数</span></span><span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)"><strong>hive.groupby.skewindata = true</strong></span></span><span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">,解决数据倾斜的万能钥匙，查询计划会有两个 MR </span></span>[Job](http://www.verydemo.com/demo_c152_i9269.html)<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">。第一个 MR Job 中，Map 的输出结果集合会随机分布到 Reduce 中，每个 Reduce 做部分聚合操作，并输出结果，这样处理的结果是相同的 Group By Key 有可能被分发到不同的 Reduce 中，从而达到负载均衡的目的；第二个 MR Job 再根据预处理的数据结果按照 Group By Key 分布到 Reduce 中（这个过程可以保证相同的 Group By Key 被分布到同一个 Reduce 中），最后完成最终的聚合操作。</span></span>
2.<span data-type="color" style="color:rgb(0, 0, 0)"><span data-type="background" style="background-color:rgb(254, 254, 242)"><strong>MapJoin</strong></span></span><span data-type="color" style="color:rgb(0, 0, 0)"><span data-type="background" style="background-color:rgb(254, 254, 242)">会把小表全部读入内存中，在map阶段直接拿另外一个表的数据和内存中表数据做匹配。hive的where条件本身就是在map阶段进行的操作，</span></span><span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">where的条件写在join里面，使得减少join的数量。</span></span>

## 评价交流

> 欢迎留下的你的想法~

<Valine></Valine>
