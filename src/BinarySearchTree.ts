/**
 * 二叉搜索树（Binary Search Tree）实现
 * 支持插入、删除、查找和遍历操作
 */

/** 树节点 */
export class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/** 遍历回调类型 */
export type TraversalCallback<T> = (value: T) => void;

/** 比较函数类型，返回负数表示 a < b，0 表示 a === b，正数表示 a > b */
export type CompareFn<T> = (a: T, b: T) => number;

/** 默认比较函数（适用于 number 和 string） */
function defaultCompare<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export class BinarySearchTree<T> {
  private root: TreeNode<T> | null = null;
  private compareFn: CompareFn<T>;

  constructor(compareFn?: CompareFn<T>) {
    this.compareFn = compareFn ?? defaultCompare;
  }

  /** 获取根节点（只读） */
  getRoot(): TreeNode<T> | null {
    return this.root;
  }

  /** 判断树是否为空 */
  isEmpty(): boolean {
    return this.root === null;
  }

  // ==================== 插入 ====================

  /** 插入一个值，返回是否成功（重复值不插入） */
  insert(value: T): boolean {
    if (this.root === null) {
      this.root = new TreeNode(value);
      return true;
    }
    return this.insertNode(this.root, value);
  }

  private insertNode(node: TreeNode<T>, value: T): boolean {
    const cmp = this.compareFn(value, node.value);

    if (cmp === 0) {
      return false; // 重复值
    }

    if (cmp < 0) {
      if (node.left === null) {
        node.left = new TreeNode(value);
        return true;
      }
      return this.insertNode(node.left, value);
    }

    if (node.right === null) {
      node.right = new TreeNode(value);
      return true;
    }
    return this.insertNode(node.right, value);
  }

  // ==================== 查找 ====================

  /** 查找值是否存在 */
  has(value: T): boolean {
    return this.findNode(this.root, value) !== null;
  }

  /** 查找并返回节点（如果存在） */
  find(value: T): TreeNode<T> | null {
    return this.findNode(this.root, value);
  }

  private findNode(node: TreeNode<T> | null, value: T): TreeNode<T> | null {
    if (node === null) return null;

    const cmp = this.compareFn(value, node.value);

    if (cmp === 0) return node;
    if (cmp < 0) return this.findNode(node.left, value);
    return this.findNode(node.right, value);
  }

  /** 获取最小值 */
  min(): T | null {
    const node = this.minNode(this.root);
    return node ? node.value : null;
  }

  /** 获取最大值 */
  max(): T | null {
    const node = this.maxNode(this.root);
    return node ? node.value : null;
  }

  private minNode(node: TreeNode<T> | null): TreeNode<T> | null {
    if (node === null) return null;
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }

  private maxNode(node: TreeNode<T> | null): TreeNode<T> | null {
    if (node === null) return null;
    let current = node;
    while (current.right !== null) {
      current = current.right;
    }
    return current;
  }

  // ==================== 删除 ====================

  /** 删除一个值，返回是否成功删除 */
  delete(value: T): boolean {
    const { node, found } = this.deleteNode(this.root, value);
    this.root = node;
    return found;
  }

  private deleteNode(
    node: TreeNode<T> | null,
    value: T
  ): { node: TreeNode<T> | null; found: boolean } {
    if (node === null) {
      return { node: null, found: false };
    }

    const cmp = this.compareFn(value, node.value);

    if (cmp < 0) {
      const result = this.deleteNode(node.left, value);
      node.left = result.node;
      return { node, found: result.found };
    }

    if (cmp > 0) {
      const result = this.deleteNode(node.right, value);
      node.right = result.node;
      return { node, found: result.found };
    }

    // 找到要删除的节点
    // 情况1: 叶子节点
    if (node.left === null && node.right === null) {
      return { node: null, found: true };
    }

    // 情况2: 只有一个子节点
    if (node.left === null) {
      return { node: node.right, found: true };
    }
    if (node.right === null) {
      return { node: node.left, found: true };
    }

    // 情况3: 有两个子节点，用右子树的最小值替换
    const successor = this.minNode(node.right)!;
    node.value = successor.value;
    const result = this.deleteNode(node.right, successor.value);
    node.right = result.node;
    return { node, found: true };
  }

  // ==================== 遍历 ====================

  /** 中序遍历（升序） */
  inorderTraversal(callback?: TraversalCallback<T>): T[] {
    const result: T[] = [];
    this.inorder(this.root, (value) => {
      result.push(value);
      callback?.(value);
    });
    return result;
  }

  private inorder(node: TreeNode<T> | null, callback: TraversalCallback<T>): void {
    if (node === null) return;
    this.inorder(node.left, callback);
    callback(node.value);
    this.inorder(node.right, callback);
  }

  /** 前序遍历 */
  preorderTraversal(callback?: TraversalCallback<T>): T[] {
    const result: T[] = [];
    this.preorder(this.root, (value) => {
      result.push(value);
      callback?.(value);
    });
    return result;
  }

  private preorder(node: TreeNode<T> | null, callback: TraversalCallback<T>): void {
    if (node === null) return;
    callback(node.value);
    this.preorder(node.left, callback);
    this.preorder(node.right, callback);
  }

  /** 后序遍历 */
  postorderTraversal(callback?: TraversalCallback<T>): T[] {
    const result: T[] = [];
    this.postorder(this.root, (value) => {
      result.push(value);
      callback?.(value);
    });
    return result;
  }

  private postorder(node: TreeNode<T> | null, callback: TraversalCallback<T>): void {
    if (node === null) return;
    this.postorder(node.left, callback);
    this.postorder(node.right, callback);
    callback(node.value);
  }

  /** 层序遍历（BFS） */
  levelOrderTraversal(callback?: TraversalCallback<T>): T[] {
    const result: T[] = [];
    if (this.root === null) return result;

    const queue: TreeNode<T>[] = [this.root];

    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.value);
      callback?.(node.value);

      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }

    return result;
  }

  // ==================== 辅助方法 ====================

  /** 获取树的高度 */
  height(): number {
    return this.getHeight(this.root);
  }

  private getHeight(node: TreeNode<T> | null): number {
    if (node === null) return 0;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  /** 获取节点总数 */
  size(): number {
    return this.getSize(this.root);
  }

  private getSize(node: TreeNode<T> | null): number {
    if (node === null) return 0;
    return 1 + this.getSize(node.left) + this.getSize(node.right);
  }
}
