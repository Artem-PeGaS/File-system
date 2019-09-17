export default (device) => {
	let width = null;
	switch (device) {
		case 'onlyPhone':
			width = '(max-width: 599px)';
			break;
		case 'onlyTabletPortrait':
			width = '(min-width: 600px) and (max-width: 899px)';
			break;
		case 'onlyTabletLandscape':
			width = '(min-width: 900px) and (max-width: 1279px)';
			break;
		case 'onlyDesktop':
			width = '(min-width: 1280px) and (max-width: 1599px)';
			break;
		case 'tabletPortraitUp':
			width = '(min-width: 600px)';
			break;
		case 'tabletLandscapeUp':
			width = '(min-width: 900px)';
			break;
		case 'desktopUp':
			width = '(min-width: 1200px)';
			break;
		case 'bigDesktopUp':
			width = '(min-width: 1600px)';
			break;
	}
	return window.matchMedia(width).matches;
};
