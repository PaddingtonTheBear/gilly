import { TreeNode } from 'primeng/api';

import { deepClone } from '../deepClone';

interface TransformTreeOptions {
	childrenMeta: ChildrenMeta;
	expandAll?: boolean;
}

interface ChildrenMeta {
	[prop: string]: ChildMeta;
}

interface ChildMeta {
	labelProp?: string;
	expanded?: boolean;
	type?: string;
	styleClass?: string;
	expandedIcon?: string;
	collapsedIcon?: string;

	childProp?: string;
	isLeaf?: boolean;
}

export const transformTreetoTreeNodes = (
	tree: any[],
	options?: TransformTreeOptions,
	parent?: any
): TreeNode[] => {
	if (!tree?.length) return null;

	return (tree || []).map((node) => {
		const childMeta = generateChildMeta(node, options);

		return {
			...(node.data || node),
			label: node[childMeta.labelProp],
			data: node.data || node,
			expanded: childMeta.expanded,
			parent: parent,
			children: !childMeta.isLeaf
				? transformTreetoTreeNodes(node[childMeta.childProp], options, node)
				: null
			// type: childMeta.type,
			// styleClass: childMeta.styleClass,
			// expandedIcon: childMeta.expandedIcon,
			// collapsedIcon: childMeta.collapsedIcon
		};
	});
};

const generateChildMeta = (node: any, options: TransformTreeOptions): ChildMeta => {
	let childMeta: ChildMeta = {
		childProp: 'children',
		labelProp: 'label',
		expanded: options?.expandAll ? options.expandAll : true
		// styleClass: parent ? 'child-node' : 'parent-node'
		// expandedIcon: 'pi pi-folder-open',
		// collapsedIcon: 'pi pi-folder',
	};
	if (options?.childrenMeta) {
		const nodeProps = Object.keys(node);
		let foundChildMetaFlag: boolean = false;
		for (let i = 0; i < nodeProps.length && !foundChildMetaFlag; i++) {
			const nodeProp = nodeProps[i];
			const foundChildMeta = options.childrenMeta[nodeProp];
			if (foundChildMeta) {
				childMeta.childProp = nodeProp;
				Object.assign(childMeta, foundChildMeta);
				foundChildMetaFlag = true;
			}
		}
	}

	childMeta.isLeaf = node[childMeta.childProp]?.length <= 0;
	childMeta.type = childMeta.type || childMeta.isLeaf ? 'leaf' : null;

	return childMeta;
};
