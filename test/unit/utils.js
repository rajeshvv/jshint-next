var _ = require("underscore");
var linter = require("../../src/jshint.js");
var utils = require("../../src/utils.js");
var helpers = require("../lib/helpers.js");

var fixtures = new helpers.Fixtures(__dirname, __filename);

exports.testReport = function (test) {
	var report = new utils.Report();

	test.equal(_.size(report.messages), 0);
	test.equal(report.errors.length, 0);
	test.equal(report.warnings.length, 0);

	report.addError("Random Error", 1);
	report.addError("Another Error", 2);
	report.addWarning("Random Warning", 3);

	test.equal(_.size(report.messages), 3);
	test.equal(report.errors.length, 2);
	test.equal(report.warnings.length, 1);

	test.deepEqual(report.errors[0], {
		type: report.ERROR,
		line: 1,
		data: "Random Error"
	});

	test.done();
};

exports.testMixin = function (test) {
	var firstReport = new utils.Report();
	var secondReport = new utils.Report();

	firstReport.addError("Random Error", 1);
	secondReport.addError("Another Error", 1);

	firstReport.mixin(secondReport);
	test.equal(firstReport.errors.length, 2);

	test.done();
};

exports.getRange = function (test) {
	var code = fixtures.get("simple_file.js");
	var tokens = linter.lint({ code: code }).tree.tokens;

	var slice = utils.getRange(tokens, [ 0, 27 ]);
	test.equal(slice.length, 3);
	test.equal(slice[0].value, "var");
	test.equal(slice[1].value, "number");
	test.equal(slice[2].value, "=");

	slice = utils.getRange(tokens, [ 84, 84 ], 2);
	test.equal(slice.length, 2);
	test.equal(slice[0].value, ")");
	test.equal(slice[1].value, ";");

	test.done();
};
