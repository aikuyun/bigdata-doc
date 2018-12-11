# MapReduce

## MapReduce 是什么

它是一个__分布式__的__离线计算__框架。是一种编程模型，用于大规模（大于 TB）的并行计算，将自己的程序运行在分布式系统上，Map 是映射、Reduce 是归约。__可用于大规模的算法图形处理和文字处理__。

## MapReduce 的设计理念

1.分布式计算
2.移动计算到数据，计算向数据靠拢，也就是将计算程序移动到集群中的数据节点上运行。

## MapReduce 的计算框架组成

计算流程为：<span data-type="color" style="color:rgb(79, 79, 79)"><span data-type="background" style="background-color:rgb(255, 255, 255)">input --&gt; map --&gt; shuffle --&gt;reduce ---&gt;output</span></span>

下面来源于网络，觉得很详细。就以这个图作为依据来说明，mapreduce 的过程。



![image.png | left | 747x355](https://cdn.nlark.com/yuque/0/2018/png/199648/1542028905333-449256b7-1dd8-47ea-b440-490c647eeacf.png "")



## 深入理解 mapreduce
MapReduce 底层到地址如何让运行的呢？

1.客户端要编写好 MapReduce 程序，配置好 MapReduce 的作业（job）

2.接下来提交 job 到 JobTracker 上。JobTracker 复杂构建这个 job , 具体的就是分配一个 job id , 接着检查输入输出目录是否存在等。

## MR架构

__它是一主多从架构。__

__主是 JobTracker （RM）__ , 负责调度分配每一个子任务的运行于 TaskTracker 上。一个 Hadoop 集群一般只有一个 RM, 运行在 Matser 节点上。

__从是 TaskTracker （NM）__, 主动联系 主 ，接收作业，并负责执行每一个任务。为了减少网络带宽，__TaskTrack__ 最好运行在 __HDFS__ 的 __DataNode__ 节点上。

## MR & Yarn 架构

特点:
	1、分布式并行计算
	2、主要核心功能：排序，默认的排序方式是按照key进行排序
概念定义：
	1、MapReduce执行流程涉及到Client、ResourceManager、NodeManager、ApplicationMaster、Container、Task
	2、其中Client是提交Mapreduce的机器
	3、ApplicationMaster是负责该Job调度的进程，一个job一个applicationMaster
	4、Container是资源表示形式
	5、Task是运行在NodeManager上的进程，使用到资源就是Container 
	6、resourcemanager是管理整个集群的资源

	7、nodemanager是单个节点的资源管理



![image.png | left | 747x323](https://cdn.nlark.com/yuque/0/2018/png/199648/1542031075758-2b5c3279-bff0-41ee-a3b3-1d80f7bcbf6b.png "")




![image.png | left | 747x393](https://cdn.nlark.com/yuque/0/2018/png/199648/1542031086462-6d139901-d15f-4051-9a19-b82f7d8579c9.png "")


提交流程：
	1、Clinet向RM申请资源，RM上有所有NM的节点资源信息，RM将资源信息(NM的hostname、以及分配的内存和CPU大小)发送给Client
	2、Client根据请求到资源信息发送到对应的NM，NM中产生Container对象，然后在Container对象中调用相关代码，启动AM 
	3、AM开始获取job相关设置信息，获得得到map task数量(由InputFormat的getSplits方法决定)和reduce task数量(由参数mapreduce.job.reduces影响)
	4、然后AM向RM申请Map Task运行的资源(一个task就需要申请一个container)，RM将分配的资源发送给AM，AM远程调用NM的相关方法启动对应的Container，并在Container中启动对应的Map Task
	5、当一个Map Task执行完成后，会通知AM进程，当前Map Task执行完成；当总Map Task中有5%执行完成，AM向RM申请reduce task运行资源(一个task需要一个container)
	6、RM将资源信息发送给AM，AM在对应的NM节点启动对应的Container，并在Container中运行对应的reduce task任务
	7、当reduce task任务执行完成后，会AM进程，当所有的reduce task执行完成，AM通知client表示程序执行完成

具体执行流程：

1、runjar向resourcemanager申请提交一个job
2、resourcemanager返回job相关的资源提交的路径staging-dir和本job产生的job ID
3、runjar根据路径提交资源/tmp/hadoop-yarn/staging/job ID
4、runjar向resourcemanager回报提交结果
5、resourcemanager将job加入任务队列
6、nodemanager向resourcemanager领取任务
7、resourcemanager向nodemanager分配运行资源容器container
8、resourcemanager启动MRappMaster
9、MRappMaster向resourcemanager注册相关信息
10、启动map task 任务
11、启动reduce task 任务
12、job完成以后MRappMaster向resourcemanager注销自己


## 深入理解 shuffle

__MapReduce的Shuffle过程介绍__

Shuffle的本义是__洗牌、混洗__，把一组有一定规则的数据尽量转换成一组无规则的数据，越随机越好。MapReduce中的Shuffle更像是洗牌的逆过程，__把一组无规则的数据尽量转换成一组具有一定规则的数__据。

为什么 MapReduce 计算模型需要 Shuffle 过程？我们都知道 MapReduce 计算模型一般包括两个重要的阶段：Map 是映射，负责数据的过滤分发；Reduce 是规约，负责数据的计算归并。Reduce 的数据来源于 Map，Map 的输出即是 Reduce 的输入，Reduce 则需要通过 Shuffle 来获取数据。

从Map输出到Reduce输入的整个过程可以广义地称为Shuffle。Shuffle横跨Map端和Reduce端，在Map端包括Spill过程，在Reduce端包括copy和sort过程，如图所示：



![image.png | left | 747x304](https://cdn.nlark.com/yuque/0/2018/png/199648/1542030867993-fb78d502-f22d-4f40-8288-25a6a6a48f6c.png "")



__Spill过程__

Spill过程包括输出、排序、溢写、合并等步骤，如图所示：




![image.png | left | 620x176](https://cdn.nlark.com/yuque/0/2018/png/199648/1542030884941-b91931a9-223f-4cd4-a750-0048db8c9fa4.png "")


__Collect__

每个Map任务不断地以键值对的形式把数据输出到在内存中构造的一个环形数据结构中。使用环形数据结构是为了更有效地使用内存空间，在内存中放置尽可能多的数据。

这个数据结构其实就是个字节数组，叫Kvbuffer，名如其义，但是这里面不光放置了数据，还放置了一些索引数据，给放置索引数据的区域起了一个Kvmeta的别名，在Kvbuffer的一块区域上穿了一个IntBuffer（字节序采用的是平台自身的字节序）的马甲。数据区域和索引数据区域在Kvbuffer中是相邻不重叠的两个区域，用一个分界点来划分两者，分界点不是亘古不变的，而是每次Spill之后都会更新一次。初始的分界点是0，数据的存储方向是向上增长，索引数据的存储方向是向下增长，如图所示：


![image.png | left | 576x177](https://cdn.nlark.com/yuque/0/2018/png/199648/1542030922943-c5752822-78e1-442e-a1fc-610768bdc09c.png "")


Kvbuffer的存放指针bufindex是一直闷着头地向上增长，比如bufindex初始值为0，一个Int型的key写完之后，bufindex增长为4，一个Int型的value写完之后，bufindex增长为8。

索引是对在kvbuffer中的索引，是个四元组，包括：value的起始位置、key的起始位置、partition值、value的长度，占用四个Int长度，Kvmeta的存放指针Kvindex每次都是向下跳四个“格子”，然后再向上一个格子一个格子地填充四元组的数据。比如Kvindex初始位置是-4，当第一个写完之后，(Kvindex+0)的位置存放value的起始位置、(Kvindex+1)的位置存放key的起始位置、(Kvindex+2)的位置存放partition的值、(Kvindex+3)的位置存放value的长度，然后Kvindex跳到-8位置，等第二个和索引写完之后，Kvindex跳到-32位置。

Kvbuffer的大小虽然可以通过参数设置，但是总共就那么大，和索引不断地增加，加着加着，Kvbuffer总有不够用的那天，那怎么办？把数据从内存刷到磁盘上再接着往内存写数据，把Kvbuffer中的数据刷到磁盘上的过程就叫Spill，多么明了的叫法，内存中的数据满了就自动地spill到具有更大空间的磁盘。

关于Spill触发的条件，也就是Kvbuffer用到什么程度开始Spill，还是要讲究一下的。如果把Kvbuffer用得死死得，一点缝都不剩的时候再开始Spill，那Map任务就需要等Spill完成腾出空间之后才能继续写数据；如果Kvbuffer只是满到一定程度，比如80%的时候就开始Spill，那在Spill的同时，Map任务还能继续写数据，如果Spill够快，Map可能都不需要为空闲空间而发愁。两利相衡取其大，一般选择后者。

Spill这个重要的过程是由Spill线程承担，Spill线程从Map任务接到“命令”之后就开始正式干活，干的活叫SortAndSpill，原来不仅仅是Spill，在Spill之前还有个颇具争议性的Sort。

__Sort__

先把Kvbuffer中的数据按照partition值和key两个关键字升序排序，移动的只是索引数据，排序结果是Kvmeta中数据按照partition为单位聚集在一起，同一partition内的按照key有序。

__Spill__

Spill线程为这次Spill过程创建一个磁盘文件：从所有的本地目录中轮训查找能存储这么大空间的目录，找到之后在其中创建一个类似于“spill12.out”的文件。Spill线程根据排过序的Kvmeta挨个partition的把数据吐到这个文件中，一个partition对应的数据吐完之后顺序地吐下个partition，直到把所有的partition遍历完。一个partition在文件中对应的数据也叫段(segment)。

所有的partition对应的数据都放在这个文件里，虽然是顺序存放的，但是怎么直接知道某个partition在这个文件中存放的起始位置呢？强大的索引又出场了。有一个三元组记录某个partition对应的数据在这个文件中的索引：起始位置、原始数据长度、压缩之后的数据长度，一个partition对应一个三元组。然后把这些索引信息存放在内存中，如果内存中放不下了，后续的索引信息就需要写到磁盘文件中了：从所有的本地目录中轮训查找能存储这么大空间的目录，找到之后在其中创建一个类似于“spill12.out.index”的文件，文件中不光存储了索引数据，还存储了crc32的校验数据。(spill12.out.index不一定在磁盘上创建，如果内存（默认1M空间）中能放得下就放在内存中，即使在磁盘上创建了，和spill12.out文件也不一定在同一个目录下。)

每一次Spill过程就会最少生成一个out文件，有时还会生成index文件，Spill的次数也烙印在文件名中。索引文件和数据文件的对应关系如下图所示：



![image.png | left | 544x379](https://cdn.nlark.com/yuque/0/2018/png/199648/1542030940698-4b484c92-fa5f-4fde-8f3d-63ec914b54a8.png "")


在Spill线程如火如荼的进行SortAndSpill工作的同时，Map任务不会因此而停歇，而是一无既往地进行着数据输出。Map还是把数据写到kvbuffer中，那问题就来了：只顾着闷头按照bufindex指针向上增长，kvmeta只顾着按照Kvindex向下增长，是保持指针起始位置不变继续跑呢，还是另谋它路？如果保持指针起始位置不变，很快bufindex和Kvindex就碰头了，碰头之后再重新开始或者移动内存都比较麻烦，不可取。Map取kvbuffer中剩余空间的中间位置，用这个位置设置为新的分界点，bufindex指针移动到这个分界点，Kvindex移动到这个分界点的-16位置，然后两者就可以和谐地按照自己既定的轨迹放置数据了，当Spill完成，空间腾出之后，不需要做任何改动继续前进。分界点的转换如下图所示：


![image.png | left | 591x376](https://cdn.nlark.com/yuque/0/2018/png/199648/1542030948718-dd318e24-e3cb-4df0-a407-5a6c1bfbb64c.png "")



Map任务总要把输出的数据写到磁盘上，即使输出数据量很小在内存中全部能装得下，在最后也会把数据刷到磁盘上。

__Merge__

Map任务如果输出数据量很大，可能会进行好几次Spill，out文件和Index文件会产生很多，分布在不同的磁盘上。最后把这些文件进行合并的merge过程闪亮登场。

Merge过程怎么知道产生的Spill文件都在哪了呢？从所有的本地目录上扫描得到产生的Spill文件，然后把路径存储在一个数组里。Merge过程又怎么知道Spill的索引信息呢？没错，也是从所有的本地目录上扫描得到Index文件，然后把索引信息存储在一个列表里。到这里，又遇到了一个值得纳闷的地方。在之前Spill过程中的时候为什么不直接把这些信息存储在内存中呢，何必又多了这步扫描的操作？特别是Spill的索引数据，之前当内存超限之后就把数据写到磁盘，现在又要从磁盘把这些数据读出来，还是需要装到更多的内存中。之所以多此一举，是因为这时kvbuffer这个内存大户已经不再使用可以回收，有内存空间来装这些数据了。（对于内存空间较大的土豪来说，用内存来省却这两个io步骤还是值得考虑的。）

然后为merge过程创建一个叫file.out的文件和一个叫file.out.Index的文件用来存储最终的输出和索引。

一个partition一个partition的进行合并输出。对于某个partition来说，从索引列表中查询这个partition对应的所有索引信息，每个对应一个段插入到段列表中。也就是这个partition对应一个段列表，记录所有的Spill文件中对应的这个partition那段数据的文件名、起始位置、长度等等。

然后对这个partition对应的所有的segment进行合并，目标是合并成一个segment。当这个partition对应很多个segment时，会分批地进行合并：先从segment列表中把第一批取出来，以key为关键字放置成最小堆，然后从最小堆中每次取出最小的输出到一个临时文件中，这样就把这一批段合并成一个临时的段，把它加回到segment列表中；再从segment列表中把第二批取出来合并输出到一个临时segment，把其加入到列表中；这样往复执行，直到剩下的段是一批，输出到最终的文件中。

最终的索引数据仍然输出到Index文件中。


![image.png | left | 590x235](https://cdn.nlark.com/yuque/0/2018/png/199648/1542030970368-39564007-a353-4126-a142-d2a7a63242af.png "")


Map端的Shuffle过程到此结束。

__Copy__

Reduce任务通过HTTP向各个Map任务拖取它所需要的数据。每个节点都会启动一个常驻的HTTP server，其中一项服务就是响应Reduce拖取Map数据。当有MapOutput的HTTP请求过来的时候，HTTP server就读取相应的Map输出文件中对应这个Reduce部分的数据通过网络流输出给Reduce。

Reduce任务拖取某个Map对应的数据，如果在内存中能放得下这次数据的话就直接把数据写到内存中。Reduce要向每个Map去拖取数据，在内存中每个Map对应一块数据，当内存中存储的Map数据占用空间达到一定程度的时候，开始启动内存中merge，把内存中的数据merge输出到磁盘上一个文件中。

如果在内存中不能放得下这个Map的数据的话，直接把Map数据写到磁盘上，在本地目录创建一个文件，从HTTP流中读取数据然后写到磁盘，使用的缓存区大小是64K。拖一个Map数据过来就会创建一个文件，当文件数量达到一定阈值时，开始启动磁盘文件merge，把这些文件合并输出到一个文件。

有些Map的数据较小是可以放在内存中的，有些Map的数据较大需要放在磁盘上，这样最后Reduce任务拖过来的数据有些放在内存中了有些放在磁盘上，最后会对这些来一个全局合并。

__Merge Sort__

这里使用的Merge和Map端使用的Merge过程一样。Map的输出数据已经是有序的，Merge进行一次合并排序，所谓Reduce端的sort过程就是这个合并的过程。一般Reduce是一边copy一边sort，即copy和sort两个阶段是重叠而不是完全分开的。

Reduce端的Shuffle过程至此结束。


## 评价交流

> 欢迎留下的你的想法~

<Valine></Valine>
