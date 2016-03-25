//delivery tests for gotmap package
var expect = require('expect.js');
//node-phantom is used to emulate the browser
var phantom = require("node-phantom");


describe("gotmap tests", function() {
    it("should be a function", function () {
        phantom.create(function (error, ph) {
            ph.createPage(function (err, page) {
                page.open("../builds/test.bundle.js", function (err, status) {
                    expect(gotmap).to.be.a('function');
                });
            });
        });
    });

    it("should include api config variables", function() {
        phantom.create(function (error, ph) {
            ph.createPage(function (err, page) {
                page.open("../builds/test.bundle.js", function (err, status) {
                    expect(apiLocation).to.not.be(undefined);
                    expect(apiToken).to.not.be(undefined);
                });
            });
        });
    });
});
