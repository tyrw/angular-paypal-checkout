(function () {
  'use strict'
  angular.module('paypal-checkout', [])

  angular
    .module('paypal-checkout')
    .directive('paypalCheckout', paypalCheckout)

  function paypalCheckout ($http, $q, $timeout) {
    return {
      templateUrl: 'paypal-checkout.html',
      restrict: 'EA',
      scope: {},
      link: function(scope, ele, attrs) {
        var environment = 'sandbox'       // CHANGE AS NEEDED
        var merchantId  = '6XF3MPZBZV6HU' // YOUR MERCHANT ID HERE (or import with scope)
        var req = {
          method: 'POST',
          url: 'http://foo.bar',          // YOUR SERVER HERE (or import with scope)
          data: { foo: 'bar' }            // YOUR DATA HERE (or import with scope)
        }
        scope.showButton = false

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

        function showButton() {
          scope.showButton = true
          scope.$apply()
        }

        function delayAndShowButton() {
          $timeout(showButton, 1000)
        }

        function loadPaypalButton() {
          paypal.checkout.setup(merchantId, {
            environment: environment,
            buttons: [{ container: 't1', shape: 'rect', size: 'medium' }]
          })
          delayAndShowButton()
        }

        scope.initPaypal = function() {
          if (scope.showButton == false) { return }
          paypal.checkout.initXO()
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
          scope.showButton = true
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
  }
})()
