// const { Account } = require("../../server/models");

const TotList = function(props) {
    // console.log(props);
    if (props.tots.length === 0) {
        return (
            <div className="totList">
                <h3 className="emptyTot">You haven't made any Tots yet</h3>
            </div>
        );
    }

    const totNodes = props.tots.map(function(tot) {

        return (
            <div key={tot._id} className="tot">
                <section id="ownerSection">
                <h3 className="totOwner"> Owner: </h3> <h3 className="totOwner" id="owner">{tot.owner}</h3>
                </section>
                <h3 className="totItem"> Item 1: {tot.item1} | Wins: {tot.wins1} </h3>
                <h3 className="totItem"> Item 2: {tot.item2} | Wins: {tot.wins2} </h3>
                <button className="totButton" id="deleteButton" onClick={ () => handleDelete(tot, props.csrf) }>Delete</button>
            </div>
        );
    });

    return (
        <div className="totList">
            {totNodes}
        </div>
    );
};

const handleDelete = (data, csrf) => {

    console.log("tot delete attempted");
    console.log(data);

    data.csrf = csrf;

    sendAjax('DELETE', '/delete', data, (data) => {
        setup(data.csrf);
    });
};

const handlePassChange = (e) => {
    e.preventDefault();

    $("#totMessage").animate({width: 'hide'}, 350);

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

const ChangePassForm = (props) => {
    return (
        <form
            id="changePassForm"
            name="changePassForm"
            onSubmit={handlePassChange}
            action="/changePass"
            method="POST"
            className="changePassForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="oldPass"> Current Password: </label>
            <input id="oldPass" type="password" name="oldPass" placeholder="current password"/>
            <label htmlFor="newPass"> New Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="new password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="totButton" id="changePassSubmit" type="submit" value="Submit" />
        </form>
    );
};

const createChangePassForm = (csrf) => {
    ReactDOM.render(
        <ChangePassForm csrf={csrf} />,
        document.querySelector("#changePass")
    );
};

const setup = (csrf) => {
    sendAjax('GET', '/getAllTots', null, (data) => {
        ReactDOM.render(
            <TotList tots = {data.tots} csrf={csrf} />, document.querySelector("#tots")
        );
    });

    const changePassButton = document.querySelector("#changePassButton");

    changePassButton.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePassForm(csrf);
        return false;
    });
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});