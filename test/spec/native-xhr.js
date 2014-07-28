/*global describe, it */
'use strict';

describe('XHRListener can listen without libraries', function () {

  var baseDataUrl = 'base/data/',

      makeXHRRequest = function (url, callbackDone, options) {
        var xhr = new XMLHttpRequest();

        options = options || {};

        xhr.onreadystatechange = function () {
          if (this.readyState === 4 && callbackDone) {
            callbackDone.apply(this, arguments);
          }
        };

        xhr.open(options.type || 'get', url);
        xhr.send(options.params || '');
      },

      jsonUrl = baseDataUrl + 'test.json',
      xhrListenerCall;

  beforeEach(function () {
    xhrListenerCall = jasmine.createSpy('xhrListenerCall');
    XhrListener.clearRequestsList();
  });

  it('when a request is opened', function (done) {
    XhrListener(jsonUrl).onopen(xhrListenerCall);

    makeXHRRequest(jsonUrl, function () {
      expect(xhrListenerCall).toHaveBeenCalled();
      done();
    });
  });

  it('when a request is done before its original handler is called', function (done) {
    XhrListener(jsonUrl).done(xhrListenerCall);

    makeXHRRequest(jsonUrl, function () {
      expect(xhrListenerCall).toHaveBeenCalled();
      done();
    });
  });

  it('using the callback as second param without .done promise', function (done) {
    XhrListener(jsonUrl, xhrListenerCall);

    makeXHRRequest(jsonUrl, function () {
      expect(xhrListenerCall).toHaveBeenCalled();
      done();
    });
  });

  it('when a request is done after its original handler is called - using .after', function (done) {
    XhrListener(jsonUrl).done(xhrListenerCall).after();

    makeXHRRequest(jsonUrl, function () {
      expect(xhrListenerCall).not.toHaveBeenCalled();
      done();
    });
  });

  it('when a request is done before its original handler is called - using .before', function (done) {
    XhrListener(jsonUrl).done(xhrListenerCall).before();

    makeXHRRequest(jsonUrl, function () {
      expect(xhrListenerCall).toHaveBeenCalled();
      done();
    });
  });

  it('when an error has been occured', function (done) {
    XhrListener(baseDataUrl + 'error_test').error(xhrListenerCall);

    makeXHRRequest(baseDataUrl + 'error_test', function () {
      expect(xhrListenerCall).toHaveBeenCalled();
      done();
    });
  });

  it('and change the responseText when response is overwritable', function (done) {
    var newResponseText = '{ newValue: true }';

    XhrListener(jsonUrl).done(function () {
      if(this.responseOverwritable) {
        this.newResponseText = newResponseText;
      }

      xhrListenerCall.apply(this, arguments);
    });

    makeXHRRequest(jsonUrl, function () {
      if(this.responseOverwritable) {
        expect(this.responseText).toEqual(newResponseText);
      } else {
        expect(this.responseText).not.toEqual(newResponseText);
      }

      expect(xhrListenerCall).toHaveBeenCalled();
      done();
    });
  });

  it('and can waits for the original callback is done when the responseText is not overwritable', function (done) {
    var newResponseText = '{ newValue: true }',
        requestIsDone = jasmine.createSpy('requestIsDone');

    XhrListener(jsonUrl).done(function () {

      if(!this.responseOverwritable) {
        this.waitRequestDone(requestIsDone);
      }

      xhrListenerCall.apply(this, arguments);
    });

    makeXHRRequest(jsonUrl, function () {
      expect(xhrListenerCall).toHaveBeenCalled();

      if(!this.responseOverwritable) {
        //the requestIsDone should not has been called
        expect(requestIsDone).not.toHaveBeenCalled();
      }

      done();
    });
  });

  it('and is able to listen multiples requests', function (done) {
    var allRequests = 0;

    XhrListener(baseDataUrl + 'test.json').done(function () {
      xhrListenerCall(this.url);
    });

    XhrListener(baseDataUrl + 'test2.json').done(function () {
      xhrListenerCall(this.url);
    });

    XhrListener(baseDataUrl + 'test3.json').done(function () {
      xhrListenerCall(this.url);
    });

    XhrListener(baseDataUrl + 'test4.json').done(function () {
      xhrListenerCall(this.url);
    });

    makeXHRRequest(baseDataUrl + 'test.json', function () {
      expect(xhrListenerCall).toHaveBeenCalledWith(this.url);
      allRequests++;
    });

    makeXHRRequest(baseDataUrl + 'test2.json', function () {
      expect(xhrListenerCall).toHaveBeenCalledWith(this.url);
      allRequests++;
    });

    makeXHRRequest(baseDataUrl + 'test3.json', function () {
      expect(xhrListenerCall).toHaveBeenCalledWith(this.url);
      allRequests++;
    });

    makeXHRRequest(baseDataUrl + 'test4.json', function () {
      expect(xhrListenerCall).toHaveBeenCalledWith(this.url);
      allRequests++;
    });

    var id = setInterval(function () {
      if(allRequests === 4) {
        done();
        clearInterval(id);
      }
    }, 15);
  });

  it('and is able to work with POST params', function (done) {
    XhrListener(baseDataUrl + 'test.json')
      .done(xhrListenerCall)
      .data({
        test: true,
        type: 'json'
      });

    makeXHRRequest(baseDataUrl + 'test.json', function () {
      expect(xhrListenerCall).toHaveBeenCalled();
      done();
    }, {
      type: 'post',
      params: 'test=true&type=json'
    });
  });
});
