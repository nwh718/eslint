"use strict";

/**
 * @fileoverview Check if a target segment is reachable from given segments.
 */

/**
 * Traverses segments graph to check if target segment is reachable.
 * Uses BFS traversal with visited set to avoid cycles.
 * @param {CodePathSegment[]} segments The starting segments to check from.
 * @param {CodePathSegment} targetSegment The segment to check reachability to.
 * @returns {boolean} `true` if target segment is reachable.
 */
function isSegmentReachableInPath(segments, targetSegment) {
	if (!Array.isArray(segments) || segments.length === 0) {
		return false;
	}

	if (targetSegment === null || targetSegment === undefined) {
		return false;
	}

	const visited = new Set();
	const queue = [...segments];

	for (const segment of queue) {
		if (visited.has(segment)) {
			continue;
		}
		visited.add(segment);

		if (segment === targetSegment) {
			return true;
		}

		if (segment.nextSegments) {
			for (const nextSegment of segment.nextSegments) {
				if (!visited.has(nextSegment)) {
					queue.push(nextSegment);
				}
			}
		}

		if (segment.prevSegments) {
			for (const prevSegment of segment.prevSegments) {
				if (!visited.has(prevSegment)) {
					queue.push(prevSegment);
				}
			}
		}
	}

	return false;
}

module.exports = isSegmentReachableInPath;
