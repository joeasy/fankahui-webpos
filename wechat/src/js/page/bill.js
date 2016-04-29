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
  if (!dealId) {
    return console.log('not found dealId');
  }
  $.ajax({
    url: wxjssdk.apiBaseUrl+"/deals/"+dealId,
    // url: wxjssdk.apiBaseUrl+"/deals/findOne",
    // data: {
    //   filter: {include:['bonuses'], where:{id:dealId}}
    // },
    crossDomain: true,
    success: function (data) {
      var created = new Date(data.created);
      $('#created').html(created.toLocaleDateString('zh-CN', {hour12: false})+" "+created.getHours()+":"+created.getMinutes());

      data.entities.forEach(function (entity, index) {
        var dom = '<div class="weui_cell"> \
                    <div class="weui_cell_bd weui_cell_primary"> \
                      <p>'+entity.sku.item.name+' '+entity.sku.model+'</p> \
                    </div> \
                    <div class="weui_cell_ft"> \
                      ¥ '+(entity.sku.price/100).toFixed(2)+' x \
                      '+entity.qty+' \
                    </div> \
                   </div>';

        $('#itemList').append(dom);

        $('#totalQty').html(data.totalQty);
        $('#totalAmount').html('¥ '+(data.totalAmount/100).toFixed(2));
        $('#discountAmount').html('¥ '+(0-(data.discountAmount||0)/100).toFixed(2));
        $('#bonusVouchAmount').html('¥ '+(0-(data.bonusVouchAmount||0)/100).toFixed(2));
        $('#payment').html('¥ '+(Math.abs(data.payment.amount)/100).toFixed(2));
        $('#vouchBonus').html(data.vouchBonus);
        $('#rewardBonus').html(data.rewardBonus);
        $('#memberBonus').html(data.member.bonus);
        $('#memberBalance').html('¥ '+(data.member.balance/100).toFixed(2));
        $('#business_name').html(data.shop.business_name);
        $('#branch_name').html(data.shop.branch_name);
      });
    },
    error: function (res) {
      console.log(res);
    }
  });

}

$(document).ready(function () {
  var dealId = wxjssdk.getParameterByName('dealId');
  fetchDeal(dealId);
});
