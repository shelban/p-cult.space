const {
  createStreamsArchive,
  createTimestampGroups,
  extractStreamTags,
  formatDateDisplay,
  streamExcerpt,
  timestampToSeconds,
} = require("./lib/streams-archive");

module.exports = function (eleventyConfig) {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/CNAME");

  // Streams collection sorted by date descending
  eleventyConfig.addCollection("streams", function (collectionApi) {
    return createStreamsArchive(collectionApi.getFilteredByGlob("src/streams/*.md"));
  });

  // Friends collection with random sorting (Fisher-Yates shuffle)
  eleventyConfig.addCollection("friends", function (collectionApi) {
    const friends = collectionApi.getFilteredByGlob("src/friends/*.md");

    // Separate friends with manual order vs. random order
    const withOrder = friends.filter(f => f.data.order !== undefined);
    const withoutOrder = friends.filter(f => f.data.order === undefined);

    // Sort manual-order friends by order field
    withOrder.sort((a, b) => a.data.order - b.data.order);

    // Randomize the rest (Fisher-Yates shuffle)
    for (let i = withoutOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [withoutOrder[i], withoutOrder[j]] = [withoutOrder[j], withoutOrder[i]];
    }

    // Manual-order friends first, then randomized
    return [...withOrder, ...withoutOrder];
  });

  // Date formatting filter
  eleventyConfig.addFilter("dateDisplay", formatDateDisplay);

  // Convert timestamp HH:MM:SS to seconds for YouTube links
  eleventyConfig.addFilter("timestampToSeconds", timestampToSeconds);

  eleventyConfig.addFilter("streamTags", extractStreamTags);

  eleventyConfig.addFilter("streamTimestampGroups", createTimestampGroups);

  // Truncate text to specified length with ellipsis
  eleventyConfig.addFilter("truncate", streamExcerpt);

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
