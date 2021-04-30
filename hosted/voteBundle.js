"use strict";

var handleVote = function handleVote(e) {
  e.preventDefault(); //$("#totMessage").animate({width: 'hide'}, 350);

  if ($("#voteItem1").val() == '' && $("#voteItem2").val() == '') {
    handleError("Choose one before submitting");
    return false;
  }

  sendAjax('POST', $("#voteForm").attr("action"), $("#voteForm").serialize(), function () {
    loadTotFromServer();
  });
  return false;
};

var VoteForm = function VoteForm(props) {
  console.log(props);
  return (/*#__PURE__*/React.createElement("form", {
      id: "voteForm",
      name: "voteForm",
      onSubmit: handleVote,
      action: "/voter",
      method: "POST",
      className: "voteForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "item1"
    }, props.item1), /*#__PURE__*/React.createElement("input", {
      id: "voteItem1",
      type: "radio",
      name: "item1",
      placeholder: "Tot Item 1"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "item2"
    }, props.item2), /*#__PURE__*/React.createElement("input", {
      id: "voteItem2",
      type: "radio",
      name: "item2",
      placeholder: "Tot Item 2"
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeTotSubmit",
      type: "submit",
      value: "Submit Vote!"
    }))
  );
};

var VoteList = function VoteList(props) {
  if (props.tot.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "totList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyTot"
      }, "You haven't made any Tots yet"))
    );
  }

  var totNodes = function totNodes(tot) {
    return (/*#__PURE__*/React.createElement("div", {
        key: tot._id,
        className: "tot"
      }, /*#__PURE__*/React.createElement("h3", {
        classname: "totItem"
      }, " Item 1: ", tot.item1, " "), /*#__PURE__*/React.createElement("h3", {
        classname: "totItem"
      }, " Item 2: ", tot.item2, " "))
    );
  };

  return (/*#__PURE__*/React.createElement("div", {
      className: "totList"
    }, totNodes)
  );
};

var loadTotFromServer = function loadTotFromServer() {
  sendAjax('GET', '/getTot', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(VoteList, {
      tot: data.tot
    }), document.querySelector("#tots"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(VoteForm, {
    csrf: csrf
  }), document.querySelector("#voteTot"));
  ReactDOM.render( /*#__PURE__*/React.createElement(VoteList, {
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
