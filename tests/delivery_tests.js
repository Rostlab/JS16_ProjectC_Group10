//delivery tests for gotmap package
var expect = require('expect.js');
var phantom = require("node-phantom");
phantom.create(function (error, ph) {
    ph.createPage(function (err, page) {
        page.open("../builds/test.bundle.js", function (err, status) {


        });
    });
});


describe("gotmap", function() {
    it("should include gotmap object", function () {
        phantom.create(function (error, ph) {
            ph.createPage(function (err, page) {
                page.open("../builds/test.bundle.js", function (err, status) {
                    expect(gotmap).to.be.a('function');
                });
            });
        });
    })
});
