/*
 * @description: demo文件，用于测试功能，不参与编译，不会被打包到dist目录下
 * @author: Yoke
 * @Date: 2024-02-01 10:01:41
 */
import { type CalculatorImpl, Calculator } from "./calculationClass";
import { treeHandler } from "./treeTools";
const calculator: CalculatorImpl = new Calculator();
// 计算 0.1 + 0.2
// const result = calculator.add(0.1, 0.2, 0.2, 0.1, 0.4, 0.43).getResult(); //0.3
// 计算 0.3 - 0.1
// const result = calculator.divide("0.3", "0.1").getResult(); // 0.2
// 计算 0.3 * 0.1 - 0.2 + 0.1 / 0.2
// 注意：这里的的计算工程并不是按照数学的计算顺序，而是按照代码的书写顺序，所以这里的计算顺序是：0.3 * 0.1 - 0.2 + 0.1 / 0.2 = -0.35
// const result = calculator.multiply("0.3", "0.1").subtract("0.2").add("0.1").divide("0.2").getResult(); // -0.35


// 写一个树形结构的数据，然后转换为树形结构
const data: TreeType[] = [{
    id: 1,
    pid: 0,
    name: 'body'
}, {
    id: 2,
    pid: 1,
    name: 'title'
}, {
    id: 3,
    pid: 2,
    name: 'div'
}, {
    id: 4,
    pid: 2,
    name: 'div'
}
];

type TreeType = {
    id: number,
    pid: number,
    name: string,
    children?: TreeType[]
}

// 转换为树形结构
const tree = treeHandler.fromList<TreeType>(data, {
    id: 'id',
    pid: 'pid',
    children: 'children'
})

// 树形结构转换为列表
// const list = treeHandler.toList(tree);

// // 查找list中的某个节点
// const findNode = treeHandler.findNode(data, (node) => {
//     return node.id === 2
// });

// // 查询list中的所有相同节点
// const findNodes = treeHandler.findNodeAll(data, (node) => {
//     return node.name === "div"
// });

// 查找符合条件的所有节点
const filter = treeHandler.filter(tree, (node) => {
    return node.name === "div"
});

console.log(tree, filter)