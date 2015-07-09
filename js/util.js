/**
 * @file util.js
 * @author zchen9(zhao.zchen9@gmail.com)
 */

/**
 * 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
 *
 * @param {Array} arr 传递一个数组
 * @param {Function} fn 传递一个函数
 */
function each(arr, fn){
    for (var i = 0; i < arr.length; i++){
        fn(arr[i], i);
    }
}

/**
 * 为element增加一个样式名为newClassName的新样式
 *
 * @param {Object} element 传入一个DOM节点元素
 * @param {string} newClassName 传入新的样式名称
 */
function addClass(element, newClassName){
    try{
        element.setAttribute("class", newClassName);
    }
    catch( ex ) {
        element.className = "newClassName";
    }
}

/**
 * 判断class属性
 *
 * @class
 */
function hasClass(tagStr, classStr) {
    //这个正则表达式是因为class可以有多个,判断是否包含
    var arr = tagStr.className.split(/\s+/); 
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] == classStr) {
            return true;
        }
    }
    return false;
};


/**
 * 移除element中的样式oldClassName
 *
 * @param {Object} element 传入一个DOM节点元素
 * @param {string} oldClassName 传入需要删除的样式名称
 */
function removeClass(element, oldClassName){
    if (element.className == oldClassName) {
        try {
            element.removeAttribute("class");
        }
        catch (ex) {
            element.className = "";
        }
    }
}

/**
 * 实现一个简单的$()选择器
 *
 * @param {string} selector 传入选择器字符串
 * @return {Object} 返回选择器对应节点
 */
function $(selector) {
    //将传入的选择器以空格符隔开生成数组
    var selItem = selector.split(" ");
    //如果数组长度为1，表示选择器只传入一个样式
    if (selItem.length === 1) {
        // 将数组转变成字符串
        var aitem = selItem.toString();
        // 通过switch取字符串第一个字符来判断选择器类型
        switch (aitem.substr(0, 1)) {
            //为id选择器
            case "#":
                return document.getElementById(aitem.substr(1));
                break;
            //为class选择器
            case ".":
                if (document.getElementsByClassName) {
                    return document.getElementsByClassName(aitem.substr(1))
                }
                else {
                    //获取全部元素
                    var nodes = document.getElementsByTagName("*");
                    var tar = [];
                    for(i = 0; i < nodes.length; i++) {
                        //遍历全部元素节点，若节点有传入的选择器属性则存入数组
                        if(hasClass(nodes[i],aitem.substr(1))){
                            tar.push(nodes[i])
                        }
                    }
                    return tar;
                }
                break;
            //为指定属性名选择器
            case "[":
                //检查[]是否完整
                if (aitem.charAt(aitem.length - 1) === "]") {
                    //取[]中间的字符串
                    var item = aitem.substring(1, aitem.length - 1);
                    var elements = document.getElementsByTagName("*");
                    //查找字符串中是否有=号
                    if (item.indexOf("=") != -1) {
                        //若有=号，将字符串以=号分隔成数组
                        var items = item.split("=");
                        //遍历所有元素
                        for (var j = 0; j < elements.length; j++) {
                            //判断是否有节点拥有传入的属性名，且属性值一致，若找到则返回该节点
                            if (elements[j].getAttribute( items[0] ) === items[1]) {
                                return elements[j];
                            }
                        }
                    }
                    //若字符串无=号
                    else {
                        for ( var i = 0; i < elements.length; i++ ) {
                            //返回匹配该属性名的第一个节点
                            if (elements[i].hasAttribute(item)) {
                                return elements[i];
                            }
                        }
                    }
                }
                // 如果[]不完整，则抛出错误
                else {
                    throw Error( "']' is missing !" );
                }
                break;
            //默认排除以上选择器，返回元素名选择器
            default :
                return document.getElementsByTagName(aitem);
        }
    }
    //若传入的字符串含有多个选择器
    //以下并没有考虑getElementsByClassName的兼容...
    else {
        for (var k = 1; k < selItem.length; i++) {
            
            if (selItem[0].substr(0, 1) == "#") {
                var itemId = document.getElementById(selItem[0].substr(1));
                switch (selItem[k].substr(0,1)) {
                    case ".":
                        return itemId.getElementsByClassName(selItem[k].substr(1))[0];
                        break;
                    default :
                        return itemId.getElementsByTagName(selItem[k]);
                }
            }
            else if (selItem[0].substr(0, 1) == ".") {
                var itemClass = document.getElementsByClassName(selItem[0].substr(1));
                switch (selItem[k].substr(0, 1)) {
                    case "#":
                        return itemClass.getElementById(selItem[k].substr(1));
                        break;
                    case ".":
                        return itemClass.getElementsByClassName(selItem[k].substr(1))[0];
                        break;
                    default :
                        return itemId.getElementsByTagName(selItem[k]);
                }
            }
        }
    }
}

/**
 * 给一个element绑定一个针对event事件的响应，响应函数为listener
 *
 * @param {Object} element 传入DOM节点元素
 * @param {string} event 传入事件字符串
 * @param {string | Function} listener 传入函数名称或直接传入匿名函数 
 */
function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    }
    else {
        element["on" + event] = listener;
    }

}

/**
 * 实现对click事件的绑定
 *
 * @param {Object} element 传入DOM节点元素
 * @param {string | Function} listener 传入函数名称或直接传入匿名函数 
 */
function addClickEvent(element, listener) {
    if ( element.addEventListener ) {
        element.addEventListener( "click", listener, false );
    }
    else if ( element.attachEvent ) {
        element.attachEvent( "onclick", listener );
    }else {
        element["onclick"] = listener;
    }
}

//遍历元素初始化样式
function delegateInitClass(ele, classname) {
    var eles = ele.parentNode.children;
    for (var i = 0, len = eles.length; i < len; i++) {
        removeClass(eles[i], classname);
    }
    addClass(ele, classname);
};

//遍历元素添加点击事件
function delegateClickEvent(ele, listener) {
    for (var i = 0, len = ele.length; i < len; i++) {
        addClickEvent(ele[i], listener);
    }
};

/**
 * 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
 *
 * @param {Object} element 传入一个DOM节点元素
 * 
 * http://www.cnblogs.com/leejersey/p/4127714.html
 */
function getPosition(element){
    var posRect = element.getBoundingClientRect();
    var docTop = document.documentElement.clientTop;
    var docLeft = document.documentElement.clientLeft;

    return { x: posRect.top - docTop ,
             y: posRect.left - docLeft
           }
}

/**
 * 给一个element绑定一个针对event事件的响应，响应函数为listener
 *
 * @param {Object} element 传入DOM节点元素
 * @param {string} event 传入事件字符串
 * @param {string | Function} listener 传入函数名称或直接传入匿名函数 
 */
function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    }
    else {
        element["on" + event] = listener;
    }

}

/**
 *功能：阻止事件默认行为
 *
 * @class
 */
function stopDefault( e ) {
    // 阻止默认浏览器动作(W3C)
    if ( e && e.preventDefault ) {
        e.preventDefault();
    }
    else {
        // IE中阻止函数器默认动作的方式
        window.event.returnValue = false;
    }
    return false;
}
 