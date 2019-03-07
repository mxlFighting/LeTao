$(function () {
    addHistory();

    queryHistory();

    delHistory();

    clearHistory();

    gotoProductList();

    //1.添加记录函数
    function addHistory() {
        /* 添加记录的思路
            1. 点击搜索添加记录 添加事件
            2. 获取当前输入内容 搜索的内容
            3. 判断如果没有输入内容 提示输入
            4. 把记录添加到本地存储中
            5. 因为连续添加记录应该把数据放到一个数组中 把数组整个加入到本地存储中
            6. 而且还得获取之前的数组之前有数组 使用之前的数组往这个里面添加 新的搜索的值
            7. 而且如果搜索内容重复还要对数组去重（把旧的删掉 在添加新的） 新的内容往数组最前面加
            8. 加完后把数组保存到本地存储中（转成json字符串） */

        //1.
        $('.btn-search').on('tap', function () {
            var search = $('.input-search').val().trim();
            if (search == "") {
                mui.toast('请输入有效商品名', {
                    duration: 'long',
                    type: 'div'
                });
                return false;
            }
            var searchHistory = localStorage.getItem('searchHistory');

            if (searchHistory) {
                searchHistory = JSON.parse(searchHistory);
            } else {
                searchHistory = [];
            }
            //判断是否有重复的 去重
            for (var i = 0; i < searchHistory.length; i++) {
                if (searchHistory[i].key == search) {
                    // 如果有重复的就把他删除掉
                    searchHistory.splice(i, 1);
                    i--;
                }
            }
            //添加到数组
            searchHistory.unshift({
                key: search,
                time: new Date().getTime()
            })
            // console.log(searchHistory);
            //把数据专程json存在本地
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            //存储完之后就要执行一次查询函数 就可以立即刷新页面
            queryHistory();
            //清空输入框
            $('.input-search').val('');
            //搜索之后跳转到产品页面
            location = 'productList.html?search=' + search + '&time=' + new Date().getTime();
        })
    }

    //2.查询记录函数
    function queryHistory() {
        var searchHistory = localStorage.getItem('searchHistory');
        if (searchHistory) {
            searchHistory = JSON.parse(searchHistory);
        } else {
            searchHistory = [];
        }
        // console.log(searchHistory);

        var html = template('historyTpl', {
            list: searchHistory
        });
        $('.history').html(html);
    }

    //3.删除记录函数
    //开关思想 判断是删还是点击跳转
    var isDelete = false;
    function delHistory() {
        //1.给删除按钮添加点击事件
        $('.search-history ul').on('tap', 'li .btn-delete', function () {
            // console.log(this);
            var searchHistory = localStorage.getItem('searchHistory');
            // console.log(searchHistory);
            searchHistory = JSON.parse(searchHistory);
            // console.log(searchHistory);
            var index = $(this).parent().data('index');
            // console.log(index);
            searchHistory.splice(index, 1);
            // console.log(searchHistory);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            //删除本地内存之后 再重新渲染一次
            queryHistory();
            //如果是删的话就改为true
            isDelete = true;
        })
    }

    //4.清空记录函数
    function clearHistory() {
        $('.btn-clear').on('tap', function () {
            //清空本地存储
            localStorage.removeItem('searchHistory');
            //调用查询函数 刷新
            queryHistory();
        })
    }

    //5.搜索历史记录列表点击跳转到商品列表
    function gotoProductList() {
        $('.search-history ul').on('tap', 'li', function () {
            if (isDelete == false) {
                var search = $(this).data('key');
                // console.log(key);
                location = 'productList.html?search=' + search + '&time=' + new Date().getTime();
            }
            isDelete = false;
        })
    }

    //6.初始化区域滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false
    });
})