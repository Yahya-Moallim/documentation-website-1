/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  openApiSidebar: [
    {
      type: "category",
      label: "API",
      collapsed:false,
      link: {
        type: "generated-index",
        title: "GATEWAY API",
        description:
          "Offical Documentation of Dinero Pay",
        slug: "/",
        // collapsed: false,
      },
      // @ts-ignore
      items: require("./api/gateway/sidebar.js")
    }
  ]
};

module.exports = sidebars;
