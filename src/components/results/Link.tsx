/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled("a")({});
interface NextLinkComposedProps
	extends
		Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
		Omit<NextLinkProps, "href" | "as" | "onClick" | "onMouseEnter" | "onTouchStart"> {
	linkAs?: NextLinkProps["as"];
	to: NextLinkProps["href"];
}

const NextLinkComposed = React.forwardRef<HTMLAnchorElement, NextLinkComposedProps>(function LinkBehaviour(props, ref) {
	return <NextLink ref={ref} href={props.to} {...props} />;
});

export type LinkProps = {
	activeClassName?: string;
	// as?: NextLinkProps["as"];
	href: NextLinkProps["href"];
	// linkAs?: NextLinkProps["as"]; // Useful when the as prop is shallow by styled().
	noLinkStyle?: boolean;
	disablePrefetch?: boolean;
} & Omit<NextLinkComposedProps, "to" | "linkAs" | "href"> &
	Omit<MuiLinkProps, "href">;

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/api-reference/next/link
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
	const { activeClassName = "active", className: classNameProps, href, noLinkStyle, disablePrefetch, ...other } = props;

	const router = useRouter();
	const pathname = typeof href === "string" ? href : href.pathname;
	const className = clsx(classNameProps, {
		[activeClassName]: router.pathname === pathname && activeClassName,
	});

	const isExternal =
		typeof href === "string" && (href.indexOf("http") === 0 || disablePrefetch || href.indexOf("mailto:") === 0);

	if (isExternal) {
		if (noLinkStyle) {
			return <Anchor className={className} href={href} ref={ref} {...other} />;
		}

		return <MuiLink className={className} href={href} ref={ref} {...other} />;
	}

	if (noLinkStyle) {
		return <NextLinkComposed className={className} ref={ref} to={href} {...other} />;
	}

	return <MuiLink component={NextLinkComposed} className={className} ref={ref} to={href} {...other} />;
});
