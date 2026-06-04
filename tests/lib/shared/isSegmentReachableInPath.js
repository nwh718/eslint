/**
 * @fileoverview Tests for isSegmentReachableInPath utility
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { assert } = require("chai");
const isSegmentReachableInPath = require("../../../lib/shared/isSegmentReachableInPath.js");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Creates a mock CodePathSegment with the given properties.
 * @param {string} id The segment identifier.
 * @param {Array} [prevSegments=[]] The previous segments.
 * @param {Array} [nextSegments=[]] The next segments.
 * @returns {Object} A mock segment object.
 */
function createMockSegment(id, prevSegments = [], nextSegments = []) {
	return {
		id,
		prevSegments,
		nextSegments,
	};
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("isSegmentReachableInPath", () => {
	describe("edge cases", () => {
		it("should return false when segments array is empty", () => {
			const target = createMockSegment("target");
			const result = isSegmentReachableInPath([], target);

			assert.strictEqual(result, false);
		});

		it("should return false when segments is not an array", () => {
			const target = createMockSegment("target");
			const result = isSegmentReachableInPath(null, target);

			assert.strictEqual(result, false);
		});

		it("should return false when targetSegment is null", () => {
			const start = createMockSegment("start");
			const result = isSegmentReachableInPath([start], null);

			assert.strictEqual(result, false);
		});

		it("should return false when targetSegment is undefined", () => {
			const start = createMockSegment("start");
			const result = isSegmentReachableInPath([start], undefined);

			assert.strictEqual(result, false);
		});
	});

	describe("direct reachability", () => {
		it("should return true when target is in the starting segments array", () => {
			const target = createMockSegment("target");
			const result = isSegmentReachableInPath([target], target);

			assert.strictEqual(result, true);
		});

		it("should return true when target is a direct nextSegment", () => {
			const target = createMockSegment("target");
			const start = createMockSegment("start", [], [target]);
			const result = isSegmentReachableInPath([start], target);

			assert.strictEqual(result, true);
		});

		it("should return true when target is a direct prevSegment", () => {
			const start = createMockSegment("start");
			const target = createMockSegment("target", [], [start]);
			const result = isSegmentReachableInPath([start], target);

			assert.strictEqual(result, true);
		});
	});

	describe("indirect reachability", () => {
		it("should return true when target is reachable through multiple nextSegments", () => {
			const target = createMockSegment("target");
			const middle = createMockSegment("middle", [], [target]);
			const start = createMockSegment("start", [], [middle]);

			middle.prevSegments = [start];
			target.prevSegments = [middle];

			const result = isSegmentReachableInPath([start], target);

			assert.strictEqual(result, true);
		});

		it("should return true when target is reachable through multiple prevSegments", () => {
			const start = createMockSegment("start");
			const middle = createMockSegment("middle", [start]);
			const target = createMockSegment("target", [middle]);

			start.nextSegments = [middle];
			middle.nextSegments = [target];

			const result = isSegmentReachableInPath([target], start);

			assert.strictEqual(result, true);
		});

		it("should return true when target is reachable through a mix of nextSegments and prevSegments", () => {
			const target = createMockSegment("target");
			const node2 = createMockSegment("node2");
			const node1 = createMockSegment("node1");
			const start = createMockSegment("start");

			start.nextSegments = [node1];
			node1.prevSegments = [start];
			node1.nextSegments = [node2];
			node2.prevSegments = [node1];
			node2.nextSegments = [target];
			target.prevSegments = [node2];

			const result = isSegmentReachableInPath([start], target);

			assert.strictEqual(result, true);
		});
	});

	describe("unreachable targets", () => {
		it("should return false when target is not connected", () => {
			const start = createMockSegment("start");
			const target = createMockSegment("target");
			const result = isSegmentReachableInPath([start], target);

			assert.strictEqual(result, false);
		});

		it("should return false when target is in a separate graph", () => {
			const start = createMockSegment("start");
			const other = createMockSegment("other");
			const target = createMockSegment("target", [], [other]);

			other.prevSegments = [target];

			const result = isSegmentReachableInPath([start], target);

			assert.strictEqual(result, false);
		});
	});

	describe("circular paths", () => {
		it("should handle simple cycle without infinite loop", () => {
			const a = createMockSegment("a");
			const b = createMockSegment("b");

			a.nextSegments = [b];
			b.prevSegments = [a];
			b.nextSegments = [a];
			a.prevSegments = [b];

			const result = isSegmentReachableInPath([a], b);

			assert.strictEqual(result, true);
		});

		it("should handle complex cycle with multiple nodes", () => {
			const a = createMockSegment("a");
			const b = createMockSegment("b");
			const c = createMockSegment("c");
			const target = createMockSegment("target");

			a.nextSegments = [b];
			b.prevSegments = [a];
			b.nextSegments = [c];
			c.prevSegments = [b];
			c.nextSegments = [a, target];
			a.prevSegments = [c];
			target.prevSegments = [c];

			const result = isSegmentReachableInPath([a], target);

			assert.strictEqual(result, true);
		});

		it("should return false when target is not reachable in a cycle", () => {
			const a = createMockSegment("a");
			const b = createMockSegment("b");
			const target = createMockSegment("target");

			a.nextSegments = [b];
			b.prevSegments = [a];
			b.nextSegments = [a];
			a.prevSegments = [b];

			const result = isSegmentReachableInPath([a], target);

			assert.strictEqual(result, false);
		});
	});

	describe("multiple starting segments", () => {
		it("should return true when target is reachable from any starting segment", () => {
			const target = createMockSegment("target");
			const unreachable = createMockSegment("unreachable");
			const reachable = createMockSegment("reachable", [], [target]);

			target.prevSegments = [reachable];

			const result = isSegmentReachableInPath(
				[unreachable, reachable],
				target,
			);

			assert.strictEqual(result, true);
		});

		it("should return false when target is not reachable from any starting segment", () => {
			const start1 = createMockSegment("start1");
			const start2 = createMockSegment("start2");
			const target = createMockSegment("target");

			const result = isSegmentReachableInPath([start1, start2], target);

			assert.strictEqual(result, false);
		});
	});

	describe("branching paths", () => {
		it("should find target through branching nextSegments", () => {
			const target = createMockSegment("target");
			const branch1 = createMockSegment("branch1");
			const branch2 = createMockSegment("branch2", [], [target]);
			const start = createMockSegment("start", [], [branch1, branch2]);

			branch1.prevSegments = [start];
			branch2.prevSegments = [start];
			target.prevSegments = [branch2];

			const result = isSegmentReachableInPath([start], target);

			assert.strictEqual(result, true);
		});

		it("should find target through merging paths", () => {
			const target = createMockSegment("target");
			const branch1 = createMockSegment("branch1", [], [target]);
			const branch2 = createMockSegment("branch2", [], [target]);
			const start1 = createMockSegment("start1", [], [branch1]);
			const start2 = createMockSegment("start2", [], [branch2]);

			branch1.prevSegments = [start1];
			branch2.prevSegments = [start2];
			target.prevSegments = [branch1, branch2];

			const result = isSegmentReachableInPath([start1], target);

			assert.strictEqual(result, true);
		});
	});
});
