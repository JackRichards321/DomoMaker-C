const handleTot = (e) => {
    e.preventDefault();

    $("#totMessage").animate({width: 'hide'}, 350);

    if ($("#totItem1").val() == '' || $("#totItem2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    //if ($("#totItem1").val() == ) { cannot do repeat tots

    //}

    sendAjax('POST', $("#totForm").attr("action"), $("#totForm").serialize(), function() {
        loadTotsFromServer();
    });

    return false;
};

const TotForm = (props) => {
    return (
        <form 
            id="totForm" 
            name="totForm"
            onSubmit={handleTot}
            action="/maker"
            method="POST"
            className="totForm"
        >
            <label htmlFor="item1">Item 1: </label>
            <input id="totItem1" type="text" name="item1" placeholder="Tot Item 1"/>
            <label htmlFor="item2">Item 2: </label>
            <input id="totItem2" type="text" name="item2" placeholder="Tot Item 2"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeTotSubmit" type="submit" value="Make Tot" />
        </form>
    );
};

const TotList = function(props) {
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
                <h3 classname="totItem"> Item 1: {tot.item1} </h3>
                <h3 classname="totItem"> Item 2: {tot.item2} </h3>
            </div>
        );
    });

    return (
        <div className="totList">
            {totNodes}
        </div>
    );
};

const loadTotsFromServer = () => {
    sendAjax('GET', '/getTots', null, (data) => {
        ReactDOM.render(
            <TotList tots = {data.tots} />, document.querySelector("#tots")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <TotForm csrf={csrf} />, document.querySelector("#makeTot")
    );

    ReactDOM.render(
        <TotList tots={[]} />, document.querySelector("#tots")
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