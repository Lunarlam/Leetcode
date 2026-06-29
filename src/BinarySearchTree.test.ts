import { BinarySearchTree } from './BinarySearchTree';

describe('BinarySearchTree', () => {
  let bst: BinarySearchTree<number>;

  beforeEach(() => {
    bst = new BinarySearchTree<number>();
  });

  describe('insert', () => {
    it('should insert values correctly', () => {
      expect(bst.insert(10)).toBe(true);
      expect(bst.insert(5)).toBe(true);
      expect(bst.insert(15)).toBe(true);
      expect(bst.size()).toBe(3);
    });

    it('should not insert duplicate values', () => {
      bst.insert(10);
      expect(bst.insert(10)).toBe(false);
      expect(bst.size()).toBe(1);
    });

    it('should maintain BST property', () => {
      [8, 3, 10, 1, 6, 14, 4, 7, 13].forEach((v) => bst.insert(v));
      expect(bst.inorderTraversal()).toEqual([1, 3, 4, 6, 7, 8, 10, 13, 14]);
    });
  });

  describe('find / has', () => {
    beforeEach(() => {
      [10, 5, 15, 3, 7, 12, 20].forEach((v) => bst.insert(v));
    });

    it('should find existing values', () => {
      expect(bst.has(10)).toBe(true);
      expect(bst.has(5)).toBe(true);
      expect(bst.has(20)).toBe(true);
    });

    it('should return false for non-existing values', () => {
      expect(bst.has(100)).toBe(false);
      expect(bst.has(0)).toBe(false);
    });

    it('should return the node with find()', () => {
      const node = bst.find(15);
      expect(node).not.toBeNull();
      expect(node!.value).toBe(15);
    });

    it('should return null for non-existing find()', () => {
      expect(bst.find(999)).toBeNull();
    });
  });

  describe('min / max', () => {
    it('should return null for empty tree', () => {
      expect(bst.min()).toBeNull();
      expect(bst.max()).toBeNull();
    });

    it('should return correct min and max', () => {
      [10, 5, 15, 3, 7, 12, 20].forEach((v) => bst.insert(v));
      expect(bst.min()).toBe(3);
      expect(bst.max()).toBe(20);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      [10, 5, 15, 3, 7, 12, 20].forEach((v) => bst.insert(v));
    });

    it('should return false when deleting non-existing value', () => {
      expect(bst.delete(100)).toBe(false);
      expect(bst.size()).toBe(7);
    });

    it('should delete a leaf node', () => {
      expect(bst.delete(3)).toBe(true);
      expect(bst.has(3)).toBe(false);
      expect(bst.size()).toBe(6);
    });

    it('should delete a node with one child', () => {
      bst.delete(3); // make 5 have only right child (7)
      expect(bst.delete(5)).toBe(true);
      expect(bst.has(5)).toBe(false);
      expect(bst.has(7)).toBe(true);
    });

    it('should delete a node with two children', () => {
      expect(bst.delete(15)).toBe(true);
      expect(bst.has(15)).toBe(false);
      expect(bst.has(12)).toBe(true);
      expect(bst.has(20)).toBe(true);
      // BST property should be maintained
      const sorted = bst.inorderTraversal();
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i]).toBeGreaterThan(sorted[i - 1]);
      }
    });

    it('should delete the root node', () => {
      expect(bst.delete(10)).toBe(true);
      expect(bst.has(10)).toBe(false);
      expect(bst.size()).toBe(6);
      // BST property maintained
      const sorted = bst.inorderTraversal();
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i]).toBeGreaterThan(sorted[i - 1]);
      }
    });
  });

  describe('traversal', () => {
    beforeEach(() => {
      //        10
      //       /  \
      //      5    15
      //     / \   / \
      //    3   7 12  20
      [10, 5, 15, 3, 7, 12, 20].forEach((v) => bst.insert(v));
    });

    it('inorder traversal (sorted order)', () => {
      expect(bst.inorderTraversal()).toEqual([3, 5, 7, 10, 12, 15, 20]);
    });

    it('preorder traversal', () => {
      expect(bst.preorderTraversal()).toEqual([10, 5, 3, 7, 15, 12, 20]);
    });

    it('postorder traversal', () => {
      expect(bst.postorderTraversal()).toEqual([3, 7, 5, 12, 20, 15, 10]);
    });

    it('level order traversal (BFS)', () => {
      expect(bst.levelOrderTraversal()).toEqual([10, 5, 15, 3, 7, 12, 20]);
    });

    it('should invoke callback during traversal', () => {
      const values: number[] = [];
      bst.inorderTraversal((v) => values.push(v * 2));
      expect(values).toEqual([6, 10, 14, 20, 24, 30, 40]);
    });

    it('should return empty array for empty tree', () => {
      const emptyBst = new BinarySearchTree<number>();
      expect(emptyBst.inorderTraversal()).toEqual([]);
      expect(emptyBst.preorderTraversal()).toEqual([]);
      expect(emptyBst.postorderTraversal()).toEqual([]);
      expect(emptyBst.levelOrderTraversal()).toEqual([]);
    });
  });

  describe('helper methods', () => {
    it('isEmpty should return true for new tree', () => {
      expect(bst.isEmpty()).toBe(true);
    });

    it('isEmpty should return false after insert', () => {
      bst.insert(1);
      expect(bst.isEmpty()).toBe(false);
    });

    it('should calculate height correctly', () => {
      expect(bst.height()).toBe(0);
      bst.insert(10);
      expect(bst.height()).toBe(1);
      bst.insert(5);
      bst.insert(15);
      expect(bst.height()).toBe(2);
      bst.insert(3);
      expect(bst.height()).toBe(3);
    });

    it('should calculate size correctly', () => {
      expect(bst.size()).toBe(0);
      [10, 5, 15, 3, 7].forEach((v) => bst.insert(v));
      expect(bst.size()).toBe(5);
    });
  });

  describe('custom comparator', () => {
    it('should work with string type', () => {
      const strBst = new BinarySearchTree<string>();
      ['banana', 'apple', 'cherry', 'date'].forEach((v) => strBst.insert(v));
      expect(strBst.inorderTraversal()).toEqual(['apple', 'banana', 'cherry', 'date']);
    });

    it('should work with custom compare function', () => {
      // Reverse order BST
      const reverseBst = new BinarySearchTree<number>((a, b) => b - a);
      [10, 5, 15, 3, 7].forEach((v) => reverseBst.insert(v));
      expect(reverseBst.inorderTraversal()).toEqual([15, 10, 7, 5, 3]);
    });
  });
});
