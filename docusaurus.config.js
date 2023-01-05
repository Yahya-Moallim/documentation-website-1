// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// const SVG = require('@site/static/img/dineropayS.svg')
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
// const dineroSVG = require(`@site/static/img/dineropayS.svg`);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Dineropay',
  tagline: 'help you to empower your online business',
  url: 'https://dineropay.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'dineropay', // Usually your GitHub org/user name.
  projectName: 'dineropay-dev', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en'],
  // },
  themes: ["docusaurus-theme-openapi-docs"],
  plugins:[
    require.resolve("@cmfcmf/docusaurus-search-local"),
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'api',
        routeBasePath: 'api',
        sidebarPath: require.resolve('./sidebarsApi.js'),
        breadcrumbs:true,
        showLastUpdateTime: true,
        disableVersioning: false,
        includeCurrentVersion: true,
        sidebarCollapsed:true,
        sidebarCollapsible:true,
        docLayoutComponent: "@theme/DocPage",
        docItemComponent: "@theme/ApiItem",
        versions: {
          current: {
            label: '1.0.0',
            path: '/',
            badge:true,
            banner: 'none',
            className:'badgeVersion'
          },
         // onlyIncludeVersions: ['current'],
        },
      },
    ],
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: "apiDocs",
        docsPluginId: "classic",
        config: {
          petstore: { // Note: petstore key is treated as the <id> and can be used to specify an API doc instance when using CLI commands
            specPath: "./petstore.yaml", // Path to designated spec file
            outputDir: "docs/petstore", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
            },
          },
        }
      },
    ]
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          breadcrumbs:true,
          showLastUpdateTime: true,
          disableVersioning: false,
          includeCurrentVersion: true,
          sidebarCollapsed:true,
          sidebarCollapsible:true,
          // docLayoutComponent: "@theme/DocPage",
          // docItemComponent: "@theme/ApiItem",
          
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://test.com',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      navbar: {
        logo: {
          alt: 'Dinerpay logo',
          src: 'img/dineropayS.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'search',
            position: 'right',
          },
          {
            to:'/api/',
            position:'left',
            label:'API'
          },
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'Dashboard',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
              {
                label:'Dineropay',
                to:'/'
              },
              {
                html:` <a href="dineropay.com" target="_blank" rel="noreferrer noopener">
                <img src="${`img/dineropayS.svg`}" alt="Find more about dineropay" width="114" height="51" />
              </a>`
              }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Dineropay, Inc. Built for the developer.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
