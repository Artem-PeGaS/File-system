module.exports = {
	plugins: [
		require('postcss-easy-import'),
		require('postcss-mixins'),
		require('postcss-nested'),
		require('postcss-object-fit-images'),
		require('postcss-preset-env')({
			stage: 2,
			features: {
				'custom-media-queries': true,
				'color-mod-function': true
			}
		})
	]
};
