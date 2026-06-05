/**
 * @fileoverview Code path related utilities.
 */

"use strict";

/**
 * Checks all segments in a set and returns true if any are reachable.
 * @param {Set<CodePathSegment>} segments The segments to check.
 * @returns {boolean} `true` if any segment is reachable; `false` otherwise.
 */
function isAnySegmentReachable(segments) {
	if (!segments) {
		return false;
	}

	for (const segment of segments) {
		if (segment && segment.reachable) {
			return true;
		}
	}

	return false;
}

module.exports = { isAnySegmentReachable };
