export const flattenTree = (tree: any[], arr) => {
	if (!tree || !arr) return [];
	for (let i = 0; i < tree.length; i++) {
		arr.push(tree[i]);
		flattenTree(tree[i].children, arr);
	}
	return arr;
};
