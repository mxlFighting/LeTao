$(function () {
    //1. mui 自动轮播初始化js
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
    });

    // 小圆点 js

    mui.init({
        swipeBack: true //启用右滑关闭功能
    });

    //2. 区域滚动js
    //初始化
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false //是否显示滚动条
    });
})