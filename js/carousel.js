window.onload = function() {
    //定义轮播图需要的图片名称和路径
    var imgInfo = [
        {
            name: 'img1.png',
            src: 'img/carousel/'
        },
        {
            name: 'img2.png',
            src: 'img/carousel/'
        },
        {
            name: 'img3.png',
            src: 'img/carousel/'
        },
        {
            name: 'img4.png',
            src: 'img/carousel/'
        },
        {
            name: 'img5.png',
            src: 'img/carousel/'
        }
    ];
    //实例化轮播图组件
    new carouseller({
        //盛放轮播图的容器
        imgDom: $(".carousel-list")[0],
        //盛放轮播序号导航容器
        numDom: $(".carousel-order")[0],
        //图片信息
        imgs: imgInfo,
        // 轮播时间
        time: 3000,
        //轮播容器存放图片大小
        width: 100 + '%',
        height: 80
    });
}

function carouseller(options){
    this.curId = 0;
    this.dom = options.imgDom;
    this.orderDom = options.numDom;
    this.imgs = options.imgs;
    this.len = options.imgs.length;
    this.time = options.time;
    this.width = options.width;
    this.height = options.height;

    this.init();
    this.bindDom();
    this.slideDom();
}

/**
 * 初始化轮播图DOM节点
 */
carouseller.prototype.init = function() {
    var carDom = this.dom,
        imgInfo = this.imgs,
        orderDom = this.orderDom,
        len = this.len;
        imgArr = [],
        numArr = [];

    // 根据图片数组添加对应DOM节点
    for (var i = 0; i < len; i++) {
        
        var imgSrc = imgInfo[i].src + imgInfo[i].name;
        var imgNum = i + 1;
        

        var imgDom =  ''
                      + '<li data-img="'+ i +'">'
                            + '<img src="'+ imgSrc +'" alt="carousel img' + imgNum + '" />'
                      + '</li>';

        var numDom = '<li data-slide-to="' + i + '">' + imgNum + '</li>';

        imgArr.push(imgDom);
        imgTotal = imgArr.join("");

        numArr.push(numDom);
        numTotal = numArr.join("");

    };

    // 渲染页面
    carDom.innerHTML = imgTotal;
    orderDom.innerHTML = numTotal;

    // 初始化序号导航节点
    var initNum = $("[data-slide-to=0]");
    addClass(initNum, "active");
}

/**
 * 渲染当前序号的图片
 *
 * @param {number} n 传入显示序号
 */
carouseller.prototype.renderDom = function(n) {
    var imgDom = this.dom.childNodes,
        numDom = this.orderDom.childNodes,
        len = this.len,
        that = this;

    var curId = n || this.curId;

    // 初始化所有节点的样式
    each(imgDom, function(item, i) {
        item.style.width = that.width;
        item.style.display = 'inline-block';
        item.style.position = 'absolute';
        item.style.transition = 'top .3s ease-out';
        item.style.top = that.height * i + 'px';
    });

    // 当前序号显示图片
    imgDom[curId].style.top = 0;

    // 当前序号之前影藏图片
    for (var i = 0; i < curId; i++) {
      imgDom[i] 
        && (imgDom[i].style.top = '-' + that.height +'px');
    }
    // 当前序号之后影藏图片
    for (var ii = curId + 1; ii < len; ii++) {
      imgDom[ii] 
        && (imgDom[ii].style.top = that.height +'px');
    }

    // 更换当前序号导航节点的样式
    var curNum = numDom[curId];
    delegateInitClass(curNum, "active");

    // 更换当前序号
    this.curId = curId;
}

/**
 * 图片循环滑动
 */
carouseller.prototype.slideDom = function() {

    var that = this;
    that.renderDom(that.curId);

    setTimeout(function() {

        if ( that.curId > 3 ) {
            that.curId = -1;
        }

        that.curId++;

        that.slideDom();

    }, that.time);

}

/**
 * 绑定序号导航点击事件
 */
carouseller.prototype.bindDom = function() {
    var numDom = this.orderDom.childNodes,
        that = this;

    // 点击事件代理
    delegateClickEvent(numDom, function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var clickId = target.getAttribute("data-slide-to");

        that.renderDom(clickId);
    });
}
