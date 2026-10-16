/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

export const ScreenSizes = {
	// Landscape Responsive
	landscape: "@media (orientation: landscape)",
	// Portrait Mobile
	landscapeMobile: "@media (orientation: landscape) and (max-width: 799px)",
	// Landscape Small Tablet, e.g. 800x600 - aligns with default mui breakpoints for sm
	landscapeSmWidth: "@media (orientation: landscape) and (min-width: 800px) and (max-width: 899px)",
	// Landscape medium width - aligns with default mui breakpoints for md, lg
	landscapeMdWidth: "@media (orientation: landscape) and (min-width: 900px) and (max-width: 1199px)",
	// Landscape large width, e.g. 1366 x 768, 1280 x 720. - aligns with default mui breakpoints for md, lg
	landscapeLgWidth: "@media (orientation: landscape) and (min-width: 1200px) and (max-width: 1535px)",
	// Landscape extra large width, e.g. 1920 x 1080, 1536 x 864, 2560 x 1440. - aligns with default mui breakpoints for xl
	landscapeXlWidth: "@media (orientation: landscape) and (min-width: 1536px)",
	// Portrait Responsive
	portrait: "@media (orientation: portrait)",
	// Portrait Mobile - aligns with default mui breakpoints for xs
	portraitMobile: "@media (orientation: portrait) and (max-width: 599px)",
	// Portrait Small Tablet - aligns with default mui breakpoints for sm
	portraitSmWidth: "@media (orientation: portrait) and (min-width: 600px) and (max-width: 899px)",
	// Portrait 720p Event Screen (720x1280) with 50px margin of error
	portrait720p:
		"@media (orientation: portrait) and (min-width: 670px) and (max-width: 770px) and (min-height: 1230px) and (max-height: 1330px)",
	// Portrait 1080p Event Screen (1080x1920) with 50px margin of error
	portrait1080p:
		"@media (orientation: portrait) and (min-width: 1030px) and (max-width: 1130px) and (min-height: 1870px) and (max-height: 1970px)",
	// Portrait HD Event Screen Or Larger (1440x2440) with 50px margin of error
	portraitHDOrLarger: "@media (orientation: portrait) and (min-width: 1390px) and (min-height: 2390px)",
	// Portrait 4k Event Screen Or Larger (2160x3700) with 50px margin of error
	portrait4kOrLarger: "@media (orientation: portrait) and (min-width: 2110px) and (min-height: 3650px)",
};
