 /*
  * MSAL Configuration Setup
  */
const msalConfig = {
    auth: {
        clientId: "42415a6b-2204-4b21-a31e-ee9db4576856",
        authority: "https://login.microsoftonline.com/a53b7f37-b2ed-42ba-968b-e6a846f30c21",
        redirectUri: 'https://dlinbeck.github.io/',
        navigateToLoginRequestUrl: false,
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