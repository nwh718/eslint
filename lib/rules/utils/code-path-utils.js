/**
 * @fileoverview Code path analysis utilities.
 * Re-exports segment analysis functions from the shared module.
 */

"use strict";

const { isAnySegmentReachable } = require("../../shared/segment-analysis");

module.exports = {
	isAnySegmentReachable,
};
