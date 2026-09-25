const yaml = require("js-yaml");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({ html: false });

// Turns a tag label ("urban nature") into a URL-safe slug ("urban-nature").
// Shared by the tidTags collection and the slugify filter so a tag always
// links to the same page it was collected under.
function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

  eleventyConfig.addFilter("slugify", slugify);

  // Tag structure: one entry per unique tag used on a "Things I've Done"
  // piece, each holding every piece that carries it. Sorted alphabetically
  // (for the /tags/ cloud); .items.length gives each tag's frequency.
  eleventyConfig.addCollection("tidTags", (collectionApi) => {
    const pieces = collectionApi
      .getAll()
      .filter((item) => item.data.page_type === "tid" && Array.isArray(item.data.tags));

    const bySlug = new Map();
    for (const piece of pieces) {
      for (const label of piece.data.tags) {
        const slug = slugify(label);
        if (!bySlug.has(slug)) {
          bySlug.set(slug, { slug, label, items: [] });
        }
        bySlug.get(slug).items.push(piece);
      }
    }

    return [...bySlug.values()].sort((a, b) => a.label.localeCompare(b.label));
  });

  // Maps a tag's frequency to a font size (rem) for the tag cloud, so
  // more-used tags render visibly bigger, capped so one outlier tag
  // doesn't dominate the page.
  eleventyConfig.addFilter("tagCloudSize", (count) =>
    Math.min(1 + count * 0.35, 3).toFixed(2)
  );

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
