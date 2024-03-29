
// localStorage && sessionStorage 存、取、删

const storage = {
    setLocal: function (key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    getLocal: function (key) {
        let value = window.localStorage.getItem(key);
        return JSON.parse(value);
    },
    setSession: function (key, value) {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    },
    getSession: function (key) {
        let value = window.sessionStorage.getItem(key);
        return JSON.parse(value);
    },
    clearOneLocal: function (key) {
        window.localStorage.removeItem(key);
    },
    clearOneSession: function (key) {
        window.sessionStorage.removeItem(key);
    },
    clearAllLocal: function () {
        window.localStorage.clear();
    },
    clearAllSession: function () {
        window.sessionStorage.clear();
    }
};

export default storage


// "dependencies": {
//     "axios": "^0.18.0",
//     "element-ui": "^2.6.1",
//     "iview": "^3.4.0-rc.2",
//     "qs": "^6.6.0",
//     "stylus": "^0.54.5",
//     "vue": "^2.5.2",
//     "vue-router": "^3.0.1",
//     "vuex": "^3.1.0"
//   },
//   "devDependencies": {
//     "autoprefixer": "^7.1.2",
//     "babel-core": "^6.22.1",
//     "babel-helper-vue-jsx-merge-props": "^2.0.3",
//     "babel-loader": "^7.1.1",
//     "babel-plugin-import": "^1.11.0",
//     "babel-plugin-syntax-jsx": "^6.18.0",
//     "babel-plugin-transform-runtime": "^6.22.0",
//     "babel-plugin-transform-vue-jsx": "^3.5.0",
//     "babel-polyfill": "^6.26.0",
//     "babel-preset-env": "^1.3.2",
//     "babel-preset-stage-2": "^6.22.0",
//     "chalk": "^2.0.1",
//     "copy-webpack-plugin": "^4.0.1",
//     "css-loader": "^2.1.1",
//     "extract-text-webpack-plugin": "^3.0.0",
//     "file-loader": "^1.1.4",
//     "friendly-errors-webpack-plugin": "^1.6.1",
//     "html-webpack-plugin": "^2.30.1",
//     "node-notifier": "^5.1.2",
//     "optimize-css-assets-webpack-plugin": "^5.0.1",
//     "ora": "^1.2.0",
//     "portfinder": "^1.0.13",
//     "postcss-import": "^11.0.0",
//     "postcss-loader": "^2.0.8",
//     "postcss-url": "^7.2.1",
//     "rimraf": "^2.6.0",
//     "semver": "^5.3.0",
//     "shelljs": "^0.7.6",
//     "stylus-loader": "^3.0.2",
//     "uglifyjs-webpack-plugin": "^1.1.1",
//     "url-loader": "^1.1.2",
//     "vue-loader": "^13.3.0",
//     "vue-style-loader": "^3.0.1",
//     "vue-template-compiler": "^2.5.2",
//     "webpack": "^3.6.0",
//     "webpack-bundle-analyzer": "^2.9.0",
//     "webpack-cli": "^3.3.0",
//     "webpack-dev-server": "^3.3.1",
//     "webpack-merge": "^4.1.0"


