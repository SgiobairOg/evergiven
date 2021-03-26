const CleanCSS = require("clean-css");

module.exports = function(config) {
    config.addFilter("cssmin", function(code) {
        return new CleanCSS({}).minify(code).styles;
    });

    config.addFilter("response", function(sheIsStuck) {
        return sheIsStuck ? 'Is still pretty stuck.' : 'Is free!'
    })
    
    return {
        dir: {
            input: "src",
            output: "dist",
            data: "_data",
            includes: "_includes",
        },
    };
}