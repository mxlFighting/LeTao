//声明一个全局变量记录搜索的商品key
var proName;
//声明一个全局变量记录页码
var page = 1;

$(function () {
    //页面刚加载调用当前查询商品的函数
    queryProduct();
    //调用当前商品搜索页面的搜索功能
    searchProduct();
    //调用商品排序功能函数
    sortProduct();
    //调用下拉刷新和上啦加载的函数
    pullRefresh();
    //调用点击购买按钮跳转的函数
    gotoDetail();

    //1.查询商品
    function queryProduct() {
        /* 思路
            1. 根据当前商品名称来搜索商品(商品名称就是用户在输入框输入内容也就是当前url参数 search的值)
            2. 调用查询商品的API
            3. 把后台返回商品列表的数据 调用模板引擎生成html结构
            4. 最后把生成html放到商品列表容器中 */
        //拿到url里面的参数
        proName = getQueryString('search');
        $.ajax({
            url: '/product/queryProduct',
            data: {
                proName: proName,
                page: 1,
                pageSize: 4
            },
            success: function (data) {
                // console.log(data);
                //调用模板
                var html = template('productListTpl', data);
                $('.productList .productCon').html(html);
                //重置上拉加载
                mui('#pullRefresh').pullRefresh().refresh(true);
                //重置页码
                page = 1;
            }
        })
    }

    //2.搜索商品
    function searchProduct() {
        $('.btn-search').on('tap', function () {
            //    console.log(123);
            proName = $('.input-search').val().trim();
            if (proName == '') {
                mui.toast('请输入有效商品', {
                    duration: 'long',
                    type: 'div'
                });
                return false;
            }
            //把输入的商品存在本地存储中 如果有相同的话就用本地的 
            var searchHistory = localStorage.getItem('searchHistory');
            if (searchHistory) {
                searchHistory = JSON.parse(searchHistory);
            } else {
                searchHistory = [];
            }
            //去重
            for (var i = 0; i < searchHistory.length; i++) {
                if (proName == searchHistory[i].key) {
                    searchHistory.splice(i, 1);
                    i--;
                }
            }
            //存到本地存储中
            searchHistory.unshift({
                key: proName,
                time: new Date().getTime()
            });
            // console.log(searchHistory);
            //转换成字符串
            searchHistory = JSON.stringify(searchHistory);
            localStorage.setItem('searchHistory', searchHistory);

            //清空输入框
            $('.input-search').val('');

            //刷新页面
            location = 'productList.html?search=' + proName + '&time=' + new Date().getTime();
        })
    }

    //3.排序
    function sortProduct() {
        $('.productTitle a').on('tap', function () {
            $(this).addClass('active').siblings().removeClass('active');

            //给a添加自定义属性 以便获得是升序还是降序 1是升序 2 是降序
            var sort = $(this).data('sort');

            if (sort == 2) {
                sort = 1;
                $(this).children('i').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                sort = 2;
                $(this).children('i').addClass('fa-angle-down').removeClass('fa-angle-up');
            }
            //也要改自定义属性
            $(this).data('sort', sort);

            //获取当前的分类类型
            var type = $(this).data('type');
            //给参数对象动态添加元素
            var obj = {
                proName: proName,
                page: 1,
                pageSize: 4
            }
            obj[type] = sort;
            //ajax 请求
            $.ajax({
                url: '/product/queryProduct',
                data: obj,
                success: function (data) {
                    // console.log(data);
                    var html = template('productListTpl', data);
                    $('.productList .productCon').html(html);
                }
            })
        })
    }

    //4.加载刷新
    function pullRefresh() {
        //初始化刷新
        mui.init({
            pullRefresh: {
                container: "#pullRefresh", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    // 下拉刷新的回调函数 用真正的刷新数据 发送请求真实刷新数据和页面
                    callback: pulldownRefresh
                },
                up: {
                    // 上拉加载的回调函数 用来真正请求更多数据 追加到页面上
                    callback: pullupRefresh
                }
            }
        });
        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            setTimeout(function () {
                //使用查询函数刷新页面
                queryProduct();
                // //刷新页面
                // location = 'productList.html?search=' + proName + '&time=' + new Date().getTime();
                //停止圈圈持续转动
                mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
            }, 1000);
        }


        /**
         * 上拉加载具体业务实现
         */


        function pullupRefresh() {
            setTimeout(function () {
                //ajax请求更多数据
                $.ajax({
                    url: '/product/queryProduct',
                    data: {
                        page: ++page,
                        pageSize: 4,
                        proName: proName
                    },
                    success: function (data) {
                        //   console.log(data);
                        if (data.data.length > 0) {
                            //如果还有数据就追加下一页
                            var html = template('productListTpl', data);
                            $('.productList .productCon').append(html);
                            mui('#pullRefresh').pullRefresh().endPullupToRefresh();
                        } else {
                            mui('#pullRefresh').pullRefresh().endPullupToRefresh(true);
                        }
                    }
                })
            }, 1000);
        }
    }

    //5.点击购买按钮跳转的函数
    function gotoDetail() {
        $('.productList').on('tap','.btn-buy',function () { 
            var id = $(this).data('id');
            // console.log(id);
            location = 'detail.html?id=' + id;
        })
    }

    // 公共的 使用正则封装的一个获取url参数值的函数
    function getQueryString(name) {
        var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
        var arr = location.search.match(reg);
        if (arr != null) {
            return decodeURI(arr[0].split('=')[1]);
        }
        return "";
    }
})