# yoke_tools 的使用说明

## 安装
```bash
npm install -g yoke_tools
```

## 使用
```ts
import { treeHandler,Calculator } from 'yoke_tools';

const calculator = new Calculator();
const result = calculator.add(0.1,0.2).getResult() // 0.3

```

## cdn使用
```html
<script src="https://cdn.jsdelivr.net/npm/yoke_tools@0.1.0/dist/index.min.js"></script>
<!-- <script src="https://unpkg.com/yoke_tools/dist/yoke_tools.min.js"></script>  备用地址 -->
<script>
    const { treeHandler,Calculator } = yokeTools;
    const calculator = new Calculator();
    const result = calculator.add(0.1,0.2).getResult() // 0.3
</script>
```

### API说明
| 功能                         |                           API                            | 用到的config配置项 |                                                备注                                                |
| ---------------------------- | :------------------------------------------------------: | :----------------: | :------------------------------------------------------------------------------------------------: |
| 列表结构转树结构             |            treeHandler.fromList(list[, config])             | id、pid、children  |                                                                                                    |
| 树结构转列表结构             |             treeHandler.toList(tree[, config] )             |      children      |                                                                                                    |
| 查找符合条件的单个节点       |       treeHandler.findNode(tree, callback[, config])        |      children      |         返回广度优先遍历查找到的第一个符合条件(callback(node)为true)的节点，没有则返回null         |
| 查找符合条件的所有节点       |      treeHandler.findNodeAll(tree, callback[, config])      |      children      |                                                                                                    |
| 查找符合条件的单个节点的路径 |       treeHandler.findPath(tree, callback[, config])        |      children      |    返回符合条件(callback(node)为true)的节点的所有祖先节点有序组成的数组，没有找到节点则返回null    |
| 查找符合条件的所有节点的路径 |      treeHandler.findPathAll(tree, callback[, config])      |      children      |                       返回符合条件(callback(node)为true)的节点路径组成的数组                       |
| 树结构筛选                   |        treeHandler.filter(tree, callback[, config])         |      children      | 返回符合筛选条件(callback(node)为true)的树节点构成的树，一个节点符合条件，其祖先节点也会被保留返回 |
| 树结构遍历                   |        treeHandler.forEach(tree, callback[, config])        |      children      |                            对于所有节点node调用callback(node)，深度优先                            |
| 在指定oldNode前插入newNode   | treeHandler.insertBefore (tree, newNode, oldNode[, config]) |      children      |   如果树中没有oldNode，则不会改变原数组。注意oldNode和newNode的参数顺序，和它们在树中的顺序一致    |
| 在指定oldNode后插入newNode   | treeHandler.insertAfter (tree, oldNode, newNode[, config])  |      children      |   如果树中没有oldNode，则不会改变原数组。注意oldNode和newNode的参数顺序，和它们在树中的顺序一致    |
| 删除符合条件的所有节点       |      treeHandler.removeNode(tree, callback[, config])       |      children      |                       删除符合条件(callback(node)为true)的所有节点及其子节点                       |
| 创建闭包了配置项config的实例 |             treeHandler.createInstance(config)              |         无         |   为了避免每个函数都传入config参数，你可以使用该API创建一个实例，以上所有API可以当成实例方法使用   |

参数说明：
#### 1. list 列表 给定一组node节点列表，每个node节点至少包含两个属性：唯一标识和父节点标识，例如：
  ```js
  const list = [
    { id: '1', title: '节点1', parentId: '', },
    { id: '1-1', title: '节点1-1', parentId: '1' },
    { id: '1-2', title: '节点1-2', parentId: '1' },
    { id: '2', title: '节点2', parentId: '' },
    { id: '2-1', title: '节点2-1', parentId: '2' }
  ]
  ```
#### 2. tree 树结构数据 一个数组表示的一棵树，例如：
  ```js
  const tree = [
    {
      id: '1',
      title: '节点1',
      children: [
        {
          id: '1-1',
          title: '节点1-1'
        },
        {
          id: '1-2',
          title: '节点1-2',
          children: [
            {
              id: '1-2-1',
              title: '节点1-2-1'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: '节点2',
      children: [
        {
          id: '2-1',
          title: '节点2-1'
        }
      ]
    }
  ]
  ```
#### 3. callback 回调函数，接收node参数，在查找、筛选等功能中表示约束条件，在遍历功能中则为对每个节点的操作。
#### 4. config 可选，用于自定义node节点的唯一标识、父节点、子节点的属性名称，如果接口用到的config配置项与默认不同，需要通过config参数来自定义不同的部分。默认值如下：
  ```js
  {
    id: 'id', // 唯一标识属性名
    children: 'children', // 子节点属性名
    pid: 'pid' // 父节点标识属性名
  }
  ```

## 四、使用示例
```js
const tree = require('./index')

function getTree () {
  const tree = [
    {
      id: '1',
      title: '节点1',
      children: [
        {
          id: '1-1',
          title: '节点1-1'
        },
        {
          id: '1-2',
          title: '节点1-2',
          children: [
            {
              id: '1-2-1',
              title: '节点1-2-1'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: '节点2',
      children: [
        {
          id: '2-1',
          title: '节点2-1'
        }
      ]
    }
  ]
  return tree
}

function getList () {
  const list = [
    {
      id: '1',
      title: '节点1',
      parentId: '',
    },
    {
      id: '1-1',
      title: '节点1-1',
      parentId: '1'
    },
    {
      id: '1-2',
      title: '节点1-2',
      parentId: '1'
    },
    {
      id: '2',
      title: '节点2',
      parentId: ''
    },
    {
      id: '2-1',
      title: '节点2-1',
      parentId: '2'
    }
  ]
  return list
}


// 创建一个实例，因为数据里的pid属性名与默认值不同，所以需要传递该配置项
const instance = treeHandler.createInstance({ pid: 'parentId' })

// 列表转树 不创建实例
function testFromList () {
  const list = getList()
  const tree = treeHandler.fromList(list, { pid: 'parentId' })
  console.log(JSON.stringify(tree, null, 2))
}

// 列表结构转树 使用instance
function testFromList () {
  const list = getList()
  const tree = instance.fromList(list)
  console.log(JSON.stringify(tree, null, 2))
}

// 树结构转列表结构
function testToList () {
  const tree = getTree()
  const list = instance.toList(tree)
  console.log(list.map(i => i.id))
}

// 查找节点
function testFindNode () {
  const callback = node => node.id == '2-1'
  const tree = getTree()
  const result = instance.findNode(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

// 查找符合条件的所有节点
function testFindNodeAll () {
  const list = getList()
  const tree = instance.fromList(list)
  
  const callback = node => node.parentId == '1'
  const result = instance.findNodeAll(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

// 查找节点路径
function testFindPath () {
  const callback = node => node.id == '2-1'
  const tree = getTree()
  const result = instance.findPath(tree, callback)
  console.log(result.map(i => i.id))
}

// 查找符合条件的所有节点的路径
function testFindPathAll () {
  const callback = node => node.id == '2-1' || node.id == '1-2-1'
  const tree = getTree()
  const result = instance.findPathAll(tree, callback)
  console.log(result)
}

// 树节点过滤
function testFilter () {
  const callback = node => node.id == '2-1'
  const tree = getTree()
  const result = instance.filter(tree, callback)
  console.log(JSON.stringify(result, null, 2))
}

// 树节点遍历 深度优先
function testForEach () {
  const tree = getTree()
  const idList = []
  instance.forEach(tree, node => idList.push(node.id))
  console.log(idList)
}

// 节点插入：在node前插入newNode
function testInsertBefore () {
  const tree = getTree()
  const node = instance.findNode(tree, n => n.id == '1-2-1')
  const newNode = {
    id: '1-2-0',
    title: '节点1-2-0'
  }
  instance.insertBefore(tree, newNode, node)
  const idList = []
  instance.forEach(tree, node => idList.push(node.id))
  console.log(idList)
}

// 节点插入：在node后插入newNode
function testInsertAfter () {
  const tree = getTree()
  const node = instance.findNode(tree, n => n.id == '1-2-1')
  const newNode = {
    id: '1-2-2',
    title: '节点1-2-2'
  }
  instance.insertAfter(tree, node, newNode)
  const idList = []
  instance.forEach(tree, node => idList.push(node.id))
  console.log(idList)
}

// 节点删除：删除符合条件的Node
function testRemoveNode () {
  const tree = getTree()
  instance.removeNode(tree, n => n.id == '1')
  console.log(tree)
}

```

-------
## 联系我

使用过程中有任何问题，请联系我：

Email: 2480790748@qq.com

wechat: 2480790748

-----
## 有BUG或新需求

欢迎在issue提树结构相关的新需求或者本库的BUG，以帮助我完善这个小树库，感谢。

您也可以通过PR参与完善，非常感谢。