const handleVote = (e) => {
    e.preventDefault();

    //$("#totMessage").animate({width: 'hide'}, 350);

    if ($("#voteItem1").val() == '' && $("#voteItem2").val() == '') {
        handleError("Choose one before submitting");
        return false;
    }

    sendAjax('POST', $("#voteForm").attr("action"), $("#voteForm").serialize(), function() {
        loadTotFromServer();
    });

    return false;
};


const VoteForm = (props) => {
    console.log(props);
    return (
        <form 
            id="voteForm" 
            name="voteForm"
            onSubmit={handleVote}
            action="/voter"
            method="POST"
            className="voteForm"
        >
            <label htmlFor="item1">{props.item1}</label>
            <input id="voteItem1" type="radio" name="item1" placeholder="Tot Item 1" />
            <label htmlFor="item2">{props.item2}</label>
            <input id="voteItem2" type="radio" name="item2" placeholder="Tot Item 2" />
            <input className="makeTotSubmit" type="submit" value="Submit Vote!" />
        </form>
    );
};

const VoteList = function(props) {
    if (props.tot.length === 0) {
        return (
            <div className="totList">
                <h3 className="emptyTot">You haven't made any Tots yet</h3>
            </div>
        );
    }

    const totNodes = function(tot) {
        return (
            <div key={tot._id} className="tot">
                <h3 classname="totItem"> Item 1: {tot.item1} </h3>
                <h3 classname="totItem"> Item 2: {tot.item2} </h3>
            </div>
        );
        }

    return (
        <div className="totList">
            {totNodes}
        </div>
    );
};

const loadTotFromServer = () => {
    sendAjax('GET', '/getTot', null, (data) => {
        ReactDOM.render(
            <VoteList tot = {data.tot} />, document.querySelector("#tots")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <VoteForm csrf={csrf} />, document.querySelector("#voteTot")
    );

    ReactDOM.render(
        <VoteList tots={[]} />, document.querySelector("#tots")
    );

    loadTotsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});