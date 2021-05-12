const ErrorMessage = () => {
    return (
        <div id="error">
            <h3>Error 404 - Page not found :-(</h3>
            <p>Are you sure you entered the URL correctly?</p>
            <p>Use the nav bar above to redirect yourself</p>
        </div>
    )
}

const displayError = () => {
    ReactDOM.render(
        <ErrorMessage />, 
        document.querySelector("#error")
    );
}

$(document).ready(function () {
    displayError();
});