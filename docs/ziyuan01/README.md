# 大数据

## HDFS

### 如何学习大数据？

大数据生态有什么？
![image.png | left | 747x434](https://cdn.nlark.com/yuque/0/2018/png/199648/1541505323203-074507a4-3e06-44ed-99bb-bda10f11f9f5.png "")

共同点是：都是分布式的。
__分布式就是将庞大的数据，复杂的业务分发到不同的计算机节点和服务器上进行处理。__

为什么使用分布式呢？要从大数据的角度思考🤔 :tada:
1.效率高，处理快
2.单点限制，给单机解压
3.可扩展，添加更多的节点
4.安全稳定，一个节点宕机，另一个节点可以接替。

__大数据架构层面看问题，。__

__分布式计算就是将庞大的数据，复杂的业务分发到不同的计算机节点和服务器上进行处理。__
发展：03年Google 发表三篇论文，分别是 GFS,mapreduce,bigtable的思想，分别对应后来出现的 HDFS，mapreduce,Hbase
06年 __Docu cutting__ 推出 Hadoop，现在就职于 __Cloudra__ 公司。
阿里飞天2.0完成重大如破！！！

等等上述这些都是大数据的基石，这个时代研究大数据是很有意义的。时代在进步...

### HDFS 是什么？

它是一个__分布式文件存储系统，__全称是 __Hadoop Distributed File System 。 __为什么会出现这个呢？想象一个场景，数据随着业务的增长飞快的积累，达到了PB甚至更大的量级，这时候受网络带宽和单机节点的资源限制的影响，海量的数据无法进行存储，如何存储，万一数据丢了怎么办？这一系列问题，在 HDFS 中都将迎刃而解。__<span data-type="color" style="color:#F5222D">HDFS 就是解决海量数据的存储问题</span>__。百度网盘就是一个现实的例子，它的成功离不开 分布式存储技术。

科普：
PB = 1024TB
TB = 1024GB
GB = 1024MB
MB = 1024KB

假设这里有 一个带宽为 4000M 的网络，<span data-type="color" style="color:rgb(51, 51, 51)"><span data-type="background" style="background-color:rgb(255, 255, 255)">带宽是以 bit（比特）表示，而电信，联通，移动等运营商在推广的时候往往忽略了这个单位。</span></span>
所以实际处理处理速度是 4000/8=500m/s

传输 __1TB__ 的数据，大概是 2097秒 约等于 34 分钟。
传输 1PB 的数据 ，大概是 596 小时 约等于 24 天。这还是在没有其他因素的影响下。注意 PB 级别的数据是大数据的入门级别的数据。可见处理海量数据，单机是很难高效的进行的，需要利用分布式来存储和计算海量数据。

### HDFS 的优缺点

优点：
* 处理海量数据，TB , PB ...
* 支持处理百万规模以上的文件数量， __10k+节点__
* __<span data-type="color" style="color:#F5222D">适合批处理</span>__ ，__移动计算而非数据，数据位置暴露给计算框架__
* 可构建在廉价机器上
* 可靠性高，多个副本
* 自动创建多个副本，副本丢失后自动恢复，<span data-type="color" style="color:#F5222D"><strong>高容错性</strong></span>

缺点：
* 不支持毫秒级别
* 吞吐量达但受限于延迟
* 不允许修改文件（其实本身支持，但不这么做，为了性能）

### HDFS 1.x 架构图



![image.png | left | 747x488](https://cdn.nlark.com/yuque/0/2018/png/199648/1541508154349-d5d9e29b-922d-4cfa-8ade-9cac1b2cbfb8.png "")


上述红字部分是这个架构存在的问题，后面还提到__ fsimage__ 太大之后消耗内存的问题。

由上图可见，HDFS主要的部分有 __NameNode , DateNode , Secondeary Namenode__

### HDFS 功能模块详解

#### __HDFS 数据存储模型(逻辑上)__

文件被__<span data-type="color" style="color:#F5222D">线性切分</span>__为固定大小的 block 块。通过偏移量（offset）进行标记。
1.x版本的默认 block 块为 64 M
2.x版本的默认 block 块为 128 M

#### __存储方式__

按__固定大小__切分为若干个 __block__ ,存储到不同的节点上。
默认情况下，每个 block 都有额外的两个副本，共三份。
副本数不能大于节点数，（同一个节点就出现相同的副本了，没有意义）

文件上传时，可以通过 HDFS 客户端设置 文件的副本数和 block 大小，该文件一旦上传之后，副本数可以修改，但是 block 的大小就不能改了。



![image.png | left | 747x496](https://cdn.nlark.com/yuque/0/2018/png/199648/1541508828396-0347d0da-bbcb-40dd-87b6-afdd4b8d24b4.png "")


#### __NameNode__

简称 NN , 主要是干什么的呢？

观察之前的结构图，也可以看出，不管是文件的读取和写入都是要经过 NameNode 节点的，而且 NameNode 节点接受来自 DataNode 的心跳数据，而且还会存储文件的元数据（文件大小，归属，权限，偏移量列表即说明一个完整的文件包含哪些 block ）

综上，NameNode 主要干这样事情：

* 接受客户端的读、写
* 接收 DN 汇报 block 列表
* 保存元数据，元数据是基于内存的。数据包括文件的大小，归属，偏移量列表等
* <strong>block 的位置信息，在启动的时候上报给 NN,并且动态更新。</strong><strong><span data-type="color" style="color:#F5222D">一般是3秒一次</span></strong>

说明：

NameNode 如果10分钟没有收到 DN 的汇报，就会认为这个节点 lost 了，然后把缺失的副本在别的节点上增加一份。

NameNode 启动之后，会加载元数据到内存中，也会创建一份镜像文件 fsimage.

block 位置信息不会保存到 fsimage

eidts 记录对元数据的操作日志。

#### __Secondary NameNode__

它的主要工作主要是帮助NN合并 edits 和元数据，减少 NN 启动时间。

执行合并的时间和机制：

* 根据配置文件配置时间间隔：fs.checkppint.period , 默认为 3600 秒
* 根据配置文件设置 edits log 的大小，fs.checkpoint.size 默认为 64 MB

合并流程：图示



![image.png | left | 747x590](https://cdn.nlark.com/yuque/0/2018/png/199648/1541512723822-4962dfa8-4d5a-43ff-b44e-aa9f64760674.png "")


步骤一：__SSN __在一个 checkpoint 时间点和 __NameNode __进行通信，请求 NameNode 停止使用 edits 文件记录相关操作而是暂时将新的 Write 操作写到新的文件 edits.new 来。

步骤二：SSN 通过 <span data-type="color" style="color:#F5222D"><strong>HTTP GET </strong></span>的方式从 __NameNode __中将 __fsimage__和__edits __文件下载回来本地目录中。

步骤三：SSN中合并 edits 和 fsimage 。<span data-type="color" style="color:#F5222D"><strong>SSN 将从 NameNode 中下载回来的 fsimage 加载到内存中，然后逐条 执行 edits 文件中的各个操作项，使得加载到内存中的 fsimage 中包含 edits 中的操作，这个过程就是所谓的合并了。</strong></span>

步骤四：在 SSN 中合并完 fsimage 和 edits 文件后，需要将新的 fsimage 回传到 NameNode 上，这个是通过__<span data-type="color" style="color:#F5222D">HTTP POST </span>__方式进行的。

步骤五：__NameNode __将从 SSN 接收到的新的 fsimage 替换掉旧的 fsimage 。同时将 edits.new 文件转换为通常的 edits 文件，这样 edits 文件的大小就得到减少了。SSN 整个合并以及和 NameNode 的交互过程到这里已经结束。


一个亿的 block 的元数据会占用138G的内存。可见，元数据太大，会大量占用服务器的内存资源


#### __DataNode __

就是用来存储数据的。逻辑上分为各个block 块

这里有一个 block 块的放置策略：
* 第一个副本，如果在集群内部会放到上传的这台服务器的 DN 上。如果是集群外，则会随机找一个空闲的机器。
* 第二个副本，放置在与第一个副本 <span data-type="color" style="color:#F5222D"><strong>不同机架 </strong></span>的节点上。
* 第三个副本，放置在与第二个副本 相同机架 的 不同 节点上。
* 更多 副本，随机



![image.png | left | 747x540](https://cdn.nlark.com/yuque/0/2018/png/199648/1541513477121-1a141885-bde2-4246-8822-d3af5ed0bc75.png "")


机架，<span data-type="color" style="color:rgb(51, 51, 51)"><span data-type="background" style="background-color:rgb(255, 255, 255)">这种结构的多为功能型服务器。机房里面可以见到，不同网段，</span></span><span data-type="background" style="background-color:rgb(255, 255, 255)"><span data-type="color" style="color:#F5222D"><strong>Hadoop源码里面提供了感知机架（机架感应）的代码。</strong></span></span>

#### __HDFS的读流程__



![image.png | left | 747x447](https://cdn.nlark.com/yuque/0/2018/png/199648/1541823943595-589f23e3-efe0-4146-bd92-e9e4be512996.png "")


角色：HDFS Client , NameNode, DateNode

1,首先 HDFS 调用 FileSystem 对象的 Open 方法获取一个 DistributedFileSystem 实例；
2,DistributedFileSystem 通过 __RPC协议__ 获取第一批 block localtions（第一批 block 块的位置），__<span data-type="color" style="color:#F5222D">同一个 block 和副本都会返回位置信息，这些位置信息按照 hadoop 的拓扑结构给这些位置排序，就近原则。</span>__
3.前两部会生成一个 FSDataInputStream ，该对象会被封装 DFSInputStream 对象，DFSInputStream 可以方便的管理 datanode 和 namenode 数据流。客户端调用 read 方法，DFSInputStream 最会找出离客户端最近的 datanode 并连接。
4.__数据从 datanode 源源不断的流向客户端__。这些操作对客户端来说是透明的，客户端的角度看来只
是读一个持续不断的流。

5.如果第一批 block 都读完了， DFSInputStream 就会去 namenode 拿下一批 block 的 locations，然后继续读，如果所有的块都读完，这时就会关闭掉所有的流。如果在读数据的时候， __<span data-type="color" style="color:#F5222D">DFSInputStream 和 datanode的通讯发生异常，就会尝试正在读的 block 的排序第二近的datanode,并且会记录哪个 datanode 发生错误，剩余的blocks 读的时候就会直接跳过该 datanode。</span>__
DFSInputStream 也会<span data-type="color" style="color:#F5222D"><strong>检查 block 数据校验和</strong></span>，如果发现一个坏的 block ,就会先报告到 namenode 节点，然后DFSInputStream 在其他的 datanode 上读该 block 的镜像。该设计就是客户端直接连接 datanode 来检索数据并且namenode 来负责为每一个 block 提供最优的 datanode，namenode 仅仅处理 block location 的请求，这些信息都加载在 namenode 的内存中，hdfs 通过 datanode 集群可以承受大量客户端的并发访问。

<span data-type="color" style="color:rgb(20.000000%, 20.000000%, 20.000000%)">RPC 跨越了</span><span data-type="color" style="color:rgb(7.450000%, 43.100000%, 76.100000%)">传输层</span><span data-type="color" style="color:rgb(20.000000%, 20.000000%, 20.000000%)">和</span><span data-type="color" style="color:rgb(7.450000%, 43.100000%, 76.100000%)">应用层</span><span data-type="color" style="color:rgb(20.000000%, 20.000000%, 20.000000%)">。</span><span data-type="color" style="color:rgb(20.000000%, 20.000000%, 20.000000%)"><span data-type="background" style="background-color:rgb(100.000000%, 100.000000%, 100.000000%)">RPC 使得开发包括网络</span></span><span data-type="color" style="color:rgb(7.450000%, 43.100000%, 76.100000%)"><span data-type="background" style="background-color:rgb(100.000000%, 100.000000%, 100.000000%)">分布式</span></span><span data-type="color" style="color:rgb(20.000000%, 20.000000%, 20.000000%)"><span data-type="background" style="background-color:rgb(100.000000%, 100.000000%, 100.000000%)">多程序在内的应用程序更加容易。</span></span>

#### __HDFS的写流程__



![image.png | left | 747x540](https://cdn.nlark.com/yuque/0/2018/png/199648/1541825912702-70ffd0db-65ff-44fc-9007-d8d7f0ff5c7e.png "")

<span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">1.</span>客户端通过调用 DistributedFileSystem 的 create 方法创建新文件。

<span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">2.</span>DistributedFileSystem 通过 RPC 调用 namenode 去创建一个没有 blocks 关联的新文件，<span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">创建前， namenode 会做各种校验，比如文件是否存在，客户端有无权限去创建等</span>。如果校验通过， namenode 就会记录下新文件，否则就会抛出<span data-type="color" style="color:rgb(100.000000%, 0.000000%, 0.000000%)">IO</span>异常。    

<span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">3.</span>前两步结束后，会返回 FSDataOutputStream 的对象，与读文件的时候相似，FSDataOutputStream 被封装成DFSOutputStream。
DFSOutputStream 可以协调 namenode 和 datanode。客户端开始写数据到 DFSOutputStream，DFSOutputStream 会把数
据切成一个个小的 <span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">packet</span>，<span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">然后排成队列 data quene</span>。

<span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">4</span>.DataStreamer 会去处理接受 data quene，它先询问namenode 这个新的 block 最适合存储的在哪几个 datanode。

里(比如重复数是 3，那么就找到 3 个最适合的 datanode)，把他们排成一个<span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">管道 pipeline 输出</span>。DataStreamer 把packet 按队列输出到管道的第一个 datanode 中，第一个datanode 又把 packet 输出到第二个 datanode 中，以此类推。

<span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">5.</span>DFSOutputStream 还有一个对列叫 ack quene，也是由 packet 组成等待 datanode 的收到响应，当 pipeline 中的 datanode 都表示已经收到数据的时候，这时 ack quene才会把对应的 packet 包移除掉。 如果在写的过程中某个datanode 发生错误，会采取以下几步:

* pipeline 被关闭掉;

* 为了防止防止丢包。ack quene 里的 packet 会同步到 data quene 里;创建新的 pipeline 管道怼到其他正常 DN上

* 剩下的部分被写到剩下的两个正常的 datanode 中;

* namenode 找到另外的 datanode 去创建这个块的复制。当然，这些操作对客户端来说是无感知的。

<span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">6.</span>客户端完成写数据后调用 close 方法关闭写入流。<span data-type="color" style="color:rgb(26.700000%, 26.700000%, 26.700000%)"><span data-type="background" style="background-color:rgb(94.900000%, 94.900000%, 94.900000%)">深入 DFSOutputStream 内部原理</span></span>

<span data-type="color" style="color:rgb(26.700000%, 26.700000%, 26.700000%)"><span data-type="background" style="background-color:rgb(94.900000%, 94.900000%, 94.900000%)">打开一个 DFSOutputStream 流，Client 会写数据到流内部的一个缓冲区中，然后数据被分解成多个 Packet，每个Packet 大小为 64k 字节，每个 Packet 又由一组 chunk 和这组 chunk 对应的 checksum 数据组成，默认 chunk 大小为 512</span></span><span data-type="color" style="color:rgb(26.700000%, 26.700000%, 26.700000%)">字节，每个 checksum 是对 512 字节数据计算的校验和数据。</span>

<span data-type="color" style="color:rgb(26.700000%, 26.700000%, 26.700000%)"><span data-type="background" style="background-color:rgb(94.900000%, 94.900000%, 94.900000%)">===》当 Client 写入的字节流数据达到一个 Packet 的长度，这个 Packet 会被构建出来，然后会被放到队列dataQueue 中，接着 DataStreamer 线程会不断地从dataQueue 队列中取出 Packet，发送到复制 Pipeline 中的第一个 DataNode 上，并将该 Packet 从 dataQueue 队列中移到 ackQueue 队列中。ResponseProcessor 线程接收从Datanode 发送过来的 ack，如果是一个成功的 ack，表示复</span></span><span data-type="color" style="color:rgb(26.700000%, 26.700000%, 26.700000%)">制 Pipeline 中的所有 Datanode 都已经接收到这个 Packet，ResponseProcessor 线程将 packet 从队列 ackQueue 中删除。</span>

<span data-type="color" style="color:rgb(26.700000%, 26.700000%, 26.700000%)"><span data-type="background" style="background-color:rgb(94.900000%, 94.900000%, 94.900000%)">====》 在发送过程中，如果发生错误，错误的数据节点会被移除掉，ackqueue 数据块同步到 dataqueue 中，然后重新创建一个新的 Pipeline，排除掉出错的那些 DataNode节点，接着 DataStreamer 线程继续从 dataQueue 队列中发送 Packet。</span></span>

<span data-type="color" style="color:rgb(26.700000%, 26.700000%, 26.700000%)"><span data-type="background" style="background-color:rgb(94.900000%, 94.900000%, 94.900000%)">下面是 DFSOutputStream 的结构及其原理，如图所示:</span></span>


![image.png | left | 726x374](https://cdn.nlark.com/yuque/0/2018/png/199648/1541522815542-7b1d4d60-3ad1-404a-a44a-4d8ad04e1ed2.png "")

<span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">注意:客户端执行 write 操作后，写完的 block 才是可见的，正在写的 block 对客户端是不可见的，</span>只有调用 sync 方法，客户端才确保该文件的写操作已经全部完成，当客户端调用 close 方法时，会默认调用 sync 方法。是否需要手动调用取决你根据程序需要在数据健壮性和吞吐率之间的权衡。

### HDFS 的文件权限和安全模式

__安全模式__

* namenode 启动的时候，首先将映像文件(fsimage)载入内存，并执行编辑日志(edits)中的各 项操作。
* 一旦在内存中成功建立文件系统元数据的映射，则创建一个新的fsimage 文件(这个操作不需要 SecondaryNameNode)和一个空的编辑日志。
* 此刻 namenode 运行在安全模式。即 namenode 的文件系统对于客服端来说是只读的。(显示 目录，显示文件内容等。写、删除、重命名都会失败)。
* 在此阶段 Namenode 收集各个 datanode 的报告，当数据块达到最小副本数以上时，会被认为是“安全”的， 在一定比例(可设置)的数据块被确定为“安全”后，再过若干时间，安全模式结束
* 当检测到副本数不足的数据块时，该块会被复制直到达到最小副本数，<span data-type="color" style="color:#F5222D"><strong>系统中数据块的位 置并不是由 namenode 维护的，而是以块列表形式存储在 datanode 中</strong></span>


![image.png | left | 747x220](https://cdn.nlark.com/yuque/0/2018/png/199648/1541523023852-0f767a2f-1df2-4fe4-9ce2-50102276741d.png "")


退出安全模式：__hdfs namenode -safemode leave__

### HDFS 命令操作


`hdfs dfs -put file /input`
file是要上传的文件，/input 是文件上传到 hdfs 的路径。

`hdfs dfs -rm -rf file /input`
删除文件

`hdfs dfs -mkdir -p /input`
创建目录

其他的可以查看 help

## MapReduce

### MapReduce 是什么

它是一个__分布式__的__离线计算__框架。是一种编程模型，用于大规模（大于 TB）的并行计算，将自己的程序运行在分布式系统上，Map 是映射、Reduce 是归约。__可用于大规模的算法图形处理和文字处理__。

### MapReduce 的设计理念

1.分布式计算
2.移动计算到数据，计算向数据靠拢，也就是将计算程序移动到集群中的数据节点上运行。

### MapReduce 的计算框架组成

计算流程为：<span data-type="color" style="color:rgb(79, 79, 79)"><span data-type="background" style="background-color:rgb(255, 255, 255)">input --&gt; map --&gt; shuffle --&gt;reduce ---&gt;output</span></span>

下面来源于网络，觉得很详细。就以这个图作为依据来说明，mapreduce 的过程。



![image.png | left | 747x355](https://cdn.nlark.com/yuque/0/2018/png/199648/1542028905333-449256b7-1dd8-47ea-b440-490c647eeacf.png "")



### 深入理解 mapreduce
MapReduce 底层到地址如何让运行的呢？

1.客户端要编写好 MapReduce 程序，配置好 MapReduce 的作业（job）

2.接下来提交 job 到 JobTracker 上。JobTracker 复杂构建这个 job , 具体的就是分配一个 job id , 接着检查输入输出目录是否存在等。

### MR架构

__它是一主多从架构。__

__主是 JobTracker （RM）__ , 负责调度分配每一个子任务的运行于 TaskTracker 上。一个 Hadoop 集群一般只有一个 RM, 运行在 Matser 节点上。

__从是 TaskTracker （NM）__, 主动联系 主 ，接收作业，并负责执行每一个任务。为了减少网络带宽，__TaskTrack__ 最好运行在 __HDFS__ 的 __DataNode__ 节点上。

### MR & Yarn 架构

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


### 深入理解 shuffle

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
