/**
 * @fileoverview Code path related utilities.
 */

"use strict";

/**
 * Checks all segments in a set and returns true if any are reachable,
 * considering their previous segments to handle cases like try/catch blocks.
 * @param {Set<CodePathSegment>} segments The segments to check.
 * @returns {boolean} `true` if any segment is reachable; `false` otherwise.
 */
function isAnySegmentReachable(segments) {
	const checked = new Set();

	function checkSegment(segment) {
		if (checked.has(segment)) {
			return false;
		}
		checked.add(segment);

		if (segment.reachable) {
			return true;
		}

		// Check all previous segments for reachability
		for (const prev of segment.allPrevSegments) {
			if (checkSegment(prev)) {
				return true;
			}
		}

		return false;
	}

	for (const segment of segments) {
		if (checkSegment(segment)) {
			return true;
		}
	}

	return false;
}

module.exports = { isAnySegmentReachable };
