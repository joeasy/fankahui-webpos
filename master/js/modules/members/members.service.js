(function() {
    'use strict';

    angular
        .module('app.members')
        .service('qrcodeService', qrcodeService);

    qrcodeService.$inject = ['ngDialog'];
    function qrcodeService(ngDialog) {
      var self = this;
      
      this.showQRCode = showQRCode;
      
      function showQRCode(imageurl) {
        imageurl = imageurl || 'app/img/qrcode-for-gh.jpg';
        ngDialog.open({
          template: "<img src="+imageurl+" class='img-responsive'>",
          plain: true,
          className: 'ngdialog-theme-default'
        });    
      }
    }

})();
