const yaml = require("js-yaml");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({ html: false });

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/pages/cv.pdf");
  eleventyConfig.addFilter("markdown", (content) => md.renderInline(content || ""));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
