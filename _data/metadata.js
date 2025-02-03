const imgUrlShortcode = require("../imageHelpers").imgUrlShortcode;

module.exports = async function () {
  site =
    process.env.CONTEXT === "deploy-preview"
      ? process.env.DEPLOY_PRIME_URL
      : process.env.URL;

  let social_image = await imgUrlShortcode(
    "raw_img/davidall-com.png",
    [1600],
    ["png"]
  );
  social_image = site + social_image;

  return {
    title: "David All",
    url: "https://davidall.com/",
    domain: "https://davidall.com",
    baseurl: site,
    description:
      'David is an American storyteller and poet based in Spring Mills, Pennsylvania. Among other things, he is known for organizing events across America and his podcast, [Belly of the Beast Life Stories](https://creators.spotify.com/pod/show/davidall).',
    social_description: "With no small commitment.",
    feed: {
      subtitle: "With no small commitment.",
      filename: "feed.xml",
      path: "/feed/feed.xml",
      url: "https://davidall.com/feed/feed.xml",
      id: "https://davidall.com/",
    },
    author: {
      name: "David All",
      site: "https://davidall.com",
      github_username: "DavidAllX",
      //til: "https://cassey.dev/til",
    },
    favicon: "/img/jackson.png",
    social_image: social_image,
    social_image_alt: "davidall.com",
    social_image_height: 900,
    social_image_width: 1600,
    twitter_card_style: "summary_large_image",
  };
};
