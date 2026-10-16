/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import Head from "next/head";
import { ReactNode } from "react";

export const HeadWithMeta: React.FC<{
	host: string | null;
	title: string;
	children?: ReactNode;
}> = ({ host, children, title }) => {
	const socialMediaTagline =
		"Test your speed in a deluge of data. Catch as many data points as you can before the clock runs out!";

	const metaTags = (
		<MetaTags title={title} url={`https://${host ?? ""}/datacatcher/`} socialMediaTagline={socialMediaTagline} />
	);

	return (
		<Head>
			<title>{title}</title>
			{metaTags}
			{children}
		</Head>
	);
};

type MetaTagsProps = {
	title: string;
	url: string;
	socialMediaTagline: string;
};

const MetaTags = ({ title, url, socialMediaTagline }: MetaTagsProps) => {
	return (
		<>
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@SASsoftware" />
			<meta name="twitter:creator" content="@SASsoftware" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={socialMediaTagline} />
			<meta property="og:url" content={url} />
			<meta property="og:type" content="website" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={socialMediaTagline} />
		</>
	);
};
