const proxyURL = "localhost:8888/opencart.loc";

const { src, dest, parallel, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleanss = require("gulp-clean-css");
const bourbon = require("bourbon");
const rsync = require("gulp-rsync");

function browsersync() {
  browserSync.init({
    proxy: proxyURL,
    browser: "google chrome",
    notify: false,
  });
}

function styles() {
  return src(`catalog/view/theme/apple/stylesheet/stylesheet.sass`)
    .pipe(
      sass({
        includePaths: bourbon.includePaths,
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(concat("stylesheet.css"))
    .pipe(cleanss({ level: { 1: { specialComments: 0 } } }))
    .pipe(dest(`catalog/view/theme/apple/stylesheet/`))
    .pipe(browserSync.stream());
}
function startwatch() {
  watch("catalog/view/theme/apple/stylesheet/stylesheet.sass", styles);
  watch([`catalog/view/theme/apple/template/**/*.twig`]).on(
    "change",
    browserSync.reload
  );
}

function deploy() {
	return src('catalog/view/theme/apple/')
		.pipe(rsync({
			root: 'catalog/view/theme/apple/',
			hostname: 'paketik7gm@iphoneservice333433.ru.swtest.ru',
			destination: 'public_html/catalog/view/theme/apple/',
			clean: true, // Mirror copy with file deletion
			include: [/* '*.htaccess' */], // Included files to deploy,
			exclude: [ '**/Thumbs.db', '**/*.DS_Store' ],
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
}

exports.browsersync = browsersync;
exports.styles = styles;
exports.deploy = deploy;
exports.default = parallel(styles, browsersync, startwatch);
