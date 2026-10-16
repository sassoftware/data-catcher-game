/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import CircularProgress, { CircularProgressProps } from "@mui/material/CircularProgress";
import React, { ReactNode, useState } from "react";

type LoadingIndicatorProps = CircularProgressProps & {
	children: ReactNode;
};

export const LoadingIndicator = ({ children, ...rest }: LoadingIndicatorProps) => {
	const [loading, setLoading] = useState(false);

	return (
		<div>
			{loading ? (
				<CircularProgress {...rest} />
			) : React.isValidElement(children) ? (
				//TODO: type this better, having issue with children/onclick combo. Remove `as any` to see error
				React.cloneElement(children as any, {
					onClick: () => {
						children.props.onClick?.();
						setLoading(true);
					},
				})
			) : (
				children
			)}
		</div>
	);
};
