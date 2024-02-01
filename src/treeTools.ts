
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
    fromList: <T extends Record<string, any>>(list: T[], config?: Partial<DefaultConfigType>) => T[];
    // 树结构转列表结构
    toList: <T extends Record<string, any>>(tree: T[], config?: Partial<DefaultConfigType>) => T[];
    // 查找符合条件的单个节点
    findNode: <T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>) => T | null;
    // 查找符合条件的所有节点
    findNodeAll: <T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>) => T[];
    // 查找符合条件的单个节点的路径
    findPath: <T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>) => T[] | null;
    // 查找符合条件的所有节点的路径
    findPathAll: <T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>) => T[][];
    // 树结构筛选
    filter: <T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>) => T[];
    // 树结构遍
    forEach: <T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>) => void;
    // 在指定oldNode前插入newNode
    insertBefore: <T extends Record<string, any>>(tree: T[], newNode: T, oldNode: any, config?: Partial<DefaultConfigType>) => void;
    // 在指定oldNode后插入newNode
    insertAfter: <T extends Record<string, any>>(tree: T[], newNode: T, oldNode: any, config?: Partial<DefaultConfigType>) => void;
    // 删除符合条件的所有节点
    removeNode: <T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>) => void;
    // 创建实例
    createInstance: (config: Partial<DefaultConfigType>) => TreeHandlerType;

    // 辅助方法
    _insert: <T>(tree: T[], node: T, targetNode: T, config: DefaultConfigType, after: number) => void;
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
    fromList<T extends Record<string, any>>(list: T[], config?: Partial<DefaultConfigType>): T[] {
        config = getConfig(config || {})
        const nodeMap = new Map<any, T>(), result: T[] = [], { id, children, pid } = config as DefaultConfigType
        for (const node of list) {
            (node[children] as T[] | undefined) = node[children] || [];
            nodeMap.set(node[id], node)
        }
        for (const node of list) {
            const parent = nodeMap.get(node[pid])
                ; (parent ? parent[children] : result).push(node)
        }
        return result
    },

    /**
     * 树结构转列表结构
     * @param tree 
     * @param config 
     * @returns 
     */
    toList<T extends Record<string, any>>(tree: T[], config?: Partial<DefaultConfigType>): T[] {
        config = getConfig(config ?? {})
        const { children } = config as DefaultConfigType, result: T[] = [...tree]
        for (let i = 0; i < result.length; i++) {
            if (!result[i][children]) continue
            result.splice(i + 1, 0, ...result[i][children])
        }
        return result?.map(el => {
            delete el[children]
            return el
        })
    },

    /**
     * 查找符合条件的单个节点
     * @param tree 
     * @param func 
     * @param config 
     * @returns 
     */
    findNode<T extends Record<string, any>>(list: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>): T | null {
        config = getConfig(config ?? {})
        const { children } = config as DefaultConfigType
        for (let node of list) {
            if (func(node)) return node;
            node[children] && list.push(...node[children])
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
    findNodeAll<T extends Record<string, any>>(list: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>): T[] {
        config = getConfig(config ?? {})
        const { children } = config as DefaultConfigType, result: T[] = []
        for (let node of list) {
            func(node) && result.push(node);
            node[children] && list.push(...node[children])
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
    findPath<T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>): T[] | null {
        config = getConfig(config ?? {})
        const path: T[] = [], list = [...tree as T[]], visitedSet = new Set<T>(), { children } = config as DefaultConfigType
        while (list.length) {
            const node = list[0]
            if (visitedSet.has(node)) {
                path.pop()
                list.shift()
            } else {
                visitedSet.add(node);
                node[children] && list.unshift(...node[children])
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
    findPathAll<T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>): T[][] {
        config = getConfig(config ?? {})
        const path: T[] = [], list = [...tree as T[]], result: T[][] = []
        const visitedSet = new Set<T>(), { children } = config as DefaultConfigType
        while (list.length) {
            const node = list[0]
            if (visitedSet.has(node)) {
                path.pop()
                list.shift()
            } else {
                visitedSet.add(node);
                node[children] && list.unshift(...node[children])
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
    filter<T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>): T[] {
        config = getConfig(config ?? {})
        const { children } = config as DefaultConfigType
        function listFilter(list: T[]): T[] {
            return list.map((node: T & any) => ({ ...node })).filter((node: T & any) => {
                node[children] = node[children] && listFilter(node[children])
                return func(node) || (node[children] && node[children].length)
            })
        }
        return listFilter(tree)
    },

    /**
     * 树结构遍历
     * @param tree 
     * @param func 
     * @param config 
     */
    forEach<T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>): void {
        config = getConfig(config ?? {})
        const list = [...tree as T[]], { children } = config as DefaultConfigType
        for (let i = 0; i < list.length; i++) {
            func(list[i]);
            list[i][children] && list.splice(i + 1, 0, ...list[i][children])
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
    _insert<T>(tree: T[], node: T, targetNode: T, config: DefaultConfigType, after: number): void {
        config = getConfig(config)
        const { children } = config as DefaultConfigType
        function insert(list: T[]) {
            let idx = list.indexOf(node)
            idx < 0 ? list.forEach((n: T & any) => insert(n[children] || [])) : list.splice(idx + after, 0, targetNode)
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
    insertBefore<T extends Record<string, any>>(tree: T[], newNode: T, oldNode: T, config?: Partial<DefaultConfigType>): void {
        tools._insert<T>(tree, oldNode, newNode, config as DefaultConfigType, 0)
    },

    /**
     * 在指定oldNode后插入newNode
     * @param tree 
     * @param oldNode 
     * @param newNode 
     * @param config 
     */
    insertAfter<T extends Record<string, any>>(tree: T[], newNode: T, oldNode: T, config?: Partial<DefaultConfigType>): void {
        tools._insert(tree, oldNode, newNode, config as DefaultConfigType, 1)
    },

    /**
     * 删除符合条件的所有节点
     * @param tree 
     * @param func 
     * @param config 
     */
    removeNode<T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, config?: Partial<DefaultConfigType>): void {
        config = getConfig(config ?? {})
        const { children } = config as DefaultConfigType, list = [tree]
        while (list.length) {
            const nodeList: T[] | undefined = list.shift()
            const delList = nodeList!.reduce((r: any, n: T, idx: number) => (func(n) && r.push(idx), r), [])
            delList.reverse()
            delList.forEach((idx: number) => nodeList!.splice(idx, 1))
            const childrenList = nodeList!.map((n: T) => n[children]).filter((l: T) => l && l.length)
            list.push(...childrenList)
        }
    }

}

const makeHandlers = (): Partial<TreeHandlerType> => {
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
    createInstance(config: Partial<DefaultConfigType>): TreeHandlerType {
        const obj: Partial<TreeHandlerType> = {}
        for (const key in handlers) {
            const keyStr = key as keyof typeof handlers
            const func = handlers[keyStr];
            (obj as any)[keyStr] = (...args: any[]) => {
                if (typeof func === 'function') {
                    return (func as (node: any) => boolean)(...args as [], config)
                }
            }
        }
        return obj as TreeHandlerType;
    }
}