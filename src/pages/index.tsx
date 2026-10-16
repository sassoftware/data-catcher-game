/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { GetServerSideProps } from "next";
export default function Home() {
	return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		redirect: {
			destination: "/datacatcher",
			permanent: false,
		},
	};
};
