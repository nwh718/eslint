"use strict";

const { stringifyValueForError } = require("./shared");

module.exports = function ({ ruleId, value }) {
	const valueType = Array.isArray(value) ? "array" : typeof value;
	const isArray = Array.isArray(value);
	
	return `
Error in rule configuration for "${ruleId}":

The rule configuration must be one of the following formats:
- A severity string: "off", "warn", or "error"
- A severity number: 0, 1, or 2
- An array: [severity, ...options] where severity is "off"/"warn"/"error" or 0/1/2

You provided a ${valueType}:
${stringifyValueForError(value, 4)}

${isArray 
	? `Your array doesn't have a valid severity as the first element. The first element must be "off", 0, "warn", 1, "error", or 2, but you provided: ${stringifyValueForError(value[0], 8)}` 
	: `Your ${valueType} cannot be used directly as a rule configuration.`
}

Here are some valid examples:
- "${ruleId}": "error"          (just severity)
- "${ruleId}": ["warn", { ... }] (severity + options)

See https://eslint.org/docs/latest/use/configure/rules#use-configuration-files for more details.
`.trimStart();
};
