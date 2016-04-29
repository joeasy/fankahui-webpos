var wxjssdk = require('../wxjssdk');

// wxjssdk.config({jsApiList: ['closeWindow']});
// wx.ready(function () {
//   wxjssdk.getUser(function (user) {
//     $('#nickname').html(user.nickname);
//     $('#avatar').attr("src", user.headimgurl);
//     $('#wxuserProfile').html(user.province+" "+user.city);
//   });
// });

var data = {};

function validate() {
  var valid = true;
  $('input').each(function (index, dom) {
    if(valid) valid = dom.validity.valid;
    var inputSelector = $('input[name='+dom.name+']');
    if(!dom.validity.valid || (dom.name === 'password2' && dom.value != data.password)) {
      inputSelector.parent().parent().addClass('weui_cell_warn');
    } else {
      inputSelector.parent().parent().removeClass('weui_cell_warn');
      data[dom.name] = dom.value;
    }
  });
  if(valid) {
    valid = data.password === data.password2;
  }
  delete data.password2;
  return valid;
}

$('#btnSubmit').click(function () {
  var errorMsg = null;
  var access_token = wxjssdk.getParameterByName('access_token');
  if(!access_token) {
    errorMsg = '会话无效或已经过去，请重新扫码！';
  }
  var userId = wxjssdk.getParameterByName('userId');
  console.log(userId);
  if(!userId) {
    errorMsg = '无效的用户ID，请重新扫码！';
  }
  if(errorMsg) {
    $.alert(errorMsg, function () {
      // wx.closeWindow();
    });
  }
  if(validate()) {

    $.ajax({
      url: wxjssdk.apiBaseUrl+"/users/"+userId+"?access_token="+access_token,
      method: "PUT",
      data: {
        password: data.password
      },
      crossDomain: true,
      success: function (data) {
        $.alert("您已经成功修复密码", "成功", function () {
          // wx.closeWindow();
        });
      },
      error: function (res) {
        var text = res.responseText;
        var msg = "修改密码失败";
        $.alert(msg, "失败");
      }
    });
  }
});
