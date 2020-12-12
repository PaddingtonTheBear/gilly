export const openLink = (href: string) => {
	if (!href) return;
	const aRef = document.createElement('a');
	aRef.setAttribute('href', href);
	aRef.style.display = 'none';
	document.body.appendChild(aRef);
	aRef.click();
	document.body.removeChild(aRef);
};
