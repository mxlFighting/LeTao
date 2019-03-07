$(function () {
    //1.ajax请求获取分类左边数据
    $.ajax({
        url: '/category/queryTopCategory',
        success: function (data) {
            // console.log(data);
            var html = template('leftTpl', data);
            $('.left ul').html(html);
        }
    });
    //页面加载完之后就要渲染右边的商品 默认为第一个
    xuanranRight(1);
    //给左边的li添加点击事件
    //记录点之前的id
    var oldId;
    $('.left ul').on('tap', 'li', function () {
        $(this).addClass('active').siblings().removeClass('active');
        
        var id = $(this).data('id');
        if (id == oldId) {
            return false;
        }
        // console.log(id);
        //渲染对应的右边商品
        xuanranRight(id);
        //渲染之后给id赋值给oldId
        oldId = id;
    })

    function xuanranRight(id) { 
        //ajax请求右边对应数据
        $.ajax({
            url:'/category/querySecondCategory',
            data:{id:id},
            success:function (data) { 
                // console.log(data);
                var html = template('rightTpl',data);
                $('.right>div').html(html);
             }
        })
     }

    //.区域滑块初始化js代码
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false //是否显示滚动条
    });
})