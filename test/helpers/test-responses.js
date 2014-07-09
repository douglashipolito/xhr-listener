/*global exports */
'use strict';

(function(test_responses) {
  if (typeof window === "undefined" && typeof exports === "object") {
    exports.test_responses = test_responses;
  } else {
    window.test_responses = test_responses;
  }
}({
  json: {
    success: {
      status: 200,
      responseText: '{ "users": [{"uid": 0, "name": "User 1"}, {"uid": 1, "name": "User 2"}]  }'
    }
  }
}));
