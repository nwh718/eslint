/**
 * @fileoverview Code path related utilities.
 */

"use strict";

/**
 * Checks all segments in a set and returns true if any are reachable,
 * considering their previous segments to handle cases like try/catch blocks
 * where the catch segment itself may be unreachable but its predecessor
 * in the try block is reachable.
 * @param {Set<CodePathSegment>} segments The segments to check.
 * @returns {boolean} `true` if any segment is reachable; `false` otherwise.
 */
function isAnySegmentReachable(segments) {
	const checked = new Set();

	/**
	 * Recursively checks if a segment or any of its previous segments
	 * in the code path chain is reachable.
	 * @param {CodePathSegment} segment The segment to check.
	 * @returns {boolean} `true` if reachable; `false` otherwise.
	 */
	function checkSegment(segment) {
		if (checked.has(segment)) {
			return false;
		}
		checked.add(segment);

		if (segment.reachable) {
			return true;
		}

		for (const prevSegment of segment.allPrevSegments) {
			if (checkSegment(prevSegment)) {
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
