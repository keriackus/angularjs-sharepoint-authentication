﻿angular.module('app').service('SharepointOnlineAuthenticator', ['$q', '$http',function ($q, $http) {
    var self = this;
     self.authenticate= function (username, password, _url) {
        var url = _url;

        var deferred = $q.defer();
        var promise = deferred.promise;

        var req = {
            method: 'POST',
            url: 'https://login.microsoftonline.com/extSTS.srf',
            headers: {
                Accept: "application/soap+xml; charset=utf-8"
            },
            data: getSAMLRequest(username, password, url)
        };
        $http(req).success(function (data) {

            var t = get_t(data);
            if (!t) {

                deferred.reject();
                return;
            }
            req = {
                'method': 'POST',
                'url': url + '/_forms/default.aspx?wa=wsignin1.0',
               
                data: t,
            };
            $http(req).success(function (data, status, headers) {

                req = {
                    'method': 'GET',
                    'url': url + '/_api/web/title',
                    headers: {
                        Accept: "text"
                    }
                };
                $http(req).success(function (data) {
                    deferred.resolve(data);
                }).error(function (err) {
                    deferred.reject(err);
                });
            }).error(function (err) {
                deferred.reject(err);
            });
        }).error(function (err) {
            deferred.reject(err);
        });
        return promise;
    };

    function getSAMLRequest(username, password, url) {

        var template = '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> <s:Header> <a:Action s:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action> <a:ReplyTo> <a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address> </a:ReplyTo> <a:To s:mustUnderstand="1">https://login.microsoftonline.com/extSTS.srf</a:To> <o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"> <o:UsernameToken> <o:Username>' + username + '</o:Username> <o:Password>' + password + '</o:Password> </o:UsernameToken> </o:Security> </s:Header> <s:Body> <t:RequestSecurityToken xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust"> <wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy"> <a:EndpointReference> <a:Address>' + url + '</a:Address> </a:EndpointReference> </wsp:AppliesTo> <t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType> <t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType> <t:TokenType>urn:oasis:names:tc:SAML:1.0:assertion</t:TokenType> </t:RequestSecurityToken> </s:Body> </s:Envelope>';

        return template;
    }
    function get_t(env) {
        var t = null;
        var arr = env.split('<wsse:BinarySecurityToken Id=\"Compact0\">');
        if (arr && arr.length > 1) {
            var arr2 = arr[1].split('</wsse:BinarySecurityToken>');
            if (arr2 && arr2.length > 0)
                t = arr2[0];
        }

        return t;
    }
}]);
