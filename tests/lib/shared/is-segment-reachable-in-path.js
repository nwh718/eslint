"use strict";

/**
 * @fileoverview Tests for isSegmentReachableInPath.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const CodePathSegment = require("../../../lib/linter/code-path-analysis/code-path-segment");
const isSegmentReachableInPath = require("../../../lib/shared/is-segment-reachable-in-path");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("isSegmentReachableInPath", () => {
	describe("edge cases", () => {
		it("should return false for empty segments array", () => {
			const target = CodePathSegment.newRoot("target");
			assert.isFalse(isSegmentReachableInPath([], target));
		});

		it("should return false when targetSegment is null", () => {
			const start = CodePathSegment.newRoot("start");
			assert.isFalse(isSegmentReachableInPath([start], null));
		});

		it("should return false when targetSegment is undefined", () => {
			const start = CodePathSegment.newRoot("start");
			assert.isFalse(isSegmentReachableInPath([start], undefined));
		});
	});

	describe("basic reachability", () => {
		it("should return true when target is in the starting segments", () => {
			const start1 = CodePathSegment.newRoot("start1");
			const target = CodePathSegment.newRoot("target");
			assert.isTrue(isSegmentReachableInPath([start1, target], target));
		});

		it("should return true when target is directly next to a starting segment", () => {
			const start = CodePathSegment.newRoot("start");
			const target = CodePathSegment.newNext("target", [start]);
			CodePathSegment.markUsed(target);
			assert.isTrue(isSegmentReachableInPath([start], target));
		});

		it("should return false when target is not reachable", () => {
			const start = CodePathSegment.newRoot("start");
			const unreachable = CodePathSegment.newNext("unreachable", [start]);
			CodePathSegment.markUsed(unreachable);
			const target = CodePathSegment.newRoot("target");
			assert.isFalse(isSegmentReachableInPath([start], target));
		});
	});

	describe("multi-step paths", () => {
		it("should return true for multi-step reachable path", () => {
			const a = CodePathSegment.newRoot("a");
			const b = CodePathSegment.newNext("b", [a]);
			const c = CodePathSegment.newNext("c", [b]);
			const target = CodePathSegment.newNext("target", [c]);
			CodePathSegment.markUsed(b);
			CodePathSegment.markUsed(c);
			CodePathSegment.markUsed(target);
			assert.isTrue(isSegmentReachableInPath([a], target));
		});
	});

	describe("branched paths", () => {
		it("should find target in one of multiple branches", () => {
			const root = CodePathSegment.newRoot("root");
			const branch1 = CodePathSegment.newNext("branch1", [root]);
			const branch2 = CodePathSegment.newNext("branch2", [root]);
			const target = CodePathSegment.newNext("target", [branch2]);
			CodePathSegment.markUsed(branch1);
			CodePathSegment.markUsed(branch2);
			CodePathSegment.markUsed(target);
			assert.isTrue(isSegmentReachableInPath([root], target));
		});
	});

	describe("cyclic paths", () => {
		it("should handle cyclic paths without infinite loop", () => {
			const a = CodePathSegment.newRoot("a");
			const b = CodePathSegment.newNext("b", [a]);
			const c = CodePathSegment.newNext("c", [b]);
			const d = CodePathSegment.newNext("d", [c]);
			const e = CodePathSegment.newNext("e", [d]);
			CodePathSegment.markUsed(b);
			CodePathSegment.markUsed(c);
			CodePathSegment.markUsed(d);
			CodePathSegment.markUsed(e);

			const cycleBack = CodePathSegment.newNext("cycleBack", [e]);
			cycleBack.allPrevSegments.push(b);
			CodePathSegment.markUsed(cycleBack);

			const target = CodePathSegment.newNext("target", [d]);
			CodePathSegment.markUsed(target);

			assert.isTrue(isSegmentReachableInPath([a], target));
		});
	});
});
