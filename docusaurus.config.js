// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// const SVG = require('@site/static/img/dineropayS.svg')
const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
// const dineroSVG = require(`@site/static/img/dineropayS.svg`);

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: "Dinero Pay",
	staticDirectories: ["public", "static"],
	tagline: "help you to empower your online business by providing you with all the tools you need to start getting paid",
	url: "https://dineropay.com",
	baseUrl: "/",
	onBrokenLinks: "warn",
	onBrokenMarkdownLinks: "warn",
	favicon: "img/favicon.ico",

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: "Dinero-Pay-PG", // Usually your GitHub org/user name.
	projectName: "Documentation-website", // Usually your repo name.
	deploymentBranch: "staging",

	// Even if you don't use internalization, you can use this field to set useful
	// metadata like html lang. For example, if your site is Chinese, you may want
	// to replace "en" with "zh-Hans".
	// i18n: {
	//   defaultLocale: 'en',
	//   locales: ['en'],
	// },
	themes: ["docusaurus-theme-openapi-docs"],
	plugins: [
		[
			require.resolve("@cmfcmf/docusaurus-search-local"),
			{
				indexBlog: false,
				indexPages: false,
			},
		],
		[
			"@docusaurus/plugin-content-docs",
			{
				id: "api",
				path: "api",
				routeBasePath: "api",
				sidebarPath: require.resolve("./sidebarsApi.js"),
				breadcrumbs: true,
				showLastUpdateTime: true,
				disableVersioning: false,
				includeCurrentVersion: true,
				sidebarCollapsed: true,
				sidebarCollapsible: true,
				docLayoutComponent: "@theme/DocPage",
				docItemComponent: "@theme/ApiItem",
				versions: {
					current: {
						label: "1.0.0",
						path: "/",
						badge: true,
						banner: "none",
						className: "badgeVersion",
					},
					// onlyIncludeVersions: ['current'],
				},
			},
		],
		[
			"docusaurus-plugin-openapi-docs",
			{
				id: "api",
				docsPluginId: "api", // if there is any issue use docsPluginId:"classic"
				config: {
					dinerpayDocs: {
						// Note: petstore key is treated as the <id> and can be used to specify an API doc instance when using CLI commands
						specPath: "./dineropay.openAPI.json", // Path to designated spec file
						outputDir: "api/gateway", // Output directory for generated .mdx docs
						sidebarOptions: {
							groupPathsBy: "tag",
							categoryLinkSource: "tag",
						},
					},
				},
			},
		],
	],
	presets: [
		[
			"classic",
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				blog: false,
				docs: {
					path: "docs",
					routeBasePath: "/",
					sidebarPath: require.resolve("./sidebars.js"),
					breadcrumbs: true,
					showLastUpdateTime: true,
					disableVersioning: false,
					includeCurrentVersion: true,
					sidebarCollapsed: true,
					sidebarCollapsible: true,
				},
				theme: {
					customCss: require.resolve("./src/css/custom.css"),
				},
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			metadata: [
				{ name: "payment gateway", content: "payment gateway in Saudi Arabia" },
				{ name: "technical guide | mada , visa , mastercard, applpay , stcpay", content: "we support mada , visa, mastercard ,applepay, stcpay" },
			],
			docs: {
				sidebar: {
					autoCollapseCategories: true,
				},
			},
			navbar: {
				logo: {
					alt: "Dinerpay logo",
					src: "img/dineropayS.svg",
				},
				items: [
					{
						to: "/",
						position: "left",
						label: "Docs",
					},
					{
						type: "search",
						position: "right",
					},
					{
						to: "/api/",
						position: "left",
						label: "API",
					},
					{
						type: "html",
						position: "right",
						value: `<a href="/checkoutAPI.json" download> <span style="display:flex; align-items:center"><img src="/img/postman.svg" style="width:2rem;margin-right:.5rem"></img>checkout collection</span> </a>`,
					},
					{
						href: "https://dashaboard.dineropay.com",
						label: "Dashboard",
						position: "right",
					},
				],
			},
			footer: {
				style: "dark",
				links: [
					{
						html: ` <a href="https://dineropay.com" target="_blank" rel="noreferrer noopener">
                <img src="/img/dineropayS.svg" alt="Find more about Dinero Pay" width="114" height="51" />
              </a>`,
					},
				],
				copyright: `Copyright © ${new Date().getFullYear()} Dinero Pay, Inc. Built with ❤️ for the Developers.`,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
		}),
};

module.exports = config;
