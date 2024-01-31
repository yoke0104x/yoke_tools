
export type DefaultConfigType = {
    id: string
    children: string
    pid: string
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: DefaultConfigType = {
    id: 'id',
    children: 'children',
    pid: 'pid'
}

export type TreeHandlerType = {
    // 列表结构转树结构
    fromList: <T extends any>(list: T[], config?: Partial<DefaultConfigType>) => any[];
    // 树结构转列表结构
    toList: <T extends any>(tree: T[], config?: Partial<DefaultConfigType>) => any[];
    // 查找符合条件的单个节点
    findNode: <T extends any[]>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) => any;
    // 查找符合条件的所有节点
    findNodeAll: <T extends any>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) => any[];
    // 查找符合条件的单个节点的路径
    findPath: <T extends any>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) => any;
    // 查找符合条件的所有节点的路径
    findPathAll: <T extends any>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) => any;
    // 树结构筛选
    filter: <T extends any>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) => any;
    // 树结构遍
    forEach: <T extends any>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) => void;
    // 在指定oldNode前插入newNode
    insertBefore: <T extends any>(tree: T[], newNode: any, oldNode: any, config?: Partial<DefaultConfigType>) => void;
    // 在指定oldNode后插入newNode
    insertAfter: <T extends any>(tree: T[], newNode: any, oldNode: any, config?: Partial<DefaultConfigType>) => void;
    // 删除符合条件的所有节点
    removeNode: <T extends any>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) => void;
    // 创建实例
    createInstance: (config: DefaultConfigType) => TreeHandlerType;

    // 辅助方法
    _insert: (tree: any[], node: any, targetNode: any, config: any, after: any) => void;
}

/**
 * 获取配置
 * @param config 
 * @returns 
 */
const getConfig = (config: Partial<DefaultConfigType>): DefaultConfigType => Object.assign({}, DEFAULT_CONFIG, config)

const tools: Omit<TreeHandlerType, "createInstance"> = {

    /**
     * 列表结构转树结构
     * @param list 
     * @param config 
     * @returns 
     */
    fromList<T extends any>(list: T[], config?: Partial<DefaultConfigType>) {
        config = getConfig(config ?? {})
        const nodeMap = new Map(), result: any = [], { id, children, pid } = config as DefaultConfigType
        for (const node of list) {
            (node as any)[children] = (node as any)[children] || [] as any[]
            nodeMap.set((node as any)[id], node)
        }
        for (const node of list) {
            const parent = nodeMap.get((node as any)[pid])
                ; (parent ? parent.children : result).push(node)
        }
        return result
    },

    /**
     * 树结构转列表结构
     * @param tree 
     * @param config 
     * @returns 
     */
    toList<T extends any>(tree: T[], config?: Partial<DefaultConfigType>) {
        config = getConfig(config ?? {})
        const { children } = config as DefaultConfigType, result: any[] = [...tree]
        for (let i = 0; i < result.length; i++) {
            if (!result[i][children]) continue
            result.splice(i + 1, 0, ...result[i][children])
        }
        return result
    },

    /**
     * 查找符合条件的单个节点
     * @param tree 
     * @param func 
     * @param config 
     * @returns 
     */
    findNode<T extends any[]>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) {
        config = getConfig(config ?? {})
        const { children } = config as DefaultConfigType, list = [...tree as any]
        for (let node of list) {
            if (func(node)) return node as any
            (node as any)[children as keyof typeof node] && list.push(...(node as any)[children as keyof typeof node])
        }
        return null
    },

    /**
     * 查找符合条件的所有节点
     * @param tree 
     * @param func 
     * @param config 
     * @returns 
     */
    findNodeAll<T extends any>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) {
        config = getConfig(config ?? {})
        const { children } = config, list = [...tree], result: any = []
        for (let node of list) {
            func(node) && result.push(node)
                (node as any)[children as keyof typeof node] && list.push(...(node as any)[children as keyof typeof node])
        }
        return result
    },

    /**
     * 查找符合条件的单个节点的路径
     * @param tree 
     * @param func 
     * @param config 
     * @returns 
     */
    findPath<T extends any>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) {
        config = getConfig(config ?? {})
        const path = [], list = [...tree], visitedSet: Set<any> = new Set(), { children } = config
        while (list.length) {
            const node = list[0]
            if (visitedSet.has(node)) {
                path.pop()
                list.shift()
            } else {
                visitedSet.add(node);
                (node as any)[children as keyof typeof node] && list.unshift(...(node as any)[children as keyof typeof node])
                path.push(node)
                if (func(node)) return path
            }
        }
        return null
    },

    /**
     * 查找符合条件的所有节点的路径
     * @param tree 
     * @param func 
     * @param config 
     * @returns 
     */
    findPathAll<T extends any>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) {
        config = getConfig(config ?? {})
        const path = [], list = [...tree], result = []
        const visitedSet = new Set(), { children } = config
        while (list.length) {
            const node = list[0]
            if (visitedSet.has(node)) {
                path.pop()
                list.shift()
            } else {
                visitedSet.add(node);
                (node as any)[children as keyof typeof node] && list.unshift(...(node as any)[children as keyof typeof node])
                path.push(node)
                func(node) && result.push([...path])
            }
        }
        return result
    },

    /**
     * 树结构筛选
     * @param tree 
     * @param func 
     * @param config 
     * @returns 
     */
    filter<T extends any>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) {
        config = getConfig(config ?? {})
        const { children } = config as DefaultConfigType
        function listFilter(list: any) {
            return list.map((node: any) => ({ ...node })).filter((node: any) => {
                node[children] = node[children] && listFilter(node[children])
                return func(node) || (node[children] && node[children].length)
            })
        }
        return listFilter(tree)
    },

    /**
     * 树结构遍
     * @param tree 
     * @param func 
     * @param config 
     */
    forEach<T extends any>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) {
        config = getConfig(config ?? {})
        const list = [...tree], { children } = config as DefaultConfigType
        for (let i = 0; i < list.length; i++) {
            func(list[i]);
            (list[i] as any)[children] && list.splice(i + 1, 0, ...(list[i] as any)[children])
        }
    },

    /**
     * insert 辅助方法
     * @param tree 
     * @param node 
     * @param targetNode 
     * @param config 
     * @param after 
     */
    _insert(tree: any[], node: any, targetNode: any, config: any, after: any) {
        config = getConfig(config)
        const { children } = config
        function insert(list: any) {
            let idx = list.indexOf(node)
            idx < 0 ? list.forEach((n: any) => insert(n[children] || [])) : list.splice(idx + after, 0, targetNode)
        }
        insert(tree)
    },

    /**
     * 在指定oldNode前插入newNode
     * @param tree 
     * @param newNode 
     * @param oldNode 
     * @param config 
     */
    insertBefore(tree: any[], newNode: any, oldNode: any, config?: Partial<DefaultConfigType>) {
        tools._insert(tree, oldNode, newNode, config, 0)
    },

    /**
     * 在指定oldNode后插入newNode
     * @param tree 
     * @param oldNode 
     * @param newNode 
     * @param config 
     */
    insertAfter(tree: any[], newNode: any, oldNode: any, config?: Partial<DefaultConfigType>) {
        tools._insert(tree, oldNode, newNode, config, 1)
    },

    /**
     * 删除符合条件的所有节点
     * @param tree 
     * @param func 
     * @param config 
     */
    removeNode<T extends any>(tree: T[], func: (node: any) => boolean, config?: Partial<DefaultConfigType>) {
        config = getConfig(config ?? {})
        const { children } = config as DefaultConfigType, list = [tree]
        while (list.length) {
            const nodeList: any = list.shift()
            const delList = nodeList.reduce((r: any, n: any, idx: any) => (func(n) && r.push(idx), r), [])
            delList.reverse()
            delList.forEach((idx: any) => nodeList.splice(idx, 1))
            const childrenList = nodeList.map((n: any) => n[children]).filter((l: any) => l && l.length)
            list.push(...childrenList)
        }
    }

}

const makeHandlers = () => {
    const obj: Partial<TreeHandlerType> = {}
    for (let key in tools) {
        const keyStr = key as keyof typeof tools
        if (key.startsWith('_')) continue

        obj[keyStr] = (tools as any)[key]
    }
    return obj
}

const handlers = makeHandlers()

export const treeHandler: Omit<TreeHandlerType, "_insert"> = {
    ...handlers as TreeHandlerType,
    createInstance(config: DefaultConfigType) {
        const obj: any = {}
        for (const key in handlers) {
            const keyStr = key as keyof typeof handlers
            const func = handlers[keyStr]
            obj[keyStr] = (...args: any[]) => {
                if (typeof func === 'function') {
                    return (func as (node: any) => boolean)(...args as [], config)
                }
            }
        }
        return obj
    }
}