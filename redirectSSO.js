 /*
  * MSAL Configuration Setup <script src="configSSO.js"></script>
  */
const msalConfig = {
    auth: {
        clientId: "42415a6b-2204-4b21-a31e-ee9db4576856",
        authority: "https://login.microsoftonline.com/a53b7f37-b2ed-42ba-968b-e6a846f30c21",
        //redirectUri: 'https://dlinbeck.github.io/',
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
    state: "test", // holds request through MSAL process
};

const silentRequest = {
    scopes: [],
    loginHint: "user@linbeck.com", //placeholder
    state: "test",
}

const msalInstance = new msal.PublicClientApplication(msalConfig);
//await msalInstance.initialize();

/*
 * ===== BLOCK =====
 */
window.addEventListener("load", _ => {
    let loginBtn;
    let silentBtn;
    let redirBtn;

    loginBtn = document.getElementById("login-btn");
    silentBtn = document.getElementById("silent-btn");
    redirBtn = document.getElementById("redirect-btn");

    loginBtn.onclick=async() => {
        silentRequest.loginHint = "dlinbeck@linbeck.com"
        try {
            const loginResponse = await msalInstance.loginPopup(silentRequest);
            console.log("SUCCESS - POPUP");
            console.log(loginResponse);
        } catch (err) {
            console.log("FAIL");
        }

    };

    silentBtn.onclick=async() => {
        silentRequest.loginHint = "dlinbeck@linbeck.com"
        try {
            const loginResponse = await msalInstance.ssoSilent(silentRequest);
            console.log("SUCCESS - SILENT");
            console.log(loginResponse);
        } catch (err) {
            if (err instanceof InteractionRequiredAuthError) {
                const loginResponse = await msalInstance
                    .loginPopup(silentRequest)
                    .catch((error) => {
                        console.log("FAIL: " + error);
                    });
                console.log("SUCCESS - POPUP");
                console.log(loginResponse);
            } else {
                console.log("FAIL SILENT: " + err);
            }
        }
    };

    loginBtn.addEventListener('click', _ => loginRedir());

}); // end onload

// redirect login
function loginRedir() {
    silentRequest.loginHint = "dlinbeck@linbeck.com";
    msalInstance.loginRedirect(silentRequest);
}

// redirect return handling

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