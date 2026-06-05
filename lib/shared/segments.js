/**
 * @fileoverview Common utils for code path segments.
 *
 * This file contains only shared items for code path segments.
 * If you make a utility for rules, please see `../rules/utils/code-path-utils.js`.
 */
"use strict";

/**
 * Checks all segments in a set and returns true if any are reachable.
 * @param {Set<CodePathSegment>} segments The segments to check.
 * @returns {boolean} `true` if any segment is reachable; `false` otherwise.
 */
function isAnySegmentReachable(segments) {
	for (const segment of segments) {
		if (segment.reachable) {
			return true;
		}
	}

	return false;
}

module.exports = {
	isAnySegmentReachable,
};
