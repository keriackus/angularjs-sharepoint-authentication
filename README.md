# angularjs-sharepoint-authentication 


## This simple angularJS service allows you to authenticate to sharepoint online.

**It's by default added to an angular module named app. don't forget to change the module name to your desired module.**


## Inject 'SharepointOnlineAuthenticator' service.
## Then use it's single function  _authenticate()_ as follows.

This function returns a promise.


SharepointOnlineAuthenticator.authenticate(username, password, url).then(function(
//handle success
), function(err){
//handle error
});

_the url is the full url of your sharepoint app _
_ex: https://xyz-62974b2f5d0e47.sharepoint.com_