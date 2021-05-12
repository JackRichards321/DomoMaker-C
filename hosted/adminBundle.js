"use strict";

// const { Account } = require("../../server/models");
var TotList = function TotList(props) {
  // console.log(props);
  if (props.tots.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "totList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyTot"
      }, "You haven't made any Tots yet"))
    );
  }

  var totNodes = props.tots.map(function (tot) {
    return (/*#__PURE__*/React.createElement("div", {
        key: tot._id,
        className: "tot"
      }, /*#__PURE__*/React.createElement("section", {
        id: "ownerSection"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "totOwner"
      }, " Owner: "), " ", /*#__PURE__*/React.createElement("h3", {
        className: "totOwner",
        id: "owner"
      }, tot.owner)), /*#__PURE__*/React.createElement("h3", {
        className: "totItem"
      }, " Item 1: ", tot.item1, " | Wins: ", tot.wins1, " "), /*#__PURE__*/React.createElement("h3", {
        className: "totItem"
      }, " Item 2: ", tot.item2, " | Wins: ", tot.wins2, " "), /*#__PURE__*/React.createElement("button", {
        className: "totButton",
        id: "deleteButton",
        onClick: function onClick() {
          return handleDelete(tot, props.csrf);
        }
      }, "Delete"))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "totList"
    }, totNodes)
  );
};

var handleDelete = function handleDelete(data, csrf) {
  console.log("tot delete attempted");
  console.log(data);
  data.csrf = csrf;
  sendAjax('DELETE', '/delete', data, function (data) {
    setup(data.csrf);
  });
};

var handlePassChange = function handlePassChange(e) {
  e.preventDefault();
  $("#totMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() === '' || $("#oldPass").val() === '' || $("#newPass").val() === '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#oldPass").val() === $("#newPass").val()) {
    handleError("Passwords must not match");
    return false;
  }

  console.log("serialized data: ");
  console.log($("#changePassForm").serialize());
  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
  return false;
};

var ChangePassForm = function ChangePassForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "changePassForm",
      name: "changePassForm",
      onSubmit: handlePassChange,
      action: "/changePass",
      method: "POST",
      className: "changePassForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username: "), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "oldPass"
    }, " Current Password: "), /*#__PURE__*/React.createElement("input", {
      id: "oldPass",
      type: "password",
      name: "oldPass",
      placeholder: "current password"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "newPass"
    }, " New Password: "), /*#__PURE__*/React.createElement("input", {
      id: "newPass",
      type: "password",
      name: "newPass",
      placeholder: "new password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "totButton",
      id: "changePassSubmit",
      type: "submit",
      value: "Submit"
    }))
  );
};

var createChangePassForm = function createChangePassForm(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangePassForm, {
    csrf: csrf
  }), document.querySelector("#changePass"));
};

var setup = function setup(csrf) {
  sendAjax('GET', '/getAllTots', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(TotList, {
      tots: data.tots,
      csrf: csrf
    }), document.querySelector("#tots"));
  });
  var changePassButton = document.querySelector("#changePassButton");
  changePassButton.addEventListener("click", function (e) {
    e.preventDefault();
    createChangePassForm(csrf);
    return false;
  });
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
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
