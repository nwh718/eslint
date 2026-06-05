"use strict";

const { stringifyValueForError } = require("./shared");

module.exports = function ({ ruleId, value }) {
	const valueType =
		value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
	const valueDescription = ["array", "object", "undefined"].includes(
		valueType,
	)
		? `an ${valueType}`
		: `a ${valueType}`;
	const capitalizedValueDescription = `${valueDescription[0].toUpperCase()}${
		valueDescription.slice(1)
	}`;
	const formattedValue = stringifyValueForError(value, 4);
	const optionsHint =
		valueType === "object"
			? `
If you're attempting to configure rule options, move the options object into an array after the severity, for example:

    "${ruleId}": ["error", ${stringifyValueForError(value, 8)}]`
			: `
Use a severity by itself or place rule options after the severity in an array, for example:

    "${ruleId}": "error"
    "${ruleId}": ["error", { ...options }]`;

	return `
Configuration for rule "${ruleId}" is invalid. A rule configuration must be one of the following:

- a severity string: "off", "warn", or "error"
- a severity number: 0, 1, or 2
- an array whose first item is the severity and whose remaining items are rule options

You passed ${valueDescription} value: '${formattedValue}'.

${capitalizedValueDescription} value cannot be used directly as a rule configuration because it doesn't specify a severity.${optionsHint}

See https://eslint.org/docs/latest/use/configure/rules#use-configuration-files for configuring rules.
`.trimStart();
};
