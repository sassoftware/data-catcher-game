/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { HeadWithMeta } from "components/HeadWithMeta";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

const DataCatcher = dynamic(() => import("components/DataCatcherComponent"), {
	ssr: false,
	loading: () => <HeadWithMeta host="" title="Data Catcher" />,
});

type DataCatcherPageProps = {
	host: string | null;
};

export default function DataCatcherPage({ host }: DataCatcherPageProps) {
	return <DataCatcher host={host} />;
}

export const getServerSideProps: GetServerSideProps<DataCatcherPageProps> = async ({ req }) => {
	const host = req.headers.host || null;

	return { props: { host } };
};
