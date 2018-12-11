# MR 二次排序

## 规则
在一个数据文件中，首先按照key排序。 
在key相同的情况下，按照value大小排序的情况称为二次排序。

* __自定义key__ ：NewKey实现比较规则
* __自定义GroupingComparator方法__



![image.png | left | 746x379](https://cdn.nlark.com/yuque/0/2018/png/199648/1544530369151-2c799756-df4a-436c-9765-ad9a4294c8e6.png "")

## 原理

<span data-type="color" style="color:rgb(75, 75, 75)"><span data-type="background" style="background-color:rgb(255, 255, 255)"><strong>在map阶段</strong></span></span><span data-type="color" style="color:rgb(75, 75, 75)"><span data-type="background" style="background-color:rgb(255, 255, 255)">，使
用job.setInputFormatClass定义的InputFormat将输入的数据集分割成小数据块splites，同时InputFormat提供一个RecordReder的实现。比如使用的是TextInputFormat，它提供的RecordReder会将文本的一行的行号作为key，这一行的文本作为value。这就是自定义Map的输入是&lt;LongWritable, Text&gt;的原因。然后调用自定义Map的map方法，将一个个&lt;LongWritable, Text&gt;对输入给Map的map方法。注意输出应该符合自定义Map中定义的输出&lt;IntPair, IntWritable&gt;。最终是生成一个List&lt;IntPair, IntWritable&gt;。在map阶段的最后，会先调用</span></span><strong><span data-type="background" style="background-color:rgb(255, 255, 255)"><span data-type="color" style="color:#F5222D">job.setPartitionerClass</span></span></strong><span data-type="color" style="color:rgb(75, 75, 75)"><span data-type="background" style="background-color:rgb(255, 255, 255)">对这个List进行分区，每个分区映射到一个reducer。每个分区内又调用</span></span><strong><span data-type="background" style="background-color:rgb(255, 255, 255)"><span data-type="color" style="color:#F5222D">job.setSortComparatorClass</span></span></strong><span data-type="color" style="color:rgb(75, 75, 75)"><span data-type="background" style="background-color:rgb(255, 255, 255)">设置的key比较函数类排序。可以看到，这本身就是一个二次排序。如果没有通过job.setSortComparatorClass设置key比较函数类，则使用key的实现的compareTo方法。</span></span>

<span data-type="color" style="color:rgb(75, 75, 75)"><span data-type="background" style="background-color:rgb(255, 255, 255)"><strong>在reduce阶段</strong></span></span><span data-type="color" style="color:rgb(75, 75, 75)"><span data-type="background" style="background-color:rgb(255, 255, 255)">，reducer接收到所有映射到这个reducer的map输出后，也是会调用</span></span><span data-type="color" style="color:rgb(75, 75, 75)"><span data-type="background" style="background-color:rgb(255, 255, 255)"><strong>job.setSortComparatorClass</strong></span></span><span data-type="color" style="color:rgb(75, 75, 75)"><span data-type="background" style="background-color:rgb(255, 255, 255)">设置的key比较函数类对所有数据对排序。然后开始构造一个key对应的value迭代器。这时就要用到分组，使用</span></span><strong><span data-type="background" style="background-color:rgb(255, 255, 255)"><span data-type="color" style="color:#F5222D">job.setGroupingComparatorClass</span></span></strong><span data-type="color" style="color:rgb(75, 75, 75)"><span data-type="background" style="background-color:rgb(255, 255, 255)">设置的分组函数类。只要这个比较器比较的两个key相同，他们就属于同一个组，它们的value放在一个value迭代器，而这个迭代器的key使用属于同一个组的所有key的第一个key。最后就是进入Reducer的reduce方法，reduce方法的输入是所有的（key和它的value迭代器）。同样注意输入与输出的类型必须与自定义的Reducer中声明的一致。 </span></span>

## 参数

主要是下面这几个配置参数：

<span data-type="color" style="color:red">job.setPartitionerClass(Partitioner p);</span>

<span data-type="color" style="color:red">job.setSortComparatorClass(RawComparator c);</span>

<span data-type="color" style="color:red">job.setGroupingComparatorClass(RawComparator c);</span>

## 评价交流

> 欢迎留下的你的想法~

<Valine></Valine>
