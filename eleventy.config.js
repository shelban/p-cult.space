module.exports = function (eleventyConfig) {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/CNAME");

  // Streams collection sorted by date descending
  eleventyConfig.addCollection("streams", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/streams/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Date formatting filter
  eleventyConfig.addFilter("dateDisplay", function (date) {
    return new Date(date).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Convert timestamp HH:MM:SS to seconds for YouTube links
  eleventyConfig.addFilter("timestampToSeconds", function (timestamp) {
    if (!timestamp) return 0;

    const parts = timestamp.split(":").map(p => parseInt(p, 10));

    // Validate that all parts are valid numbers
    if (parts.some(isNaN)) return 0;

    if (parts.length === 3) {
      // HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // MM:SS
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      // SS
      return parts[0];
    }

    return 0;
  });

  // Truncate text to specified length with ellipsis
  eleventyConfig.addFilter("truncate", function (text, length) {
    if (!text || text.length <= length) return text;
    return text.substring(0, length).trim() + "...";
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
