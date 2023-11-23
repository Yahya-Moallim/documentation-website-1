import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { findFirstCategoryLink, useDocById } from "@docusaurus/theme-common/internal";
import isInternalUrl from "@docusaurus/isInternalUrl";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

// icon need to be loaded at build time this is a weback related issue
const apiIcon = require("@site/static/img/api.png").default;
const hostedIcon = require("@site/static/img/hosted.png").default;
const pluginsIcon = require("@site/static/img/plugin.png").default;
const get_startedIcon = require("@site/static/img/get-started.png").default;

const pathToImages = {
	api: apiIcon,
	hosted: hostedIcon,
	plugin: pluginsIcon,
	get_started: get_startedIcon,
};

function CardContainer({ href, children, custom }) {
	return (
		<Link style={{ width: custom ? "50%" : "auto" }} href={href} className={clsx("card padding--lg", styles.cardContainer)}>
			{children}
		</Link>
	);
}
function CardLayout({ href, icon, title, description, custom }) {
	return (
		<CardContainer href={href} custom={custom ? custom : false}>
			<h2 className={clsx("text--truncate", styles.cardTitle)} title={title} style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
				{icon === "📄️" || icon === "🔗" || icon === "🗃️" ? (
					icon
				) : (
					<span>
						<img width="30px" src={pathToImages[icon]} />
					</span>
				)}
				{title}
			</h2>
			{description && (
				<p className={clsx("text--truncate", styles.cardDescription)} title={description}>
					{description}
				</p>
			)}
		</CardContainer>
	);
}
function CardCategory({ item }) {
	const href = findFirstCategoryLink(item);
	// Unexpected: categories that don't have a link have been filtered upfront
	if (!href) {
		return null;
	}
	return (
		<CardLayout
			href={href}
			icon="🗃️"
			title={item.label}
			description={translate(
				{
					message: "{count} items",
					id: "theme.docs.DocCard.categoryDescription",
					description: "The default description for a category card in the generated index about how many items this category includes",
				},
				{ count: item.items.length }
			)}
		/>
	);
}
function CardLink({ item }) {
	let icon;
	if (item.icon) {
		icon = item.icon;
	} else {
		icon = isInternalUrl(item.href) ? "📄️" : "🔗";
	}
	const doc = useDocById(item.docId ?? undefined);
	const description = doc?.description || item.description;
	return <CardLayout href={item.href} icon={icon} title={item.label} description={description} custom={item.custom} />;
}
export default function DocCard({ item }) {
	switch (item.type) {
		case "link":
			return <CardLink item={item} />;
		case "category":
			return <CardCategory item={item} />;
		default:
			throw new Error(`unknown item type ${JSON.stringify(item)}`);
	}
}
