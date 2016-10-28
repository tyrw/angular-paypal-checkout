(function() {
  /* globals paypal */
  'use strict';

  angular.module('paypal-checkout', [])
    .directive('paypalCheckout', function($timeout) {
      return {
        templateUrl: 'paypal-checkout.html',
        restrict: 'EA',
        scope: {
          info: '=info'
        },
        link: function(scope) {

          scope.showButton = false;

          function showButton() {
            scope.showButton = true;
            scope.$apply();
          }

          function delayAndShowButton() {
            $timeout(showButton, 1000);
          }

          function loadPaypalButton() {
            paypal.checkout.setup(scope.info.merchantId, {
              environment: scope.info.environment,
              buttons: [{ container: 't1', shape: 'rect', size: 'medium' }]
            });
            delayAndShowButton();
          }

          scope.initPaypal = function() {
            if (scope.showButton === false) { return; }
            paypal.checkout.initXO();
            return scope.info.url()
              .then(function(url) {
                return paypal.checkout.startFlow(url);
              })
              .catch(function(err) {
                console.log('Problem with checkout flow', err);
                return paypal.checkout.closeFlow();
              });
          };

          if (!!window.paypalCheckoutReady) {
            scope.showButton = true;
          } else {
            var s = document.createElement('script');
            s.src = '//www.paypalobjects.com/api/checkout.js';
            document.body.appendChild(s);
            window.paypalCheckoutReady = function() {
              return loadPaypalButton();
            };
          }

        }
      };
    });
})();
