/*global describe, it */
'use strict';

describe('XHRListener can listen without libraries', function () {

  var baseDataUrl = 'base/data/',

      makeXHRRequest = function (url, callbackDone, abort) {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
          if (this.readyState == this.DONE && callbackDone) {
            callbackDone.apply(this, arguments);
          }
        };

        xhr.open('GET', url);
        xhr.send();
      },

      htmlUrl = baseDataUrl + 'test.html',
      jsonUrl = baseDataUrl + 'test.json';

  describe("a JSON file", function() {
    var xhrListenerCall;

    beforeEach(function () {
      xhrListenerCall = jasmine.createSpy('xhrListenerCall');
      XhrListener.clearRequestsList();
    });

    it('when the request is opened', function (done) {
      XhrListener(jsonUrl).onopen(xhrListenerCall);

      makeXHRRequest(jsonUrl, function () {
        expect(xhrListenerCall).toHaveBeenCalled();
        done();
      });
    });

    it('when the request is done before its original handler is called', function (done) {
      XhrListener(jsonUrl).done(xhrListenerCall);

      makeXHRRequest(jsonUrl, function () {
        expect(xhrListenerCall).toHaveBeenCalled();
        done();
      });
    });

    it('when the request is done after its original handler is called', function (done) {
      XhrListener(jsonUrl).done(xhrListenerCall).after();

      makeXHRRequest(jsonUrl, function () {
        expect(xhrListenerCall).not.toHaveBeenCalled();
        done();
      });
    });
  });


});
