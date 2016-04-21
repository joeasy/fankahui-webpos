var wxjssdk = require('../wxjssdk');

// wxjssdk.config({jsApiList: ['closeWindow']});
// wx.ready(function () {
//   wxjssdk.getUser(function (user) {
//     $('#nickname').html(user.nickname);
//     $('#avatar').attr("src", user.headimgurl);
//     $('#wxuserProfile').html(user.province+" "+user.city);
//   });
// });

function fetchDeal(dealId) {
  
  $.ajax({
    url: wxjssdk.apiBaseUrl+"/deals/"+dealId,
    crossDomain: true,
    success: function (data) {
      console.log(data);

      var created = new Date(data.created);
      $('#created').html(created.toLocaleString('zh-CN'));

      data.entities.forEach(function (entity) {
        var dom = '<div class="weui_cell"> \
                    <div class="weui_cell_bd weui_cell_primary"> \
                      <p>'+entity.sku.item.name+'</p> \
                    </div> \
                    <div class="weui_cell_ft"> \
                      ¥ '+entity.sku.price/100+' x \
                      '+entity.qty+' \
                    </div> \
                   </div>';
        
        $('#itemList').append(dom);
        
        $('#totalQty').html(data.totalQty);
        $('#totalAmount').html('¥ '+data.totalAmount/100);
        $('#discountAmount').html('¥ '+(data.discountAmount||0)/100);
        $('#bonusVouchAmount').html('¥ '+(data.bonusVouchAmount||0)/100);
        $('#fee').html('¥ '+data.fee/100);
        $('#payment').html('¥ '+Math.abs(data.payment.amount)/100);
        $('#business_name').html(data.shop.business_name);
        $('#branch_name').html(data.shop.branch_name);
      });
    },
    error: function (res) {
      console.log(res);
    }
  });
  
}

var dealId = wxjssdk.getParameterByName('dealId');
fetchDeal(dealId);