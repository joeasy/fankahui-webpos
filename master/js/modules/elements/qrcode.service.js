(function() {
    'use strict';

    angular
        .module('app.elements')
        .service('qrcodeService', qrcodeService);

    qrcodeService.$inject = ['ngDialog', 'Wxuser'];
    function qrcodeService(ngDialog, Wxuser) {
      var self = this;
      var urlBase = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=';

      this.showQRCode = showQRCode;
      this.showRegisterQRCode = showRegisterQRCode;

      function showQRCode(imageurl) {
        imageurl = imageurl || 'app/img/qrcode-for-gh.jpg';
        ngDialog.open({
          template: "<img src="+imageurl+" class='img-responsive'>",
          plain: true,
          className: 'ngdialog-theme-default'
        });
      }

      function showRegisterQRCode() {
        Wxuser.getQRCode({param: {sceneId: "1"}}).$promise
        .then(function (data) {
          showQRCode(urlBase+data.ticket);
        });
      }
    }

})();
