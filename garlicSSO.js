
/* =============================
       MSAL Configuration
============================= */

const msalConfig = {
    auth: {
        clientId: "42415a6b-2204-4b21-a31e-ee9db4576856",
        authority: "https://login.microsoftonline.com/a53b7f37-b2ed-42ba-968b-e6a846f30c21",
        redirectUri: 'https://dlinbeck.github.io/',
        //navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case msal.LogLevel.Error:
                        console.error(message);
                        return;
                    case msal.LogLevel.Info:
                        console.info(message);
                        return;
                    case msal.LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case msal.LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            },
        },
    },
};

// ----- Authorization Request Types ----- //
const defaultRequest = {
    scopes: [],
    prompt: "login",
    loginHint: "user@linbeck.com", //placeholder, filled in by user input
    state: "request", // holds request through MSAL process
};

const silentRequest = {
    scopes: [],
    loginHint: "user@linbeck.com", //placeholder
    state: "request",
}

const msalInstance = new msal.PublicClientApplication(msalConfig);

/* =============================
          Main Methods
============================= */

let loginBtn;
let usernameInput;

const ENTER = 13;
const TAB = 9;

window.addEventListener("load", _ => {

    usernameInput = document.getElementById("username");
    loginBtn = document.getElementById("login-btn");

    // ----- Username ----- //
    usernameInput.addEventListener('focus', _ => usernameInput.select());

    // Enter/tab on username bar
    usernameInput.addEventListener('keydown', e => {
        if (e.keyCode === ENTER || e.keyCode === TAB) {
            runRedirect();
        }
    });

    loginBtn.addEventListener('click', _ => runRedirect());
});

function runRedirect() { // processes entered username
    let username = usernameInput.value;
    silentRequest.loginHint = username;

    msalInstance.loginRedirect(silentRequest);
}

/* =============================
        Handling Redirect
============================= */

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
        //$.post to server

    } else {
        console.log("FAILURE: null response");
        console.log(response);
        const currentAccounts = msalInstance.getAllAccounts();
        console.log("currentAcounts: " + currentAccounts);
        console.log("hash: " + window.location.hash);
    }
}