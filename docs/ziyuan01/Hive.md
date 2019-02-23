# Hive 篇


![image.png | center | 114x105](https://cdn.nlark.com/yuque/0/2019/png/199648/1548171293996-7543ab21-1496-49ad-9a1b-51a98e1a4d75.png "")

Hive 的官网：[http://hive.apache.org/](http://hive.apache.org/)

<span data-type="color" style="color:rgb(23, 43, 77)"><span data-type="background" style="background-color:rgb(255, 255, 255)">Hive versions </span></span>[1.2](https://issues.apache.org/jira/browse/HIVE/fixforversion/12329345/?selectedTab=com.atlassian.jira.jira-projects-plugin:version-summary-panel)<span data-type="color" style="color:rgb(23, 43, 77)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> onward require Java 1.7 or newer.</span></span>

## Hive 简介

<span data-type="color" style="color:rgb(100.000000%, 0.000000%, 0.000000%)">Hive 是基于 Hadoop 的一个【数据仓库工具】</span><span data-type="color" style="color:#262626">，</span>可以将结构化的数据文件映射为一张 hive 数据库表，并提供简单的 sql 查询功能，可以将 sql 语句转换为 MapReduce 任务进行运行。

<span data-type="color" style="color:rgb(100.000000%, 0.000000%, 0.000000%)">非 Java 编程者对 HDFS 的数据做 mapreduce 操作。</span>

好处：使用 SQL 来快速实现简单的 MapReduce 统计，不必开发专门的 MapReduce 应用，学习成本低，十分适合数据仓库的统计分析。

## 数据仓库简介

Hive 是一个数据仓库工具，那么数据仓库是什么呢？相信大家对数据库并不陌生，翻译成英文是 DataBase , 而数据仓库的英文翻译是 Data Warehouse，可以简写成 DW 或 DWH。不同于数据库，数据仓库是面向主题的，为了支持决策创建的，主要理解这四个特点就可以了：面向主题、数据集成、历史数据、有时间维度的。

## OLTP & OLAP

__联机事务处理 on-line transaction processing__
OLTP 是传统关系数据库的主要应用，主要是基本的事务处理，例如交易系统。
它强调数据库内存效率，强调各种指标的命令率，强调绑定变量，强调并发操作。

__联机分析处理 on-line analytical processing__
OLAP 是数据仓库的主要应用，支持复杂的分析操作，侧重决策支持，并且提供直观易懂的查询结果。
它强调数据分析，强调 SQL 执行市场，强调磁盘 I/O，强调分区。

下表是 OLTP 和 OLAP 的区别（用户，功能，DB 设计，数据，存取，工作单位，用户数，DB 大小，时间要求，主要应用）

|  | OLTP | OLAP |
| --- | --- | --- |
| 用户 | 初级的 | 决策者、高级的 |
| 功能 | 基本查询 | 分析决策 |
| __<span data-type="color" style="color:#FA541C">DB 设计</span>__ | __<span data-type="color" style="color:#FA541C">面向应用</span>__ | __<span data-type="color" style="color:#FA541C">面向主题</span>__ |
| 数据 | 当前的。最新的细节，二维分立的 | 历史的，多数据源的（聚集的，多维的） |
| 存取 | 读取 10 条记录 | 读上百万条记录 |
| __<span data-type="color" style="color:#FA541C">工作单位</span>__ | __<span data-type="color" style="color:#FA541C">简单的事务</span>__ | __<span data-type="color" style="color:#FA541C">复杂的查询</span>__ |
| 用户数 | 上千个 | 上百万个 |
| DB 大小 | MB-GB | GB、TB、PB、EB |
| <span data-type="color" style="color:#FA541C"><strong>时间要求</strong></span> | <span data-type="color" style="color:#FA541C"><strong>实时</strong></span> | <span data-type="color" style="color:#FA541C"><strong>对实时要求不严格</strong></span> |
| 主要应用 | 数据库 | 数据仓库 |

__综上。数据仓库支持很复杂的查询，就是用来做数据分析的数据库。基本不用来做插入，修改，删除操作。__

__Hive 运行时，元数据存储在关系型数据库中。__

还需要明确两点：

__<span data-type="color" style="color:#262626">Hive 的真实数据是在 HDFS 上的。</span>__
__<span data-type="background" style="background-color:rgb(255, 255, 255)"><span data-type="color" style="color:#262626">Hive 的计算是通过 Yarn 和 MR 的。</span></span>__

## Hive 架构

用户接口主要有三个：Cli, Client 和 WUI 。见图 1-1，图 1-2


<div data-type="alignment" data-value="center" style="text-align:center">
  <div data-type="p">
    <div id="1xxyxz" data-type="image" data-display="block" data-align="center" data-src="https://cdn.nlark.com/yuque/0/2018/png/199648/1542282028535-81c0727c-6df5-4bb6-a72d-38b71a5c3441.png" data-width="600">
      <img src="https://cdn.nlark.com/yuque/0/2018/png/199648/1542282028535-81c0727c-6df5-4bb6-a72d-38b71a5c3441.png" width="600" />
    </div>
  </div>
</div>

<div data-type="alignment" data-value="center" style="text-align:center">
  <div data-type="p"><span data-type="color" style="color:#8C8C8C">图 1-1</span></div>
  <div data-type="p"></div>
</div>



![image.png | center | 600x543.4554973821989](https://cdn.nlark.com/yuque/0/2018/png/199648/1542282545735-71f411cf-2570-42c4-8374-3b86922bb0c5.png "")

<div data-type="alignment" data-value="center" style="text-align:center">
  <div data-type="p"><span data-type="color" style="color:#8C8C8C">图 1-2</span></div>
</div>


__从图中可以看到，有三种连接方式：__

1.cli 是最常用的，cli 启动时，会同时创建一个 Hive 副本。
安装好之后，直接使用 __hive__ 命令，进入 __hive>  ,__如下图 1-3



![image.png | center | 747x70](https://cdn.nlark.com/yuque/0/2018/png/199648/1542282898641-71c15982-34b6-436e-ab13-3aa2009e1db1.png "")

<div data-type="alignment" data-value="center" style="text-align:center">
  <div data-type="p"><span data-type="color" style="color:#8C8C8C">图 1-3</span></div>
</div>

这种方式，也可以使用命令： __hive --service cli__

2.使用 Client 方式，需要在编写 JDBC 程序，需要指定 HIve Server。 所指定的节点需要开启 Hive Server。
```
$ $HIVE_HOME/bin/hiveserver2
$ $HIVE_HOME/bin/beeline -u jdbc:hive2://$HS2_HOST:$HS2_PORT
```

当然也可以使用 hive --service hivesrver2 的方式开启。

注：使用 hiveServer2 的方式和使用 metastore 方式不同的地方在于前者还可以提供 JDBC 等连接。

3.WUI ，使用浏览器使用 Hive。（这个很少用）



![image.png | left | 747x426](https://cdn.nlark.com/yuque/0/2018/png/199648/1542283867950-d3c67c3d-c344-4714-b962-b59bb45871d9.png "")


__数据仓库 Hive 的元数据存储在关系型数据库中__，如 mysql,derby等。元数据包括表的名字，表的列，属性，数据所在目录等信息。

解释器，编译器，优化器成 HQL 查询语句从词法分析、语法分析、编译、优化以及查询计划的生成。生成的查询计划存储在HDFS中，并在随后有MapReduce调用执行。

__Hive 的数据存储在 HDFS 中。__计算由 Yarn 和 mapReduce 来完成。<span data-type="background" style="background-color:#FADB14">值得注意的是，SELECT * from XXX;这样的操作，不会提交 MapReduce 任务。</span>

__总结：__

Hive 是一个基于 Hadoop 文件系统之上的数据仓库架构，存储用 hdfs，计算用 mapreduce。
Hive 可以理解为一个工具，不存在主从架构,不需要安装在每台服务器上，只需要安装几台就行了。
Hive 还支持类 sql 语言，它可以将结构化的数据文件映射为一张数据库表，并提供简单的SQL查询功能。
Hive 有个默认数据库：derby，默认存储元数据---><span data-type="color" style="color:#F5222D">一般企业使用关系型数据库存储 mysql 元数据
</span>。

## 三种部署方式

__前提__

> 下载安装包：apache-hive-1.2.1-bin.tar.gz ,解压。
> 准备 mysql 环境，用来保存元数据的。
> 有Hadoop 集群环境，Hive 存储要使用 HDFS 的。


__内嵌模式__
这种模式，使用的是内嵌的数据库 derby 来保存元数据，但是只允许一个会话连接。

配置很简单，只需要一个 __hive-site.xml__ 文件。(<span data-type="color" style="color:rgb(100.000000%, 0.000000%, 0.000000%)">注:使用 derby 存储方式时，运行 hive 会在当前目录生成一个 derby 文件和一个 metastore_db</span>)

```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
    <property>
     <name>javax.jdo.option.ConnectionURL</name>
     <value>jdbc:derby:;databaseName=metastore_db;create=true</value>
    </property>
    <property>
     <name>javax.jdo.option.ConnectionDriverName</name>
     <value>org.apache.derby.jdbc.EmbeddedDriver</value>
    </property>
    <property>
     <name>hive.metastore.local</name>
     <value>true</value>
    </property>
    <property>
     <name>hive.metastore.warehouse.dir</name>
     <value>/user/hive/warehouse</value>
    </property>
</configuration>
```


__本地模式（测试用）__

本地模式就是把元数据的存储介质由 derby 换成了 mysql 。

需要:
__把 mysql 的驱动添加到 \$HIVE\_HOME 目录下的 lib 下。__

配置文件：__hive-site.xml__, 注意这种方式 mysql 的账户密码就明文写在配置文件里面了。


```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
   <property>
       <name>hive.metastore.warehouse.dir</name>
       <value>/user/hive_rlocal/warehouse</value>
   </property>
   <property>
       <name>hive.metastore.local</name>
       <value>true</value>
   </property>
   <property>
       <name>javax.jdo.option.ConnectionURL</name>
   <value>jdbc:mysql://node01/hive_local?createDatabaseIfNotExist=t
rue</value>
   </property>
   <property>
       <name>javax.jdo.option.ConnectionDriverName</name>
       <value>com.mysql.jdbc.Driver</value>
   </property>
   <property>
       <name>javax.jdo.option.ConnectionUserName</name>
       <value>root</value>
   </property>
   <property>
       <name>javax.jdo.option.ConnectionPassword</name>
       <value>123456</value>
   </property>
 </configuration>
```

这里要说明一点的是，__hive 和 MySQL 不用做 HA，单节点就可以__。通过设置其他节点可以访问得到数据库。


__远程模式（重要）__

这种模式需要在远端的服务器运行一个 mysql 服务器，并且需要在 Hive 服务器开启 meta 服务。

hive-site.xml 文件。

```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
	<property>
		<name>hive.metastore.warehouse.dir</name>
		<value>/user/hive/warehouse2</value>
	</property>
	<property>
		<name>javax.jdo.option.ConnectionURL</name>
		<value>jdbc:mysql://node03:3306/hive?createDatabaseIfNotExist=true</value>
	</property>
	<property>
		<name>javax.jdo.option.ConnectionDriverName</name>
		<value>com.mysql.jdbc.Driver</value> </property>
	<property>
		<name>javax.jdo.option.ConnectionUserName</name>
		<value>root</value>
	</property>
	<property>
		<name>javax.jdo.option.ConnectionPassword</name>
		<value>123456</value>
	</property>
	<property>
		<name>hive.metastore.local</name>
		<value>false</value>
	</property>
    <property>
        <name>hive.metastore.uris</name>
        <value>thrift://node01:9083</value>
    </property>

</configuration>
```

<span data-type="color" style="color:rgb(100.000000%, 0.000000%, 0.000000%)">这里把 hive 的服务端和客户端都放在同一台服务器上了。服务端和客户端可以拆开，</span>

__远程模式（分开，企业常用）__

服务端配置：

```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
	<property>
		<name>hive.metastore.warehouse.dir</name>
		<value>/user/hive/warehouse-server</value> </property>
	<property>
		<name>javax.jdo.option.ConnectionURL</name>
		<value>jdbc:mysql://node03:3306/hive?createDatabaseIfNotExist=true</value>
	</property>
	<property>
		<name>javax.jdo.option.ConnectionDriverName</name>
		<value>com.mysql.jdbc.Driver</value> </property>
	<property>
		<name>javax.jdo.option.ConnectionUserName</name>
		<value>root</value>
	</property>
	<property>
		<name>javax.jdo.option.ConnectionPassword</name>
		<value>123456</value>
	</property>
</configuration>
```

启动：<span data-type="color" style="color:rgb(100.000000%, 0.000000%, 0.000000%)"><strong>hive --service metastore</strong></span>

客户端配置

```xml
<!-- 客户端 -->
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
      <property>
         <name>hive.metastore.warehouse.dir</name>
         <value>/user/hive/warehouse-server</value>
      </property>
      <property>
         <name>hive.metastore.local</name>
         <value>false</value>
			 </property>
	 <property>
			<name>hive.metastore.uris</name>
			<value>thrift://node01:9083</value>
	 </property>
</configuration>
```


Hive常见问题总汇:  [链接](Hive常见问题总汇: http://blog.csdn.net/freedomboy319/article/details/44828337)

## HSQL 详解

可以查看官网更加详细的案例：[https://cwiki.apache.org/confluence/display/Hive/LanguageManual](https://cwiki.apache.org/confluence/display/Hive/LanguageManual)

__DDL 语句：详情看这里 __[https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL)
下面，记录的是一些常用的操作，<span data-type="background" style="background-color:#FADB14">重要的是建表语句和分区。</span>

下面只展示几个例子，以供大家参考

__创建数据库：__

create database  if not exists foo; 创建数据库，不存在则创建。

create database foo comment 'this is a database for test '； 创建数据库，并指定描述信息

数据库的位置默认是在 HDFS 上的 <span data-type="color" style="color:rgb(85, 85, 85)"><span data-type="background" style="background-color:rgb(255, 255, 255)">/user/hive/warehouse/ 目录下的，可以通过 </span></span><span data-type="color" style="color:rgb(85, 85, 85)"><span data-type="background" style="background-color:rgb(255, 255, 255)"><code>show create database foo</code></span></span><span data-type="color" style="color:rgb(85, 85, 85)"><span data-type="background" style="background-color:rgb(255, 255, 255)">  会打印出，创建数据库的信息。</span></span>

Hive 会为每一个数据库创建一个目录，该数据库的每张表都会存在该目录的子目录里面。

删除数据库：使用 `DROP`  命令
修改数据库：使用 `ALTER`  命令
查看数据库描述：使用 `describe`  命令
切换数据库：使用 `use` 命令

__创建表：__

先来看一下数据类型
__数据类型:__

data\_type：标蓝色的是常用的
__<span data-type="color" style="color:#1890FF">| primitive_type 原始数据类型 </span>__
__<span data-type="color" style="color:#1890FF">| array_type 数组</span>__
__<span data-type="color" style="color:#1890FF">
| map_type map键值对</span>__
| struct\_type
| union\_type -- (Note: Available in Hive 0.7.0 and later)

__<span data-type="color" style="color:#1890FF">primitive_type</span>__
:__ TINYINT __
__| SMALLINT__
__| INT__
| BIGINT
| BOOLEAN
| FLOAT
| DOUBLE
| DOUBLE PRECISION
__| STRING 基本可以搞定一切 __
 BINARY
| TIMESTAMP
| DECIMAL
| DECIMAL(precision, scale) | DATE
| VARCHAR
| CHAR

__<span data-type="color" style="color:#1890FF">
array_type</span>__
__: ARRAY < data\_type > __

__<span data-type="color" style="color:#1890FF">map_type</span>__
__: MAP < primitive\_type, data\_type > struct\_typ__e
: STRUCT < col\_name : data\_type [COMMENT col\_comment], ...>

union\_type
: UNIONTYPE < data\_type, data\_type, ... >





![image.png | left | 747x685](https://cdn.nlark.com/yuque/0/2018/png/199648/1542289132863-6817e244-8fc2-4995-9dc6-6a9a18439abd.png "")


例子：

```sql
create table foo(
id int,
name string,
 age int,
likes array<string>,
address map<string, string>
)
row format delimited fields terminated by ','
COLLECTION ITEMS TERMINATED by '-'
map keys terminated by ':'
lines terminated by '\n';
```

准备如下测试数据，字段

```bash
1,lily,18,game-girl-book,stu_addr:beijing-work_addr:shanghai
2,tom,16,shop-swimming-book,stu_addr:hunan-work_addr:shanghai
3,bob,20,read-run,stu_addr:shanghai-work_addr:USA
```


准备好数据之后，开始__导入数据：__

语法：

LOAD DATA __[LOCAL]__ INPATH <span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">&#x27;filepath&#x27; </span>[OVERWRITE] INTO TABLE tablename [PARTITION (partcol1=val1, partcol2=val2 ...)]

操作：

`load data local inpath '/opt/datas/hive_test.txt' into table foo;`

说明：local 指定的是系统的本地路径，如果不加 local，就要指定 hdfs 上的路径。

导入数据之后，可以看到 mysql 数据库中有一些元数据信息，如下：



![image.png | left | 747x439](https://cdn.nlark.com/yuque/0/2018/png/199648/1542287578607-a92e5c05-f5dd-4537-9514-1b70c9b38776.png "")

　　　　　　
__分区表__

使用关键词 <span data-type="color" style="color:rgb(23, 43, 77)"><span data-type="background" style="background-color:rgb(255, 255, 255)">PARTITIONED BY 来指定分区字段，一张表可以有一个或者多个分区，数据按照分区字段分别存储到不同的目录下。简单的分区表如下：</span></span>

```sql
create table table_name (
  id                int,
  dtDontQuery       string,
  name              string
)
partitioned by (date string)
```

更多关于分区表的内容，下面会介绍的。

上面是 DDL 的一些操作，重点是建表语句和分区语句。下面简单总结一下，

1. __Managed and External Tables__：内表和外表的区别，建立外表需要加上额外的关键词 external ，外表的数据可以指向任何 HDFS 的位置，而不一定是默认的位置。删除外表的时候，不会删除数据，只会删除元数据。
2. 为了健壮性，建表的时候最好加上 <span data-type="color" style="color:rgb(23, 43, 77)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span><span data-type="color" style="color:rgb(23, 43, 77)"><span data-type="background" style="background-color:rgb(255, 255, 255)"><strong>IF NOT EXISTS </strong></span></span><span data-type="color" style="color:rgb(23, 43, 77)"><span data-type="background" style="background-color:rgb(255, 255, 255)">来避免发生异常。</span></span>
3. Hive 的存储格式：textFile 、<span data-type="color" style="color:rgb(23, 43, 77)"><span data-type="background" style="background-color:rgb(255, 255, 255)">SEQUENCEFILE、ORC 等。</span></span>


__DML__

具体可以参考：[https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DML](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DML)

Hive 不能很好的支持用 insert 语句一条一条的进行插入操作，不支持 update 操作。数据是以 load 的方式加载到建立好的表中。数据一旦导入就不可以修改。

__插入数据__

<span data-type="color" style="color:rgb(0.000000%, 40.000000%, 60.000000%)"><span data-type="background" style="background-color:rgb(100.000000%, 100.000000%, 100.000000%)">第一种:</span></span>

LOAD DATA [LOCAL] INPATH <span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">&#x27;filepath&#x27; </span>[OVERWRITE] INTO TABLEtablename [PARTITION (partcol1=val1, partcol2=val2 ...)]

可选项：local 、overwrite 、partition

<span data-type="color" style="color:#1890FF">第二种：</span>

创建表的时候，通过 select 或者 insert 或者 location  加载数据。注意通过 insert 这种方式个非常耗时，尽量避免使用这种方式。

参考：[https://www.2cto.com/kf/201609/545560.html](https://www.2cto.com/kf/201609/545560.html)


<span data-type="color" style="color:rgb(100.000000%, 0.000000%, 0.000000%)">本地 load 数据和从 HDFS 上 load 加载数据的过程有什么区别?</span>

<span data-type="color" style="color:rgb(100.000000%, 0.000000%, 0.000000%)">本地: local 会自动复制到 HDFS 上的 hive 的**目录下</span>

__查询数据并保存__

第一种，保存到本地：__insert overwrite local directory __'/opt/date/xxx.txt' ROW FORMAT DELIMITED FIELDS TERMINATED BY <span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">&#x27;,&#x27; select * from table_name;</span>

第二种，保存到 HDFS 上的某个路径上：__insert overwrite  directory__ '/opt/date/xxx.txt' ROW FORMAT DELIMITED FIELDS TERMINATED BY <span data-type="color" style="color:rgb(0.000000%, 0.000000%, 100.000000%)">&#x27;,&#x27; select * from table_name;</span>


第三种，可以在 hive客户端执行 hive -e "select \* from table\_name " > "/opt/data/xxx.txt" 重定向到文件。

__备份或还原数据__

使用 <span data-type="color" style="color:#1890FF">export</span> table db\_2019.emp <span data-type="color" style="color:#1890FF">to</span> '/xx/xx' 备份数据

使用 <span data-type="color" style="color:#1890FF">import from</span> '/xx/xx' 还原数据

<span data-type="color" style="color:rgb(51, 51, 51)"><span data-type="background" style="background-color:rgb(249, 249, 249)"><strong>常见的查询，如 group by、 having、join 、sort by、order by等，与 mysql 类似。</strong></span></span>

Hive SerDe 用于对做序列化和反序列化，构建在数据存储和计算引擎之间，实现两者的解耦。下面是官网的几个例子：

```sql
CREATE TABLE apachelog (
  host STRING,
  identity STRING,
  user STRING,
  time STRING,
  request STRING,
  status STRING,
  size STRING,
  referer STRING,
  agent STRING)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.RegexSerDe'
WITH SERDEPROPERTIES (
  "input.regex" = "([^]*) ([^]*) ([^]*) (-|\\[^\\]*\\]) ([^ \"]*|\"[^\"]*\") (-|[0-9]*) (-|[0-9]*)(?: ([^ \"]*|\".*\") ([^ \"]*|\".*\"))?"
)
STORED AS TEXTFILE;
```

```sql
CREATE TABLE my_table(a string, b bigint, ...)
ROW FORMAT SERDE 'org.apache.hive.hcatalog.data.JsonSerDe'
STORED AS TEXTFILE;
```


### Beeline & Hiveserver2

官网的描述：
<span data-type="color" style="color:rgb(23, 43, 77)"><span data-type="background" style="background-color:rgb(255, 255, 255)">Beeline is started with the JDBC URL of the HiveServer2, which depends on the address and port where HiveServer2 was started. </span></span>
<span data-type="color" style="color:rgb(23, 43, 77)"><span data-type="background" style="background-color:rgb(255, 255, 255)">By default, it will be (localhost:10000), so the address will look like jdbc:hive2://localhost:10000.</span></span>

Beeline 和 cli 的区别：<span data-type="color" style="color:rgb(77, 77, 76)"><span data-type="background" style="background-color:rgb(255, 255, 255)">CliDriver是 SQL 本地直接编译，然后访问 MetaStore，提交作业，是重客户端。</span></span>
<span data-type="color" style="color:rgb(77, 77, 76)"><span data-type="background" style="background-color:rgb(255, 255, 255)">BeeLine 是把 SQL 提交给 HiveServer2，由 HiveServer2 编译，然后访问 MetaStore，提交作业，是轻客户端。</span></span>

这种模式下经常用来使用 JDBC 来查询数据，下面是一个官网的示例代码：

```java
import java.sql.SQLException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.DriverManager;

public class HiveJdbcClient {
  private static String driverName = "org.apache.hive.jdbc.HiveDriver";

  /**
   * @param args
   * @throws SQLException
   */
  public static void main(String[] args) throws SQLException {
      try {
      Class.forName(driverName);
    } catch (ClassNotFoundException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      System.exit(1);
    }
    //replace "hive" here with the name of the user the queries should run as
    Connection con = DriverManager.getConnection("jdbc:hive2://localhost:10000/default", "hive", "");
    Statement stmt = con.createStatement();
    String tableName = "testHiveDriverTable";
    stmt.execute("drop table if exists " + tableName);
    stmt.execute("create table " + tableName + " (key int, value string)");
    // show tables
    String sql = "show tables '" + tableName + "'";
    System.out.println("Running: " + sql);
    ResultSet res = stmt.executeQuery(sql);
    if (res.next()) {
      System.out.println(res.getString(1));
    }
       // describe table
    sql = "describe " + tableName;
    System.out.println("Running: " + sql);
    res = stmt.executeQuery(sql);
    while (res.next()) {
      System.out.println(res.getString(1) + "\t" + res.getString(2));
    }

    // load data into table
    // NOTE: filepath has to be local to the hive server
    // NOTE: /tmp/a.txt is a ctrl-A separated file with two fields per line
    String filepath = "/tmp/a.txt";
    sql = "load data local inpath '" + filepath + "' into table " + tableName;
    System.out.println("Running: " + sql);
    stmt.execute(sql);

    // select * query
    sql = "select * from " + tableName;
    System.out.println("Running: " + sql);
    res = stmt.executeQuery(sql);
    while (res.next()) {
      System.out.println(String.valueOf(res.getInt(1)) + "\t" + res.getString(2));
    }

    // regular hive query
    sql = "select count(1) from " + tableName;
    System.out.println("Running: " + sql);
    res = stmt.executeQuery(sql);
    while (res.next()) {
      System.out.println(res.getString(1));
    }
  }
}
```

## 分区 & 分桶

Hive 分区表的建立是为了方便管理大量的数据。比如下面这个例子：分区使用关键词  partitioned by

```sql
create table day_hour_table (id int, content string)
partitioned by (dt string, hour string)
row format delimited fields terminated by ',';
```

<span data-type="color" style="color:#F5222D">使用查询的时候，指定 where 后面跟着分区字段, 可以减少计算的数据量，加快查询效率。</span>

查看分区：show partitions table\_name
添加分区：alter table table\_name add partition(dt='2018',hour='9')
重命名分区：alter table table\_name partition(dt='2018',hour='9') rename to partition(dt='2018',hour='10')
删除分区：alter table table\_name drop partition(dt='2018',hour='10'), 分区的数据和元数据一起被删除。
加载数据到分区：load data inpath 'xxxx' into table table\_name partition(dt='2018',hour='9')

加载的数据的时候，上面的是未开启动态分区的情况下的，如果开启了动态分区，就不需要手动指定分区的值了。

开启动态分区的参数如下：
<span data-type="color" style="color:#2F54EB">hive.exec.dynamic.partition 设置成 true ,</span>
<span data-type="color" style="color:#2F54EB">hive.exec.dynamic.partition.mode 需要设置成 nostrict 模式，表示允许所有的字段是动态分区字段。hive.exec.max.dynamic.partitions.pernode 在每个执行 MR 的节点上，最大可以创建多少个动态分区。该参数需要根据实际的数据来设定。比如:源数据中包含了一年的数据，即 day 字段有 365 个值，那么该参数就需要设置成大于 365，如果使用默认值 100，则会报错。</span>

动态分区表的使用流程：1.常见临时表，将数据家在进去。2.使用 hsql 将临时表的按照分区字段动态加入。

__分桶__：分桶表是对列值取哈希值的方式，将不同数据放到不同文件中存储。对于 hive 中每一个表、分区都可以进一步进行分桶。由列的哈希值除以桶的个数来决定每条数据划分在哪个桶中。

适用场景：适用场景:
数据抽样( sampling )、map-join

开启支持分桶

set hive.enforce.bucketing=true;默认:false;
设置为 true 之后，mr 运行时会根据 bucket 的个数自动分配 reduce task 个数。(用户也可以通过 mapred.reduce.tasks 自己设置 reduce 任务个数，但分桶时不推荐使用)

注意:一次作业产生的桶(文件数量)和 reduce task 个数一致。


桶表 抽样查询

select \* from bucket\_table tablesample(bucket 1 out of 4 on columns);TABLESAMPLE 语法:

## 函数自定义

UDAF：多进一出
UDF: 一进一出
UDTF：一进多出

使用方式： 在 hive 中 add jar , 之后创建函数调用这个 jar 就可以了。下面是 一个自定义函数的例子：

编写 UDF 函数的时候需要注意一下几点:

a)自定义 UDF 需要继承 org.apache.hadoop.hive.ql.UDF。

b)需要实现 evaluate 函数，evaluate 函数支持重载。

```java
package com.hive.test.udf;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.hive.ql.exec.UDF;
import org.apache.hadoop.io.Text;

// 例子
public class Trim extends UDF {
	private Text res = new Text();

	public Text evaluate(String str) {

		if (str == null) {
			return null;
		}
		res.set(StringUtils.strip(str.toString()));

		return res;
	}

	public Text evaluate(Text str,String stripChars){
		if (str == null) {
			return null;
		}

		res.set(StringUtils.strip(str.toString(),stripChars));
		return res;

	}
}
```

然后导出 Jar 包，在 Hive 中执行 add jar jar 位置，

方式1：hive> add jar /xxx/xx/xxx.jar

方式2：<span data-type="color" style="color:rgb(79, 79, 79)"><span data-type="background" style="background-color:rgb(255, 255, 255)">在启动时在命令后传递 --auxpath选项， --auxpath后面为jar包所在的路径</span></span>hive -auxpath /xxx/xx/xxx.jar

<span data-type="color" style="color:#F5222D"><span data-type="background" style="background-color:#FADB14">清除缓存时记得删除 jar 包 delete jar /*

之后再创建临时函数: hive>CREATE TEMPORARY FUNCTION trim1 '<span data-type="color" style="color:#F5222D">com.hive.test.udf.Trim</span>'; ps: 红色部分为类的全限定名

使用：select trim1(参数) form 表。

如果只用这一次，可以销毁了：hive> DROP TEMPORARY FUNCTION trim1;

UDAF 和 UDTF 函数用的比较少。

## Hive 优化

> 核心思想：把Hive SQL 当做Mapreduce程序去优化

以下SQL不会转为Mapreduce来执行
	--select仅查询本表字段
	--where仅对本表字段做条件过滤

------------------------------------------------------------------------------

Explain 显示执行计划
EXPLAIN [EXTENDED] query

-------------------------------------------------------------------------------
Hive运行方式：
本地模式                        100MB
集群模式

本地模式
开启本地模式：
set hive.exec.mode.local.auto=true;
注意：                                                
hive.exec.mode.local.auto.inputbytes.max默认值为128M【134217728】
表示加载文件的最大值，若大于该配置仍会以集群方式来运行！


-------------------------------------------------------------------------------
严格模式
通过设置以下参数开启严格模式[防止误操作]：
set hive.mapred.mode=strict;
（默认为：nonstrict非严格模式）

查询限制：
1、对分区表查询时，必须添加where对于分区字段的条件过滤；
2、order by语句必须包含limit输出限制；
3、限制执行笛卡尔积的查询


-------------------------------------------------------------------------------
Hive排序
Order By - 对于查询结果做全排序，只允许有一个reduce处理
（当数据量较大时，应慎用。严格模式下，必须结合limit来使用）
Sort By - 对于单个reduce的数据进行排序
Distribute By - 分区排序，经常和Sort By结合使用
Cluster By - 相当于 Sort By + Distribute By
（Cluster By不能通过asc、desc的方式指定排序规则；
可通过 distribute by column sort by column asc|desc 的方式）


-------------------------------------------------------------------------------
Hive Join   
Join计算时，将小表（驱动表）放在join的左边
Map Join：在Map端完成Join
两种实现方式：
	1、SQL方式，在SQL语句中添加MapJoin标记（mapjoin hint）
		语法：
		SELECT  /\*+ MAPJOIN(smallTable) \*/  smallTable.key,  bigTable.value
		FROM  smallTable  JOIN  bigTable  ON  smallTable.key  =  bigTable.key;

	2、开启自动的MapJoin
		通过修改以下配置启用自动的mapjoin：
		set hive.auto.convert.join = true;
（该参数为true时，Hive自动对左边的表统计量，如果是小表就加入内存，即对小表使用Map join）
其他相关配置参数：
hive.mapjoin.smalltable.filesize;  
（大表小表判断的阈值25MB左右，如果表的大小小于该值则会被加载到内存中运行）
hive.ignore.mapjoin.hint；
（默认值：true；是否忽略mapjoin hint 即mapjoin标记）
hive.auto.convert.join.noconditionaltask;
（默认值：true；将普通的join转化为普通的mapjoin时，是否将多个mapjoin转化为一个mapjoin）
hive.auto.convert.join.noconditionaltask.size;
（将多个mapjoin转化为一个mapjoin时，其表的最大值）



-------------------------------------------------------------------------------
Map-Side聚合   如count()等聚合函数
通过设置以下参数开启在Map端的聚合：
set hive.map.aggr=true;

相关配置参数：
	hive.groupby.mapaggr.checkinterval：
	    map端group by执行聚合时处理的多少行数据（默认：100000）

	hive.map.aggr.hash.min.reduction：
		进行聚合的最小比例（预先对100000条数据做聚合，若聚合的数据量 /100000
		 的值小于该配置0.5，则不会聚合）


	hive.map.aggr.hash.percentmemory：
		map端聚合使用的内存的最大值

	hive.map.aggr.hash.force.flush.memory.threshold：
		map端做聚合操作是hash表的最大可用内容，大于该值则会触发flush

	hive.groupby.skewindata
		是否对GroupBy产生的数据倾斜做优化，默认为false
	分成两个 MR 任务。


-------------------------------------------------------------------------------
控制Hive中Map以及Reduce的数量
Map数量相关的参数
mapred.max.split.size
	一个split的最大值，即每个map处理文件的最大值
mapred.min.split.size.per.node
	一个节点上split的最小值
mapred.min.split.size.per.rack
	一个机架上split的最小值

Reduce数量相关的参数
mapred.reduce.tasks
	强制指定reduce任务的数量
hive.exec.reducers.bytes.per.reducer
	每个reduce任务处理的数据量
hive.exec.reducers.max
	每个任务最大的reduce数 [Map数量 >= Reduce数量 ]

-------------------------------------------------------------------------------
Hive - JVM重用
适用场景：
1、小文件个数过多
2、task个数过多

通过 set mapred.job.reuse.jvm.num.tasks=n; 来设置
（n为task插槽个数）

缺点：设置开启之后，task插槽会一直占用资源，不论是否有task运行，
直到所有的task即整个job全部执行完成时，才会释放所有的task插槽资源！
