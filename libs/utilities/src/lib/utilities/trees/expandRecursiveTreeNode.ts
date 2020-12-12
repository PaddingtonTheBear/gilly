import { TreeNode } from 'primeng/api';

export const expandRecursiveTreeNode = (node: TreeNode, isExpand: boolean) => {
    node.expanded = isExpand;
    if (node.children) {
        node.children.forEach(childNode => {
            expandRecursiveTreeNode(childNode, isExpand);
        })
    }
}