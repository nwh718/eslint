/**
 * @fileoverview Tests for isSegmentReachableInPath.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const isSegmentReachableInPath = require("../../../lib/shared/isSegmentReachableInPath");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function createSegment() {
	return {
		prevSegments: [],
		nextSegments: [],
	};
}

function connect(fromSegment, toSegment) {
	fromSegment.nextSegments.push(toSegment);
	toSegment.prevSegments.push(fromSegment);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("isSegmentReachableInPath", () => {
	it("returns false for an empty segments array", () => {
		const targetSegment = createSegment();

		assert.strictEqual(
			isSegmentReachableInPath([], targetSegment),
			false,
		);
	});

	it("returns true when the target segment is directly included", () => {
		const targetSegment = createSegment();

		assert.strictEqual(
			isSegmentReachableInPath([targetSegment], targetSegment),
			true,
		);
	});

	it("returns true when the target segment is reachable through nextSegments", () => {
		const startSegment = createSegment();
		const middleSegment = createSegment();
		const targetSegment = createSegment();

		connect(startSegment, middleSegment);
		connect(middleSegment, targetSegment);

		assert.strictEqual(
			isSegmentReachableInPath([startSegment], targetSegment),
			true,
		);
	});

	it("returns true when the target segment is reachable through prevSegments", () => {
		const startSegment = createSegment();
		const middleSegment = createSegment();
		const targetSegment = createSegment();

		connect(startSegment, middleSegment);
		connect(middleSegment, targetSegment);

		assert.strictEqual(
			isSegmentReachableInPath([targetSegment], startSegment),
			true,
		);
	});

	it("returns false when the target segment is not connected to the path", () => {
		const startSegment = createSegment();
		const middleSegment = createSegment();
		const targetSegment = createSegment();

		connect(startSegment, middleSegment);

		assert.strictEqual(
			isSegmentReachableInPath([startSegment], targetSegment),
			false,
		);
	});

	it("handles cyclic paths without infinite traversal", () => {
		const firstSegment = createSegment();
		const secondSegment = createSegment();
		const thirdSegment = createSegment();
		const targetSegment = createSegment();

		connect(firstSegment, secondSegment);
		connect(secondSegment, thirdSegment);
		connect(thirdSegment, firstSegment);
		connect(thirdSegment, targetSegment);

		assert.strictEqual(
			isSegmentReachableInPath([firstSegment], targetSegment),
			true,
		);
	});

	it("returns false for cyclic paths that do not include the target segment", () => {
		const firstSegment = createSegment();
		const secondSegment = createSegment();
		const targetSegment = createSegment();

		connect(firstSegment, secondSegment);
		connect(secondSegment, firstSegment);

		assert.strictEqual(
			isSegmentReachableInPath([firstSegment], targetSegment),
			false,
		);
	});
});
