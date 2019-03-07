$(function () {
    //调用查询商品详情的函数
    queryDetail();
    //区域滚动初始化
    initScroll();
    //调用加入购物车功能函数
    addCart();

    //查询商品详情的函数
    function queryDetail() {
        //拿到url里面的参数 id
        var id = getQueryString('id');
        // console.log(id);
        //调用接口请求数据
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: id
            },
            success: function (data) {
                // console.log(data);
                //data里面的size是40-50 不是我们需要的 所以需要转换成数组
                var arr = data.size.split('-');
                // console.log(arr);//[40,50]
                //把数组补全
                var size = [];
                for (var i = arr[0]; i <= arr[arr.length - 1]; i++) {
                    size.push(i);
                }
                // console.log(size);
                //把这个整理好的数组替换data里面的size
                data.size = size;
                // console.log(data);

                var html = template('detailTpl', data);
                $('.productDetail').html(html);
                //渲染完页面之后再启用轮播图初始化函数
                initSlider();
                //渲染完页面之后再启用数字输入框的初始化
                mui('.productNum').numbox();
                //给页码按钮加点击事件切换类名
                $('.productSize button').on('tap', function () {
                    $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
                })
            }
        })
    }
    
    //加入购物车功能函数
    function addCart() {  
        //给加入购物车按钮添加事件
        $('.addCart').on('tap',function () {  
            // console.log(123);
            //获得商品id
            var id = getQueryString('id');
            //获得商品数量
            var num = mui('.productNum').numbox().getValue();
            //获得商品尺码
            var size = $('.productSize button').data('size');
            //调用接口 请求数据
            $.ajax({
                url:'/cart/addCart',
                type:'post',
                data:{
                    productId:id,
                    num:num,
                    size:size
                },
                success:function (data) {  
                    console.log(data);
                    if (data.error) {
                        //说明没有登录 要跳转到登录页面登录 并且带上本页的url 以便等下可以返回
                        location = 'login.html?returnUrl=' + location.href;
                    }else{
                        //说明登录成功了 跳转到购物车页面
                        //先询问顾客确定吗
                        mui.confirm( 
                            '是否去购物车查看?',
                            '<h4>温馨提示</h4>',
                            ['是','否'], 
                            function (res) { 
                                console.log(res);
                                if (res.index == 1) {
                                    mui.toast('请确认好尺寸和数量',{ duration:'long', type:'div' }); 
                                } else{
                                    location = 'cart.html';
                                } 
                            }
                        )
                    }
                }
            })
        })
    }

    //轮播图初始化函数
    function initSlider() {
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    }

    //区域滚动函数的初始化
    function initScroll() {  
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            indicators: false //是否显示滚动条
        });
    }

    // 公共的 使用正则封装的一个获取url参数值的函数
    function getQueryString(name) {
        var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
        var arr = location.search.match(reg);
        if (arr != null) {
            return decodeURI(arr[0].substr(arr[0].indexOf('=') + 1));
        }
        return "";
    }

})