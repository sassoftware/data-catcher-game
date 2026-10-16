/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResultsComponent } from "components/results/Results";
import { GetServerSideProps } from "next";

type ResultsPageProps = {
	host: string | null;
};

export default function ResultsPage({ host }: ResultsPageProps) {
	return <ResultsComponent host={host} />;
}

export const getServerSideProps: GetServerSideProps<ResultsPageProps> = async ({ req }) => {
	const host = req.headers.host || null;

	return { props: { host } };
};
