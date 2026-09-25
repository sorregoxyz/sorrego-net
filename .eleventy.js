const yaml = require("js-yaml");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({ html: false });

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/pages/cv.pdf");
  eleventyConfig.addFilter("markdown", (content) => md.renderInline(content || ""));
  // Pieces belonging to one theme folder (e.g. "/tid/multimodal-experiments/"),
  // excluding that folder's own index page, sorted by title.
  eleventyConfig.addFilter("bySection", (collection, prefix) =>
    collection
      .filter(
        (item) =>
          item.filePathStem.startsWith(prefix) &&
          !item.filePathStem.endsWith("/index")
      )
        .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    const dd = String(d.getUTCDate()).padStart(2, "0");
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = d.getUTCFullYear();
    return `${dd}.${mm}.${yyyy}`;
  });

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
