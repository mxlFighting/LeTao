$(function () {  
    //调用登录函数
    login();

    //登录函数
    function login() {  
        //给登录按钮添加点击事件
        $('.login').on('tap',function () {  
            //获得用户名
            var username = $('.username').val().trim();
            //非空判断
            if (username == '') {
                mui.toast('请输入有效用户名',{ duration:'long', type:'div' }); 
                return false;
            }
            //获得用户密码
            var password = $('.password').val().trim();
            //调用接口 
            $.ajax({
                url:'/user/login',
                type:'post',
                data:{
                    username:username,
                    password:password
                },
                success:function (data) {  
                    console.log(data);
                    if (data.error) {
                        //登录失败弹出提示框
                        mui.toast(data.message,{ duration:'long', type:'div' });
                    }else{
                        //登陆成功则跳回原来的页面
                        location = getQueryString('returnUrl');
                    }
                }
            })
        })
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