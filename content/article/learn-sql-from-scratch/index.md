---
title: "从头开始学 SQL（上）"
date: 2026-03-09T18:26:00+08:00
draft: true
categories: ['Learning']
tags: ['SQL', 'Learning', '2026']
summary: "Another SQL tutorial written laziness in mind."
---

-----
## 写在前面

开始学 SQL，准备为写一些更大的项目做准备。

因为~~本人很懒~~是个人学习笔记，故一些基础知识不会去阐述，也是记录一下关键知识点防止学完就忘记了。

分为上、下两部分，上部分主要着重于数据的查询，下半部分将着重于数据的修改、数据表的维护。

-----
## 基础格式

1. Verb (Action) + Subject (Target) + Condition (Filter)
2. 使用分号 `;` 分开两个 SQL 语句
3. 使用 `--` 或者 `/* */` 进行注释
4. 数据是大小写敏感（尤其是 String），关键词（SELECT、FROM 等）大小写不敏感

-----
## 选择数据源
使用 `SELECT`。

```sql
SELECT
  column1,
  column2,
  column3,
  column4 * 1.05 AS caculated
FROM
  table_name;
```
在 `table_name` 中选择 `column1` `column2` `column3` 三列。如果想要选择这个表中的所有列可以使用 `*`。

在查询的时候也可以进行计算：在 `column4 * 1.05` 中，在对 `column4` 查询后会进行乘 1.05 的计算，并且返回到新列中。新列如果没有用 `AS` 进行命名会给予一个临时名字，你也可以和示例中一样使用 `AS` 进行命名返回列。

（你也可以直接抛弃 `AS` 关键词，写成 `column4 * 1.05 caculated`）

-----
## 数据列排序
使用 `ORDER BY`。

```sql
SELECT
  select_list
FROM
  table_name
ORDER BY
  sort_expression_1 [ASC | DESC],
  sort_expression_2 [ASC | DESC];
```

`sort_expression_1` 和 `sort_expression_2` 为筛选依据列，`ASC` 为升序，`DESC` 为降序。

你也可以对空值 `NULL` 进行排序，使用 `ORDER BY sort_expression NULLS FIRST` 或者 `ORDER BY sort_expression NULLS LAST`。这个有什么用呢？因为空值无法进行排序，可以先将空值挑出来放在表的头/尾，再对剩下的值进行排序。

-----
## 限制查询范围
### `DISTINCT`
返回唯一值。如果选中多列会综合选择的多列进行去重。

```sql
SELECT DISTINCT
  column1,
  column2
FROM
  table_name;
```

关于 `NULL`：会将所有空值作为一个类型进行去重合并。

### `LIMIT`
限制返回行。

```sql
SELECT
  column_list
FROM
  table1
ORDER BY
  column_list
LIMIT
  row_count
OFFSET
  row_to_skip;
```

使用 `LIMIT` 限制返回的行数量，同时 `OFFSET` 来给予查询的偏移量，跳过指定行后再返回（可选，用于多次分页查询）。建议配合 `ORDER BY` 进行排序。

如果使用 `OFFSET` 想要查询第 N 的数据，有一个潜在的问题：如果这第 N 的数据有多个，只会返回其中一行数据。解决方法是先对需要排序的数值进行去重排序，取第 N 个数据后，再在表中查询对应行的数据。（分两步查询或使用 SubQuery）

### `FETCH`
`LIMIT` 并非标准关键词，而是被主流数据库（MySQL, PostgreSQL, and SQLite）支持的方法之一。SQL 标准关键词是使用 `FETCH`。

如何选择：如果是在确定的数据库中进行简单查询，可以直接在支持的数据库中使用 `LIMIT` 快速查询；如果是进行支持数据库之间迁移的严谨性开发（或者进行分页展示）则优先使用 `FETCH`。

```sql
OFFSET rows_to_skip { ROW | ROWS }
FETCH { FIRST | NEXT } [ row_count ] { ROW | ROWS } { ONLY | WITH TIES };
```

其中 `ONLY` / `WITH TIES` 关键词，`ONLY` 会强行进行指定行数的切割，`WITH TIES` 会把相等值也给返回回来（要配合 `ORDER BY` 进行排序）。

-----
## 筛选查询数据
### `WHERE`
通过条件筛选查询行。

```sql
SELECT 
    column1, column2, ...
FROM
    table_name
WHERE
    condition;
```

`WHERE` 需要紧跟着 `FROM`，使用选择的列名称写逻辑条件。

在判断条件中，可以使用以下关键词进行多条件拼接：

- `AND`
- `OR`
- `IN`
- `BETWEEN` X `AND` Y
- `NOT`
- `LIKE`
- `IS NULL`

1. 同时在多条件拼接计算时，存在 **短路评估（Short-Circuit Evaluation）** 情况，即在特定条件拼接中（比如 `AND` 或者 `OR`中），如果前面的计算已经能够让整改条件成立，则计算立即停止，并且不会执行接下来的命令：如在 `AND` 中，第一个条件执行返回为 False 后，会立即返回 False 并且停止执行接下来的判断；在 `OR` 中，第一个条件执行返回为 True 后，会立即返回 True 并且停止执行接下来的判断。

作用是可以利用这种优化特性优化性能（比如将长耗时判断后置）、防御性编程确保安全性（将关键判断前置）。这种特性在许多其他编程语言中也存在。

2. 条件拼接关键词也有执行优先级：`NOT` > `AND` > `OR`，如果确定不了就用圆括号指示执行顺序。

3. `IN` 可以作为多个 `OR` 的便携写法，下方例子是选择 `hire_date` 在 1990 或 1999 或 2000 的数据：
```sql
WHERE
    EXTRACT(year from hire_date) IN (1990, 1999, 2000)
```

4. `LIKE` 使用通配符进行匹配：
- `%` 通配零到多个字符
- `_` 通配一个字符
- `ESCAPE` 标记一个通配符使其作为普通字符处理（比如我想匹配 `10%`，我需要写作 `10!%` 并且使用 `ESCAPE` 声明
```sql
WHERE value LIKE '%10!%%' ESCAPE '!'
```

-----
## 合并表格
### `INNER JOIN`
将其他表中的列根据某种条件合并进来。
```sql
SELECT
  column1,
  column2
FROM
  table1
  INNER JOIN table2 AS d ON condition;
```
其中这里的链接条件可以不仅仅使用值相等，也可以使用条件。引用多表数据需要使用 `table.column` 进行列的引用。如果在 `SELECT` 中两个表的字段名称有重复，必须使用以上格式声明来源表。

`AS` 可以用来给表临时给予别名（`AS` 关键词可以忽略），并且在条件中直接使用别名进行引用。

如果匹配结果在第二张表中有多行，第一张表的对应行会出现“分裂”，生成指定数量行去匹配。

### `LEFT JOIN` 和 `RIGHT JOIN`
和 `INNER JOIN` 类似，但是会确保指定拼接表中数据全部保留：

- `INNER JOIN` 只会对双方都匹配到的数据保留，孤立未匹配到的数据会直接被丢弃
- `LEFT JOIN` 和 `RIGHT JOIN` 会确保指定拼接表中的数据全部保留（`LEFT JOIN` 会保留左表所有数据，`RIGHT JOIN` 会保留右表所有数据），未匹配到位置会使用 `NULL` 填充
- 无论是 `INNER JOIN` `LEFT JOIN` 还是 `RIGHT JOIN`，本质都是笛卡尔积，故如果匹配到了多个数据，拼接表中的数据都会“分裂”
- `LEFT JOIN` 和 `RIGHT JOIN` 行为对称，按照常规思维方式 `LEFT JOIN` 使用得会更多，实际使用中尽量使用 `LEFT JOIN`

```sql
SELECT
  column1,
  column2
FROM
  left_table
  LEFT JOIN right_table ON condition
WHERE
  column2 IS NULL;
```

这里加了一个 `WHERE`，这种方法可以筛选出 left_table 中有哪些在 right_table 中没有匹配值。

### `FULL OUTER JOIN` 或者 `FULL JOIN`
全合并，所有未匹配到的数据都会保留，未匹配内容使用 `NULL` 填充。

```sql
SELECT
  column1,
  column2
FROM
  table1
  FULL JOIN table2 ON table2.column2 = table1.column1;
```

### `CROSS JOIN`
没有条件的合并，会返回所有可能的合并方式（m * n 种）

```sql
SELECT
  select_list
FROM
  table1
  CROSS JOIN table2;
```

### 自交
使用 `INNER JOIN` `LEFT JOIN` 或者 `CROSS JOIN` 进行自己与自己合并。能这么做，但是暂时没有想好实际使用案例，先放这里。

-----
## 数据分组
### `GROUP BY`
根据指定列进行分组。通常要配合 `MIN` `MAX` `AVG` `SUM` `COUNT` 进行计算，如果没有只会进行分组。

```sql
SELECT
  column1,
  column2,
  aggregate_function(column3)
FROM
  table_name
GROUP BY
  column1,
  column2;
```

其中 `aggregate_function` 就是使用 `MIN` `MAX` `AVG` `SUM` `COUNT` 进行计算的地方。

以下是使用这些计算方法的一个查询语句示例：

```sql
SELECT
  department_name,
  MIN(salary) min_salary,
  MAX(salary) max_salary,
  ROUND(AVG(salary), 2) average_salary
FROM
  employees e
  INNER JOIN departments d ON d.department_id = e.department_id
GROUP BY
  department_name;
```

### `HAVING`
在 `GROUP BY` 中，使用 `HAVING` 进行对组的筛选。

```sql
SELECT
  column1,
  column2,
  aggregate_function(column3)
FROM
  table1
GROUP BY
  column1,
  column2
HAVING
  group_condition;
```

这里的 group_condition 可以对组内的计算列进行判断（比如 `COUNT(employee_id) >= 5`）。

这里 `WHERE` 会在数据分组前对数据进行筛选，而 `HAVING` 主要针对数据分组后对数据进行筛选。

