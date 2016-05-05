/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var wxjssdk = __webpack_require__(1);

	var data = {};

	wxjssdk.config({ jsApiList: ['closeWindow'] });
	wx.ready(function () {
	  wxjssdk.getUser(function (user) {
	    data.name = user.nickname;
	    data.headimgurl = user.headimgurl;
	    data.wxuserId = user.id;
	    $('#nickname').html(user.nickname);
	    $('#avatar').attr("src", user.headimgurl);
	    $('#wxuserProfile').html(user.province + " " + user.city);
	  });
	});

	function validate() {
	  var valid = true;
	  $('input').each(function (index, dom) {
	    if (valid) valid = dom.validity.valid;
	    var inputSelector = $('input[name=' + dom.name + ']');
	    if (!dom.validity.valid) {
	      inputSelector.parent().parent().addClass('weui_cell_warn');
	    } else {
	      inputSelector.parent().parent().removeClass('weui_cell_warn');
	      data[dom.name] = dom.value;
	    }
	  });
	  return valid;
	}

	$('#btnSubmit').click(function () {
	  if (validate()) {
	    data.username = data.phone;
	    data.email = data.phone + '@fankahui.com';
	    data.realm = 'merchant';
	    data.role = 'owner';

	    $.showLoading('正在注册...');
	    $.ajax({
	      url: wxjssdk.apiBaseUrl + "/users",
	      method: "POST",
	      data: data,
	      crossDomain: true,
	      success: function (data) {
	        $.hideLoading();
	        $.alert("您已经成功注册", "成功", function () {
	          wx.closeWindow();
	        });
	      },
	      error: function (res) {
	        $.hideLoading();

	        var errorMsg = {
	          'wxuserId is not unique': '微信用户已经注册过商户',
	          'User already exists': '手机号已经被其他用户注册过',
	          'Merchant name exist': '商户名已经被占用',
	          'Merchant owner without wxuserId': '缺少商户老板微信资料'
	        };
	        var msg = "";
	        var error = res.responseJSON.error;
	        for (var key in errorMsg) {
	          if (new RegExp(key, 'i').test(error.message)) {
	            msg = errorMsg[key];
	            break;
	          }
	        }
	        if (msg === "") msg = error.message;
	        $.toast(msg, "cancel");
	      }
	    });
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	//! wechat.js
	//! version : 0.1.0
	//! authors : guanbo2002@gmail.com
	//! license : MIT

	__webpack_require__(2);
	__webpack_require__(6);

	function getUrlVars() {
	  var vars = [],
	      hash;
	  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	  for (var i = 0; i < hashes.length; i++) {
	    hash = hashes[i].split('=');
	    vars.push(hash[0]);
	    vars[hash[0]] = hash[1];
	  }
	  return vars;
	}

	var apiBaseUrl = "http://wechat.fankahui.com/api";
	var wxjssdk = {
	  apiBaseUrl: apiBaseUrl,
	  config: function (param, success, error) {
	    param = param || {/*debug: true*/};
	    param.url = window.location.href;
	    $.ajax({
	      url: apiBaseUrl + "/wxusers/getjsconfig",
	      data: {
	        param: param
	      },
	      crossDomain: true,
	      success: success || function (data) {
	        wx.config(data);
	      },
	      error: error || function (res) {
	        console.log(res);
	      }
	    });
	  },
	  getOAuth: function (success, error) {
	    success = success || function (accesstoken) {
	      console.log(accesstoken);
	    };
	    error = error || function (res) {
	      console.log(res);
	    };
	    var code = getUrlVars().code;
	    if (!code) {
	      return error('no code');
	    }

	    $.ajax({
	      url: apiBaseUrl + "/wxusers/getoauthaccesstoken",
	      data: {
	        code: code
	      },
	      crossDomain: true,
	      success: success,
	      error: error
	    });
	  },
	  getUser: function (success, error) {
	    success = success || function (user) {
	      wxjssdk.setCookie('wxuser', JSON.stringify(user));
	    };
	    error = error || function (res) {
	      var cachedUser = wxjssdk.getCookie('wxuser');
	      if (cachedUser) return success(JSON.parse(cachedUser));
	      console.log(res);
	    };
	    var code = getUrlVars().code;
	    if (!code) {
	      return error('no code');
	    }

	    $.ajax({
	      url: apiBaseUrl + "/wxusers/getuserbycode",
	      data: {
	        code: code
	      },
	      crossDomain: true,
	      success: success,
	      error: error
	    });
	  },
	  setCookie: function (name, value) {
	    var Days = 30;
	    var exp = new Date();
	    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	  },
	  getCookie: function (name) {
	    var arr,
	        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	    if (arr = document.cookie.match(reg)) return unescape(arr[2]);else return null;
	  },
	  getParameterByName: function (name, url) {
	    if (!url) url = window.location.href;
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	  }
	};

	module.exports = wxjssdk;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../css-loader/index.js!./jquery-weui.css", function() {
				var newContent = require("!!./../../../css-loader/index.js!./jquery-weui.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "/** \n* jQuery WeUI V0.6.0 \n* By 言川\n* http://lihongxun945.github.io/jquery-weui/\n */\n.preloader {\n  width: 20px;\n  height: 20px;\n  -webkit-transform-origin: 50%;\n          transform-origin: 50%;\n  -webkit-animation: preloader-spin 1s steps(12, end) infinite;\n          animation: preloader-spin 1s steps(12, end) infinite;\n}\n.preloader:after {\n  display: block;\n  width: 100%;\n  height: 100%;\n  content: \"\";\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");\n  background-repeat: no-repeat;\n  background-position: 50%;\n  background-size: 100%;\n}\n@-webkit-keyframes preloader-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n@keyframes preloader-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n/*\n.hairline(@position, @color) when (@position = top) {\n  border-top: 1px solid @color;\n}\n.hairline(@position, @color) when (@position = left) {\n  border-left: 1px solid @color;\n}\n.hairline(@position, @color) when (@position = bottom) {\n  border-bottom: 1px solid @color;\n}\n.hairline(@position, @color) when (@position = right) {\n  border-right: 1px solid @color;\n}\n// For right and bottom\n.hairline-remove(@position) when not (@position = left) and not (@position = top) {\n  border-left: 0;\n  border-bottom: 0;\n}\n// For left and top\n.hairline-remove(@position) when not (@position = right) and not (@position = bottom) {\n  border-right: 0;\n  border-top: 0;\n}\n// For right and bottom\n.hairline-color(@position, @color) when not (@position = left) and not (@position = top) {\n  border-right-color: @color;\n  border-bottom-color: @color;\n}\n// For left and top\n.hairline-color(@position, @color) when not (@position = right) and not (@position = bottom) {\n  border-left-color: @color;\n  border-top-color: @color;\n}\n*/\nhtml {\n  font-size: 20px;\n}\nbody {\n  font-size: 16px;\n}\n@media only screen and (min-width: 400px) {\n  html {\n    font-size: 21.33333333px !important;\n  }\n}\n@media only screen and (min-width: 414px) {\n  html {\n    font-size: 22.08px !important;\n  }\n}\n@media only screen and (min-width: 480px) {\n  html {\n    font-size: 25.6px !important;\n  }\n}\n/* === Grid === */\n.weui-row {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-pack: justify;\n  -ms-flex-pack: justify;\n  -webkit-justify-content: space-between;\n  justify-content: space-between;\n  -webkit-box-lines: multiple;\n  -moz-box-lines: multiple;\n  -webkit-flex-wrap: wrap;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  -webkit-box-align: start;\n  -ms-flex-align: start;\n  -webkit-align-items: flex-start;\n  align-items: flex-start;\n}\n.weui-row > [class*=\"col-\"] {\n  box-sizing: border-box;\n}\n.weui-row .col-auto {\n  width: 100%;\n}\n.weui-row .weui-col-100 {\n  width: 100%;\n  width: calc((100% - 15px*0) / 1);\n}\n.weui-row.weui-no-gutter .weui-col-100 {\n  width: 100%;\n}\n.weui-row .weui-col-95 {\n  width: 95%;\n  width: calc((100% - 15px*0.05263157894736836) / 1.0526315789473684);\n}\n.weui-row.weui-no-gutter .weui-col-95 {\n  width: 95%;\n}\n.weui-row .weui-col-90 {\n  width: 90%;\n  width: calc((100% - 15px*0.11111111111111116) / 1.1111111111111112);\n}\n.weui-row.weui-no-gutter .weui-col-90 {\n  width: 90%;\n}\n.weui-row .weui-col-85 {\n  width: 85%;\n  width: calc((100% - 15px*0.17647058823529416) / 1.1764705882352942);\n}\n.weui-row.weui-no-gutter .weui-col-85 {\n  width: 85%;\n}\n.weui-row .weui-col-80 {\n  width: 80%;\n  width: calc((100% - 15px*0.25) / 1.25);\n}\n.weui-row.weui-no-gutter .weui-col-80 {\n  width: 80%;\n}\n.weui-row .weui-col-75 {\n  width: 75%;\n  width: calc((100% - 15px*0.33333333333333326) / 1.3333333333333333);\n}\n.weui-row.weui-no-gutter .weui-col-75 {\n  width: 75%;\n}\n.weui-row .weui-col-66 {\n  width: 66.66666666666666%;\n  width: calc((100% - 15px*0.5000000000000002) / 1.5000000000000002);\n}\n.weui-row.weui-no-gutter .weui-col-66 {\n  width: 66.66666666666666%;\n}\n.weui-row .weui-col-60 {\n  width: 60%;\n  width: calc((100% - 15px*0.6666666666666667) / 1.6666666666666667);\n}\n.weui-row.weui-no-gutter .weui-col-60 {\n  width: 60%;\n}\n.weui-row .weui-col-50 {\n  width: 50%;\n  width: calc((100% - 15px*1) / 2);\n}\n.weui-row.weui-no-gutter .weui-col-50 {\n  width: 50%;\n}\n.weui-row .weui-col-40 {\n  width: 40%;\n  width: calc((100% - 15px*1.5) / 2.5);\n}\n.weui-row.weui-no-gutter .weui-col-40 {\n  width: 40%;\n}\n.weui-row .weui-col-33 {\n  width: 33.333333333333336%;\n  width: calc((100% - 15px*2) / 3);\n}\n.weui-row.weui-no-gutter .weui-col-33 {\n  width: 33.333333333333336%;\n}\n.weui-row .weui-col-25 {\n  width: 25%;\n  width: calc((100% - 15px*3) / 4);\n}\n.weui-row.weui-no-gutter .weui-col-25 {\n  width: 25%;\n}\n.weui-row .weui-col-20 {\n  width: 20%;\n  width: calc((100% - 15px*4) / 5);\n}\n.weui-row.weui-no-gutter .weui-col-20 {\n  width: 20%;\n}\n.weui-row .weui-col-15 {\n  width: 15%;\n  width: calc((100% - 15px*5.666666666666667) / 6.666666666666667);\n}\n.weui-row.weui-no-gutter .weui-col-15 {\n  width: 15%;\n}\n.weui-row .weui-col-10 {\n  width: 10%;\n  width: calc((100% - 15px*9) / 10);\n}\n.weui-row.weui-no-gutter .weui-col-10 {\n  width: 10%;\n}\n.weui-row .weui-col-5 {\n  width: 5%;\n  width: calc((100% - 15px*19) / 20);\n}\n.weui-row.weui-no-gutter .weui-col-5 {\n  width: 5%;\n}\n.weui-row .weui-col-auto:nth-last-child(1),\n.weui-row .weui-col-auto:nth-last-child(1) ~ .weui-col-auto {\n  width: 100%;\n  width: calc((100% - 15px*0) / 1);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(1),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(1) ~ .weui-col-auto {\n  width: 100%;\n}\n.weui-row .weui-col-auto:nth-last-child(2),\n.weui-row .weui-col-auto:nth-last-child(2) ~ .weui-col-auto {\n  width: 50%;\n  width: calc((100% - 15px*1) / 2);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(2),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(2) ~ .weui-col-auto {\n  width: 50%;\n}\n.weui-row .weui-col-auto:nth-last-child(3),\n.weui-row .weui-col-auto:nth-last-child(3) ~ .weui-col-auto {\n  width: 33.33333333%;\n  width: calc((100% - 15px*2) / 3);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(3),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(3) ~ .weui-col-auto {\n  width: 33.33333333%;\n}\n.weui-row .weui-col-auto:nth-last-child(4),\n.weui-row .weui-col-auto:nth-last-child(4) ~ .weui-col-auto {\n  width: 25%;\n  width: calc((100% - 15px*3) / 4);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(4),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(4) ~ .weui-col-auto {\n  width: 25%;\n}\n.weui-row .weui-col-auto:nth-last-child(5),\n.weui-row .weui-col-auto:nth-last-child(5) ~ .weui-col-auto {\n  width: 20%;\n  width: calc((100% - 15px*4) / 5);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(5),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(5) ~ .weui-col-auto {\n  width: 20%;\n}\n.weui-row .weui-col-auto:nth-last-child(6),\n.weui-row .weui-col-auto:nth-last-child(6) ~ .weui-col-auto {\n  width: 16.66666667%;\n  width: calc((100% - 15px*5) / 6);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(6),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(6) ~ .weui-col-auto {\n  width: 16.66666667%;\n}\n.weui-row .weui-col-auto:nth-last-child(7),\n.weui-row .weui-col-auto:nth-last-child(7) ~ .weui-col-auto {\n  width: 14.28571429%;\n  width: calc((100% - 15px*6) / 7);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(7),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(7) ~ .weui-col-auto {\n  width: 14.28571429%;\n}\n.weui-row .weui-col-auto:nth-last-child(8),\n.weui-row .weui-col-auto:nth-last-child(8) ~ .weui-col-auto {\n  width: 12.5%;\n  width: calc((100% - 15px*7) / 8);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(8),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(8) ~ .weui-col-auto {\n  width: 12.5%;\n}\n.weui-row .weui-col-auto:nth-last-child(9),\n.weui-row .weui-col-auto:nth-last-child(9) ~ .weui-col-auto {\n  width: 11.11111111%;\n  width: calc((100% - 15px*8) / 9);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(9),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(9) ~ .weui-col-auto {\n  width: 11.11111111%;\n}\n.weui-row .weui-col-auto:nth-last-child(10),\n.weui-row .weui-col-auto:nth-last-child(10) ~ .weui-col-auto {\n  width: 10%;\n  width: calc((100% - 15px*9) / 10);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(10),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(10) ~ .weui-col-auto {\n  width: 10%;\n}\n.weui-row .weui-col-auto:nth-last-child(11),\n.weui-row .weui-col-auto:nth-last-child(11) ~ .weui-col-auto {\n  width: 9.09090909%;\n  width: calc((100% - 15px*10) / 11);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(11),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(11) ~ .weui-col-auto {\n  width: 9.09090909%;\n}\n.weui-row .weui-col-auto:nth-last-child(12),\n.weui-row .weui-col-auto:nth-last-child(12) ~ .weui-col-auto {\n  width: 8.33333333%;\n  width: calc((100% - 15px*11) / 12);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(12),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(12) ~ .weui-col-auto {\n  width: 8.33333333%;\n}\n.weui-row .weui-col-auto:nth-last-child(13),\n.weui-row .weui-col-auto:nth-last-child(13) ~ .weui-col-auto {\n  width: 7.69230769%;\n  width: calc((100% - 15px*12) / 13);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(13),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(13) ~ .weui-col-auto {\n  width: 7.69230769%;\n}\n.weui-row .weui-col-auto:nth-last-child(14),\n.weui-row .weui-col-auto:nth-last-child(14) ~ .weui-col-auto {\n  width: 7.14285714%;\n  width: calc((100% - 15px*13) / 14);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(14),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(14) ~ .weui-col-auto {\n  width: 7.14285714%;\n}\n.weui-row .weui-col-auto:nth-last-child(15),\n.weui-row .weui-col-auto:nth-last-child(15) ~ .weui-col-auto {\n  width: 6.66666667%;\n  width: calc((100% - 15px*14) / 15);\n}\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(15),\n.weui-row.weui-no-gutter .weui-col-auto:nth-last-child(15) ~ .weui-col-auto {\n  width: 6.66666667%;\n}\n@media all and (min-width: 768px) {\n  .row .tablet-100 {\n    width: 100%;\n    width: calc((100% - 15px*0) / 1);\n  }\n  .row.no-gutter .tablet-100 {\n    width: 100%;\n  }\n  .row .tablet-95 {\n    width: 95%;\n    width: calc((100% - 15px*0.05263157894736836) / 1.0526315789473684);\n  }\n  .row.no-gutter .tablet-95 {\n    width: 95%;\n  }\n  .row .tablet-90 {\n    width: 90%;\n    width: calc((100% - 15px*0.11111111111111116) / 1.1111111111111112);\n  }\n  .row.no-gutter .tablet-90 {\n    width: 90%;\n  }\n  .row .tablet-85 {\n    width: 85%;\n    width: calc((100% - 15px*0.17647058823529416) / 1.1764705882352942);\n  }\n  .row.no-gutter .tablet-85 {\n    width: 85%;\n  }\n  .row .tablet-80 {\n    width: 80%;\n    width: calc((100% - 15px*0.25) / 1.25);\n  }\n  .row.no-gutter .tablet-80 {\n    width: 80%;\n  }\n  .row .tablet-75 {\n    width: 75%;\n    width: calc((100% - 15px*0.33333333333333326) / 1.3333333333333333);\n  }\n  .row.no-gutter .tablet-75 {\n    width: 75%;\n  }\n  .row .tablet-66 {\n    width: 66.66666666666666%;\n    width: calc((100% - 15px*0.5000000000000002) / 1.5000000000000002);\n  }\n  .row.no-gutter .tablet-66 {\n    width: 66.66666666666666%;\n  }\n  .row .tablet-60 {\n    width: 60%;\n    width: calc((100% - 15px*0.6666666666666667) / 1.6666666666666667);\n  }\n  .row.no-gutter .tablet-60 {\n    width: 60%;\n  }\n  .row .tablet-50 {\n    width: 50%;\n    width: calc((100% - 15px*1) / 2);\n  }\n  .row.no-gutter .tablet-50 {\n    width: 50%;\n  }\n  .row .tablet-40 {\n    width: 40%;\n    width: calc((100% - 15px*1.5) / 2.5);\n  }\n  .row.no-gutter .tablet-40 {\n    width: 40%;\n  }\n  .row .tablet-33 {\n    width: 33.333333333333336%;\n    width: calc((100% - 15px*2) / 3);\n  }\n  .row.no-gutter .tablet-33 {\n    width: 33.333333333333336%;\n  }\n  .row .tablet-25 {\n    width: 25%;\n    width: calc((100% - 15px*3) / 4);\n  }\n  .row.no-gutter .tablet-25 {\n    width: 25%;\n  }\n  .row .tablet-20 {\n    width: 20%;\n    width: calc((100% - 15px*4) / 5);\n  }\n  .row.no-gutter .tablet-20 {\n    width: 20%;\n  }\n  .row .tablet-15 {\n    width: 15%;\n    width: calc((100% - 15px*5.666666666666667) / 6.666666666666667);\n  }\n  .row.no-gutter .tablet-15 {\n    width: 15%;\n  }\n  .row .tablet-10 {\n    width: 10%;\n    width: calc((100% - 15px*9) / 10);\n  }\n  .row.no-gutter .tablet-10 {\n    width: 10%;\n  }\n  .row .tablet-5 {\n    width: 5%;\n    width: calc((100% - 15px*19) / 20);\n  }\n  .row.no-gutter .tablet-5 {\n    width: 5%;\n  }\n  .row .tablet-auto:nth-last-child(1),\n  .row .tablet-auto:nth-last-child(1) ~ .col-auto {\n    width: 100%;\n    width: calc((100% - 15px*0) / 1);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(1),\n  .row.no-gutter .tablet-auto:nth-last-child(1) ~ .tablet-auto {\n    width: 100%;\n  }\n  .row .tablet-auto:nth-last-child(2),\n  .row .tablet-auto:nth-last-child(2) ~ .col-auto {\n    width: 50%;\n    width: calc((100% - 15px*1) / 2);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(2),\n  .row.no-gutter .tablet-auto:nth-last-child(2) ~ .tablet-auto {\n    width: 50%;\n  }\n  .row .tablet-auto:nth-last-child(3),\n  .row .tablet-auto:nth-last-child(3) ~ .col-auto {\n    width: 33.33333333%;\n    width: calc((100% - 15px*2) / 3);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(3),\n  .row.no-gutter .tablet-auto:nth-last-child(3) ~ .tablet-auto {\n    width: 33.33333333%;\n  }\n  .row .tablet-auto:nth-last-child(4),\n  .row .tablet-auto:nth-last-child(4) ~ .col-auto {\n    width: 25%;\n    width: calc((100% - 15px*3) / 4);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(4),\n  .row.no-gutter .tablet-auto:nth-last-child(4) ~ .tablet-auto {\n    width: 25%;\n  }\n  .row .tablet-auto:nth-last-child(5),\n  .row .tablet-auto:nth-last-child(5) ~ .col-auto {\n    width: 20%;\n    width: calc((100% - 15px*4) / 5);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(5),\n  .row.no-gutter .tablet-auto:nth-last-child(5) ~ .tablet-auto {\n    width: 20%;\n  }\n  .row .tablet-auto:nth-last-child(6),\n  .row .tablet-auto:nth-last-child(6) ~ .col-auto {\n    width: 16.66666667%;\n    width: calc((100% - 15px*5) / 6);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(6),\n  .row.no-gutter .tablet-auto:nth-last-child(6) ~ .tablet-auto {\n    width: 16.66666667%;\n  }\n  .row .tablet-auto:nth-last-child(7),\n  .row .tablet-auto:nth-last-child(7) ~ .col-auto {\n    width: 14.28571429%;\n    width: calc((100% - 15px*6) / 7);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(7),\n  .row.no-gutter .tablet-auto:nth-last-child(7) ~ .tablet-auto {\n    width: 14.28571429%;\n  }\n  .row .tablet-auto:nth-last-child(8),\n  .row .tablet-auto:nth-last-child(8) ~ .col-auto {\n    width: 12.5%;\n    width: calc((100% - 15px*7) / 8);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(8),\n  .row.no-gutter .tablet-auto:nth-last-child(8) ~ .tablet-auto {\n    width: 12.5%;\n  }\n  .row .tablet-auto:nth-last-child(9),\n  .row .tablet-auto:nth-last-child(9) ~ .col-auto {\n    width: 11.11111111%;\n    width: calc((100% - 15px*8) / 9);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(9),\n  .row.no-gutter .tablet-auto:nth-last-child(9) ~ .tablet-auto {\n    width: 11.11111111%;\n  }\n  .row .tablet-auto:nth-last-child(10),\n  .row .tablet-auto:nth-last-child(10) ~ .col-auto {\n    width: 10%;\n    width: calc((100% - 15px*9) / 10);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(10),\n  .row.no-gutter .tablet-auto:nth-last-child(10) ~ .tablet-auto {\n    width: 10%;\n  }\n  .row .tablet-auto:nth-last-child(11),\n  .row .tablet-auto:nth-last-child(11) ~ .col-auto {\n    width: 9.09090909%;\n    width: calc((100% - 15px*10) / 11);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(11),\n  .row.no-gutter .tablet-auto:nth-last-child(11) ~ .tablet-auto {\n    width: 9.09090909%;\n  }\n  .row .tablet-auto:nth-last-child(12),\n  .row .tablet-auto:nth-last-child(12) ~ .col-auto {\n    width: 8.33333333%;\n    width: calc((100% - 15px*11) / 12);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(12),\n  .row.no-gutter .tablet-auto:nth-last-child(12) ~ .tablet-auto {\n    width: 8.33333333%;\n  }\n  .row .tablet-auto:nth-last-child(13),\n  .row .tablet-auto:nth-last-child(13) ~ .col-auto {\n    width: 7.69230769%;\n    width: calc((100% - 15px*12) / 13);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(13),\n  .row.no-gutter .tablet-auto:nth-last-child(13) ~ .tablet-auto {\n    width: 7.69230769%;\n  }\n  .row .tablet-auto:nth-last-child(14),\n  .row .tablet-auto:nth-last-child(14) ~ .col-auto {\n    width: 7.14285714%;\n    width: calc((100% - 15px*13) / 14);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(14),\n  .row.no-gutter .tablet-auto:nth-last-child(14) ~ .tablet-auto {\n    width: 7.14285714%;\n  }\n  .row .tablet-auto:nth-last-child(15),\n  .row .tablet-auto:nth-last-child(15) ~ .col-auto {\n    width: 6.66666667%;\n    width: calc((100% - 15px*14) / 15);\n  }\n  .row.no-gutter .tablet-auto:nth-last-child(15),\n  .row.no-gutter .tablet-auto:nth-last-child(15) ~ .tablet-auto {\n    width: 6.66666667%;\n  }\n}\n.weui_dialog,\n.weui_toast {\n  -webkit-transition-duration: .2s;\n          transition-duration: .2s;\n  opacity: 0;\n  -webkit-transform: scale(0.9);\n          transform: scale(0.9);\n  visibility: hidden;\n  margin: 0;\n  left: 7.5%;\n  top: 30%;\n  z-index: 100;\n}\n.weui_dialog .weui_btn_dialog + .weui_btn_dialog,\n.weui_toast .weui_btn_dialog + .weui_btn_dialog {\n  position: relative;\n}\n.weui_dialog .weui_btn_dialog + .weui_btn_dialog:after,\n.weui_toast .weui_btn_dialog + .weui_btn_dialog:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 1px;\n  height: 100%;\n  border-left: 1px solid #D5D5D6;\n  color: #D5D5D6;\n  -webkit-transform-origin: 0 0;\n          transform-origin: 0 0;\n  -webkit-transform: scaleX(0.5);\n          transform: scaleX(0.5);\n}\n.weui_dialog.weui_dialog_visible,\n.weui_toast.weui_dialog_visible,\n.weui_dialog.weui_toast_visible,\n.weui_toast.weui_toast_visible {\n  opacity: 1;\n  visibility: visible;\n  -webkit-transform: scale(1);\n          transform: scale(1);\n}\n.weui_toast {\n  left: 50%;\n  top: 35%;\n  margin-left: -3.8em;\n}\n.weui_toast_forbidden {\n  color: #F76260;\n}\n.weui_toast_cancel .weui_icon_toast:before {\n  content: \"\\EA0D\";\n}\n.weui_toast_forbidden .weui_icon_toast:before {\n  content: \"\\EA0B\";\n  color: #F76260;\n}\n.weui_mask {\n  opacity: 0;\n  -webkit-transition-duration: .3s;\n          transition-duration: .3s;\n  visibility: hidden;\n  z-index: 10;\n}\n.weui_mask.weui_mask_visible {\n  opacity: 1;\n  visibility: visible;\n}\n.weui-prompt-input {\n  padding: 4px 6px;\n  border: 1px solid #ccc;\n  box-sizing: border-box;\n  height: 2em;\n  width: 80%;\n  margin-top: 10px;\n}\n.weui-pull-to-refresh {\n  margin-top: -50px;\n  -webkit-transition: -webkit-transform .4s;\n  transition: -webkit-transform .4s;\n  transition: transform .4s;\n  transition: transform .4s, -webkit-transform .4s;\n}\n.weui-pull-to-refresh.refreshing {\n  -webkit-transform: translate3d(0, 50px, 0);\n          transform: translate3d(0, 50px, 0);\n}\n.weui-pull-to-refresh.touching {\n  -webkit-transition-duration: 0s;\n          transition-duration: 0s;\n}\n.weui-pull-to-refresh-layer {\n  height: 30px;\n  line-height: 30px;\n  padding: 10px;\n  text-align: center;\n}\n.weui-pull-to-refresh-layer .down {\n  display: inline-block;\n}\n.weui-pull-to-refresh-layer .up,\n.weui-pull-to-refresh-layer .refresh {\n  display: none;\n}\n.weui-pull-to-refresh-layer .pull-to-refresh-arrow {\n  display: inline-block;\n  z-index: 10;\n  width: 20px;\n  height: 20px;\n  margin-right: 4px;\n  vertical-align: -4px;\n  background: no-repeat center;\n  background-size: 13px 20px;\n  -webkit-transition-duration: 300ms;\n          transition-duration: 300ms;\n  -webkit-transform: rotate(0deg) translate3d(0, 0, 0);\n          transform: rotate(0deg) translate3d(0, 0, 0);\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2026%2040'%3E%3Cpolygon%20points%3D'9%2C22%209%2C0%2017%2C0%2017%2C22%2026%2C22%2013.5%2C40%200%2C22'%20fill%3D'%238c8c8c'%2F%3E%3C%2Fsvg%3E\");\n}\n.weui-pull-to-refresh-layer .pull-to-refresh-preloader {\n  display: none;\n  vertical-align: -4px;\n  margin-right: 4px;\n  width: 20px;\n  height: 20px;\n  -webkit-transform-origin: 50%;\n          transform-origin: 50%;\n  -webkit-animation: preloader-spin 1s steps(12, end) infinite;\n          animation: preloader-spin 1s steps(12, end) infinite;\n}\n.weui-pull-to-refresh-layer .pull-to-refresh-preloader:after {\n  display: block;\n  width: 100%;\n  height: 100%;\n  content: \"\";\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");\n  background-repeat: no-repeat;\n  background-position: 50%;\n  background-size: 100%;\n}\n.pull-up .weui-pull-to-refresh-layer .down,\n.refreshing .weui-pull-to-refresh-layer .down {\n  display: none;\n}\n.pull-up .weui-pull-to-refresh-layer .pull-to-refresh-arrow {\n  display: inline-block;\n  -webkit-transform: rotate(180deg) translate3d(0, 0, 0);\n          transform: rotate(180deg) translate3d(0, 0, 0);\n}\n.pull-up .weui-pull-to-refresh-layer .up {\n  display: inline-block;\n}\n.pull-down .weui-pull-to-refresh-layer .pull-to-refresh-arrow {\n  display: inline-block;\n}\n.pull-down .weui-pull-to-refresh-layer .down {\n  display: inline-block;\n}\n.refreshing .weui-pull-to-refresh-layer .pull-to-refresh-arrow {\n  display: none;\n}\n.refreshing .weui-pull-to-refresh-layer .pull-to-refresh-preloader {\n  display: inline-block;\n}\n.refreshing .weui-pull-to-refresh-layer .refresh {\n  display: inline-block;\n}\n@keyframes preloader-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.weui_tab_bd_item.weui-pull-to-refresh {\n  position: absolute;\n  top: 50px;\n}\n.weui-infinite-scroll {\n  height: 24px;\n  line-height: 24px;\n  padding: 10px;\n  text-align: center;\n}\n.weui-infinite-scroll .infinite-preloader {\n  display: inline-block;\n  margin-right: 4px;\n  vertical-align: -4px;\n  width: 20px;\n  height: 20px;\n  -webkit-transform-origin: 50%;\n          transform-origin: 50%;\n  -webkit-animation: preloader-spin 1s steps(12, end) infinite;\n          animation: preloader-spin 1s steps(12, end) infinite;\n}\n.weui-infinite-scroll .infinite-preloader:after {\n  display: block;\n  width: 100%;\n  height: 100%;\n  content: \"\";\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");\n  background-repeat: no-repeat;\n  background-position: 50%;\n  background-size: 100%;\n}\n.weui_tab {\n  overflow: hidden;\n}\n.weui_navbar_item {\n  color: #888;\n}\n.weui_navbar_item.weui_bar_item_on {\n  color: #666;\n}\n.weui_tab_bd .weui_tab_bd_item {\n  display: none;\n  height: 100%;\n  overflow: auto;\n}\n.weui_tab_bd .weui_tab_bd_item.weui_tab_bd_item_active {\n  display: block;\n}\n.weui_navbar {\n  z-index: 100;\n}\n/* === Columns Picker === */\n.weui-picker-modal {\n  width: 100%;\n  position: absolute;\n  z-index: 100;\n  bottom: 0;\n  text-align: center;\n  border-radius: 0;\n  opacity: 0.6;\n  color: #3d4145;\n  -webkit-transition-duration: .3s;\n          transition-duration: .3s;\n  height: 13rem;\n  background: #EFEFF4;\n  -webkit-transform: translate3d(0, 100%, 0);\n          transform: translate3d(0, 100%, 0);\n  -webkit-transition-property: opacity, -webkit-transform;\n  transition-property: opacity, -webkit-transform;\n  transition-property: transform, opacity;\n  transition-property: transform, opacity, -webkit-transform;\n}\n.weui-picker-modal.weui-picker-modal-visible {\n  opacity: 1;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n}\n.weui-picker-modal .picker-modal-inner {\n  position: relative;\n  height: 10.8rem;\n}\n.weui-picker-modal .toolbar {\n  position: relative;\n  width: 100%;\n  font-size: .85rem;\n  line-height: 1.5;\n  color: #3d4145;\n  background: #f7f7f8;\n}\n.weui-picker-modal .toolbar:before {\n  content: '';\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: auto;\n  right: auto;\n  height: 1px;\n  width: 100%;\n  background-color: #d9d9d9;\n  display: block;\n  z-index: 15;\n  -webkit-transform-origin: 50% 0%;\n          transform-origin: 50% 0%;\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 2) {\n  .weui-picker-modal .toolbar:before {\n    -webkit-transform: scaleY(0.5);\n            transform: scaleY(0.5);\n  }\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 3) {\n  .weui-picker-modal .toolbar:before {\n    -webkit-transform: scaleY(0.33);\n            transform: scaleY(0.33);\n  }\n}\n.weui-picker-modal .picker-columns {\n  width: 100%;\n  height: 13rem;\n  z-index: 11500;\n}\n.weui-picker-modal .picker-columns.picker-modal-inline,\n.popover .weui-picker-modal .picker-columns {\n  height: 10rem;\n}\n@media (orientation: landscape) and (max-height: 415px) {\n  .weui-picker-modal .picker-columns:not(.picker-modal-inline) {\n    height: 10rem;\n  }\n}\n.weui-picker-modal .popover.popover-picker-columns {\n  width: 14rem;\n}\n.weui-picker-modal .picker-items {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-pack: center;\n  -ms-flex-pack: center;\n  -webkit-justify-content: center;\n  justify-content: center;\n  width: 100%;\n  padding: 0;\n  text-align: right;\n  font-size: 1rem;\n  font-weight: normal;\n  -webkit-mask-box-image: -webkit-linear-gradient(bottom, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent);\n  -webkit-mask-box-image: linear-gradient(to top, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent);\n}\n.weui-picker-modal .bar + .picker-items {\n  height: 10.8rem;\n}\n.weui-picker-modal .picker-items-col {\n  overflow: hidden;\n  position: relative;\n  max-height: 100%;\n}\n.weui-picker-modal .picker-items-col.picker-items-col-left {\n  text-align: left;\n}\n.weui-picker-modal .picker-items-col.picker-items-col-center {\n  text-align: center;\n}\n.weui-picker-modal .picker-items-col.picker-items-col-right {\n  text-align: right;\n}\n.weui-picker-modal .picker-items-col.picker-items-col-divider {\n  color: #3d4145;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-align: center;\n  -ms-flex-align: center;\n  -webkit-align-items: center;\n  align-items: center;\n}\n.weui-picker-modal .picker-items-col-wrapper {\n  -webkit-transition: 300ms;\n  transition: 300ms;\n  -webkit-transition-timing-function: ease-out;\n  transition-timing-function: ease-out;\n}\n.weui-picker-modal .picker-item {\n  height: 32px;\n  line-height: 32px;\n  padding: 0 10px;\n  white-space: nowrap;\n  position: relative;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #9b9b9b;\n  left: 0;\n  top: 0;\n  width: 100%;\n  box-sizing: border-box;\n  -webkit-transition: 300ms;\n  transition: 300ms;\n}\n.picker-items-col-absolute .weui-picker-modal .picker-item {\n  position: absolute;\n}\n.weui-picker-modal .picker-item.picker-item-far {\n  pointer-events: none;\n}\n.weui-picker-modal .picker-item.picker-selected {\n  color: #3d4145;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n  -webkit-transform: rotateX(0deg);\n          transform: rotateX(0deg);\n}\n.weui-picker-modal .picker-center-highlight {\n  height: 32px;\n  box-sizing: border-box;\n  position: absolute;\n  left: 0;\n  width: 100%;\n  top: 50%;\n  margin-top: -16px;\n  pointer-events: none;\n}\n.weui-picker-modal .picker-center-highlight:before {\n  content: '';\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: auto;\n  right: auto;\n  height: 1px;\n  width: 100%;\n  background-color: #D9D9D9;\n  display: block;\n  z-index: 15;\n  -webkit-transform-origin: 50% 0%;\n          transform-origin: 50% 0%;\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 2) {\n  .weui-picker-modal .picker-center-highlight:before {\n    -webkit-transform: scaleY(0.5);\n            transform: scaleY(0.5);\n  }\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 3) {\n  .weui-picker-modal .picker-center-highlight:before {\n    -webkit-transform: scaleY(0.33);\n            transform: scaleY(0.33);\n  }\n}\n.weui-picker-modal .picker-center-highlight:after {\n  content: '';\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  right: auto;\n  top: auto;\n  height: 1px;\n  width: 100%;\n  background-color: #D9D9D9;\n  display: block;\n  z-index: 15;\n  -webkit-transform-origin: 50% 100%;\n          transform-origin: 50% 100%;\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 2) {\n  .weui-picker-modal .picker-center-highlight:after {\n    -webkit-transform: scaleY(0.5);\n            transform: scaleY(0.5);\n  }\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 3) {\n  .weui-picker-modal .picker-center-highlight:after {\n    -webkit-transform: scaleY(0.33);\n            transform: scaleY(0.33);\n  }\n}\n.weui-picker-modal .picker-3d .picker-items {\n  overflow: hidden;\n  -webkit-perspective: 1200px;\n  perspective: 1200px;\n}\n.weui-picker-modal .picker-3d .picker-items-col,\n.weui-picker-modal .picker-3d .picker-items-col-wrapper,\n.weui-picker-modal .picker-3d .picker-item {\n  -webkit-transform-style: preserve-3d;\n  transform-style: preserve-3d;\n}\n.weui-picker-modal .picker-3d .picker-items-col {\n  overflow: visible;\n}\n.weui-picker-modal .picker-3d .picker-item {\n  -webkit-transform-origin: center center -110px;\n  transform-origin: center center -110px;\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  -webkit-transition-timing-function: ease-out;\n  transition-timing-function: ease-out;\n}\n.weui-picker-modal .title {\n  position: absolute;\n  display: block;\n  width: 100%;\n  padding: 0;\n  font-size: .85rem;\n  font-weight: normal;\n  line-height: 2.2rem;\n  color: #3d4145;\n  text-align: center;\n  white-space: nowrap;\n}\n.weui-picker-modal .picker-button {\n  position: absolute;\n  right: 0;\n  box-sizing: border-box;\n  height: 2.2rem;\n  line-height: 2.2rem;\n  color: #04BE02;\n  z-index: 1;\n  padding: 0 .5rem;\n}\n.weui-picker-overlay,\n.weui-picker-container {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 0;\n  width: 100%;\n}\n.city-picker .col-province {\n  width: 5rem;\n}\n.city-picker .col-city {\n  width: 6rem;\n}\n.city-picker .col-district {\n  width: 5rem;\n}\n.weui-picker-container .weui_cells {\n  margin: 0;\n  text-align: left;\n}\n.weui-select-modal {\n  height: auto;\n}\n.weui-select-modal .weui_cells {\n  overflow-y: auto;\n  overflow-x: hidden;\n  max-height: 16rem;\n}\n.weui-select-modal .weui_cells:after {\n  display: none;\n}\n/* === Calendar === */\n.weui-picker-calendar {\n  background: #fff;\n  height: 15rem;\n  width: 100%;\n  overflow: hidden;\n}\n@media (orientation: landscape) and (max-height: 415px) {\n  .weui-picker-calendar:not(.picker-modal-inline) {\n    height: 11rem;\n  }\n}\n.weui-picker-calendar .picker-modal-inner {\n  overflow: hidden;\n  height: 12.8rem;\n}\n.picker-calendar-week-days {\n  height: .9rem;\n  background: #f7f7f8;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  font-size: 11px;\n  box-sizing: border-box;\n  position: relative;\n}\n.picker-calendar-week-days:after {\n  content: '';\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  right: auto;\n  top: auto;\n  height: 1px;\n  width: 100%;\n  background-color: #c4c4c4;\n  display: block;\n  z-index: 15;\n  -webkit-transform-origin: 50% 100%;\n          transform-origin: 50% 100%;\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 2) {\n  .picker-calendar-week-days:after {\n    -webkit-transform: scaleY(0.5);\n            transform: scaleY(0.5);\n  }\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 3) {\n  .picker-calendar-week-days:after {\n    -webkit-transform: scaleY(0.33);\n            transform: scaleY(0.33);\n  }\n}\n.picker-calendar-week-days .picker-calendar-week-day {\n  -webkit-flex-shrink: 1;\n  -ms-flex: 0 1 auto;\n  -webkit-flex-shrink: 1;\n      -ms-flex-negative: 1;\n          flex-shrink: 1;\n  width: 14.28571429%;\n  width: calc(100% / 7);\n  line-height: 17px;\n  text-align: center;\n}\n.picker-calendar-week-days + .picker-calendar-months {\n  height: 11.9rem;\n}\n.picker-calendar-months {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  position: relative;\n}\n.picker-calendar-months-wrapper {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  -webkit-transition: 300ms;\n  transition: 300ms;\n}\n.picker-calendar-month {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -ms-flex-direction: column;\n  -webkit-flex-direction: column;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n.picker-calendar-row {\n  height: 16.66666667%;\n  height: calc(100% / 6);\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-flex-shrink: 1;\n  -ms-flex: 0 1 auto;\n  -webkit-flex-shrink: 1;\n      -ms-flex-negative: 1;\n          flex-shrink: 1;\n  width: 100%;\n  position: relative;\n}\n.picker-calendar-row:after {\n  content: '';\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  right: auto;\n  top: auto;\n  height: 1px;\n  width: 100%;\n  background-color: #ccc;\n  display: block;\n  z-index: 15;\n  -webkit-transform-origin: 50% 100%;\n          transform-origin: 50% 100%;\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 2) {\n  .picker-calendar-row:after {\n    -webkit-transform: scaleY(0.5);\n            transform: scaleY(0.5);\n  }\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 3) {\n  .picker-calendar-row:after {\n    -webkit-transform: scaleY(0.33);\n            transform: scaleY(0.33);\n  }\n}\n.picker-calendar-row:last-child:after {\n  display: none;\n}\n.picker-calendar-day {\n  -webkit-flex-shrink: 1;\n  -ms-flex: 0 1 auto;\n  -webkit-flex-shrink: 1;\n      -ms-flex-negative: 1;\n          flex-shrink: 1;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-pack: center;\n  -ms-flex-pack: center;\n  -webkit-justify-content: center;\n  justify-content: center;\n  -webkit-box-align: center;\n  -ms-flex-align: center;\n  -webkit-align-items: center;\n  align-items: center;\n  box-sizing: border-box;\n  width: 14.28571429%;\n  width: calc(100% / 7);\n  text-align: center;\n  color: #3d4145;\n  font-size: 15px;\n  cursor: pointer;\n}\n.picker-calendar-day.picker-calendar-day-prev,\n.picker-calendar-day.picker-calendar-day-next {\n  color: #ccc;\n}\n.picker-calendar-day.picker-calendar-day-disabled {\n  color: #d4d4d4;\n  cursor: auto;\n}\n.picker-calendar-day.picker-calendar-day-today span {\n  background: #e3e3e3;\n}\n.picker-calendar-day.picker-calendar-day-selected span {\n  background: #04BE02;\n  color: #fff;\n}\n.picker-calendar-day span {\n  display: inline-block;\n  border-radius: 100%;\n  width: 30px;\n  height: 30px;\n  line-height: 30px;\n}\n.picker-calendar-month-picker,\n.picker-calendar-year-picker {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-align: center;\n  -ms-flex-align: center;\n  -webkit-align-items: center;\n  align-items: center;\n  -webkit-box-pack: justify;\n  -ms-flex-pack: justify;\n  -webkit-justify-content: space-between;\n  justify-content: space-between;\n  width: 50%;\n  max-width: 200px;\n  -webkit-flex-shrink: 10;\n  -ms-flex: 0 10 auto;\n  -webkit-flex-shrink: 10;\n      -ms-flex-negative: 10;\n          flex-shrink: 10;\n}\n.picker-calendar-month-picker a.icon-only,\n.picker-calendar-year-picker a.icon-only {\n  min-width: 36px;\n}\n.picker-calendar-month-picker span,\n.picker-calendar-year-picker span {\n  -webkit-flex-shrink: 1;\n  -ms-flex: 0 1 auto;\n  -webkit-flex-shrink: 1;\n      -ms-flex-negative: 1;\n          flex-shrink: 1;\n  position: relative;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.popover .picker-calendar .picker-calendar-week-days,\n.picker-calendar.picker-modal-inline .picker-calendar-week-days {\n  background: none;\n}\n.popover .picker-calendar .toolbar:before,\n.picker-calendar.picker-modal-inline .toolbar:before,\n.popover .picker-calendar .picker-calendar-week-days:before,\n.picker-calendar.picker-modal-inline .picker-calendar-week-days:before {\n  display: none;\n}\n.popover .picker-calendar .toolbar:after,\n.picker-calendar.picker-modal-inline .toolbar:after,\n.popover .picker-calendar .picker-calendar-week-days:after,\n.picker-calendar.picker-modal-inline .picker-calendar-week-days:after {\n  display: none;\n}\n.popover .picker-calendar .toolbar ~ .picker-modal-inner .picker-calendar-months:before,\n.picker-calendar.picker-modal-inline .toolbar ~ .picker-modal-inner .picker-calendar-months:before,\n.popover .picker-calendar .picker-calendar-week-days ~ .picker-calendar-months:before,\n.picker-calendar.picker-modal-inline .picker-calendar-week-days ~ .picker-calendar-months:before {\n  content: '';\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: auto;\n  right: auto;\n  height: 1px;\n  width: 100%;\n  background-color: #c4c4c4;\n  display: block;\n  z-index: 15;\n  -webkit-transform-origin: 50% 0%;\n          transform-origin: 50% 0%;\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 2) {\n  .popover .picker-calendar .toolbar ~ .picker-modal-inner .picker-calendar-months:before,\n  .picker-calendar.picker-modal-inline .toolbar ~ .picker-modal-inner .picker-calendar-months:before,\n  .popover .picker-calendar .picker-calendar-week-days ~ .picker-calendar-months:before,\n  .picker-calendar.picker-modal-inline .picker-calendar-week-days ~ .picker-calendar-months:before {\n    -webkit-transform: scaleY(0.5);\n            transform: scaleY(0.5);\n  }\n}\n@media only screen and (-webkit-min-device-pixel-ratio: 3) {\n  .popover .picker-calendar .toolbar ~ .picker-modal-inner .picker-calendar-months:before,\n  .picker-calendar.picker-modal-inline .toolbar ~ .picker-modal-inner .picker-calendar-months:before,\n  .popover .picker-calendar .picker-calendar-week-days ~ .picker-calendar-months:before,\n  .picker-calendar.picker-modal-inline .picker-calendar-week-days ~ .picker-calendar-months:before {\n    -webkit-transform: scaleY(0.33);\n            transform: scaleY(0.33);\n  }\n}\n.weui-picker-modal .toolbar-inner {\n  height: 2.2rem;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  text-align: center;\n}\n.picker-calendar-month-picker,\n.picker-calendar-year-picker {\n  display: block;\n  line-height: 2.2rem;\n}\n.picker-calendar-month-picker a.icon-only,\n.picker-calendar-year-picker a.icon-only {\n  float: left;\n  width: 25%;\n  height: 2.2rem;\n  line-height: 2rem;\n}\n.picker-calendar-month-picker .current-month-value,\n.picker-calendar-year-picker .current-month-value,\n.picker-calendar-month-picker .current-year-value,\n.picker-calendar-year-picker .current-year-value {\n  float: left;\n  width: 50%;\n  height: 2.2rem;\n}\ni.icon {\n  display: inline-block;\n  vertical-align: middle;\n  background-size: 100% auto;\n  background-position: center;\n  background-repeat: no-repeat;\n  font-style: normal;\n  position: relative;\n}\ni.icon.icon-next,\ni.icon.icon-prev {\n  width: 0.75rem;\n  height: 0.75rem;\n}\ni.icon.icon-next {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2015%2015'%3E%3Cg%3E%3Cpath%20fill%3D'%2304BE02'%20d%3D'M1%2C1.6l11.8%2C5.8L1%2C13.4V1.6%20M0%2C0v15l15-7.6L0%2C0L0%2C0z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");\n}\ni.icon.icon-prev {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2015%2015'%3E%3Cg%3E%3Cpath%20fill%3D'%2304BE02'%20d%3D'M14%2C1.6v11.8L2.2%2C7.6L14%2C1.6%20M15%2C0L0%2C7.6L15%2C15V0L15%2C0z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");\n}\n/**\n * Swiper 3.3.1\n * Most modern mobile touch slider and framework with hardware accelerated transitions\n * \n * http://www.idangero.us/swiper/\n * \n * Copyright 2016, Vladimir Kharlampidi\n * The iDangero.us\n * http://www.idangero.us/\n * \n * Licensed under MIT\n * \n * Released on: February 7, 2016\n */\n.swiper-container {\n  margin: 0 auto;\n  position: relative;\n  overflow: hidden;\n  /* Fix of Webkit flickering */\n  z-index: 1;\n}\n.swiper-container-no-flexbox .swiper-slide {\n  float: left;\n}\n.swiper-container-vertical > .swiper-wrapper {\n  -webkit-box-orient: vertical;\n  -ms-flex-direction: column;\n  -webkit-flex-direction: column;\n  flex-direction: column;\n}\n.swiper-wrapper {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  z-index: 1;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-transition-property: -webkit-transform;\n  transition-property: -webkit-transform;\n  transition-property: transform;\n  transition-property: transform, -webkit-transform;\n  box-sizing: content-box;\n}\n.swiper-container-android .swiper-slide,\n.swiper-wrapper {\n  -webkit-transform: translate3d(0px, 0, 0);\n  transform: translate3d(0px, 0, 0);\n}\n.swiper-container-multirow > .swiper-wrapper {\n  -webkit-box-lines: multiple;\n  -moz-box-lines: multiple;\n  -ms-flex-wrap: wrap;\n  -webkit-flex-wrap: wrap;\n  flex-wrap: wrap;\n}\n.swiper-container-free-mode > .swiper-wrapper {\n  -webkit-transition-timing-function: ease-out;\n  transition-timing-function: ease-out;\n  margin: 0 auto;\n}\n.swiper-slide {\n  -webkit-flex-shrink: 0;\n  -ms-flex: 0 0 auto;\n  -webkit-flex-shrink: 0;\n      -ms-flex-negative: 0;\n          flex-shrink: 0;\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n/* Auto Height */\n.swiper-container-autoheight,\n.swiper-container-autoheight .swiper-slide {\n  height: auto;\n}\n.swiper-container-autoheight .swiper-wrapper {\n  -webkit-box-align: start;\n  -ms-flex-align: start;\n  -webkit-align-items: flex-start;\n  align-items: flex-start;\n  -webkit-transition-property: -webkit-transform, height;\n  -webkit-transition-property: height, -webkit-transform;\n  transition-property: height, -webkit-transform;\n  transition-property: transform, height;\n  transition-property: transform, height, -webkit-transform;\n}\n/* a11y */\n.swiper-container .swiper-notification {\n  position: absolute;\n  left: 0;\n  top: 0;\n  pointer-events: none;\n  opacity: 0;\n  z-index: -1000;\n}\n/* IE10 Windows Phone 8 Fixes */\n.swiper-wp8-horizontal {\n  -ms-touch-action: pan-y;\n  touch-action: pan-y;\n}\n.swiper-wp8-vertical {\n  -ms-touch-action: pan-x;\n  touch-action: pan-x;\n}\n/* Arrows */\n.swiper-button-prev,\n.swiper-button-next {\n  position: absolute;\n  top: 50%;\n  width: 27px;\n  height: 44px;\n  margin-top: -22px;\n  z-index: 10;\n  cursor: pointer;\n  background-size: 27px 44px;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.swiper-button-prev.swiper-button-disabled,\n.swiper-button-next.swiper-button-disabled {\n  opacity: 0.35;\n  cursor: auto;\n  pointer-events: none;\n}\n.swiper-button-prev,\n.swiper-container-rtl .swiper-button-next {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E\");\n  left: 10px;\n  right: auto;\n}\n.swiper-button-prev.swiper-button-black,\n.swiper-container-rtl .swiper-button-next.swiper-button-black {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E\");\n}\n.swiper-button-prev.swiper-button-white,\n.swiper-container-rtl .swiper-button-next.swiper-button-white {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E\");\n}\n.swiper-button-next,\n.swiper-container-rtl .swiper-button-prev {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E\");\n  right: 10px;\n  left: auto;\n}\n.swiper-button-next.swiper-button-black,\n.swiper-container-rtl .swiper-button-prev.swiper-button-black {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E\");\n}\n.swiper-button-next.swiper-button-white,\n.swiper-container-rtl .swiper-button-prev.swiper-button-white {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E\");\n}\n/* Pagination Styles */\n.swiper-pagination {\n  position: absolute;\n  text-align: center;\n  -webkit-transition: 300ms;\n  transition: 300ms;\n  -webkit-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  z-index: 10;\n}\n.swiper-pagination.swiper-pagination-hidden {\n  opacity: 0;\n}\n/* Common Styles */\n.swiper-pagination-fraction,\n.swiper-pagination-custom,\n.swiper-container-horizontal > .swiper-pagination-bullets {\n  bottom: 10px;\n  left: 0;\n  width: 100%;\n}\n/* Bullets */\n.swiper-pagination-bullet {\n  width: 8px;\n  height: 8px;\n  display: inline-block;\n  border-radius: 100%;\n  background: #000;\n  opacity: 0.2;\n}\nbutton.swiper-pagination-bullet {\n  border: none;\n  margin: 0;\n  padding: 0;\n  box-shadow: none;\n  -moz-appearance: none;\n  -ms-appearance: none;\n  -webkit-appearance: none;\n  appearance: none;\n}\n.swiper-pagination-clickable .swiper-pagination-bullet {\n  cursor: pointer;\n}\n.swiper-pagination-white .swiper-pagination-bullet {\n  background: #fff;\n}\n.swiper-pagination-bullet-active {\n  opacity: 1;\n  background: #04BE02;\n}\n.swiper-pagination-white .swiper-pagination-bullet-active {\n  background: #fff;\n}\n.swiper-pagination-black .swiper-pagination-bullet-active {\n  background: #000;\n}\n.swiper-container-vertical > .swiper-pagination-bullets {\n  right: 10px;\n  top: 50%;\n  -webkit-transform: translate3d(0px, -50%, 0);\n  transform: translate3d(0px, -50%, 0);\n}\n.swiper-container-vertical > .swiper-pagination-bullets .swiper-pagination-bullet {\n  margin: 5px 0;\n  display: block;\n}\n.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {\n  margin: 0 5px;\n}\n/* Progress */\n.swiper-pagination-progress {\n  background: rgba(0, 0, 0, 0.25);\n  position: absolute;\n}\n.swiper-pagination-progress .swiper-pagination-progressbar {\n  background: #007aff;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  -webkit-transform-origin: left top;\n  transform-origin: left top;\n}\n.swiper-container-rtl .swiper-pagination-progress .swiper-pagination-progressbar {\n  -webkit-transform-origin: right top;\n  transform-origin: right top;\n}\n.swiper-container-horizontal > .swiper-pagination-progress {\n  width: 100%;\n  height: 4px;\n  left: 0;\n  top: 0;\n}\n.swiper-container-vertical > .swiper-pagination-progress {\n  width: 4px;\n  height: 100%;\n  left: 0;\n  top: 0;\n}\n.swiper-pagination-progress.swiper-pagination-white {\n  background: rgba(255, 255, 255, 0.5);\n}\n.swiper-pagination-progress.swiper-pagination-white .swiper-pagination-progressbar {\n  background: #fff;\n}\n.swiper-pagination-progress.swiper-pagination-black .swiper-pagination-progressbar {\n  background: #000;\n}\n/* 3D Container */\n.swiper-container-3d {\n  -webkit-perspective: 1200px;\n  -o-perspective: 1200px;\n  perspective: 1200px;\n}\n.swiper-container-3d .swiper-wrapper,\n.swiper-container-3d .swiper-slide,\n.swiper-container-3d .swiper-slide-shadow-left,\n.swiper-container-3d .swiper-slide-shadow-right,\n.swiper-container-3d .swiper-slide-shadow-top,\n.swiper-container-3d .swiper-slide-shadow-bottom,\n.swiper-container-3d .swiper-cube-shadow {\n  -webkit-transform-style: preserve-3d;\n  transform-style: preserve-3d;\n}\n.swiper-container-3d .swiper-slide-shadow-left,\n.swiper-container-3d .swiper-slide-shadow-right,\n.swiper-container-3d .swiper-slide-shadow-top,\n.swiper-container-3d .swiper-slide-shadow-bottom {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  z-index: 10;\n}\n.swiper-container-3d .swiper-slide-shadow-left {\n  background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0)));\n  /* Safari 4+, Chrome */\n  background-image: -webkit-linear-gradient(right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Chrome 10+, Safari 5.1+, iOS 5+ */\n  /* Firefox 3.6-15 */\n  /* Opera 11.10-12.00 */\n  background-image: linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Firefox 16+, IE10, Opera 12.50+ */\n}\n.swiper-container-3d .swiper-slide-shadow-right {\n  background-image: -webkit-gradient(linear, right top, left top, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0)));\n  /* Safari 4+, Chrome */\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Chrome 10+, Safari 5.1+, iOS 5+ */\n  /* Firefox 3.6-15 */\n  /* Opera 11.10-12.00 */\n  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Firefox 16+, IE10, Opera 12.50+ */\n}\n.swiper-container-3d .swiper-slide-shadow-top {\n  background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0)));\n  /* Safari 4+, Chrome */\n  background-image: -webkit-linear-gradient(bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Chrome 10+, Safari 5.1+, iOS 5+ */\n  /* Firefox 3.6-15 */\n  /* Opera 11.10-12.00 */\n  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Firefox 16+, IE10, Opera 12.50+ */\n}\n.swiper-container-3d .swiper-slide-shadow-bottom {\n  background-image: -webkit-gradient(linear, left bottom, left top, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0)));\n  /* Safari 4+, Chrome */\n  background-image: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Chrome 10+, Safari 5.1+, iOS 5+ */\n  /* Firefox 3.6-15 */\n  /* Opera 11.10-12.00 */\n  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Firefox 16+, IE10, Opera 12.50+ */\n}\n/* Coverflow */\n.swiper-container-coverflow .swiper-wrapper,\n.swiper-container-flip .swiper-wrapper {\n  /* Windows 8 IE 10 fix */\n  -ms-perspective: 1200px;\n}\n/* Cube + Flip */\n.swiper-container-cube,\n.swiper-container-flip {\n  overflow: visible;\n}\n.swiper-container-cube .swiper-slide,\n.swiper-container-flip .swiper-slide {\n  pointer-events: none;\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  z-index: 1;\n}\n.swiper-container-cube .swiper-slide .swiper-slide,\n.swiper-container-flip .swiper-slide .swiper-slide {\n  pointer-events: none;\n}\n.swiper-container-cube .swiper-slide-active,\n.swiper-container-flip .swiper-slide-active,\n.swiper-container-cube .swiper-slide-active .swiper-slide-active,\n.swiper-container-flip .swiper-slide-active .swiper-slide-active {\n  pointer-events: auto;\n}\n.swiper-container-cube .swiper-slide-shadow-top,\n.swiper-container-flip .swiper-slide-shadow-top,\n.swiper-container-cube .swiper-slide-shadow-bottom,\n.swiper-container-flip .swiper-slide-shadow-bottom,\n.swiper-container-cube .swiper-slide-shadow-left,\n.swiper-container-flip .swiper-slide-shadow-left,\n.swiper-container-cube .swiper-slide-shadow-right,\n.swiper-container-flip .swiper-slide-shadow-right {\n  z-index: 0;\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n}\n/* Cube */\n.swiper-container-cube .swiper-slide {\n  visibility: hidden;\n  -webkit-transform-origin: 0 0;\n  transform-origin: 0 0;\n  width: 100%;\n  height: 100%;\n}\n.swiper-container-cube.swiper-container-rtl .swiper-slide {\n  -webkit-transform-origin: 100% 0;\n  transform-origin: 100% 0;\n}\n.swiper-container-cube .swiper-slide-active,\n.swiper-container-cube .swiper-slide-next,\n.swiper-container-cube .swiper-slide-prev,\n.swiper-container-cube .swiper-slide-next + .swiper-slide {\n  pointer-events: auto;\n  visibility: visible;\n}\n.swiper-container-cube .swiper-cube-shadow {\n  position: absolute;\n  left: 0;\n  bottom: 0px;\n  width: 100%;\n  height: 100%;\n  background: #000;\n  opacity: 0.6;\n  -webkit-filter: blur(50px);\n  filter: blur(50px);\n  z-index: 0;\n}\n/* Fade */\n.swiper-container-fade.swiper-container-free-mode .swiper-slide {\n  -webkit-transition-timing-function: ease-out;\n  transition-timing-function: ease-out;\n}\n.swiper-container-fade .swiper-slide {\n  pointer-events: none;\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n}\n.swiper-container-fade .swiper-slide .swiper-slide {\n  pointer-events: none;\n}\n.swiper-container-fade .swiper-slide-active,\n.swiper-container-fade .swiper-slide-active .swiper-slide-active {\n  pointer-events: auto;\n}\n/* Scrollbar */\n.swiper-scrollbar {\n  border-radius: 10px;\n  position: relative;\n  -ms-touch-action: none;\n  background: rgba(0, 0, 0, 0.1);\n}\n.swiper-container-horizontal > .swiper-scrollbar {\n  position: absolute;\n  left: 1%;\n  bottom: 3px;\n  z-index: 50;\n  height: 5px;\n  width: 98%;\n}\n.swiper-container-vertical > .swiper-scrollbar {\n  position: absolute;\n  right: 3px;\n  top: 1%;\n  z-index: 50;\n  width: 5px;\n  height: 98%;\n}\n.swiper-scrollbar-drag {\n  height: 100%;\n  width: 100%;\n  position: relative;\n  background: rgba(0, 0, 0, 0.5);\n  border-radius: 10px;\n  left: 0;\n  top: 0;\n}\n.swiper-scrollbar-cursor-drag {\n  cursor: move;\n}\n/* Preloader */\n.swiper-lazy-preloader {\n  width: 42px;\n  height: 42px;\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  margin-left: -21px;\n  margin-top: -21px;\n  z-index: 10;\n  -webkit-transform-origin: 50%;\n  transform-origin: 50%;\n  -webkit-animation: swiper-preloader-spin 1s steps(12, end) infinite;\n  animation: swiper-preloader-spin 1s steps(12, end) infinite;\n}\n.swiper-lazy-preloader:after {\n  display: block;\n  content: \"\";\n  width: 100%;\n  height: 100%;\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");\n  background-position: 50%;\n  background-size: 100%;\n  background-repeat: no-repeat;\n}\n.swiper-lazy-preloader-white:after {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%23fff'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");\n}\n@-webkit-keyframes swiper-preloader-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n  }\n}\n@keyframes swiper-preloader-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.weui_actionsheet {\n  z-index: 100;\n}\n.weui-popup-modal {\n  width: 100%;\n  position: absolute;\n  z-index: 100;\n  bottom: 0;\n  border-radius: 0;\n  opacity: 0.6;\n  color: #3d4145;\n  -webkit-transition-duration: .3s;\n          transition-duration: .3s;\n  height: 100%;\n  background: #EFEFF4;\n  -webkit-transform: translate3d(0, 100%, 0);\n          transform: translate3d(0, 100%, 0);\n  -webkit-transition-property: opacity, -webkit-transform;\n  transition-property: opacity, -webkit-transform;\n  transition-property: transform, opacity;\n  transition-property: transform, opacity, -webkit-transform;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n.weui-popup-modal.weui-popup-modal-visible {\n  opacity: 1;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n}\n.weui-popup-overlay,\n.weui-popup-container {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 0;\n  width: 100%;\n  height: 100%;\n}\n.weui-popup-container {\n  display: none;\n}\n.weui-popup-container.weui-popup-container-visible {\n  display: block;\n}\n.weui-popup-container .weui_cells {\n  margin: 0;\n  text-align: left;\n}\n.notification {\n  position: fixed;\n  width: 100%;\n  min-height: 3.4rem;\n  top: -2rem;\n  padding-top: 2rem;\n  left: 0;\n  right: 0;\n  z-index: 9999;\n  background-color: rgba(0, 0, 0, 0.85);\n  color: white;\n  font-size: .65rem;\n  -webkit-transform: translate3d(0, -100%, 0);\n          transform: translate3d(0, -100%, 0);\n  -webkit-transition: .4s;\n  transition: .4s;\n}\n.notification.notification-in {\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n}\n.notification.touching {\n  -webkit-transition-duration: 0s;\n          transition-duration: 0s;\n}\n.notification .notification-inner {\n  padding: .4rem .6rem 1rem .6rem;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-align: start;\n  -ms-flex-align: start;\n  -webkit-align-items: flex-start;\n  align-items: flex-start;\n}\n.notification .notification-content {\n  width: 100%;\n  margin: 0rem .4rem;\n}\n.notification .notification-title {\n  font-weight: bold;\n}\n.notification .notification-text {\n  line-height: 1;\n}\n.notification .notification-media {\n  height: 1rem;\n  width: 1rem;\n}\n.notification .notification-media img {\n  width: 100%;\n}\n.notification .notification-handle-bar {\n  position: absolute;\n  bottom: .2rem;\n  left: 50%;\n  -webkit-transform: translate3d(-50%, 0, 0);\n          transform: translate3d(-50%, 0, 0);\n  width: 2rem;\n  height: .3rem;\n  border-radius: .15rem;\n  background: white;\n  opacity: .5;\n}\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	/** 
	* jQuery WeUI V0.6.0 
	* By 言川
	* http://lihongxun945.github.io/jquery-weui/
	 */
	/* global $:true */
	/* global WebKitCSSMatrix:true */

	(function($) {
	  "use strict";

	  $.fn.transitionEnd = function(callback) {
	    var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
	      i, dom = this;

	    function fireCallBack(e) {
	      /*jshint validthis:true */
	      if (e.target !== this) return;
	      callback.call(this, e);
	      for (i = 0; i < events.length; i++) {
	        dom.off(events[i], fireCallBack);
	      }
	    }
	    if (callback) {
	      for (i = 0; i < events.length; i++) {
	        dom.on(events[i], fireCallBack);
	      }
	    }
	    return this;
	  };

	  $.support = (function() {
	    var support = {
	      touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
	    };
	    return support;
	  })();

	  $.touchEvents = {
	    start: $.support.touch ? 'touchstart' : 'mousedown',
	    move: $.support.touch ? 'touchmove' : 'mousemove',
	    end: $.support.touch ? 'touchend' : 'mouseup'
	  };

	  $.getTouchPosition = function(e) {
	    e = e.originalEvent || e; //jquery wrap the originevent
	    if(e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend') {
	      return {
	        x: e.targetTouches[0].pageX,
	        y: e.targetTouches[0].pageY
	      };
	    } else {
	      return {
	        x: e.pageX,
	        y: e.pageY
	      };
	    }
	  };

	  $.fn.scrollHeight = function() {
	    return this[0].scrollHeight;
	  };

	  $.fn.transform = function(transform) {
	    for (var i = 0; i < this.length; i++) {
	      var elStyle = this[i].style;
	      elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
	    }
	    return this;
	  };
	  $.fn.transition = function(duration) {
	    if (typeof duration !== 'string') {
	      duration = duration + 'ms';
	    }
	    for (var i = 0; i < this.length; i++) {
	      var elStyle = this[i].style;
	      elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
	    }
	    return this;
	  };

	  $.getTranslate = function (el, axis) {
	    var matrix, curTransform, curStyle, transformMatrix;

	    // automatic axis detection
	    if (typeof axis === 'undefined') {
	      axis = 'x';
	    }

	    curStyle = window.getComputedStyle(el, null);
	    if (window.WebKitCSSMatrix) {
	      // Some old versions of Webkit choke when 'none' is passed; pass
	      // empty string instead in this case
	      transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
	    }
	    else {
	      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
	      matrix = transformMatrix.toString().split(',');
	    }

	    if (axis === 'x') {
	      //Latest Chrome and webkits Fix
	      if (window.WebKitCSSMatrix)
	        curTransform = transformMatrix.m41;
	      //Crazy IE10 Matrix
	      else if (matrix.length === 16)
	        curTransform = parseFloat(matrix[12]);
	      //Normal Browsers
	      else
	        curTransform = parseFloat(matrix[4]);
	    }
	    if (axis === 'y') {
	      //Latest Chrome and webkits Fix
	      if (window.WebKitCSSMatrix)
	        curTransform = transformMatrix.m42;
	      //Crazy IE10 Matrix
	      else if (matrix.length === 16)
	        curTransform = parseFloat(matrix[13]);
	      //Normal Browsers
	      else
	        curTransform = parseFloat(matrix[5]);
	    }

	    return curTransform || 0;
	  };
	  $.requestAnimationFrame = function (callback) {
	    if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
	    else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
	    else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
	    else {
	      return window.setTimeout(callback, 1000 / 60);
	    }
	  };

	  $.cancelAnimationFrame = function (id) {
	    if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
	    else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
	    else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
	    else {
	      return window.clearTimeout(id);
	    }  
	  };

	  $.fn.join = function(arg) {
	    return this.toArray().join(arg);
	  }

	})($);

	/*===========================
	  Template7 Template engine
	  ===========================*/
	/* global $:true */
	/* jshint unused:false */
	/* jshint forin:false */
	+function ($) {
	  "use strict";
	  $.Template7 = $.t7 = (function () {
	    function isArray(arr) {
	      return Object.prototype.toString.apply(arr) === '[object Array]';
	    }
	    function isObject(obj) {
	      return obj instanceof Object;
	    }
	    function isFunction(func) {
	      return typeof func === 'function';
	    }
	    var cache = {};
	    function helperToSlices(string) {
	      var helperParts = string.replace(/[{}#}]/g, '').split(' ');
	      var slices = [];
	      var shiftIndex, i, j;
	      for (i = 0; i < helperParts.length; i++) {
	        var part = helperParts[i];
	        if (i === 0) slices.push(part);
	        else {
	          if (part.indexOf('"') === 0) {
	            // Plain String
	            if (part.match(/"/g).length === 2) {
	              // One word string
	              slices.push(part);
	            }
	            else {
	              // Find closed Index
	              shiftIndex = 0;
	              for (j = i + 1; j < helperParts.length; j++) {
	                part += ' ' + helperParts[j];
	                if (helperParts[j].indexOf('"') >= 0) {
	                  shiftIndex = j;
	                  slices.push(part);
	                  break;
	                }
	              }
	              if (shiftIndex) i = shiftIndex;
	            }
	          }
	          else {
	            if (part.indexOf('=') > 0) {
	              // Hash
	              var hashParts = part.split('=');
	              var hashName = hashParts[0];
	              var hashContent = hashParts[1];
	              if (hashContent.match(/"/g).length !== 2) {
	                shiftIndex = 0;
	                for (j = i + 1; j < helperParts.length; j++) {
	                  hashContent += ' ' + helperParts[j];
	                  if (helperParts[j].indexOf('"') >= 0) {
	                    shiftIndex = j;
	                    break;
	                  }
	                }
	                if (shiftIndex) i = shiftIndex;
	              }
	              var hash = [hashName, hashContent.replace(/"/g,'')];
	              slices.push(hash);
	            }
	            else {
	              // Plain variable
	              slices.push(part);
	            }
	          }
	        }
	      }
	      return slices;
	    }
	    function stringToBlocks(string) {
	      var blocks = [], i, j, k;
	      if (!string) return [];
	      var _blocks = string.split(/({{[^{^}]*}})/);
	      for (i = 0; i < _blocks.length; i++) {
	        var block = _blocks[i];
	        if (block === '') continue;
	        if (block.indexOf('{{') < 0) {
	          blocks.push({
	            type: 'plain',
	            content: block
	          });
	        }
	        else {
	          if (block.indexOf('{/') >= 0) {
	            continue;
	          }
	          if (block.indexOf('{#') < 0 && block.indexOf(' ') < 0 && block.indexOf('else') < 0) {
	            // Simple variable
	            blocks.push({
	              type: 'variable',
	              contextName: block.replace(/[{}]/g, '')
	            });
	            continue;
	          }
	          // Helpers
	          var helperSlices = helperToSlices(block);
	          var helperName = helperSlices[0];
	          var helperContext = [];
	          var helperHash = {};
	          for (j = 1; j < helperSlices.length; j++) {
	            var slice = helperSlices[j];
	            if (isArray(slice)) {
	              // Hash
	              helperHash[slice[0]] = slice[1] === 'false' ? false : slice[1];
	            }
	            else {
	              helperContext.push(slice);
	            }
	          }

	          if (block.indexOf('{#') >= 0) {
	            // Condition/Helper
	            var helperStartIndex = i;
	            var helperContent = '';
	            var elseContent = '';
	            var toSkip = 0;
	            var shiftIndex;
	            var foundClosed = false, foundElse = false, foundClosedElse = false, depth = 0;
	            for (j = i + 1; j < _blocks.length; j++) {
	              if (_blocks[j].indexOf('{{#') >= 0) {
	                depth ++;
	              }
	              if (_blocks[j].indexOf('{{/') >= 0) {
	                depth --;
	              }
	              if (_blocks[j].indexOf('{{#' + helperName) >= 0) {
	                helperContent += _blocks[j];
	                if (foundElse) elseContent += _blocks[j];
	                toSkip ++;
	              }
	              else if (_blocks[j].indexOf('{{/' + helperName) >= 0) {
	                if (toSkip > 0) {
	                  toSkip--;
	                  helperContent += _blocks[j];
	                  if (foundElse) elseContent += _blocks[j];
	                }
	                else {
	                  shiftIndex = j;
	                  foundClosed = true;
	                  break;
	                }
	              }
	              else if (_blocks[j].indexOf('else') >= 0 && depth === 0) {
	                foundElse = true;
	              }
	              else {
	                if (!foundElse) helperContent += _blocks[j];
	                if (foundElse) elseContent += _blocks[j];
	              }

	            }
	            if (foundClosed) {
	              if (shiftIndex) i = shiftIndex;
	              blocks.push({
	                type: 'helper',
	                helperName: helperName,
	                contextName: helperContext,
	                content: helperContent,
	                inverseContent: elseContent,
	                hash: helperHash
	              });
	            }
	          }
	          else if (block.indexOf(' ') > 0) {
	            blocks.push({
	              type: 'helper',
	              helperName: helperName,
	              contextName: helperContext,
	              hash: helperHash
	            });
	          }
	        }
	      }
	      return blocks;
	    }
	    var Template7 = function (template) {
	      var t = this;
	      t.template = template;

	      function getCompileFn(block, depth) {
	        if (block.content) return compile(block.content, depth);
	        else return function () {return ''; };
	      }
	      function getCompileInverse(block, depth) {
	        if (block.inverseContent) return compile(block.inverseContent, depth);
	        else return function () {return ''; };
	      }
	      function getCompileVar(name, ctx) {
	        var variable, parts, levelsUp = 0, initialCtx = ctx;
	        if (name.indexOf('../') === 0) {
	          levelsUp = name.split('../').length - 1;
	          var newDepth = ctx.split('_')[1] - levelsUp;
	          ctx = 'ctx_' + (newDepth >= 1 ? newDepth : 1);
	          parts = name.split('../')[levelsUp].split('.');
	        }
	        else if (name.indexOf('@global') === 0) {
	          ctx = '$.Template7.global';
	          parts = name.split('@global.')[1].split('.');
	        }
	        else if (name.indexOf('@root') === 0) {
	          ctx = 'ctx_1';
	          parts = name.split('@root.')[1].split('.');
	        }
	        else {
	          parts = name.split('.');
	        }
	        variable = ctx;
	        for (var i = 0; i < parts.length; i++) {
	          var part = parts[i];
	          if (part.indexOf('@') === 0) {
	            if (i > 0) {
	              variable += '[(data && data.' + part.replace('@', '') + ')]';
	            }
	            else {
	              variable = '(data && data.' + name.replace('@', '') + ')';
	            }
	          }
	          else {
	            if (isFinite(part)) {
	              variable += '[' + part + ']';
	            }
	            else {
	              if (part.indexOf('this') === 0) {
	                variable = part.replace('this', ctx);
	              }
	              else {
	                variable += '.' + part;       
	              }
	            }
	          }
	        }

	        return variable;
	      }
	      function getCompiledArguments(contextArray, ctx) {
	        var arr = [];
	        for (var i = 0; i < contextArray.length; i++) {
	          if (contextArray[i].indexOf('"') === 0) arr.push(contextArray[i]);
	          else {
	            arr.push(getCompileVar(contextArray[i], ctx));
	          }
	        }
	        return arr.join(', ');
	      }
	      function compile(template, depth) {
	        depth = depth || 1;
	        template = template || t.template;
	        if (typeof template !== 'string') {
	          throw new Error('Template7: Template must be a string');
	        }
	        var blocks = stringToBlocks(template);
	        if (blocks.length === 0) {
	          return function () { return ''; };
	        }
	        var ctx = 'ctx_' + depth;
	        var resultString = '(function (' + ctx + ', data) {\n';
	        if (depth === 1) {
	          resultString += 'function isArray(arr){return Object.prototype.toString.apply(arr) === \'[object Array]\';}\n';
	          resultString += 'function isFunction(func){return (typeof func === \'function\');}\n';
	          resultString += 'function c(val, ctx) {if (typeof val !== "undefined") {if (isFunction(val)) {return val.call(ctx);} else return val;} else return "";}\n';
	        }
	        resultString += 'var r = \'\';\n';
	        var i, j, context;
	        for (i = 0; i < blocks.length; i++) {
	          var block = blocks[i];
	          // Plain block
	          if (block.type === 'plain') {
	            resultString += 'r +=\'' + (block.content).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/'/g, '\\' + '\'') + '\';';
	            continue;
	          }
	          var variable, compiledArguments;
	          // Variable block
	          if (block.type === 'variable') {
	            variable = getCompileVar(block.contextName, ctx);
	            resultString += 'r += c(' + variable + ', ' + ctx + ');';
	          }
	          // Helpers block
	          if (block.type === 'helper') {
	            if (block.helperName in t.helpers) {
	              compiledArguments = getCompiledArguments(block.contextName, ctx);
	              resultString += 'r += ($.Template7.helpers.' + block.helperName + ').call(' + ctx + ', ' + (compiledArguments && (compiledArguments + ', ')) +'{hash:' + JSON.stringify(block.hash) + ', data: data || {}, fn: ' + getCompileFn(block, depth+1) + ', inverse: ' + getCompileInverse(block, depth+1) + ', root: ctx_1});';
	            }
	            else {
	              if (block.contextName.length > 0) {
	                throw new Error('Template7: Missing helper: "' + block.helperName + '"');
	              }
	              else {
	                variable = getCompileVar(block.helperName, ctx);
	                resultString += 'if (' + variable + ') {';
	                resultString += 'if (isArray(' + variable + ')) {';
	                resultString += 'r += ($.Template7.helpers.each).call(' + ctx + ', ' + variable + ', {hash:' + JSON.stringify(block.hash) + ', data: data || {}, fn: ' + getCompileFn(block, depth+1) + ', inverse: ' + getCompileInverse(block, depth+1) + ', root: ctx_1});';
	                resultString += '}else {';
	                resultString += 'r += ($.Template7.helpers.with).call(' + ctx + ', ' + variable + ', {hash:' + JSON.stringify(block.hash) + ', data: data || {}, fn: ' + getCompileFn(block, depth+1) + ', inverse: ' + getCompileInverse(block, depth+1) + ', root: ctx_1});';
	                resultString += '}}';
	              }
	            }
	          }
	        }
	        resultString += '\nreturn r;})';
	        return eval.call(window, resultString);
	      }
	      t.compile = function (template) {
	        if (!t.compiled) {
	          t.compiled = compile(template);
	        }
	        return t.compiled;
	      };
	    };
	    Template7.prototype = {
	      options: {},
	      helpers: {
	        'if': function (context, options) {
	          if (isFunction(context)) { context = context.call(this); }
	          if (context) {
	            return options.fn(this, options.data);
	          }
	          else {
	            return options.inverse(this, options.data);
	          }
	        },
	        'unless': function (context, options) {
	          if (isFunction(context)) { context = context.call(this); }
	          if (!context) {
	            return options.fn(this, options.data);
	          }
	          else {
	            return options.inverse(this, options.data);
	          }
	        },
	        'each': function (context, options) {
	          var ret = '', i = 0;
	          if (isFunction(context)) { context = context.call(this); }
	          if (isArray(context)) {
	            if (options.hash.reverse) {
	              context = context.reverse();
	            }
	            for (i = 0; i < context.length; i++) {
	              ret += options.fn(context[i], {first: i === 0, last: i === context.length - 1, index: i});
	            }
	            if (options.hash.reverse) {
	              context = context.reverse();
	            }
	          }
	          else {
	            for (var key in context) {
	              i++;
	              ret += options.fn(context[key], {key: key});
	            }
	          }
	          if (i > 0) return ret;
	          else return options.inverse(this);
	        },
	        'with': function (context, options) {
	          if (isFunction(context)) { context = context.call(this); }
	          return options.fn(context);
	        },
	        'join': function (context, options) {
	          if (isFunction(context)) { context = context.call(this); }
	          return context.join(options.hash.delimiter || options.hash.delimeter);
	        },
	        'js': function (expression, options) {
	          var func;
	          if (expression.indexOf('return')>=0) {
	            func = '(function(){'+expression+'})';
	          }
	          else {
	            func = '(function(){return ('+expression+')})';
	          }
	          return eval.call(this, func).call(this);
	        },
	        'js_compare': function (expression, options) {
	          var func;
	          if (expression.indexOf('return')>=0) {
	            func = '(function(){'+expression+'})';
	          }
	          else {
	            func = '(function(){return ('+expression+')})';
	          }
	          var condition = eval.call(this, func).call(this);
	          if (condition) {
	            return options.fn(this, options.data);
	          }
	          else {
	            return options.inverse(this, options.data);   
	          }
	        }
	      }
	    };
	    var t7 = function (template, data) {
	      if (arguments.length === 2) {
	        var instance = new Template7(template);
	        var rendered = instance.compile()(data);
	        instance = null;
	        return (rendered);
	      }
	      else return new Template7(template);
	    };
	    t7.registerHelper = function (name, fn) {
	      Template7.prototype.helpers[name] = fn;
	    };
	    t7.unregisterHelper = function (name) {
	      Template7.prototype.helpers[name] = undefined;  
	      delete Template7.prototype.helpers[name];
	    };

	    t7.compile = function (template, options) {
	      var instance = new Template7(template, options);
	      return instance.compile();
	    };

	    t7.options = Template7.prototype.options;
	    t7.helpers = Template7.prototype.helpers;
	    return t7;
	  })();
	}($);

	+ function($) {
	  "use strict";

	  var defaults;
	  
	  $.modal = function(params) {
	    params = $.extend({}, defaults, params);


	    var buttons = params.buttons;

	    var buttonsHtml = buttons.map(function(d, i) {
	      return '<a href="javascript:;" class="weui_btn_dialog ' + (d.className || "") + '">' + d.text + '</a>';
	    }).join("");

	    var tpl = '<div class="weui_dialog">' +
	                '<div class="weui_dialog_hd"><strong class="weui_dialog_title">' + params.title + '</strong></div>' +
	                ( params.text ? '<div class="weui_dialog_bd">'+params.text+'</div>' : '')+
	                '<div class="weui_dialog_ft">' + buttonsHtml + '</div>' +
	              '</div>';
	    
	    var dialog = $.openModal(tpl);

	    dialog.find(".weui_btn_dialog").each(function(i, e) {
	      var el = $(e);
	      el.click(function() {
	        //先关闭对话框，再调用回调函数
	        if(params.autoClose) $.closeModal();

	        if(buttons[i].onClick) {
	          buttons[i].onClick();
	        }
	      });
	    });
	  };

	  $.openModal = function(tpl) {
	    var mask = $("<div class='weui_mask'></div>").appendTo(document.body);
	    mask.show();

	    var dialog = $(tpl).appendTo(document.body);
	    
	    dialog.show();
	    mask.addClass("weui_mask_visible");
	    dialog.addClass("weui_dialog_visible");

	    return dialog;
	  }

	  $.closeModal = function() {
	    $(".weui_mask_visible").removeClass("weui_mask_visible").transitionEnd(function() {
	      $(this).remove();
	    });
	    $(".weui_dialog_visible").removeClass("weui_dialog_visible").transitionEnd(function() {
	      $(this).remove();
	    });
	  };

	  $.alert = function(text, title, callback) {
	    if (typeof title === 'function') {
	      callback = arguments[1];
	      title = undefined;
	    }
	    return $.modal({
	      text: text,
	      title: title,
	      buttons: [{
	        text: defaults.buttonOK,
	        className: "primary",
	        onClick: callback
	      }]
	    });
	  }

	  $.confirm = function(text, title, callbackOK, callbackCancel) {
	    if (typeof title === 'function') {
	      callbackCancel = arguments[2];
	      callbackOK = arguments[1];
	      title = undefined;
	    }
	    return $.modal({
	      text: text,
	      title: title,
	      buttons: [
	      {
	        text: defaults.buttonCancel,
	        className: "default",
	        onClick: callbackCancel
	      },
	      {
	        text: defaults.buttonOK,
	        className: "primary",
	        onClick: callbackOK
	      }]
	    });
	  };

	  $.prompt = function(text, title, callbackOK, callbackCancel) {
	    if (typeof title === 'function') {
	      callbackCancel = arguments[2];
	      callbackOK = arguments[1];
	      title = undefined;
	    }

	    return $.modal({
	      text: "<p class='weui-prompt-text'>"+(text || "")+"</p><input type='text' class='weui_input weui-prompt-input' id='weui-prompt-input'/>",
	      title: title,
	      buttons: [
	      {
	        text: defaults.buttonCancel,
	        className: "default",
	        onClick: callbackCancel
	      },
	      {
	        text: defaults.buttonOK,
	        className: "primary",
	        onClick: function() {
	          callbackOK && callbackOK($("#weui-prompt-input").val());
	        }
	      }]
	    });
	  };

	  defaults = $.modal.prototype.defaults = {
	    title: "提示",
	    text: undefined,
	    buttonOK: "确定",
	    buttonCancel: "取消",
	    buttons: [{
	      text: "确定",
	      className: "primary"
	    }],
	    autoClose: true //点击按钮自动关闭对话框，如果你不希望点击按钮就关闭对话框，可以把这个设置为false
	  };

	}($);

	+ function($) {
	  "use strict";

	  var defaults;
	  
	  var show = function(html, className) {

	    className = className || "";
	    var mask = $("<div class='weui_mask_transparent'></div>").appendTo(document.body);

	    var tpl = '<div class="weui_toast ' + className + '">' + html + '</div>';
	    var dialog = $(tpl).appendTo(document.body);

	    dialog.show();
	    dialog.addClass("weui_toast_visible");
	  };

	  var hide = function() {
	    $(".weui_mask_transparent").hide();
	    $(".weui_toast_visible").removeClass("weui_toast_visible").transitionEnd(function() {
	      $(this).remove();
	    });
	  }

	  $.toast = function(text, style) {
	    var className;
	    if(style == "cancel") {
	      className = "weui_toast_cancel";
	    } else if(style == "forbidden") {
	      className = "weui_toast_forbidden";
	    }
	    show('<i class="weui_icon_toast"></i><p class="weui_toast_content">' + (text || "已经完成") + '</p>', className);

	    setTimeout(function() {
	      hide();
	    }, toastDefaults.duration);
	  }

	  $.showLoading = function(text) {
	    var html = '<div class="weui_loading">';
	    for(var i=0;i<12;i++) {
	      html += '<div class="weui_loading_leaf weui_loading_leaf_' + i + '"></div>';
	    }
	    html += '</div>';
	    html += '<p class="weui_toast_content">' + (text || "数据加载中") + '</p>';
	    show(html, 'weui_loading_toast');
	  }

	  $.hideLoading = function() {
	    hide();
	  }

	  var toastDefaults = $.toast.prototype.defaults = {
	    duration: 2000
	  }

	}($);

	+ function($) {
	  "use strict";

	  var defaults;
	  
	  var show = function(params) {

	    var mask = $("<div class='weui_mask weui_actions_mask'></div>").appendTo(document.body);

	    var actions = params.actions || [];

	    var actionsHtml = actions.map(function(d, i) {
	      return '<div class="weui_actionsheet_cell ' + (d.className || "") + '">' + d.text + '</div>';
	    }).join("");

	    var tpl = '<div class="weui_actionsheet " id="weui_actionsheet">'+
	                '<div class="weui_actionsheet_menu">'+
	                actionsHtml +
	                '</div>'+
	                '<div class="weui_actionsheet_action">'+
	                  '<div class="weui_actionsheet_cell weui_actionsheet_cancel">取消</div>'+
	                  '</div>'+
	                '</div>';
	    var dialog = $(tpl).appendTo(document.body);

	    dialog.find(".weui_actionsheet_menu .weui_actionsheet_cell, .weui_actionsheet_action .weui_actionsheet_cell").each(function(i, e) {
	      $(e).click(function() {
	        $.closeActions();
	        if(actions[i] && actions[i].onClick) {
	          actions[i].onClick();
	        }
	      })
	    });

	    mask.show();
	    dialog.show();
	    mask.addClass("weui_mask_visible");
	    dialog.addClass("weui_actionsheet_toggle");
	  };

	  var hide = function() {
	    $(".weui_mask").removeClass("weui_mask_visible").transitionEnd(function() {
	      $(this).remove();
	    });
	    $(".weui_actionsheet").removeClass("weui_actionsheet_toggle").transitionEnd(function() {
	      $(this).remove();
	    });
	  }

	  $.actions = function(params) {
	    params = $.extend({}, defaults, params);
	    show(params);
	  }

	  $.closeActions = function() {
	    hide();
	  }

	  $(document).on("click", ".weui_actions_mask", function() {
	    $.closeActions();
	  });

	  var defaults = $.actions.prototype.defaults = {
	    /*actions: [{
	      text: "菜单",
	      className: "danger",
	      onClick: function() {
	        console.log(1);
	      }
	    },{
	      text: "菜单2",
	      className: "danger",
	      onClick: function() {
	        console.log(2);
	      }
	    }]*/
	  }

	}($);

	/* ===============================================================================
	************   Pull to refreh ************
	=============================================================================== */
	/* global $:true */

	+function ($) {
	  "use strict";

	  var PTR = function(el) {
	    this.container = $(el);
	    this.distance = 50;
	    this.attachEvents();
	  }

	  PTR.prototype.touchStart = function(e) {
	    if(this.container.hasClass("refreshing")) return;
	    var p = $.getTouchPosition(e);
	    this.start = p;
	    this.diffX = this.diffY = 0;
	  };

	  PTR.prototype.touchMove= function(e) {
	    if(this.container.hasClass("refreshing")) return;
	    if(!this.start) return false;
	    if(this.container.scrollTop() > 0) return;
	    var p = $.getTouchPosition(e);
	    this.diffX = p.x - this.start.x;
	    this.diffY = p.y - this.start.y;
	    if(this.diffY < 0) return;
	    this.container.addClass("touching");
	    e.preventDefault();
	    e.stopPropagation();
	    this.diffY = Math.pow(this.diffY, 0.8);
	    this.container.css("transform", "translate3d(0, "+this.diffY+"px, 0)");

	    if(this.diffY < this.distance) {
	      this.container.removeClass("pull-up").addClass("pull-down");
	    } else {
	      this.container.removeClass("pull-down").addClass("pull-up");
	    }
	  };
	  PTR.prototype.touchEnd = function() {
	    this.start = false;
	    if(this.diffY <= 0 || this.container.hasClass("refreshing")) return;
	    this.container.removeClass("touching");
	    this.container.removeClass("pull-down pull-up");
	    this.container.css("transform", "");
	    if(Math.abs(this.diffY) <= this.distance) {
	    } else {
	      this.container.addClass("refreshing");
	      this.container.trigger("pull-to-refresh");
	    }
	  };

	  PTR.prototype.attachEvents = function() {
	    var el = this.container;
	    el.addClass("weui-pull-to-refresh");
	    el.on($.touchEvents.start, $.proxy(this.touchStart, this));
	    el.on($.touchEvents.move, $.proxy(this.touchMove, this));
	    el.on($.touchEvents.end, $.proxy(this.touchEnd, this));
	  };

	  var pullToRefresh = function(el) {
	    new PTR(el);
	  };

	  var pullToRefreshDone = function(el) {
	    $(el).removeClass("refreshing");
	  }

	  $.fn.pullToRefresh = function() {
	    return this.each(function() {
	      pullToRefresh(this);
	    });
	  }

	  $.fn.pullToRefreshDone = function() {
	    return this.each(function() {
	      pullToRefreshDone(this);
	    });
	  }

	}($);

	/* ===============================================================================
	************   Notification ************
	=============================================================================== */
	/* global $:true */
	+function ($) {
	  "use strict";


	  var Infinite = function(el, distance) {
	    this.container = $(el);
	    this.container.data("infinite", this);
	    this.distance = distance || 50;
	    this.attachEvents();
	  }

	  Infinite.prototype.scroll = function() {
	    var container = this.container;
	    var offset = container.scrollHeight() - ($(window).height() + container.scrollTop());
	    if(offset <= this.distance) {
	      container.trigger("infinite");
	    }
	  }

	  Infinite.prototype.attachEvents = function(off) {
	    var el = this.container;
	    var scrollContainer = (el[0].tagName.toUpperCase() === "BODY" ? $(document) : el);
	    scrollContainer[off ? "off" : "on"]("scroll", $.proxy(this.scroll, this));
	  };
	  Infinite.prototype.detachEvents = function(off) {
	    this.attachEvents(true);
	  }

	  var infinite = function(el) {
	    attachEvents(el);
	  }

	  $.fn.infinite = function(distance) {
	    return this.each(function() {
	      new Infinite(this, distance);
	    });
	  }
	  $.fn.destroyInfinite = function() {
	    return this.each(function() {
	      var infinite = $(this).data("infinite");
	      if(infinite && infinite.detachEvents) infinite.detachEvents();
	    });
	  }

	}($);

	/* global $:true */
	+function ($) {
	  "use strict";

	  var ITEM_ON = "weui_bar_item_on";

	  var showTab = function(a) {
	    var $a = $(a);
	    if($a.hasClass(ITEM_ON)) return;
	    var href = $a.attr("href");

	    if(!/^#/.test(href)) return ;

	    $a.parent().find("."+ITEM_ON).removeClass(ITEM_ON);
	    $a.addClass(ITEM_ON);

	    var bd = $a.parents(".weui_tab").find(".weui_tab_bd");

	    bd.find(".weui_tab_bd_item_active").removeClass("weui_tab_bd_item_active");

	    $(href).addClass("weui_tab_bd_item_active");
	  }

	  $.showTab = showTab;

	  $(document).on("click", ".weui_tabbar_item, .weui_navbar_item", function(e) {
	    var $a = $(e.currentTarget);
	    var href = $a.attr("href");
	    if($a.hasClass(ITEM_ON)) return;
	    if(!/^#/.test(href)) return;

	    e.preventDefault();

	    showTab($a);
	  });

	}($);


	/* global $:true */
	+ function($) {
	  "use strict";

	  $(document).on("click", ".weui_search_bar label", function(e) {
	    $(e.target).parents(".weui_search_bar").addClass("weui_search_focusing");
	  }) 
	  .on("blur", ".weui_search_input", function(e) {
	    var $input = $(e.target);
	    if(!$input.val()) $input.parents(".weui_search_bar").removeClass("weui_search_focusing");
	  })
	  .on("click", ".weui_search_cancel", function(e) {
	    var $input = $(e.target).parents(".weui_search_bar").find(".weui_search_input").val("").blur();
	  })
	  .on("click", ".weui_icon_clear", function(e) {
	    var $input = $(e.target).parents(".weui_search_bar").find(".weui_search_input").val("").focus();
	  });

	}($);

	/*===========================
	Device/OS Detection
	===========================*/
	/* global $:true */
	;(function ($) {
	    "use strict";
	    var device = {};
	    var ua = navigator.userAgent;

	    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
	    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
	    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
	    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

	    device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;
	    
	    // Android
	    if (android) {
	        device.os = 'android';
	        device.osVersion = android[2];
	        device.android = true;
	        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
	    }
	    if (ipad || iphone || ipod) {
	        device.os = 'ios';
	        device.ios = true;
	    }
	    // iOS
	    if (iphone && !ipod) {
	        device.osVersion = iphone[2].replace(/_/g, '.');
	        device.iphone = true;
	    }
	    if (ipad) {
	        device.osVersion = ipad[2].replace(/_/g, '.');
	        device.ipad = true;
	    }
	    if (ipod) {
	        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
	        device.iphone = true;
	    }
	    // iOS 8+ changed UA
	    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
	        if (device.osVersion.split('.')[0] === '10') {
	            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
	        }
	    }

	    // Webview
	    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
	        
	    // Minimal UI
	    if (device.os && device.os === 'ios') {
	        var osVersionArr = device.osVersion.split('.');
	        device.minimalUi = !device.webView &&
	                            (ipod || iphone) &&
	                            (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
	                            $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
	    }

	    // Check for status bar and fullscreen app mode
	    var windowWidth = $(window).width();
	    var windowHeight = $(window).height();
	    device.statusBar = false;
	    if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
	        device.statusBar = true;
	    }
	    else {
	        device.statusBar = false;
	    }

	    // Classes
	    var classNames = [];

	    // Pixel Ratio
	    device.pixelRatio = window.devicePixelRatio || 1;
	    classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
	    if (device.pixelRatio >= 2) {
	        classNames.push('retina');
	    }

	    // OS classes
	    if (device.os) {
	        classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
	        if (device.os === 'ios') {
	            var major = parseInt(device.osVersion.split('.')[0], 10);
	            for (var i = major - 1; i >= 6; i--) {
	                classNames.push('ios-gt-' + i);
	            }
	        }
	        
	    }
	    // Status bar classes
	    if (device.statusBar) {
	        classNames.push('with-statusbar-overlay');
	    }
	    else {
	        $('html').removeClass('with-statusbar-overlay');
	    }

	    // Add html classes
	    if (classNames.length > 0) $('html').addClass(classNames.join(' '));

	    $.device = device;
	})($);

	/*======================================================
	************   Picker   ************
	======================================================*/
	/* global $:true */
	/* jshint unused:false */
	/* jshint multistr:true */
	+ function($) {
	  "use strict";
	  var Picker = function (params) {
	      var p = this;
	      var defaults = {
	          updateValuesOnMomentum: false,
	          updateValuesOnTouchmove: true,
	          rotateEffect: false,
	          momentumRatio: 7,
	          freeMode: false,
	          // Common settings
	          scrollToInput: true,
	          inputReadOnly: true,
	          toolbar: true,
	          toolbarCloseText: '完成',
	          title: '请选择',
	          toolbarTemplate: '<div class="toolbar">\
	          <div class="toolbar-inner">\
	          <a href="javascript:;" class="picker-button close-picker">{{closeText}}</a>\
	          <h1 class="title">{{title}}</h1>\
	          </div>\
	          </div>',
	      };
	      params = params || {};
	      for (var def in defaults) {
	          if (typeof params[def] === 'undefined') {
	              params[def] = defaults[def];
	          }
	      }
	      p.params = params;
	      p.cols = [];
	      p.initialized = false;
	      
	      // Inline flag
	      p.inline = p.params.container ? true : false;

	      // 3D Transforms origin bug, only on safari
	      var originBug = $.device.ios || (navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) && !$.device.android;

	      // Should be converted to popover
	      function isPopover() {
	          var toPopover = false;
	          if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
	          if (!p.inline && p.params.input) {
	              if (p.params.onlyInPopover) toPopover = true;
	              else {
	                  if ($.device.ios) {
	                      toPopover = $.device.ipad ? true : false;
	                  }
	                  else {
	                      if ($(window).width() >= 768) toPopover = true;
	                  }
	              }
	          } 
	          return toPopover; 
	      }
	      function inPopover() {
	          if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;
	          else return false;
	      }

	      // Value
	      p.setValue = function (arrValues, transition) {
	          var valueIndex = 0;
	          for (var i = 0; i < p.cols.length; i++) {
	              if (p.cols[i] && !p.cols[i].divider) {
	                  p.cols[i].setValue(arrValues[valueIndex], transition);
	                  valueIndex++;
	              }
	          }
	      };
	      p.updateValue = function () {
	          var newValue = [];
	          var newDisplayValue = [];
	          for (var i = 0; i < p.cols.length; i++) {
	              if (!p.cols[i].divider) {
	                  newValue.push(p.cols[i].value);
	                  newDisplayValue.push(p.cols[i].displayValue);
	              }
	          }
	          if (newValue.indexOf(undefined) >= 0) {
	              return;
	          }
	          p.value = newValue;
	          p.displayValue = newDisplayValue;
	          if (p.params.onChange) {
	              p.params.onChange(p, p.value, p.displayValue);
	          }
	          if (p.input && p.input.length > 0) {
	              $(p.input).val(p.params.formatValue ? p.params.formatValue(p, p.value, p.displayValue) : p.value.join(' '));
	              $(p.input).trigger('change');
	          }
	      };

	      // Columns Handlers
	      p.initPickerCol = function (colElement, updateItems) {
	          var colContainer = $(colElement);
	          var colIndex = colContainer.index();
	          var col = p.cols[colIndex];
	          if (col.divider) return;
	          col.container = colContainer;
	          col.wrapper = col.container.find('.picker-items-col-wrapper');
	          col.items = col.wrapper.find('.picker-item');
	          
	          var i, j;
	          var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
	          col.replaceValues = function (values, displayValues) {
	              col.destroyEvents();
	              col.values = values;
	              col.displayValues = displayValues;
	              var newItemsHTML = p.columnHTML(col, true);
	              col.wrapper.html(newItemsHTML);
	              col.items = col.wrapper.find('.picker-item');
	              col.calcSize();
	              col.setValue(col.values[0], 0, true);
	              col.initEvents();
	          };
	          col.calcSize = function () {
	              if (p.params.rotateEffect) {
	                  col.container.removeClass('picker-items-col-absolute');
	                  if (!col.width) col.container.css({width:''});
	              }
	              var colWidth, colHeight;
	              colWidth = 0;
	              colHeight = col.container[0].offsetHeight;
	              wrapperHeight = col.wrapper[0].offsetHeight;
	              itemHeight = col.items[0].offsetHeight;
	              itemsHeight = itemHeight * col.items.length;
	              minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
	              maxTranslate = colHeight / 2 - itemHeight / 2;    
	              if (col.width) {
	                  colWidth = col.width;
	                  if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
	                  col.container.css({width: colWidth});
	              }
	              if (p.params.rotateEffect) {
	                  if (!col.width) {
	                      col.items.each(function () {
	                          var item = $(this);
	                          item.css({width:'auto'});
	                          colWidth = Math.max(colWidth, item[0].offsetWidth);
	                          item.css({width:''});
	                      });
	                      col.container.css({width: (colWidth + 2) + 'px'});
	                  }
	                  col.container.addClass('picker-items-col-absolute');
	              }
	          };
	          col.calcSize();
	          
	          col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);


	          var activeIndex = 0;
	          var animationFrameId;

	          // Set Value Function
	          col.setValue = function (newValue, transition, valueCallbacks) {
	              if (typeof transition === 'undefined') transition = '';
	              var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
	              if(typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
	                  return;
	              }
	              var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
	              // Update wrapper
	              col.wrapper.transition(transition);
	              col.wrapper.transform('translate3d(0,' + (newTranslate) + 'px,0)');
	                  
	              // Watch items
	              if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex ) {
	                  $.cancelAnimationFrame(animationFrameId);
	                  col.wrapper.transitionEnd(function(){
	                      $.cancelAnimationFrame(animationFrameId);
	                  });
	                  updateDuringScroll();
	              }

	              // Update items
	              col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
	          };

	          col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
	              if (typeof translate === 'undefined') {
	                  translate = $.getTranslate(col.wrapper[0], 'y');
	              }
	              if(typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate)/itemHeight);
	              if (activeIndex < 0) activeIndex = 0;
	              if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
	              var previousActiveIndex = col.activeIndex;
	              col.activeIndex = activeIndex;
	              /*
	              col.wrapper.find('.picker-selected, .picker-after-selected, .picker-before-selected').removeClass('picker-selected picker-after-selected picker-before-selected');

	              col.items.transition(transition);
	              var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');
	              var prevItems = selectedItem.prevAll().addClass('picker-before-selected');
	              var nextItems = selectedItem.nextAll().addClass('picker-after-selected');
	              */
	              //去掉 .picker-after-selected, .picker-before-selected 以提高性能
	              col.wrapper.find('.picker-selected').removeClass('picker-selected');
	              if (p.params.rotateEffect) {
	                col.items.transition(transition);
	              }
	              var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');

	              if (valueCallbacks || typeof valueCallbacks === 'undefined') {
	                  // Update values
	                  col.value = selectedItem.attr('data-picker-value');
	                  col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
	                  // On change callback
	                  if (previousActiveIndex !== activeIndex) {
	                      if (col.onChange) {
	                          col.onChange(p, col.value, col.displayValue);
	                      }
	                      p.updateValue();
	                  }
	              }
	                  
	              // Set 3D rotate effect
	              if (!p.params.rotateEffect) {
	                  return;
	              }
	              var percentage = (translate - (Math.floor((translate - maxTranslate)/itemHeight) * itemHeight + maxTranslate)) / itemHeight;
	              
	              col.items.each(function () {
	                  var item = $(this);
	                  var itemOffsetTop = item.index() * itemHeight;
	                  var translateOffset = maxTranslate - translate;
	                  var itemOffset = itemOffsetTop - translateOffset;
	                  var percentage = itemOffset / itemHeight;

	                  var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;
	                  
	                  var angle = (-18*percentage);
	                  if (angle > 180) angle = 180;
	                  if (angle < -180) angle = -180;
	                  // Far class
	                  if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');
	                  else item.removeClass('picker-item-far');
	                  // Set transform
	                  item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
	              });
	          };

	          function updateDuringScroll() {
	              animationFrameId = $.requestAnimationFrame(function () {
	                  col.updateItems(undefined, undefined, 0);
	                  updateDuringScroll();
	              });
	          }

	          // Update items on init
	          if (updateItems) col.updateItems(0, maxTranslate, 0);

	          var allowItemClick = true;
	          var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;
	          function handleTouchStart (e) {
	              if (isMoved || isTouched) return;
	              e.preventDefault();
	              isTouched = true;
	              var position = $.getTouchPosition(e);
	              touchStartY = touchCurrentY = position.y;
	              touchStartTime = (new Date()).getTime();
	              
	              allowItemClick = true;
	              startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
	          }
	          function handleTouchMove (e) {
	              if (!isTouched) return;
	              e.preventDefault();
	              allowItemClick = false;
	              var position = $.getTouchPosition(e);
	              touchCurrentY = position.y;
	              if (!isMoved) {
	                  // First move
	                  $.cancelAnimationFrame(animationFrameId);
	                  isMoved = true;
	                  startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
	                  col.wrapper.transition(0);
	              }
	              e.preventDefault();

	              var diff = touchCurrentY - touchStartY;
	              currentTranslate = startTranslate + diff;
	              returnTo = undefined;

	              // Normalize translate
	              if (currentTranslate < minTranslate) {
	                  currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
	                  returnTo = 'min';
	              }
	              if (currentTranslate > maxTranslate) {
	                  currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
	                  returnTo = 'max';
	              }
	              // Transform wrapper
	              col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

	              // Update items
	              col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);
	              
	              // Calc velocity
	              velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
	              velocityTime = (new Date()).getTime();
	              prevTranslate = currentTranslate;
	          }
	          function handleTouchEnd (e) {
	              if (!isTouched || !isMoved) {
	                  isTouched = isMoved = false;
	                  return;
	              }
	              isTouched = isMoved = false;
	              col.wrapper.transition('');
	              if (returnTo) {
	                  if (returnTo === 'min') {
	                      col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
	                  }
	                  else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
	              }
	              touchEndTime = new Date().getTime();
	              var velocity, newTranslate;
	              if (touchEndTime - touchStartTime > 300) {
	                  newTranslate = currentTranslate;
	              }
	              else {
	                  velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
	                  newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
	              }

	              newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

	              // Active Index
	              var activeIndex = -Math.floor((newTranslate - maxTranslate)/itemHeight);

	              // Normalize translate
	              if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

	              // Transform wrapper
	              col.wrapper.transform('translate3d(0,' + (parseInt(newTranslate,10)) + 'px,0)');

	              // Update items
	              col.updateItems(activeIndex, newTranslate, '', true);

	              // Watch items
	              if (p.params.updateValuesOnMomentum) {
	                  updateDuringScroll();
	                  col.wrapper.transitionEnd(function(){
	                      $.cancelAnimationFrame(animationFrameId);
	                  });
	              }

	              // Allow click
	              setTimeout(function () {
	                  allowItemClick = true;
	              }, 100);
	          }

	          function handleClick(e) {
	              if (!allowItemClick) return;
	              $.cancelAnimationFrame(animationFrameId);
	              /*jshint validthis:true */
	              var value = $(this).attr('data-picker-value');
	              col.setValue(value);
	          }

	          col.initEvents = function (detach) {
	              var method = detach ? 'off' : 'on';
	              col.container[method]($.touchEvents.start, handleTouchStart);
	              col.container[method]($.touchEvents.move, handleTouchMove);
	              col.container[method]($.touchEvents.end, handleTouchEnd);
	              col.items[method]('click', handleClick);
	          };
	          col.destroyEvents = function () {
	              col.initEvents(true);
	          };

	          col.container[0].f7DestroyPickerCol = function () {
	              col.destroyEvents();
	          };

	          col.initEvents();

	      };
	      p.destroyPickerCol = function (colContainer) {
	          colContainer = $(colContainer);
	          if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
	      };
	      // Resize cols
	      function resizeCols() {
	          if (!p.opened) return;
	          for (var i = 0; i < p.cols.length; i++) {
	              if (!p.cols[i].divider) {
	                  p.cols[i].calcSize();
	                  p.cols[i].setValue(p.cols[i].value, 0, false);
	              }
	          }
	      }
	      $(window).on('resize', resizeCols);

	      // HTML Layout
	      p.columnHTML = function (col, onlyItems) {
	          var columnItemsHTML = '';
	          var columnHTML = '';
	          if (col.divider) {
	              columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
	          }
	          else {
	              for (var j = 0; j < col.values.length; j++) {
	                  columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
	              }
	              columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
	          }
	          return onlyItems ? columnItemsHTML : columnHTML;
	      };
	      p.layout = function () {
	          var pickerHTML = '';
	          var pickerClass = '';
	          var i;
	          p.cols = [];
	          var colsHTML = '';
	          for (i = 0; i < p.params.cols.length; i++) {
	              var col = p.params.cols[i];
	              colsHTML += p.columnHTML(p.params.cols[i]);
	              p.cols.push(col);
	          }
	          pickerClass = 'weui-picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '');
	          pickerHTML =
	              '<div class="' + (pickerClass) + '">' +
	                  (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText).replace(/{{title}}/g, p.params.title) : '') +
	                  '<div class="picker-modal-inner picker-items">' +
	                      colsHTML +
	                      '<div class="picker-center-highlight"></div>' +
	                  '</div>' +
	              '</div>';
	              
	          p.pickerHTML = pickerHTML;    
	      };

	      // Input Events
	      function openOnInput(e) {
	          e.preventDefault();
	          if (p.opened) return;
	          p.open();
	          if (p.params.scrollToInput && !isPopover()) {
	              var pageContent = p.input.parents('.content');
	              if (pageContent.length === 0) return;

	              var paddingTop = parseInt(pageContent.css('padding-top'), 10),
	                  paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
	                  pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
	                  pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
	                  newPaddingBottom;
	              var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
	              if (inputTop > pageHeight) {
	                  var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
	                  if (scrollTop + pageHeight > pageScrollHeight) {
	                      newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
	                      if (pageHeight === pageScrollHeight) {
	                          newPaddingBottom = p.container.height();
	                      }
	                      pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
	                  }
	                  pageContent.scrollTop(scrollTop, 300);
	              }
	          }
	      }
	      function closeOnHTMLClick(e) {
	          if (inPopover()) return;
	          if (p.input && p.input.length > 0) {
	              if (e.target !== p.input[0] && $(e.target).parents('.weui-picker-modal').length === 0) p.close();
	          }
	          else {
	              if ($(e.target).parents('.weui-picker-modal').length === 0) p.close();   
	          }
	      }

	      if (p.params.input) {
	          p.input = $(p.params.input);
	          if (p.input.length > 0) {
	              if (p.params.inputReadOnly) p.input.prop('readOnly', true);
	              if (!p.inline) {
	                  p.input.on('click', openOnInput);    
	              }
	              if (p.params.inputReadOnly) {
	                  p.input.on('focus mousedown', function (e) {
	                      e.preventDefault();
	                  });
	              }
	          }
	              
	      }
	      
	      if (!p.inline) $('html').on('click', closeOnHTMLClick);

	      // Open
	      function onPickerClose() {
	          p.opened = false;
	          if (p.input && p.input.length > 0) p.input.parents('.page-content').css({'padding-bottom': ''});
	          if (p.params.onClose) p.params.onClose(p);

	          // Destroy events
	          p.container.find('.picker-items-col').each(function () {
	              p.destroyPickerCol(this);
	          });
	      }

	      p.opened = false;
	      p.open = function () {
	          var toPopover = isPopover();

	          if (!p.opened) {

	              // Layout
	              p.layout();

	              // Append
	              if (toPopover) {
	                  p.pickerHTML = '<div class="popover popover-picker-columns"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
	                  p.popover = $.popover(p.pickerHTML, p.params.input, true);
	                  p.container = $(p.popover).find('.weui-picker-modal');
	                  $(p.popover).on('close', function () {
	                      onPickerClose();
	                  });
	              }
	              else if (p.inline) {
	                  p.container = $(p.pickerHTML);
	                  p.container.addClass('picker-modal-inline');
	                  $(p.params.container).append(p.container);
	              }
	              else {
	                  p.container = $($.openPicker(p.pickerHTML));
	                  $(p.container)
	                  .on('close', function () {
	                      onPickerClose();
	                  });
	              }

	              // Store picker instance
	              p.container[0].f7Picker = p;

	              // Init Events
	              p.container.find('.picker-items-col').each(function () {
	                  var updateItems = true;
	                  if ((!p.initialized && p.params.value) || (p.initialized && p.value)) updateItems = false;
	                  p.initPickerCol(this, updateItems);
	              });
	              
	              // Set value
	              if (!p.initialized) {
	                  if (p.params.value) {
	                      p.setValue(p.params.value, 0);
	                  }
	              }
	              else {
	                  if (p.value) p.setValue(p.value, 0);
	              }
	          }

	          // Set flag
	          p.opened = true;
	          p.initialized = true;

	          if (p.params.onOpen) p.params.onOpen(p);
	      };

	      // Close
	      p.close = function () {
	          if (!p.opened || p.inline) return;
	          if (inPopover()) {
	              $.closePicker(p.popover);
	              return;
	          }
	          else {
	              $.closePicker(p.container);
	              return;
	          }
	      };

	      // Destroy
	      p.destroy = function () {
	          p.close();
	          if (p.params.input && p.input.length > 0) {
	              p.input.off('click focus', openOnInput);
	          }
	          $('html').off('click', closeOnHTMLClick);
	          $(window).off('resize', resizeCols);
	      };

	      if (p.inline) {
	          p.open();
	      }

	      return p;
	  };

	  $(document).on("click", ".close-picker", function() {
	    var pickerToClose = $('.weui-picker-modal.weui-picker-modal-visible');
	    if (pickerToClose.length > 0) {
	      $.closePicker(pickerToClose);
	    }
	  });

	  //修复picker会滚动页面的bug
	  $(document).on($.touchEvents.move, ".picker-modal-inner", function(e) {
	    e.preventDefault();
	  });


	  $.openPicker = function(tpl, className) {

	    $.closePicker();

	    var container = $("<div class='weui-picker-container "+ (className || "") + "'></div>").appendTo(document.body);
	    container.show();

	    container.addClass("weui-picker-container-visible");

	    //关于布局的问题，如果直接放在body上，则做动画的时候会撑开body高度而导致滚动条变化。
	    var dialog = $(tpl).appendTo(container);
	    
	    dialog.width(); //通过取一次CSS值，强制浏览器不能把上下两行代码合并执行，因为合并之后会导致无法出现动画。

	    dialog.addClass("weui-picker-modal-visible");

	    return dialog;
	  }


	  $.closePicker = function(container) {
	    $(".weui-picker-modal-visible").removeClass("weui-picker-modal-visible").transitionEnd(function() {
	      $(this).parent().remove();
	    }).trigger("close");

	  };
	  $.fn.picker = function(params) {
	    var args = arguments;
	    return this.each(function() {
	      if(!this) return;
	      var $this = $(this);
	      
	      var picker = $this.data("picker");
	      if(!picker) {
	        params = params || {};
	        var inputValue = $this.val();
	        if(params.value === undefined && inputValue !== "") {
	          params.value = params.cols.length > 1 ? inputValue.split(" ") : [inputValue];
	        }
	        var p = $.extend({input: this}, params);
	        picker = new Picker(p);
	        $this.data("picker", picker);
	      }
	      if(typeof params === typeof "a") {
	        picker[params].apply(picker, Array.prototype.slice.call(args, 1));
	      }
	    });
	  };
	}($);

	/* global $:true */
	+ function($) {
	  "use strict";

	  var defaults;

	  var Select = function(input, config) {

	    var self = this;
	    this.config = config;

	    this.$input = $(input);
	    var tpl = $.t7.compile("<div class='weui-picker-modal weui-select-modal'>" + config.toolbarTemplate + (config.multi ? config.checkboxTemplate : config.radioTemplate) + "</div>");
	    this.$input.prop("readOnly", true);
	    

	    this.$input.click(function() {
	      self.parseInitValue();
	      var dialog = self.dialog = $.openPicker(tpl({
	        items: config.items,
	        title: config.title,
	        closeText: config.closeText
	      }));

	      dialog.on("change", function(e) {
	        var checked = dialog.find("input:checked");
	        var values = checked.map(function() {
	          return $(this).val();
	        });
	        var titles = checked.map(function() {
	          return $(this).data("title");
	        });
	        self.updateInputValue(values, titles);

	        if(config.autoClose && !config.multi) $.closePicker();
	      });

	    });

	    $(document).on("click", function() {
	    });

	  }

	  Select.prototype.updateInputValue = function(values, titles) {
	    var v, t;
	    if(this.config.multi) {
	      v = values.join(this.config.split);
	      t = titles.join(this.config.split);
	    } else {
	      v = values[0];
	      t = titles[0];
	    }

	    this.$input.val(t).data("values", v);
	    this.$input.attr("value", t).attr("data-values", v);
	  }

	  Select.prototype.parseInitValue = function() {
	    var value = this.$input.val();
	    var items = this.config.items;
	    if(value === undefined || value == null || value === "") return;

	    var titles = this.config.multi ? value.split(this.config.split) : [value];
	    for(var i=0;i<items.length;i++) {
	      items[i].checked = false;
	      for(var j=0;j<titles.length;j++) {
	        if(items[i].title === titles[j]) {
	          items[i].checked = true;
	        }
	      }
	    }
	  }

	  $.fn.select = function(params) {
	    var config = $.extend({}, defaults, params);
	    if(!config.items || !config.items.length) return;

	    config.items = config.items.map(function(d, i) {
	      if(typeof d == typeof "a") {
	        return {
	          title: d,
	          value: d
	        };
	      }

	      return d;
	    });


	    return this.each(function() {
	      var $this = $(this);
	      if(!$this.data("weui-select")) $this.data("weui-select", new Select(this, config));

	      var select = $this.data("weui-select");

	      return select;
	    });
	  }

	  defaults = $.fn.select.prototype.defaults = {
	    items: [],
	    title: "请选择",
	    multi: false,
	    closeText: "关闭",
	    autoClose: true, //是否选择完成后自动关闭，只有单选模式下才有效
	    split: ",",  //多选模式下的分隔符
	    toolbarTemplate: '<div class="toolbar">\
	      <div class="toolbar-inner">\
	      <a href="javascript:;" class="picker-button close-picker">{{closeText}}</a>\
	      <h1 class="title">{{title}}</h1>\
	      </div>\
	      </div>',
	    radioTemplate:
	      '<div class="weui_cells weui_cells_radio">\
	        {{#items}}\
	        <label class="weui_cell weui_check_label" for="weui-select-id-{{this.title}}">\
	          <div class="weui_cell_bd weui_cell_primary">\
	            <p>{{this.title}}</p>\
	          </div>\
	          <div class="weui_cell_ft">\
	            <input type="radio" class="weui_check" name="weui-select" id="weui-select-id-{{this.title}}" value="{{this.value}}" {{#if this.checked}}checked="checked"{{/if}} data-title="{{this.title}}">\
	            <span class="weui_icon_checked"></span>\
	          </div>\
	        </label>\
	        {{/items}}\
	      </div>',
	    checkboxTemplate:
	      '<div class="weui_cells weui_cells_checkbox">\
	        {{#items}}\
	        <label class="weui_cell weui_check_label" for="weui-select-id-{{this.title}}">\
	          <div class="weui_cell_bd weui_cell_primary">\
	            <p>{{this.title}}</p>\
	          </div>\
	          <div class="weui_cell_ft">\
	            <input type="checkbox" class="weui_check" name="weui-select" id="weui-select-id-{{this.title}}" value="{{this.value}}" {{#if this.checked}}checked="checked"{{/if}} data-title="{{this.title}}" >\
	            <span class="weui_icon_checked"></span>\
	          </div>\
	        </label>\
	        {{/items}}\
	      </div>',
	  }

	}($);

	/*======================================================
	************   Calendar   ************
	======================================================*/
	/* global $:true */
	/*jshint unused: false*/
	+function ($) {
	  "use strict";
	  var rtl = false;
	  var defaults;
	  var Calendar = function (params) {
	      var p = this;
	      params = params || {};
	      for (var def in defaults) {
	          if (typeof params[def] === 'undefined') {
	              params[def] = defaults[def];
	          }
	      }
	      p.params = params;
	      p.initialized = false;

	      // Inline flag
	      p.inline = p.params.container ? true : false;

	      // Is horizontal
	      p.isH = p.params.direction === 'horizontal';

	      // RTL inverter
	      var inverter = p.isH ? (rtl ? -1 : 1) : 1;

	      // Animating flag
	      p.animating = false;

	      // Should be converted to popover
	      function isPopover() {
	          var toPopover = false;
	          if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
	          if (!p.inline && p.params.input) {
	              if (p.params.onlyInPopover) toPopover = true;
	              else {
	                  if ($.device.ios) {
	                      toPopover = $.device.ipad ? true : false;
	                  }
	                  else {
	                      if ($(window).width() >= 768) toPopover = true;
	                  }
	              }
	          } 
	          return toPopover; 
	      }
	      function inPopover() {
	          if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;
	          else return false;
	      }

	      // Format date
	      function formatDate(date) {
	          date = new Date(date);
	          var year = date.getFullYear();
	          var month = date.getMonth();
	          var month1 = month + 1;
	          var day = date.getDate();
	          var weekDay = date.getDay();
	          return p.params.dateFormat
	              .replace(/yyyy/g, year)
	              .replace(/yy/g, (year + '').substring(2))
	              .replace(/mm/g, month1 < 10 ? '0' + month1 : month1)
	              .replace(/m/g, month1)
	              .replace(/MM/g, p.params.monthNames[month])
	              .replace(/M/g, p.params.monthNamesShort[month])
	              .replace(/dd/g, day < 10 ? '0' + day : day)
	              .replace(/d/g, day)
	              .replace(/DD/g, p.params.dayNames[weekDay])
	              .replace(/D/g, p.params.dayNamesShort[weekDay]);
	      }


	      // Value
	      p.addValue = function (value) {
	          if (p.params.multiple) {
	              if (!p.value) p.value = [];
	              var inValuesIndex;
	              for (var i = 0; i < p.value.length; i++) {
	                  if (new Date(value).getTime() === new Date(p.value[i]).getTime()) {
	                      inValuesIndex = i;
	                  }
	              }
	              if (typeof inValuesIndex === 'undefined') {
	                  p.value.push(value);
	              }
	              else {
	                  p.value.splice(inValuesIndex, 1);
	              }
	              p.updateValue();
	          }
	          else {
	              p.value = [value];
	              p.updateValue();
	          }
	      };
	      p.setValue = function (arrValues) {
	          p.value = arrValues;
	          p.updateValue();   
	      };
	      p.updateValue = function () {
	          p.wrapper.find('.picker-calendar-day-selected').removeClass('picker-calendar-day-selected');
	          var i, inputValue;
	          for (i = 0; i < p.value.length; i++) {
	              var valueDate = new Date(p.value[i]);
	              p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]').addClass('picker-calendar-day-selected');
	          }
	          if (p.params.onChange) {
	              p.params.onChange(p, p.value, p.value.map(formatDate));
	          }
	          if (p.input && p.input.length > 0) {
	              if (p.params.formatValue) inputValue = p.params.formatValue(p, p.value);
	              else {
	                  inputValue = [];
	                  for (i = 0; i < p.value.length; i++) {
	                      inputValue.push(formatDate(p.value[i]));
	                  }
	                  inputValue = inputValue.join(', ');
	              } 
	              $(p.input).val(inputValue);
	              $(p.input).trigger('change');
	          }
	      };

	      // Columns Handlers
	      p.initCalendarEvents = function () {
	          var col;
	          var allowItemClick = true;
	          var isTouched, isMoved, touchStartX, touchStartY, touchCurrentX, touchCurrentY, touchStartTime, touchEndTime, startTranslate, currentTranslate, wrapperWidth, wrapperHeight, percentage, touchesDiff, isScrolling;
	          function handleTouchStart (e) {
	              if (isMoved || isTouched) return;
	              // e.preventDefault();
	              isTouched = true;
	              var position = $.getTouchPosition(e);
	              touchStartX = touchCurrentY = position.x;
	              touchStartY = touchCurrentY = position.y;
	              touchStartTime = (new Date()).getTime();
	              percentage = 0;
	              allowItemClick = true;
	              isScrolling = undefined;
	              startTranslate = currentTranslate = p.monthsTranslate;
	          }
	          function handleTouchMove (e) {
	              if (!isTouched) return;
	              var position = $.getTouchPosition(e);
	              touchCurrentX = position.x;
	              touchCurrentY = position.y;
	              if (typeof isScrolling === 'undefined') {
	                  isScrolling = !!(isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX));
	              }
	              if (p.isH && isScrolling) {
	                  isTouched = false;
	                  return;
	              }
	              e.preventDefault();
	              if (p.animating) {
	                  isTouched = false;
	                  return;   
	              }
	              allowItemClick = false;
	              if (!isMoved) {
	                  // First move
	                  isMoved = true;
	                  wrapperWidth = p.wrapper[0].offsetWidth;
	                  wrapperHeight = p.wrapper[0].offsetHeight;
	                  p.wrapper.transition(0);
	              }
	              e.preventDefault();

	              touchesDiff = p.isH ? touchCurrentX - touchStartX : touchCurrentY - touchStartY;
	              percentage = touchesDiff/(p.isH ? wrapperWidth : wrapperHeight);
	              currentTranslate = (p.monthsTranslate * inverter + percentage) * 100;

	              // Transform wrapper
	              p.wrapper.transform('translate3d(' + (p.isH ? currentTranslate : 0) + '%, ' + (p.isH ? 0 : currentTranslate) + '%, 0)');

	          }
	          function handleTouchEnd (e) {
	              if (!isTouched || !isMoved) {
	                  isTouched = isMoved = false;
	                  return;
	              }
	              isTouched = isMoved = false;
	              
	              touchEndTime = new Date().getTime();
	              if (touchEndTime - touchStartTime < 300) {
	                  if (Math.abs(touchesDiff) < 10) {
	                      p.resetMonth();
	                  }
	                  else if (touchesDiff >= 10) {
	                      if (rtl) p.nextMonth();
	                      else p.prevMonth();
	                  }
	                  else {
	                      if (rtl) p.prevMonth();
	                      else p.nextMonth();   
	                  }
	              }
	              else {
	                  if (percentage <= -0.5) {
	                      if (rtl) p.prevMonth();
	                      else p.nextMonth();
	                  }
	                  else if (percentage >= 0.5) {
	                      if (rtl) p.nextMonth();
	                      else p.prevMonth();
	                  }
	                  else {
	                      p.resetMonth();
	                  }
	              }

	              // Allow click
	              setTimeout(function () {
	                  allowItemClick = true;
	              }, 100);
	          }

	          function handleDayClick(e) {
	              if (!allowItemClick) return;
	              var day = $(e.target).parents('.picker-calendar-day');
	              if (day.length === 0 && $(e.target).hasClass('picker-calendar-day')) {
	                  day = $(e.target);
	              }
	              if (day.length === 0) return;
	              if (day.hasClass('picker-calendar-day-selected') && !p.params.multiple) return;
	              if (day.hasClass('picker-calendar-day-disabled')) return;
	              if (day.hasClass('picker-calendar-day-next')) p.nextMonth();
	              if (day.hasClass('picker-calendar-day-prev')) p.prevMonth();
	              var dateYear = day.attr('data-year');
	              var dateMonth = day.attr('data-month');
	              var dateDay = day.attr('data-day');
	              if (p.params.onDayClick) {
	                  p.params.onDayClick(p, day[0], dateYear, dateMonth, dateDay);
	              }
	              p.addValue(new Date(dateYear, dateMonth, dateDay).getTime());
	              if (p.params.closeOnSelect) p.close();
	          }

	          p.container.find('.picker-calendar-prev-month').on('click', p.prevMonth);
	          p.container.find('.picker-calendar-next-month').on('click', p.nextMonth);
	          p.container.find('.picker-calendar-prev-year').on('click', p.prevYear);
	          p.container.find('.picker-calendar-next-year').on('click', p.nextYear);
	          p.wrapper.on('click', handleDayClick);
	          if (p.params.touchMove) {
	              p.wrapper.on($.touchEvents.start, handleTouchStart);
	              p.wrapper.on($.touchEvents.move, handleTouchMove);
	              p.wrapper.on($.touchEvents.end, handleTouchEnd);
	          }
	              
	          p.container[0].f7DestroyCalendarEvents = function () {
	              p.container.find('.picker-calendar-prev-month').off('click', p.prevMonth);
	              p.container.find('.picker-calendar-next-month').off('click', p.nextMonth);
	              p.container.find('.picker-calendar-prev-year').off('click', p.prevYear);
	              p.container.find('.picker-calendar-next-year').off('click', p.nextYear);
	              p.wrapper.off('click', handleDayClick);
	              if (p.params.touchMove) {
	                  p.wrapper.off($.touchEvents.start, handleTouchStart);
	                  p.wrapper.off($.touchEvents.move, handleTouchMove);
	                  p.wrapper.off($.touchEvents.end, handleTouchEnd);
	              }
	          };
	          

	      };
	      p.destroyCalendarEvents = function (colContainer) {
	          if ('f7DestroyCalendarEvents' in p.container[0]) p.container[0].f7DestroyCalendarEvents();
	      };

	      // Calendar Methods
	      p.daysInMonth = function (date) {
	          var d = new Date(date);
	          return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
	      };
	      p.monthHTML = function (date, offset) {
	          date = new Date(date);
	          var year = date.getFullYear(),
	              month = date.getMonth(),
	              day = date.getDate();
	          if (offset === 'next') {
	              if (month === 11) date = new Date(year + 1, 0);
	              else date = new Date(year, month + 1, 1);
	          }
	          if (offset === 'prev') {
	              if (month === 0) date = new Date(year - 1, 11);
	              else date = new Date(year, month - 1, 1);
	          }
	          if (offset === 'next' || offset === 'prev') {
	              month = date.getMonth();
	              year = date.getFullYear();
	          }
	          var daysInPrevMonth = p.daysInMonth(new Date(date.getFullYear(), date.getMonth()).getTime() - 10 * 24 * 60 * 60 * 1000),
	              daysInMonth = p.daysInMonth(date),
	              firstDayOfMonthIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
	          if (firstDayOfMonthIndex === 0) firstDayOfMonthIndex = 7;
	          
	          var dayDate, currentValues = [], i, j,
	              rows = 6, cols = 7,
	              monthHTML = '',
	              dayIndex = 0 + (p.params.firstDay - 1),    
	              today = new Date().setHours(0,0,0,0),
	              minDate = p.params.minDate ? new Date(p.params.minDate).getTime() : null,
	              maxDate = p.params.maxDate ? new Date(p.params.maxDate).getTime() : null;

	          if (p.value && p.value.length) {
	              for (i = 0; i < p.value.length; i++) {
	                  currentValues.push(new Date(p.value[i]).setHours(0,0,0,0));
	              }
	          }
	              
	          for (i = 1; i <= rows; i++) {
	              var rowHTML = '';
	              var row = i;
	              for (j = 1; j <= cols; j++) {
	                  var col = j;
	                  dayIndex ++;
	                  var dayNumber = dayIndex - firstDayOfMonthIndex;
	                  var addClass = '';
	                  if (dayNumber < 0) {
	                      dayNumber = daysInPrevMonth + dayNumber + 1;
	                      addClass += ' picker-calendar-day-prev';
	                      dayDate = new Date(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, dayNumber).getTime();
	                  }
	                  else {
	                      dayNumber = dayNumber + 1;
	                      if (dayNumber > daysInMonth) {
	                          dayNumber = dayNumber - daysInMonth;
	                          addClass += ' picker-calendar-day-next';
	                          dayDate = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? 0 : month + 1, dayNumber).getTime();
	                      }
	                      else {
	                          dayDate = new Date(year, month, dayNumber).getTime();    
	                      }
	                  }
	                  // Today
	                  if (dayDate === today) addClass += ' picker-calendar-day-today';
	                  // Selected
	                  if (currentValues.indexOf(dayDate) >= 0) addClass += ' picker-calendar-day-selected';
	                  // Weekend
	                  if (p.params.weekendDays.indexOf(col - 1) >= 0) {
	                      addClass += ' picker-calendar-day-weekend';
	                  }
	                  // Disabled
	                  if ((minDate && dayDate < minDate) || (maxDate && dayDate > maxDate)) {
	                      addClass += ' picker-calendar-day-disabled';   
	                  }

	                  dayDate = new Date(dayDate);
	                  var dayYear = dayDate.getFullYear();
	                  var dayMonth = dayDate.getMonth();
	                  rowHTML += '<div data-year="' + dayYear + '" data-month="' + dayMonth + '" data-day="' + dayNumber + '" class="picker-calendar-day' + (addClass) + '" data-date="' + (dayYear + '-' + dayMonth + '-' + dayNumber) + '"><span>'+dayNumber+'</span></div>';
	              }
	              monthHTML += '<div class="picker-calendar-row">' + rowHTML + '</div>';
	          }
	          monthHTML = '<div class="picker-calendar-month" data-year="' + year + '" data-month="' + month + '">' + monthHTML + '</div>';
	          return monthHTML;
	      };
	      p.animating = false;
	      p.updateCurrentMonthYear = function (dir) {
	          if (typeof dir === 'undefined') {
	              p.currentMonth = parseInt(p.months.eq(1).attr('data-month'), 10);
	              p.currentYear = parseInt(p.months.eq(1).attr('data-year'), 10);   
	          }
	          else {
	              p.currentMonth = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-month'), 10);
	              p.currentYear = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-year'), 10);
	          }
	          p.container.find('.current-month-value').text(p.params.monthNames[p.currentMonth]);
	          p.container.find('.current-year-value').text(p.currentYear);
	              
	      };
	      p.onMonthChangeStart = function (dir) {
	          p.updateCurrentMonthYear(dir);
	          p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
	          var currentIndex = dir === 'next' ? p.months.length - 1 : 0;

	          p.months.eq(currentIndex).addClass('picker-calendar-month-current');
	          p.months.eq(dir === 'next' ? currentIndex - 1 : currentIndex + 1).addClass(dir === 'next' ? 'picker-calendar-month-prev' : 'picker-calendar-month-next');

	          if (p.params.onMonthYearChangeStart) {
	              p.params.onMonthYearChangeStart(p, p.currentYear, p.currentMonth);
	          }
	      };
	      p.onMonthChangeEnd = function (dir, rebuildBoth) {
	          p.animating = false;
	          var nextMonthHTML, prevMonthHTML, newMonthHTML;
	          p.wrapper.find('.picker-calendar-month:not(.picker-calendar-month-prev):not(.picker-calendar-month-current):not(.picker-calendar-month-next)').remove();
	          
	          if (typeof dir === 'undefined') {
	              dir = 'next';
	              rebuildBoth = true;
	          }
	          if (!rebuildBoth) {
	              newMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), dir);
	          }
	          else {
	              p.wrapper.find('.picker-calendar-month-next, .picker-calendar-month-prev').remove();
	              prevMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'prev');
	              nextMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'next');
	          }
	          if (dir === 'next' || rebuildBoth) {
	              p.wrapper.append(newMonthHTML || nextMonthHTML);
	          }
	          if (dir === 'prev' || rebuildBoth) {
	              p.wrapper.prepend(newMonthHTML || prevMonthHTML);
	          }
	          p.months = p.wrapper.find('.picker-calendar-month');
	          p.setMonthsTranslate(p.monthsTranslate);
	          if (p.params.onMonthAdd) {
	              p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
	          }
	          if (p.params.onMonthYearChangeEnd) {
	              p.params.onMonthYearChangeEnd(p, p.currentYear, p.currentMonth);
	          }
	      };
	      p.setMonthsTranslate = function (translate) {
	          translate = translate || p.monthsTranslate || 0;
	          if (typeof p.monthsTranslate === 'undefined') p.monthsTranslate = translate;
	          p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
	          var prevMonthTranslate = -(translate + 1) * 100 * inverter;
	          var currentMonthTranslate = -translate * 100 * inverter;
	          var nextMonthTranslate = -(translate - 1) * 100 * inverter;
	          p.months.eq(0).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
	          p.months.eq(1).transform('translate3d(' + (p.isH ? currentMonthTranslate : 0) + '%, ' + (p.isH ? 0 : currentMonthTranslate) + '%, 0)').addClass('picker-calendar-month-current');
	          p.months.eq(2).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
	      };
	      p.nextMonth = function (transition) {
	          if (typeof transition === 'undefined' || typeof transition === 'object') {
	              transition = '';
	              if (!p.params.animate) transition = 0;
	          }
	          var nextMonth = parseInt(p.months.eq(p.months.length - 1).attr('data-month'), 10);
	          var nextYear = parseInt(p.months.eq(p.months.length - 1).attr('data-year'), 10);
	          var nextDate = new Date(nextYear, nextMonth);
	          var nextDateTime = nextDate.getTime();
	          var transitionEndCallback = p.animating ? false : true;
	          if (p.params.maxDate) {
	              if (nextDateTime > new Date(p.params.maxDate).getTime()) {
	                  return p.resetMonth();
	              }
	          }
	          p.monthsTranslate --;
	          if (nextMonth === p.currentMonth) {
	              var nextMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
	              var nextMonthHTML = $(p.monthHTML(nextDateTime, 'next')).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
	              p.wrapper.append(nextMonthHTML[0]);
	              p.months = p.wrapper.find('.picker-calendar-month');
	              if (p.params.onMonthAdd) {
	                  p.params.onMonthAdd(p, p.months.eq(p.months.length - 1)[0]);
	              }
	          }
	          p.animating = true;
	          p.onMonthChangeStart('next');
	          var translate = (p.monthsTranslate * 100) * inverter;

	          p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
	          if (transitionEndCallback) {
	              p.wrapper.transitionEnd(function () {
	                  p.onMonthChangeEnd('next');
	              });
	          }
	          if (!p.params.animate) {
	              p.onMonthChangeEnd('next');
	          }
	      };
	      p.prevMonth = function (transition) {
	          if (typeof transition === 'undefined' || typeof transition === 'object') {
	              transition = '';
	              if (!p.params.animate) transition = 0;
	          }
	          var prevMonth = parseInt(p.months.eq(0).attr('data-month'), 10);
	          var prevYear = parseInt(p.months.eq(0).attr('data-year'), 10);
	          var prevDate = new Date(prevYear, prevMonth + 1, -1);
	          var prevDateTime = prevDate.getTime();
	          var transitionEndCallback = p.animating ? false : true;
	          if (p.params.minDate) {
	              if (prevDateTime < new Date(p.params.minDate).getTime()) {
	                  return p.resetMonth();
	              }
	          }
	          p.monthsTranslate ++;
	          if (prevMonth === p.currentMonth) {
	              var prevMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
	              var prevMonthHTML = $(p.monthHTML(prevDateTime, 'prev')).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
	              p.wrapper.prepend(prevMonthHTML[0]);
	              p.months = p.wrapper.find('.picker-calendar-month');
	              if (p.params.onMonthAdd) {
	                  p.params.onMonthAdd(p, p.months.eq(0)[0]);
	              }
	          }
	          p.animating = true;
	          p.onMonthChangeStart('prev');
	          var translate = (p.monthsTranslate * 100) * inverter;
	          p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
	          if (transitionEndCallback) {
	              p.wrapper.transitionEnd(function () {
	                  p.onMonthChangeEnd('prev');
	              });
	          }
	          if (!p.params.animate) {
	              p.onMonthChangeEnd('prev');
	          }
	      };
	      p.resetMonth = function (transition) {
	          if (typeof transition === 'undefined') transition = '';
	          var translate = (p.monthsTranslate * 100) * inverter;
	          p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
	      };
	      p.setYearMonth = function (year, month, transition) {
	          if (typeof year === 'undefined') year = p.currentYear;
	          if (typeof month === 'undefined') month = p.currentMonth;
	          if (typeof transition === 'undefined' || typeof transition === 'object') {
	              transition = '';
	              if (!p.params.animate) transition = 0;
	          }
	          var targetDate;
	          if (year < p.currentYear) {
	              targetDate = new Date(year, month + 1, -1).getTime();
	          }
	          else {
	              targetDate = new Date(year, month).getTime();
	          }
	          if (p.params.maxDate && targetDate > new Date(p.params.maxDate).getTime()) {
	              return false;
	          }
	          if (p.params.minDate && targetDate < new Date(p.params.minDate).getTime()) {
	              return false;
	          }
	          var currentDate = new Date(p.currentYear, p.currentMonth).getTime();
	          var dir = targetDate > currentDate ? 'next' : 'prev';
	          var newMonthHTML = p.monthHTML(new Date(year, month));
	          p.monthsTranslate = p.monthsTranslate || 0;
	          var prevTranslate = p.monthsTranslate;
	          var monthTranslate, wrapperTranslate;
	          var transitionEndCallback = p.animating ? false : true;
	          if (targetDate > currentDate) {
	              // To next
	              p.monthsTranslate --;
	              if (!p.animating) p.months.eq(p.months.length - 1).remove();
	              p.wrapper.append(newMonthHTML);
	              p.months = p.wrapper.find('.picker-calendar-month');
	              monthTranslate = -(prevTranslate - 1) * 100 * inverter;
	              p.months.eq(p.months.length - 1).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
	          }
	          else {
	              // To prev
	              p.monthsTranslate ++;
	              if (!p.animating) p.months.eq(0).remove();
	              p.wrapper.prepend(newMonthHTML);
	              p.months = p.wrapper.find('.picker-calendar-month');
	              monthTranslate = -(prevTranslate + 1) * 100 * inverter;
	              p.months.eq(0).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
	          }
	          if (p.params.onMonthAdd) {
	              p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
	          }
	          p.animating = true;
	          p.onMonthChangeStart(dir);
	          wrapperTranslate = (p.monthsTranslate * 100) * inverter;
	          p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? wrapperTranslate : 0) + '%, ' + (p.isH ? 0 : wrapperTranslate) + '%, 0)');
	          if (transitionEndCallback) {
	             p.wrapper.transitionEnd(function () {
	                  p.onMonthChangeEnd(dir, true);
	              }); 
	          }
	          if (!p.params.animate) {
	              p.onMonthChangeEnd(dir);
	          }
	      };
	      p.nextYear = function () {
	          p.setYearMonth(p.currentYear + 1);
	      };
	      p.prevYear = function () {
	          p.setYearMonth(p.currentYear - 1);
	      };
	      

	      // HTML Layout
	      p.layout = function () {
	          var pickerHTML = '';
	          var pickerClass = '';
	          var i;
	          
	          var layoutDate = p.value && p.value.length ? p.value[0] : new Date().setHours(0,0,0,0);
	          var prevMonthHTML = p.monthHTML(layoutDate, 'prev');
	          var currentMonthHTML = p.monthHTML(layoutDate);
	          var nextMonthHTML = p.monthHTML(layoutDate, 'next');
	          var monthsHTML = '<div class="picker-calendar-months"><div class="picker-calendar-months-wrapper">' + (prevMonthHTML + currentMonthHTML + nextMonthHTML) + '</div></div>';
	          // Week days header
	          var weekHeaderHTML = '';
	          if (p.params.weekHeader) {
	              for (i = 0; i < 7; i++) {
	                  var weekDayIndex = (i + p.params.firstDay > 6) ? (i - 7 + p.params.firstDay) : (i + p.params.firstDay);
	                  var dayName = p.params.dayNamesShort[weekDayIndex];
	                  weekHeaderHTML += '<div class="picker-calendar-week-day ' + ((p.params.weekendDays.indexOf(weekDayIndex) >= 0) ? 'picker-calendar-week-day-weekend' : '') + '"> ' + dayName + '</div>';
	                  
	              }
	              weekHeaderHTML = '<div class="picker-calendar-week-days">' + weekHeaderHTML + '</div>';
	          }
	          pickerClass = 'weui-picker-modal weui-picker-calendar ' + (p.params.cssClass || '');
	          var toolbarHTML = p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';
	          if (p.params.toolbar) {
	              toolbarHTML = p.params.toolbarTemplate
	                  .replace(/{{closeText}}/g, p.params.toolbarCloseText)
	                  .replace(/{{monthPicker}}/g, (p.params.monthPicker ? p.params.monthPickerTemplate : ''))
	                  .replace(/{{yearPicker}}/g, (p.params.yearPicker ? p.params.yearPickerTemplate : ''));
	          }

	          pickerHTML =
	              '<div class="' + (pickerClass) + '">' +
	                  toolbarHTML +
	                  '<div class="picker-modal-inner">' +
	                      weekHeaderHTML +
	                      monthsHTML +
	                  '</div>' +
	              '</div>';
	              
	              
	          p.pickerHTML = pickerHTML;    
	      };

	      // Input Events
	      function openOnInput(e) {
	          e.preventDefault();
	          if (p.opened) return;
	          p.open();
	          if (p.params.scrollToInput && !isPopover()) {
	              var pageContent = p.input.parents('.page-content');
	              if (pageContent.length === 0) return;

	              var paddingTop = parseInt(pageContent.css('padding-top'), 10),
	                  paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
	                  pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
	                  pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
	                  newPaddingBottom;

	              var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
	              if (inputTop > pageHeight) {
	                  var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
	                  if (scrollTop + pageHeight > pageScrollHeight) {
	                      newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
	                      if (pageHeight === pageScrollHeight) {
	                          newPaddingBottom = p.container.height();
	                      }
	                      pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
	                  }
	                  pageContent.scrollTop(scrollTop, 300);
	              }
	          }
	      }
	      function closeOnHTMLClick(e) {
	          if (inPopover()) return;
	          if (p.input && p.input.length > 0) {
	              if (e.target !== p.input[0] && $(e.target).parents('.weui-picker-modal').length === 0) p.close();
	          }
	          else {
	              if ($(e.target).parents('.weui-picker-modal').length === 0) p.close();   
	          }
	      }

	      if (p.params.input) {
	          p.input = $(p.params.input);
	          if (p.input.length > 0) {
	              if (p.params.inputReadOnly) p.input.prop('readOnly', true);
	              if (!p.inline) {
	                  p.input.on('click', openOnInput);    
	              }
	              if (p.params.inputReadOnly) {
	                  p.input.on('focus mousedown', function (e) {
	                      e.preventDefault();
	                  });
	              }
	          }
	              
	      }
	      
	      //iphone 上无法正确触发 click，会导致点击外面无法关闭
	      if (!p.inline) $(document).on('click touchend', closeOnHTMLClick);

	      // Open
	      function onPickerClose() {
	          p.opened = false;
	          if (p.input && p.input.length > 0) p.input.parents('.page-content').css({'padding-bottom': ''});
	          if (p.params.onClose) p.params.onClose(p);

	          // Destroy events
	          p.destroyCalendarEvents();
	      }

	      p.opened = false;
	      p.open = function () {
	          var toPopover = isPopover();
	          var updateValue = false;
	          if (!p.opened) {
	              // Set date value
	              if (!p.value) {
	                  if (p.params.value) {
	                      p.value = p.params.value;
	                      updateValue = true;
	                  }
	              }

	              // Layout
	              p.layout();

	              // Append
	              if (toPopover) {
	                  p.pickerHTML = '<div class="popover popover-picker-calendar"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
	                  p.popover = $.popover(p.pickerHTML, p.params.input, true);
	                  p.container = $(p.popover).find('.weui-picker-modal');
	                  $(p.popover).on('close', function () {
	                      onPickerClose();
	                  });
	              }
	              else if (p.inline) {
	                  p.container = $(p.pickerHTML);
	                  p.container.addClass('picker-modal-inline');
	                  $(p.params.container).append(p.container);
	              }
	              else {
	                  p.container = $($.openPicker(p.pickerHTML));
	                  $(p.container)
	                  .on('close', function () {
	                      onPickerClose();
	                  });
	              }

	              // Store calendar instance
	              p.container[0].f7Calendar = p;
	              p.wrapper = p.container.find('.picker-calendar-months-wrapper');

	              // Months
	              p.months = p.wrapper.find('.picker-calendar-month');

	              // Update current month and year
	              p.updateCurrentMonthYear();

	              // Set initial translate
	              p.monthsTranslate = 0;
	              p.setMonthsTranslate();

	              // Init events
	              p.initCalendarEvents();

	              // Update input value
	              if (updateValue) p.updateValue();
	              
	          }

	          // Set flag
	          p.opened = true;
	          p.initialized = true;
	          if (p.params.onMonthAdd) {
	              p.months.each(function () {
	                  p.params.onMonthAdd(p, this);
	              });
	          }
	          if (p.params.onOpen) p.params.onOpen(p);
	      };

	      // Close
	      p.close = function () {
	          if (!p.opened || p.inline) return;
	          if (inPopover()) {
	              $.closePicker(p.popover);
	              return;
	          }
	          else {
	              $.closePicker(p.container);
	              return;
	          }
	      };

	      // Destroy
	      p.destroy = function () {
	          p.close();
	          if (p.params.input && p.input.length > 0) {
	              p.input.off('click focus', openOnInput);
	          }
	          $('html').off('click', closeOnHTMLClick);
	      };

	      if (p.inline) {
	          p.open();
	      }

	      return p;
	  };


	  $.fn.calendar = function (params) {
	      params = params || {};
	      return this.each(function() {
	        var $this = $(this);
	        if(!$this[0]) return;
	        var p = {};
	        if($this[0].tagName.toUpperCase() === "INPUT") {
	          p.input = $this;
	        } else {
	          p.container = $this;
	        }
	        //默认显示今天
	        if(!params.value) {
	          var today = new Date();
	          params.value = [today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()];
	        }
	        new Calendar($.extend(p, params));
	      });
	  };

	  defaults = $.fn.calendar.prototype.defaults = {
	    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	    dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
	    dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
	    firstDay: 1, // First day of the week, Monday
	    weekendDays: [0, 6], // Sunday and Saturday
	    multiple: false,
	    dateFormat: 'yyyy-mm-dd',
	    direction: 'horizontal', // or 'vertical'
	    minDate: null,
	    maxDate: null,
	    touchMove: true,
	    animate: true,
	    closeOnSelect: true,
	    monthPicker: true,
	    monthPickerTemplate: 
	        '<div class="picker-calendar-month-picker">' +
	            '<a href="#" class="link icon-only picker-calendar-prev-month"><i class="icon icon-prev"></i></a>' +
	            '<div class="current-month-value"></div>' +
	            '<a href="#" class="link icon-only picker-calendar-next-month"><i class="icon icon-next"></i></a>' +
	        '</div>',
	    yearPicker: true,
	    yearPickerTemplate: 
	        '<div class="picker-calendar-year-picker">' +
	            '<a href="#" class="link icon-only picker-calendar-prev-year"><i class="icon icon-prev"></i></a>' +
	            '<span class="current-year-value"></span>' +
	            '<a href="#" class="link icon-only picker-calendar-next-year"><i class="icon icon-next"></i></a>' +
	        '</div>',
	    weekHeader: true,
	    // Common settings
	    scrollToInput: true,
	    inputReadOnly: true,
	    convertToPopover: true,
	    onlyInPopover: false,
	    toolbar: true,
	    toolbarCloseText: 'Done',
	    toolbarTemplate: 
	        '<div class="toolbar">' +
	            '<div class="toolbar-inner">' +
	                '{{yearPicker}}' +
	                '{{monthPicker}}' +
	                // '<a href="#" class="link close-picker">{{closeText}}</a>' +
	            '</div>' +
	        '</div>',
	    /* Callbacks
	    onMonthAdd
	    onChange
	    onOpen
	    onClose
	    onDayClick
	    onMonthYearChangeStart
	    onMonthYearChangeEnd
	    */
	  };

	}($);

	/* global $:true */
	/* jshint unused:false*/

	+ function($) {
	  "use strict";


	  var defaults;

	  $.fn.datetimePicker = function(params) {
	    params = $.extend({}, defaults, params);
	    return this.each(function() {


	      if(!this) return;

	      var today = new Date();

	      var getDays = function(max) {
	        var days = [];
	        for(var i=1; i<= (max||31);i++) {
	          days.push(i < 10 ? "0"+i : i);
	        }
	        return days;
	      };

	      var getDaysByMonthAndYear = function(month, year) {
	        var int_d = new Date(year, parseInt(month)+1-1, 1);
	        var d = new Date(int_d - 1);
	        return getDays(d.getDate());
	      };

	      var formatNumber = function (n) {
	        return n < 10 ? "0" + n : n;
	      };

	      var formatValue = function(values, displayValues) {
	        return values[0] + params.dateSplit + values[1] + params.dateSplit + values[2] + ' ' + values[3] + params.timeSplit + values[4];
	      }

	      var initMonthes = ('01 02 03 04 05 06 07 08 09 10 11 12').split(' ');

	      var initYears = (function () {
	        var arr = [];
	        for (var i = 1950; i <= 2030; i++) { arr.push(i); }
	        return arr;
	      })();


	      var lastValidValues;

	      var config = {

	        rotateEffect: false,  //为了性能

	        value: [today.getFullYear(), formatNumber(today.getMonth()+1), formatNumber(today.getDate()), formatNumber(today.getHours()), formatNumber(today.getMinutes())],

	        onChange: function (picker, values, displayValues) {
	          var cols = picker.cols;
	          var days = getDaysByMonthAndYear(cols[1].value, cols[0].value);
	          var currentValue = picker.cols[2].value;
	          if(currentValue > days.length) currentValue = days.length;
	          picker.cols[2].setValue(currentValue);

	          //check min and max
	          
	          var current = + new Date(formatValue(values, displayValues));
	          var valid = true;
	          if(params.min) {
	            var min = + new Date(typeof params.min === "function" ? params.min() : params.min);

	            if(current < min) {
	              picker.setValue(lastValidValues);
	              valid = false;
	            } 
	          }
	          if(params.max) {
	            var max = + new Date(typeof params.max === "function" ? params.max(): params.max);

	            if(current > max) {
	              picker.setValue(lastValidValues);
	              valid = false;
	            } 
	          }

	          valid && (lastValidValues = values);
	        },

	        formatValue: function (p, values, displayValues) {
	          return formatValue(values, displayValues);
	        },

	        cols: [
	          // Years
	          {
	            values: initYears
	          },
	          // Months
	          {
	            values: initMonthes
	          },
	          // Days
	          {
	            values: getDays()
	          },

	          // Space divider
	          {
	            divider: true,
	            content: '  '
	          },
	          // Hours
	          {
	            values: (function () {
	              var arr = [];
	              for (var i = 0; i <= 23; i++) { arr.push(formatNumber(i)); }
	              return arr;
	            })(),
	          },
	          // Divider
	          {
	            divider: true,
	            content: ':'
	          },
	          // Minutes
	          {
	            values: (function () {
	              var arr = [];
	              for (var i = 0; i <= 59; i++) { arr.push(formatNumber(i)); }
	              return arr;
	            })(),
	          }
	        ]
	      };


	      var inputValue = $(this).val();
	      if(params.value === undefined && inputValue !== "") {
	        params.value = [].concat(inputValue.split(" ")[0].split(params.dateSplit), inputValue.split(" ")[1].split(params.timeSplit));
	      }

	      var p = $.extend(config, params);
	      $(this).picker(p);
	    });
	  };

	  defaults = $.fn.datetimePicker.prototype.defaults = {
	    dateSplit: "-",
	    timeSplit: ":",
	    min: undefined,
	    max: undefined
	  }

	}($);

	/*======================================================
	************   Picker   ************
	======================================================*/
	/* global $:true */

	+ function($) {
	  "use strict";


	  //Popup 和 picker 之类的不要共用一个弹出方法，因为这样会导致 在 popup 中再弹出 picker 的时候会有问题。

	  $.openPopup = function(popup, className) {

	    $.closePopup();

	    popup = $(popup);

	    popup.addClass("weui-popup-container-visible");

	    var modal = popup.find(".weui-popup-modal");

	    modal.width();

	    modal.addClass("weui-popup-modal-visible");

	  }


	  $.closePopup = function(container, remove) {
	    $(".weui-popup-modal-visible").removeClass("weui-popup-modal-visible").transitionEnd(function() {
	      $(this).parent().removeClass("weui-popup-container-visible");
	      remove && $(this).parent().remove();
	    }).trigger("close");
	  };


	  $(document).on("click", ".close-popup", function() {
	    $.closePopup();
	  });

	  $(document).on("click", ".open-popup", function() {
	    $($(this).data("target")).popup();
	  });

	  $.fn.popup = function() {
	    return this.each(function() {
	      $.openPopup(this);
	    });
	  };

	}($);

	/* ===============================================================================
	************   Notification ************
	=============================================================================== */
	/* global $:true */
	+function ($) {
	  "use strict";

	  var noti, defaults, timeout, start, diffX, diffY;

	  var touchStart = function(e) {
	    var p = $.getTouchPosition(e);
	    start = p;
	    diffX = diffY = 0;
	    noti.addClass("touching");
	  };
	  var touchMove = function(e) {
	    if(!start) return false;
	    e.preventDefault();
	    e.stopPropagation();
	    var p = $.getTouchPosition(e);
	    diffX = p.x - start.x;
	    diffY = p.y - start.y;
	    if(diffY > 0) {
	      diffY = Math.sqrt(diffY);
	    }

	    noti.css("transform", "translate3d(0, "+diffY+"px, 0)");
	  };
	  var touchEnd = function() {
	    noti.removeClass("touching");
	    noti.attr("style", "");
	    if(diffY < 0 && (Math.abs(diffY) > noti.height()*0.38)) {
	      $.closeNotification();
	    }

	    if(Math.abs(diffX) <= 1 && Math.abs(diffY) <= 1) {
	      noti.trigger("noti-click");
	    }

	    start = false;
	  };

	  var attachEvents = function(el) {
	    el.on($.touchEvents.start, touchStart);
	    el.on($.touchEvents.move, touchMove);
	    el.on($.touchEvents.end, touchEnd);
	  };

	  $.notification = $.noti = function(params) {
	    params = $.extend({}, defaults, params);
	    noti = $(".notification");
	    if(!noti[0]) { // create a new notification
	      noti = $('<div class="notification"></div>').appendTo(document.body);
	      attachEvents(noti);
	    }

	    noti.off("noti-click"); //the click event is not correct sometime: it will trigger when user is draging.
	    if(params.onClick) noti.on("noti-click", function() {
	      params.onClick(params.data);
	    });

	    noti.html($.t7.compile(params.tpl)(params));

	    noti.show();

	    noti.addClass("notification-in");
	    noti.data("params", params);

	    var startTimeout = function() {
	      if(timeout) {
	        clearTimeout(timeout);
	        timeout = null;
	      }

	      timeout = setTimeout(function() {
	        if(noti.hasClass("touching")) {
	          startTimeout();
	        } else {
	          $.closeNotification();
	        }
	      }, params.time);
	    };

	    startTimeout();

	  };

	  $.closeNotification = function() {
	    timeout && clearTimeout(timeout);
	    timeout = null;
	    var noti = $(".notification").removeClass("notification-in").transitionEnd(function() {
	      $(this).remove();
	    });

	    if(noti[0]) {
	      var params = $(".notification").data("params");
	      if(params && params.onClose) {
	        params.onClose(params.data);
	      }
	    }
	  };

	  defaults = $.noti.prototype.defaults = {
	    title: undefined,
	    text: undefined,
	    media: undefined,
	    time: 4000,
	    onClick: undefined,
	    onClose: undefined,
	    data: undefined,
	    tpl:  '<div class="notification-inner">' +
	            '{{#if media}}<div class="notification-media">{{media}}</div>{{/if}}' +
	            '<div class="notification-content">' +
	            '{{#if title}}<div class="notification-title">{{title}}</div>{{/if}}' +
	            '{{#if text}}<div class="notification-text">{{text}}</div>{{/if}}' +
	            '</div>' +
	            '<div class="notification-handle-bar"></div>' +
	          '</div>'
	  };

	}($);


/***/ }
/******/ ]);