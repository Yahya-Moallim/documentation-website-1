import React from "react";
import styles from "./style.module.css";
import Api from "../../../static/img/api.svg";
import Integration from "../../../static/img/integration.svg";
import Plugin from "../../../static/img/plugin.svg";

function Card({ text, link, type }) {
	return (
		<a className={styles.a} href={link}>
			<div className={styles.ca}>
				<div className={styles.ca_img_container}>
					{type === "api" && <Api className={styles.sv} />}
					{type === "plugin" && <Plugin className={styles.sv} />}
					{type === "integration" && <Integration className={styles.sv} />}
				</div>
				<p className={styles.ca_text}>{text}</p>
			</div>
		</a>
	);
}

export default Card;
