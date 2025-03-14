import gulp from "gulp";
import dartSass from "gulp-dart-sass"; // Replaced gulp-sass with gulp-dart-sass
import sourcemaps from "gulp-sourcemaps";
import cleanCSS from "gulp-clean-css";
import rtlcss from "gulp-rtlcss";
import { deleteAsync } from "del";
import zip from "gulp-zip";
import rename from "gulp-rename";
import replace from "gulp-string-replace";
import fileInclude from "gulp-file-include";
import imageMin from "gulp-imagemin";
import packageJson from "./package.json" assert { type: "json" };
import htmlBeauty from "gulp-html-beautify";
import merge from "merge-stream";
import browserSync from "browser-sync";

const htmlWatcher = ["./pages/**/*.*", "./blocks/**/*.*"];
const htmlDir = {
  src: "./pages/*",
  dest: "./"
};
const scssDir = {
  src: "./assets/sass/**/*.*",
  dest: "./assets/css"
};

const replaceProjectFiles = () => {
  return gulp
    .src("./**/packageName__.*")
    .pipe(
      rename((path) => {
        path.basename = path.basename.replace("packageName__", packageJson.name);
      })
    )
    .pipe(gulp.dest("./"));
};

const replaceProjectName = () => {
  let blocks = gulp
    .src("./blocks/**/*.*")
    .pipe(replace("packageName__", packageJson.name))
    .pipe(gulp.dest("./blocks"));
  let js = gulp
    .src("./assets/js/**/*.*")
    .pipe(replace("packageName__", packageJson.name))
    .pipe(gulp.dest("./assets/js"));
  let sass = gulp
    .src("./assets/sass/**/*.*")
    .pipe(replace("thm", packageJson.name))
    .pipe(gulp.dest("./assets/sass"));
  return merge(blocks, js, sass);
};

const cleanUp = () => {
  return deleteAsync("**/packageName__.*");
};

const makeFileInclude = () => {
  const options = {
    prefix: "@@",
    basepath: "@root"
  };
  return gulp.src(htmlDir.src).pipe(fileInclude(options)).pipe(gulp.dest(htmlDir.dest));
};

const makeCss = () => {
  const options = {
    outputStyle: "expanded",
    indentType: "space",
    indentWidth: 2,
    sourceMap: "sass"
  };
  return gulp
    .src(scssDir.src)
    .pipe(sourcemaps.init())
    .pipe(dartSass(options).on("error", dartSass.logError)) // Make sure it's using gulp-dart-sass
    // .pipe(cleanCSS())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(scssDir.dest))
    .pipe(browserSync.stream());
};

const makeRTL = () => {
  return gulp
    .src([scssDir.dest + "/" + packageJson.name + ".css"])
    .pipe(rtlcss())
    .pipe(rename({ suffix: "-rtl" }))
    .pipe(gulp.dest(scssDir.dest))
    .pipe(browserSync.stream());
};

const makeBeautifulHtml = () => {
  const options = [
    {
      indent_size: 4,
      indent_with_tabs: false
    }
  ];
  return gulp.src(["./*.html"]).pipe(htmlBeauty(options)).pipe(gulp.dest("./"));
};

const makeServer = () => {
  browserSync.init({
    server: "./"
  });

  gulp.watch("./assets/sass/**/*.scss", gulp.series([makeCss, makeRTL]));
  gulp.watch(htmlWatcher, gulp.parallel([makeFileInclude]));
  gulp.watch(["./*.html", "./assets/js/**/*.*"]).on("change", browserSync.reload);
};

const compressImage = () => {
  const options = [
    imageMin.gifsicle({ interlaced: true }),
    imageMin.mozjpeg({ quality: 75, progressive: true }),
    imageMin.optipng({ optimizationLevel: 5 }),
    imageMin.svgo({
      plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
    })
  ];
  return gulp
    .src(["./assets/images/**/*.*"])
    .pipe(imageMin(options))
    .pipe(gulp.dest("./assets/images/"))
    .pipe(browserSync.stream());
};

const makeZip = () => {
  return gulp
    .src([
      "./**/*.*",
      "!./.vscode",
      "!./{pages,pages/**}",
      "!./{blocks,blocks/**}",
      "!./{.DS_Store,.DS_Store/**}",
      "!./{node_modules,node_modules/**}",
      "!./{vendor,vendor/**}",
      "!./{.git,.git/**}",
      "!./.stylelintrc.json",
      "!./.eslintrc",
      "!./.gitattributes",
      "!./.github",
      "!./.gitignore",
      "!./README.md",
      "!./composer.json",
      "!./composer.lock",
      "!./commitlint.config.js",
      "!./package-lock.json",
      "!./package.json",
      "!./.travis.yml",
      "!./yarn.lock",
      "!./style.css.map",
      "!./assets/css/*.map",
      "!./assets/sass/**",
      "!./gulpfile.mjs"
    ])
    .pipe(zip(packageJson.name + "-html-main.zip"))
    .pipe(gulp.dest("../"));
};

export const makeBundle = gulp.series([
  replaceProjectFiles,
  cleanUp,
  replaceProjectName,
  makeFileInclude,
  makeCss,
  makeRTL,
  makeBeautifulHtml,
  makeZip
]);

export const build = gulp.series([
  replaceProjectFiles,
  cleanUp,
  replaceProjectName,
  makeFileInclude,
  makeCss,
  makeRTL,
  makeBeautifulHtml
]);

export const defaultTask = gulp.series([
  replaceProjectFiles,
  cleanUp,
  replaceProjectName,
  makeFileInclude,
  makeCss,
  makeRTL,
  makeServer,
  makeBeautifulHtml
]);

export default defaultTask;