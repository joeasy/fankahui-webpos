var wxjssdk = require('../wxjssdk');

var data = {};

wxjssdk.config({jsApiList: ['closeWindow']});
wx.ready(function () {
  wxjssdk.getUser(function (user) {
    data.name = user.nickname;
    data.headimgurl = user.headimgurl;
    data.wxuserId = user.id;
    $('#nickname').html(user.nickname);
    $('#avatar').attr("src", user.headimgurl);
    $('#wxuserProfile').html(user.province+" "+user.city);
  });
});

function validate() {
  var valid = true;
  $('input').each(function (index, dom) {
    if(valid) valid = dom.validity.valid;
    var inputSelector = $('input[name='+dom.name+']');
    if(!dom.validity.valid) {
      inputSelector.parent().parent().addClass('weui_cell_warn');
    } else {
      inputSelector.parent().parent().removeClass('weui_cell_warn');
      data[dom.name] = dom.value;
    }
  });
  return valid;
}

$('#btnSubmit').click(function () {
  if(validate()) {
    data.username = data.phone;
    data.email = data.phone+'@fankahui.com';
    data.realm = 'merchant';
    data.role = 'owner';

    $.showLoading('正在注册...');
    $.ajax({
      url: wxjssdk.apiBaseUrl+"/users",
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
        }
        var msg = "";
        var error = res.responseJSON.error;
        for (var key in errorMsg) {
          if(new RegExp(key, 'i').test(error.message)) {
            msg = errorMsg[key];
            break;
          }
        }
        if(msg === "") msg = error.message;
        $.toast(msg, "cancel");
      }
    });
  }
});
