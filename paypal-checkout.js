'use strict';
var module = angular.module('paypal-checkout', []);

module.directive("paypalCheckout", function($http, $q) {
  return {
    templateUrl: 'components/paypal-checkout.html',
    restrict: 'EA',
    scope: {},
    link: function(scope, ele, attrs) {
      var merchantId = '6XF3MPZBZV6HU' // YOUR MERCHANT ID HERE (or import with scope)
      var dataToYourServer = {} // YOUR DATA HERE (or import with scope)
      var urlToYourServer = 'http://foo.bar' // YOUR SERVER HERE (or import with scope)
      var req = {
        method: 'POST',
        url: urlToYourServer,
        data: dataToYourServer
      }

      function sendRequest(data) {
        var deferred = $q.defer()
        $http(data)
          .success(function(data, status) {
            return deferred.resolve(data)
          }).error(function(data, status) {
            if (status === 0) { data = 'Connection error' }
            return deferred.reject(data)
          })
        return deferred.promise
      }
      
      function loadPaypalButton() {
        return paypal.checkout.setup(merchantId, {
          environment: 'sandbox',
          buttons: [{ container: 't1', shape: 'rect', size: 'medium' }]
        })
      }
      
      scope.initPaypal = function() {
        return sendRequest(req)
          .then(function(res) {
            return paypal.checkout.startFlow(res.href)
          })
          .catch(function(err) {
            console.log('Problem with checkout flow', err)
            return paypal.checkout.closeFlow()
          })
      }
      
      if (window.paypalCheckoutReady != null) {
        loadPaypalButton()
      } else {
        var s = document.createElement('script')
        s.src = '//www.paypalobjects.com/api/checkout.js'
        document.body.appendChild(s)
        window.paypalCheckoutReady = function() {
          return loadPaypalButton()
        }
      }
    }
  }
})
