"use strict";

var ErrorMessage = function ErrorMessage() {
  return (/*#__PURE__*/React.createElement("div", {
      id: "error"
    }, /*#__PURE__*/React.createElement("h3", null, "Error 404 - Page not found :-("), /*#__PURE__*/React.createElement("p", null, "Are you sure you entered the URL correctly?"), /*#__PURE__*/React.createElement("p", null, "Use the nav bar above to redirect yourself"))
  );
};

var displayError = function displayError() {
  ReactDOM.render( /*#__PURE__*/React.createElement(ErrorMessage, null), document.querySelector("#error"));
};

$(document).ready(function () {
  displayError();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#totMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#totMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
