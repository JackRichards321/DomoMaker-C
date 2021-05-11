"use strict";

/*
/ ADDED - HandleVote
/ handles vote-related errors and posts the vote to the server if applicable.
*/
var handleVote = function handleVote(e) {
  e.preventDefault();
  $("#totMessage").animate({
    width: 'hide'
  }, 350);
  var items = document.getElementsByName('item');
  var winner;

  for (var i = 0; i < items.length; i++) {
    if (items[i].checked) {
      winner = items[i].value;
    }
  } // console.log("winner: ");
  // console.log(winner);


  if ($("#voteItem1").val() == '' && $("#voteItem2").val() == '') {
    handleError("Choose one before submitting");
    return false;
  } // console.log("serialized data: ");
  // console.log($("#voteForm").serializeArray());


  sendAjax('POST', $("#voteForm").attr("action"), $("#voteForm").serialize(), function () {
    loadResults($("#voteForm").serialize());
  });
  return false;
};
/*
/ VoteForm - based on TotForm, allows user to vote and sends all data to the router
*/


var VoteForm = function VoteForm(props) {
  // console.log("voteForm props: ");
  // console.log(props);
  return (/*#__PURE__*/React.createElement("form", {
      id: "voteForm",
      name: "voteForm",
      onSubmit: handleVote,
      action: "/voter",
      method: "POST",
      className: "voteForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "voteItem1"
    }, props.tot.item1), /*#__PURE__*/React.createElement("input", {
      id: "voteItem1",
      type: "radio",
      name: "item",
      value: props.tot.item1,
      placeholder: "Tot Item 1"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "voteItem2"
    }, props.tot.item2), /*#__PURE__*/React.createElement("input", {
      id: "voteItem2",
      type: "radio",
      name: "item",
      value: props.tot.item2,
      placeholder: "Tot Item 2"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "item1",
      value: props.tot.item1
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "item2",
      value: props.tot.item2
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "wins1",
      value: props.tot.wins1
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "wins2",
      value: props.tot.wins2
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "id",
      value: props.tot._id
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeTotSubmit",
      type: "submit",
      value: "Submit Vote!"
    }))
  );
};
/*
/ ADDED - Results
/ A React component that shows the current standings of a ToT
*/


var Results = function Results(props) {
  // console.log("props: ");
  // console.log(props);
  return (/*#__PURE__*/React.createElement("div", {
      id: "results"
    }, /*#__PURE__*/React.createElement("h3", null, props.props.item1, " wins: ", props.props.wins1), /*#__PURE__*/React.createElement("h3", null, props.props.item2, " wins: ", props.props.wins2))
  );
};
/*
/ ADDED - getVariables
/ based on Luke's answer at
/ https://stackoverflow.com/questions/9856587/is-there-an-inverse-function-to-jquery-serialize
/ essentially 'deserializes' a serialized string, back to an object
*/


var getVariables = function getVariables(str) {
  str = str.replace('/\+/g', '%20');
  var arr = str.split("&");
  var obj = {};
  arr.forEach(function (pair) {
    var nameValue = pair.split("=");
    var name = decodeURIComponent(nameValue[0].replaceAll('+', ' ')); // (C)

    var value = decodeURIComponent(nameValue[1].replaceAll('+', ' '));
    obj[name] = value;
  });
  return obj;
};
/*
/ ADDED - LoadResults
/ renders a Results component after a user votes
*/


var loadResults = function loadResults(data) {
  // console.log("data: ");
  // console.log(data);
  var objData = getVariables(data); // console.log("objData: ");
  // console.log(objData);

  ReactDOM.render( /*#__PURE__*/React.createElement("div", {
    id: "resultsDiv"
  }, /*#__PURE__*/React.createElement(Results, {
    props: objData
  }), /*#__PURE__*/React.createElement("button", {
    id: "seeNextButton",
    onClick: getToken
  }, "See Next ToT")), document.querySelector("#voteTot"));
};

var setup = function setup(csrf) {
  sendAjax('GET', '/getTot', null, function (data) {
    // console.log("data: ");
    // console.log(data);
    ReactDOM.render( /*#__PURE__*/React.createElement(VoteForm, {
      tot: data.tot,
      csrf: csrf
    }), document.querySelector("#voteTot"));
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
