/**
 * @fileoverview Utility to check if a code path segment is reachable from a set of segments.
 * @author ESLint Contributor
 */

"use strict";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Determines if the target segment is reachable from any segment in the given array
 * by traversing the graph via nextSegments and prevSegments connections.
 *
 * Uses BFS to explore all reachable segments while handling cycles through
 * a visited set.
 *
 * @param {CodePathSegment[]} segments The array of starting segments to search from.
 * @param {CodePathSegment} targetSegment The segment to check reachability for.
 * @returns {boolean} `true` if the target segment is reachable, `false` otherwise.
 */
function isSegmentReachableInPath(segments, targetSegment) {
	if (
		!Array.isArray(segments) ||
		segments.length === 0 ||
		!targetSegment
	) {
		return false;
	}

	const visited = new Set();
	const queue = [...segments];

	for (const segment of segments) {
		visited.add(segment);
	}

	while (queue.length > 0) {
		const current = queue.shift();

		if (current === targetSegment) {
			return true;
		}

		const neighbors = [
			...(current.nextSegments || []),
			...(current.prevSegments || []),
		];

		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				visited.add(neighbor);
				queue.push(neighbor);
			}
		}
	}

	return false;
}

module.exports = isSegmentReachableInPath;
