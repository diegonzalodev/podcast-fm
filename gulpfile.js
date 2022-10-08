const { src, dest, watch, series } = require("gulp");

//Min files
const htmlmin = require("gulp-htmlmin");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");

//SASS and PostCSS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");

//Images
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

//Min HTML files
function minhtml() {
    return src("src/**/*.html")
        .pipe(htmlmin({ removeComments: true }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest("build"));
}

//Build and min CSS files
function build() {
    return src("src/scss/app.scss")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(cssnano())
        .pipe(sourcemaps.write("."))
        .pipe(dest("build/css"));
}

//Min JS files
function minjs () {
    return src("src/js/*.js")
        .pipe(uglify())
        .pipe(dest("build/js"));
}

function img() {
    return src("src/img/**/*")
        .pipe(imagemin({ optimizationLevel: 4 }))
        .pipe(dest("build/img"));
}

function imgwebp() {
    return src("src/img/**/*.{jpg, png}").pipe(webp()).pipe(dest("build/img"));
}

function imgavif() {
    const options = { quality: 50, method: "ssim" };
    return src("src/img/**/*.{jpg, png}")
        .pipe(avif(options))
        .pipe(dest("build/img"));
}

//Review changes and modify
function dev() {
    watch("src/**/*.html", minhtml);
    watch("src/scss/**/*.scss", build);
    watch("src/js/*.js", minjs);
    watch("src/img/**/*", img);
    watch("src/img/**/*.{jpg, png}", imgwebp);
    watch("src/img/**/*.{jpg, png}", imgavif);
}

exports.default = series(minhtml, build, minjs, dev);