/*global describe, it */
'use strict';

(function () {

  describe('Native XHR', function () {

    it("simple JSON request", function(done) {
      var doneFn = jasmine.createSpy("success"),
          doneListener = jasmine.createSpy("success_listener");

      XhrListener("base/data/test.json", function () {
        console.log(2);
      });

      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(args) {
        if (this.readyState == this.DONE) {
          console.log(this.status);
          done()
        }
      };

      xhr.open("GET", "base/data/test.json");
      xhr.send();
    });

  });
})();
