"use strict";

const assert = require("chai").assert;
const isSegmentReachableInPath = require("../../../lib/shared/isSegmentReachableInPath");

describe("isSegmentReachableInPath", () => {
	it("should return false for empty segments array", () => {
		const target = { nextSegments: [], prevSegments: [] };
		assert.isFalse(isSegmentReachableInPath([], target));
	});

	it("should return false when targetSegment is null", () => {
		const start = { nextSegments: [], prevSegments: [] };
		assert.isFalse(isSegmentReachableInPath([start], null));
	});

	it("should return false when targetSegment is undefined", () => {
		const start = { nextSegments: [], prevSegments: [] };
		assert.isFalse(isSegmentReachableInPath([start], undefined));
	});

	it("should return true when target is in the starting segments", () => {
		const target = { nextSegments: [], prevSegments: [] };
		const start = { nextSegments: [], prevSegments: [] };
		assert.isTrue(isSegmentReachableInPath([start, target], target));
	});

	it("should return true when target is directly next to a starting segment", () => {
		const target = { nextSegments: [], prevSegments: [] };
		const start = { nextSegments: [target], prevSegments: [] };
		assert.isTrue(isSegmentReachableInPath([start], target));
	});

	it("should return true when target is directly previous to a starting segment", () => {
		const target = { nextSegments: [], prevSegments: [] };
		const start = { nextSegments: [], prevSegments: [target] };
		assert.isTrue(isSegmentReachableInPath([start], target));
	});

	it("should return false when target is not reachable", () => {
		const target = { nextSegments: [], prevSegments: [] };
		const unreachable = { nextSegments: [], prevSegments: [] };
		const start = { nextSegments: [unreachable], prevSegments: [] };
		assert.isFalse(isSegmentReachableInPath([start], target));
	});

	it("should return true for multi-step reachable path (forwards)", () => {
		const target = { nextSegments: [], prevSegments: [] };
		const c = { nextSegments: [target], prevSegments: [] };
		const b = { nextSegments: [c], prevSegments: [] };
		const a = { nextSegments: [b], prevSegments: [] };
		assert.isTrue(isSegmentReachableInPath([a], target));
	});

	it("should return true for multi-step reachable path (backwards)", () => {
		const target = { nextSegments: [], prevSegments: [] };
		const c = { nextSegments: [], prevSegments: [target] };
		const b = { nextSegments: [], prevSegments: [c] };
		const a = { nextSegments: [], prevSegments: [b] };
		assert.isTrue(isSegmentReachableInPath([a], target));
	});

	it("should find target in one of multiple branches", () => {
		const target = { nextSegments: [], prevSegments: [] };
		const branch1 = { nextSegments: [], prevSegments: [] };
		const branch2 = { nextSegments: [target], prevSegments: [] };
		const root = { nextSegments: [branch1, branch2], prevSegments: [] };
		assert.isTrue(isSegmentReachableInPath([root], target));
	});

	it("should handle cyclic paths without infinite loop", () => {
		const a = { nextSegments: [], prevSegments: [] };
		const b = { nextSegments: [], prevSegments: [] };
		const c = { nextSegments: [], prevSegments: [] };
		const d = { nextSegments: [], prevSegments: [] };
		const target = { nextSegments: [], prevSegments: [] };

		a.nextSegments.push(b);
		b.nextSegments.push(c);
		c.nextSegments.push(d);
		d.nextSegments.push(b); // Cycle here: d -> b

		// Target is connected from d
		d.nextSegments.push(target);

		assert.isTrue(isSegmentReachableInPath([a], target));
	});

	it("should handle mixed forward and backward traversal", () => {
		const target = { nextSegments: [], prevSegments: [] };
		const a = { nextSegments: [], prevSegments: [] };
		const b = { nextSegments: [], prevSegments: [] };
		const c = { nextSegments: [], prevSegments: [] };

		a.nextSegments.push(b);
		b.prevSegments.push(c); // c is previous to b
		c.nextSegments.push(target);

		assert.isTrue(isSegmentReachableInPath([a], target));
	});
});
