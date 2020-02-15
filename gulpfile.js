const gulp = require('gulp'),
	through2 = require('through2').obj,
	request = require('request'),
	fs = require('fs'),
	browserSync = require('browser-sync').create(),
	eslint = require('eslint'),
	prettier = require('prettier'),
	postcss = require('postcss'),
	nunjucks = require('nunjucks'),
	csso = require('csso'),
	SVGSpriter = require('svg-sprite'),
	SVGO = require('svgo'),
	webpack = require('webpack');

gulp.task('eslint', (done) => {
	const cli = new eslint.CLIEngine({
		fix: true
	});
	const report = cli.executeOnFiles(['scripts/main.js']);
	eslint.CLIEngine.outputFixes(report);
	const results = cli.getFormatter()(report.results);

	console.log(results); //eslint-disable-line

	if (report.errorCount > 0) new Error()();
	done();
});

gulp.task('prettier', (done) => {
	const outputs = [
		{
			src: ['*.json', '*.js', '.*rc'],
			dest: './'
		},
		{
			src: ['scripts/*.js'],
			dest: './scripts'
		},
		{
			src: ['styles/**/*.css'],
			dest: './styles'
		}
	];

	outputs.forEach((file) => {
		gulp.src(file.src)
			.pipe(
				through2((file, enc, cb) => {
					prettier.resolveConfig(file.path).then((options) => {
						file.contents = new Buffer.from(
							prettier.format(file.contents.toString(), Object.assign(options, { filepath: file.path }))
						);
						cb(null, file);
					});
				})
			)
			.pipe(gulp.dest(file.dest))
			.on('finish', () => done());
	});
});

gulp.task('postcss', (done) => {
	const outputs = {
		src: 'styles/main.css',
		dest: './www/styles'
	};

	gulp.src(outputs.src)
		.pipe(
			through2((file, enc, cb) => {
				postcss(require('./postcss.config.js').plugins)
					.process(file.contents.toString(), { from: file.path, to: outputs.dest })
					.then((result) => {
						file.contents = new Buffer.from(result.css);
						cb(null, file);
					});
			})
		)
		.pipe(gulp.dest(outputs.dest));
	done();
});

gulp.task('csso', (done) => {
	const outputs = {
		src: './www/styles/*.css',
		dest: './www/styles/'
	};

	gulp.src(outputs.src)
		.pipe(
			through2((file, enc, cb) => {
				file.contents = new Buffer.from(csso.minify(file.contents.toString()).css);
				cb(null, file);
			})
		)
		.pipe(gulp.dest(outputs.dest));
	done();
});

gulp.task('icons', (done) => {
	const outputs = {
		src: 'styles/icons/**/*.svg',
		dest: './www/styles/icons'
	};

	const spriter = new SVGSpriter({
		mode: {
			symbol: true
		}
	});

	gulp.src(outputs.src)
		.pipe(
			through2(
				(file, enc, cb) => {
					spriter.add(file);
					cb(null, null);
				},
				function(cb) {
					spriter.compile((error, result) => {
						result.symbol.sprite.path = process.cwd() + '/icons.svg';
						this.push(result.symbol.sprite);
						cb();
					});
				}
			)
		)
		.pipe(gulp.dest(outputs.dest));
	done();
});

gulp.task('images', (done) => {
	const outputs = {
		src: 'styles/images/**/*.{jpg,png,svg}',
		dest: './www/images/'
	};

	gulp.src(outputs.src).pipe(
		through2((file, enc, cb) => {
			if (/\.(jpg|png)$/.test(file.basename)) {
				request(
					{
						url: 'https://api.tinify.com/shrink',
						headers: {
							Authorization: `Basic ${new Buffer.from(`api:JnqeqUjIAiEGM668mx4oWKkB1L9UoVwh`).toString(
								'base64'
							)}`
						},
						method: 'POST',
						body: file.contents
					},
					(err, result) => {
						request(result.headers.location).pipe(fs.createWriteStream(outputs.dest + file.basename));
					}
				);
			} else if (/\.svg$/.test(file.basename)) {
				const svgo = new SVGO();
				svgo.optimize(file.contents).then((result) => {
					fs.writeFile(outputs.dest + file.basename, result.data, () => {});
				});
			}
			cb();
		})
	);
	done();
});

gulp.task('nunjucks', (done) => {
	const outputs = {
		src: ['./pages/*.njk', '!./pages/layout.njk'],
		dest: './www'
	};

	nunjucks.configure({ noCache: true });

	gulp.src(outputs.src)
		.pipe(
			through2((file, enc, cb) => {
				nunjucks.render(file.path, (err, res) => {
					file.contents = new Buffer.from(res);
					file.extname = '.html';
					cb(null, file);
				});
			})
		)
		.pipe(gulp.dest(outputs.dest));
	done();
});

gulp.task('webpack', (done) => {
	const compiler = webpack(require('./webpack.config.js'));
	compiler.run((err, result) => {
		console.log(result);
		done();
	});
});

gulp.task('fonts', (done) => {
	const outputs = {
		src: ['./styles/fonts/*.{woff,woff2}'],
		dest: './www/styles/fonts'
	};

	gulp.src(outputs.src).pipe(gulp.dest(outputs.dest));
	done();
});

gulp.task('watch', () => {
	gulp.watch('scripts/*.js', gulp.series('webpack'));
	gulp.watch('styles/**/*.css', gulp.series('postcss'));
	gulp.watch('pages/**/*.njk', gulp.series('nunjucks'));
	gulp.watch('styles/icons/**/*.svg', gulp.series('icons'));
	gulp.watch('styles/images/**/*', gulp.series('images'));
	gulp.watch('styles/fonts/*', gulp.series('fonts'));
});

gulp.task('server', () => {
	browserSync.init({
		server: './www'
	});

	browserSync.watch('./www/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series(gulp.parallel('watch', 'server')));

gulp.task(
	'build',
	gulp.series('prettier', gulp.parallel('eslint', 'webpack', 'csso', 'postcss', 'icons', 'nunjucks', 'images'))
);
