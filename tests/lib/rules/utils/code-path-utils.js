/**
 * @fileoverview Tests for code path utils.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const {
	isAnySegmentReachable,
} = require("../../../../lib/rules/utils/code-path-utils");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("isAnySegmentReachable", () => {
	it("should return false for an empty set of segments", () => {
		const segments = new Set();

		assert.strictEqual(isAnySegmentReachable(segments), false);
	});

	it("should return true when a single segment is reachable", () => {
		const segments = new Set([{ reachable: true }]);

		assert.strictEqual(isAnySegmentReachable(segments), true);
	});

	it("should return false when a single segment is unreachable", () => {
		const segments = new Set([{ reachable: false }]);

		assert.strictEqual(isAnySegmentReachable(segments), false);
	});

	it("should return false when all segments are unreachable", () => {
		const segments = new Set([{ reachable: false }, { reachable: false }]);

		assert.strictEqual(isAnySegmentReachable(segments), false);
	});

	it("should return true when all segments are reachable", () => {
		const segments = new Set([{ reachable: true }, { reachable: true }]);

		assert.strictEqual(isAnySegmentReachable(segments), true);
	});

	it("should return true when at least one segment is reachable", () => {
		const segments = new Set([{ reachable: false }, { reachable: true }]);

		assert.strictEqual(isAnySegmentReachable(segments), true);
	});

	it("should return true when a segment is unreachable but has a reachable previous segment (catch block scenario)", () => {
		const reachablePrev = { reachable: true, allPrevSegments: [] };
		const catchSegment = { reachable: false, allPrevSegments: [reachablePrev] };

		const segments = new Set([catchSegment]);

		assert.strictEqual(isAnySegmentReachable(segments), true);
	});

	it("should return false when a segment is unreachable and all previous segments are also unreachable", () => {
		const unreachablePrev = { reachable: false, allPrevSegments: [] };
		const catchSegment = { reachable: false, allPrevSegments: [unreachablePrev] };

		const segments = new Set([catchSegment]);

		assert.strictEqual(isAnySegmentReachable(segments), false);
	});

	it("should return true when chain of allPrevSegments eventually reaches a reachable segment", () => {
		const reachable = { reachable: true, allPrevSegments: [] };
		const mid = { reachable: false, allPrevSegments: [reachable] };
		const leaf = { reachable: false, allPrevSegments: [mid] };

		const segments = new Set([leaf]);

		assert.strictEqual(isAnySegmentReachable(segments), true);
	});

	it("should not loop infinitely when segments have circular allPrevSegments references", () => {
		const a = { reachable: false, allPrevSegments: [] };
		const b = { reachable: false, allPrevSegments: [a] };

		a.allPrevSegments = [b];

		const segments = new Set([a]);

		assert.strictEqual(isAnySegmentReachable(segments), false);
	});
});
