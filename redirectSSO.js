
/*
 * ===== Handling MSAL Redirect =====
 */
//const msalInstance = new msal.PublicClientApplication(msalConfig);
/*
msalInstance.initialize().then(() => {
    msalInstance.handleRedirectPromise()
        .then(handleResponse)
        .catch(error => {
            console.log("ERROR: " + error);
        });
})
*/
msalInstance.handleRedirectPromise()
    .then(handleResponse)
    .catch((error) => {
        console.log("ERROR", error);         
});

function handleResponse(response) {
    if (response !== null) {
        username = response.account.username;
        console.log("SUCCESS: " + username);
        console.log(response);
        //document.getElementById("vResult").value = "true";
        //query other needed info before return
        //document.redirectSSO.submit(); //send back through 4D
        //$.post(document.getElementById('Result').value;

    } else {
        console.log("FAILURE: null response");
        console.log(response);
        //document.getElementById("vResult").value = "false";
        //document.redirectSSO.submit();
        const currentAccounts = msalInstance.getAllAccounts();
        console.log("currentAcounts: " + currentAccounts);
        console.log("hash: " + window.location.hash);
    }
}