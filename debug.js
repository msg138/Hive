

/*/THis is a debug javascript file. This should be removed before release.
var loadingTimeout = setInterval(function(){
    if(Lemonade.loadingScreen !== undefined)
        Lemonade.loadingScreen = undefined;
}, 1000);// Every 1 seconds remove loading screen.*/