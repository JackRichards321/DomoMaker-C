"use strict";

var handleTot = function handleTot(e) {
  e.preventDefault();
  $("#totMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#totItem1").val() == '' || $("#totItem2").val() == '') {
    handleError("All fields are required");
    return false;
  } //if ($("#totItem1").val() == ) { cannot do repeat tots
  //}


  sendAjax('POST', $("#totForm").attr("action"), $("#totForm").serialize(), function () {
    loadTotsFromServer();
  });
  return false;
};

var TotForm = function TotForm(props) {
  console.log(props);
  return (/*#__PURE__*/React.createElement("form", {
      id: "totForm",
      name: "totForm",
      onSubmit: handleTot,
      action: "/maker",
      method: "POST",
      className: "totForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "item1"
    }, "Item 1: "), /*#__PURE__*/React.createElement("input", {
      id: "totItem1",
      type: "text",
      name: "item1",
      placeholder: "Tot Item 1"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "item2"
    }, "Item 2: "), /*#__PURE__*/React.createElement("input", {
      id: "totItem2",
      type: "text",
      name: "item2",
      placeholder: "Tot Item 2"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "totButton",
      type: "submit",
      value: "Make Tot"
    }))
  );
};

var TotList = function TotList(props) {
  console.log(props);

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
      }, /*#__PURE__*/React.createElement("h3", {
        className: "totItem"
      }, " Item 1: ", tot.item1, " | Wins: ", tot.wins1, " "), /*#__PURE__*/React.createElement("h3", {
        className: "totItem"
      }, " Item 2: ", tot.item2, " | Wins: ", tot.wins2, " "))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "totList"
    }, totNodes)
  );
};

var loadTotsFromServer = function loadTotsFromServer() {
  sendAjax('GET', '/getTots', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(TotList, {
      tots: data.tots
    }), document.querySelector("#tots"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(TotForm, {
    csrf: csrf
  }), document.querySelector("#makeTot"));
  ReactDOM.render( /*#__PURE__*/React.createElement(TotList, {
    tots: []
  }), document.querySelector("#tots"));
  loadTotsFromServer();
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
