/* global $ */

import animate from './animate.js';
import mm from './mm.js';

import 'svgxuse';
import 'web-animations-js';
import lozad from 'lozad';
import objectFitImages from 'object-fit-images';

// Setup lozad observer
const lazyload = lozad('.lozad', {
	rootMargin: `${window.innerHeight}px 0px ${window.innerHeight}px 0px`
});

$(() => {
	// Polyfills
	objectFitImages();

	// Observe new elements
	lazyload.observe();

	// IE11 detection
	if (/MSIE/.test(window.navigator.userAgent) || /Trident/.test(window.navigator.userAgent)) {
		$('body').addClass('msie');
	}

	const $container = $('body');

	if ($container.find('.question').length > 0) {
		$container.find('.question').each((i, el) => {
			const $el = $(el);
			$el.on('click', () => {
				alert();
			});
		});
	}
});
