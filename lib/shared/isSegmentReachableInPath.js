"use strict";

function isSegmentReachableInPath(segments, targetSegment) {
	if (!Array.isArray(segments) || segments.length === 0 || !targetSegment) {
		return false;
	}

	const visited = new Set();
	const queue = [...segments];

	for (let i = 0; i < queue.length; i++) {
		const segment = queue[i];

		if (!segment || visited.has(segment)) {
			continue;
		}
		visited.add(segment);

		if (segment === targetSegment) {
			return true;
		}

		const { prevSegments, nextSegments } = segment;

		if (Array.isArray(prevSegments)) {
			queue.push(...prevSegments);
		}
		if (Array.isArray(nextSegments)) {
			queue.push(...nextSegments);
		}
	}

	return false;
}

module.exports = isSegmentReachableInPath;
