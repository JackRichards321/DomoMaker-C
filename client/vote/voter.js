/*
/ ADDED - HandleVote
/ handles vote-related errors and posts the vote to the server if applicable.
*/
const handleVote = (e) => {
    e.preventDefault();

    $("#totMessage").animate({ width: 'hide' }, 350);

    let items = document.getElementsByName('item');
    let winner;

    for (let i = 0; i < items.length; i++) {
        if (items[i].checked) {
            winner = items[i].value;
        }
    }

    // console.log("winner: ");
    // console.log(winner);

    if ($("#voteItem1").val() == '' && $("#voteItem2").val() == '') {
        handleError("Choose one before submitting");
        return false;
    }

    // console.log("serialized data: ");
    // console.log($("#voteForm").serializeArray());

    sendAjax('POST', $("#voteForm").attr("action"), $("#voteForm").serialize(), function () {
        loadResults($("#voteForm").serialize());
    });

    return false;
};

/*
/ VoteForm - based on TotForm, allows user to vote and sends all data to the router
*/
const VoteForm = (props) => {

    // console.log("voteForm props: ");
    // console.log(props);

    return (
        <section id="voteSection">
            <form
                id="voteForm"
                name="voteForm"
                onSubmit={handleVote}
                action="/voter"
                method="POST"
                className="voteForm"
            >
                <input id="voteItem1" type="radio" name="item" value={props.tot.item1} placeholder="Tot Item 1" />
                <label htmlFor="voteItem1" id="voteLabel1" >{props.tot.item1}</label>
                <input className="totButton" id="voteSubmitButton" type="submit" value="Submit Vote!" />
                <input id="voteItem2" type="radio" name="item" value={props.tot.item2} placeholder="Tot Item 2" />
                <label htmlFor="voteItem2" id="voteLabel2" >{props.tot.item2}</label>
                <input type="hidden" name="item1" value={props.tot.item1} />
                <input type="hidden" name="item2" value={props.tot.item2} />
                <input type="hidden" name="wins1" value={props.tot.wins1} />
                <input type="hidden" name="wins2" value={props.tot.wins2} />
                <input type="hidden" name="id" value={props.tot._id} />
                <input type="hidden" name="_csrf" value={props.csrf} />
            </form>
            <button className="totButton" id="seeAnotherButton" onClick={getToken}>See Another ToT</button>
        </section>
    );
};

/*
/ ADDED - Results
/ A React function component that shows the current standings of a ToT
*/
const Results = (props) => {

    console.log("props: ");
    console.log(props);

    if (props.props.item === props.props.item1) {
        const wins1Num = parseInt(props.props.wins1);
        return (
            <div id="results">
                <label className="resultLabel" id="voteLabel1">{props.props.item1} wins: {wins1Num + 1}</label>
                <button className="totButton" id="seeNextButton" onClick={getToken}>NEXT</button>
                <label className="resultLabel" id="voteLabel2">{props.props.item2} wins: {props.props.wins2}</label>
            </div>
        );
    } else if (props.props.item === props.props.item2) {
        const wins2Num = parseInt(props.props.wins2);
        return (
            <div id="results">
                <label className="resultLabel" id="voteLabel1">{props.props.item1} wins: {props.props.wins1}</label>
                <button className="totButton" id="seeNextButton" onClick={getToken}>NEXT</button>
                <label className="resultLabel" id="voteLabel2">{props.props.item2} wins: {wins2Num + 1}</label>
            </div>
        );
    }
};

/*
/ ADDED - getVariables
/ loosely based on Luke's answer at
/ https://stackoverflow.com/questions/9856587/is-there-an-inverse-function-to-jquery-serialize
/ essentially 'deserializes' a jQuery serialized string, back to an object
*/
const getVariables = (str) => {
    str = str.replace('/\+/g', '%20');
    let arr = str.split("&");
    let obj = {};

    arr.forEach(pair => {
        let nameValue = pair.split("=");
        let name = decodeURIComponent(nameValue[0].replaceAll('+', ' ')); // (C)
        let value = decodeURIComponent(nameValue[1].replaceAll('+', ' '));

        obj[name] = value;
    });
    return obj;
};

/*
/ ADDED - LoadResults
/ renders a Results component after a user votes
*/
const loadResults = (data) => {
    // console.log("data: ");
    // console.log(data);

    const objData = getVariables(data);

    // console.log("objData: ");
    // console.log(objData);

    ReactDOM.render(
        <div id="resultsDiv">
            <Results props={objData} />
        </div>, document.querySelector("#voteTot")
    );
}

const setup = function (csrf) {
    sendAjax('GET', '/getTot', null, (data) => {

        // console.log("data: ");
        // console.log(data);

        ReactDOM.render(
            <VoteForm tot={data.tot} csrf={csrf} />, document.querySelector("#voteTot")
        );
    });
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});