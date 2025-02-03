const pluginRss = require("@11ty/eleventy-plugin-rss");
const eleventyAutoCacheBuster = require("eleventy-auto-cache-buster");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const buildCss = require("./config/buildCss.js");
const markdown = require("./config/markdown.js");
require("dotenv").config();

const {
  tilCollection,
  rssCollection,
  tilTagsCollection,
  sortedNavCollection,
} = require("./config/collections/index.js");

const {
  stripPs,
  classifyTagFilter,
  readableDateFilter,
  headFilter,
  markdownifyFilter,
} = require("./config/filters/index.js");

const includeFilter = require("./config/filters/include.js");
const { imgShortcode, imageShortcode, imgFullUrl } = require("./config/shortcodes/image.js");

module.exports = function (eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(eleventyAutoCacheBuster);
  
  // Enable deep merging of data
  eleventyConfig.setDataDeepMerge(true);

  // Layout aliases
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");
  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");

  // Add filters
  eleventyConfig.addFilter("markdownify", markdownifyFilter);
  eleventyConfig.addFilter("stripPs", stripPs);
  eleventyConfig.addFilter("readableDate", readableDateFilter);
  eleventyConfig.addFilter("include", includeFilter);

  // Updated date filter
  eleventyConfig.addFilter("htmlDateString", (date) => {
    const formattedDate = new Date(date);
    if (isNaN(formattedDate)) {
      console.error(`Invalid date: ${date}`); // Log any invalid dates
      return ""; // Return empty string if date is invalid
    }
    return formattedDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
  });

  // Utility filters
  eleventyConfig.addFilter("stringifyObject", (obj) => {
    return JSON.stringify(obj);
  });
  eleventyConfig.addFilter("classifyTag", classifyTagFilter);
  eleventyConfig.addFilter("head", headFilter);

  // Passthrough copies
  ["img", "css", "files", "admin"].forEach((path) =>
    eleventyConfig.addPassthroughCopy(path)
  );

  // Set Markdown library
  eleventyConfig.setLibrary("md", markdown);

  // Collections
  eleventyConfig.addCollection("sortedNav", sortedNavCollection);
  eleventyConfig.addCollection("tagList", require("./config/getTagList.js"));
  eleventyConfig.addCollection("til", tilCollection);
  eleventyConfig.addCollection("rss", rssCollection);
  eleventyConfig.addCollection("tilTags", tilTagsCollection);

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("img", imgShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("imgFullUrl", imgFullUrl);

  // Compile CSS
  eleventyConfig.on("beforeBuild", buildCss);

  // Watch for Sass changes
  eleventyConfig.addWatchTarget("_sass/");

  // Return configuration
  return {
    templateFormats: ["md", "njk", "html", "liquid", "hbs"],
    pathPrefix: "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "./",
      includes: "./_includes",
      data: "./_data",
      output: "./_site",
    },
  };
};