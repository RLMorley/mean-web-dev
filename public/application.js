var mainApplicationModuleName = 'mean'

var mainApplicationModule = angular.module(mainApplicationModuleName, 
	['ngRoute', 'ngResource', 'users', 'example', 'articles', 'chat']);

mainApplicationModule.config(['$locationProvider',
    function($locationProvider)
    {
        $locationProvider.hashPrefix('!');
    }
]);

// Fixes the Facebook authentication bug (Usefull in case I ever decide to impement the OAuth using Facebook)
if (window.location.hash === '#_=_') window.location.hash = '#!';

angular.element(document).ready(function()
{
    angular.bootstrap(document, [mainApplicationModuleName]);
});
