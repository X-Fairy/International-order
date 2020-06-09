// 得到网址上面的参数名及参数值
function getUrlParams () {
    let index = decodeURI(window.location.href).indexOf('?');
    let url = decodeURI(window.location.href).substr(index+1);
    let arr = url.split('&');
    let obj = {};
    for(var i=0; i< arr.length; i++) {
        obj[arr[i].split("=")[0]]=unescape(arr[i].split("=")[1]);
    };
    return obj
}
// 把getUrlParams封装好的给导入出去
export {getUrlParams}



/**
 * 把时间转化成2017-05-28类似这样的时间格式
 */
function changeday(num) {
    let date = new Date(num);
    let z = date.getFullYear() + '-',
        b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1)  : date.getMonth() + 1) + '-',
        n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) ;
    return z+b+n;
}
export {changeday}


/**
 * 把时间转化成2017-05-28 00:00:00 类似这样的时间格式
 */
function changeTime(time){
    let date = new Date(time);
    let z = date.getFullYear() + '-',
    b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
    n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + " " ,
    h = (date.getHours() < 10 ? '0'+ (date.getHours()) : date.getHours()) + ":",
    m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ":",
    s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return z+b+n+h+m+s;
}
export {changeTime}



/**
 * 判断一个数是不是6的倍数
 */
function demoNum(val) {
    if(val % 6 === 0) {
        console.log(this)
    } else {
        console.log('不是6的倍数')
    }
}
export {demo}





/**
 * 数组求和函数
 */
function getNumBox(arr) {
    var a = 0;
    for(var i = 0;i < arr.length; i++){
        a += arr[i];
    }
    return a;
}
export {getNumBox}


// 设置cookie
function setCookie (name,value){
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
export{setCookie}




// 读取cookie
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)) {
        return unescape(arr[2]);

    } else {
        return null;
    }
}
export{getCookie}




// 删除cookie
function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
export{delCookie}





function getCookieLan(name,defaultValue) {      //
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return defaultValue;
  }
  
  export {
    getCookieLan
  }



  //获得上一年在昨天这一天的日期  
function getLastYearYestdy(date){  
    let datastr = '';
     var strYear = date.getFullYear() - 1;    
     var strDay = date.getDate();    
     var strMonth = date.getMonth() + 1;  
    var h = (date.getHours() < 10 ? '0'+ (date.getHours()) : date.getHours()) + ":";
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ":";
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    // 判断当前年份是不是闰年
    if(strYear%4==0&&strYear%100!=0||strYear%400==0){
       
　　} else {
    // 如果当前年份是平年，没有2月29号，强制让月份等于3月1号
        if(strDay === 29 && strMonth === 2) {
            strDay = 1;
            strMonth = 3;
        }

    }
     if(strMonth < 10)    
     {    
        strMonth = "0" + strMonth;    
     }  
     if(strDay < 10)    
     {    
        strDay = "0"  + strDay;    
     }  
     datastr = strYear + "-" + strMonth + "-" + strDay + " " + h + m + s;
     return datastr;  
}  
export{
      getLastYearYestdy
}


/**
 *   倒计时计算
 */

function countTime (endTime) {
    //获取当前时间
    var date = new Date()
    var now = date.getTime()
    //设置截止时间
    var endDate = new Date(endTime)
    var end = endDate.getTime()
    //时间差
    var leftTime = end - now
    //定义变量 d,h,m,s保存倒计时的时间
    if (leftTime >= 0) {
      this.d = Math.floor(leftTime / 1000 / 60 / 60 / 24)//天数我没用到，暂且写上
      this.h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
      this.m = Math.floor((leftTime / 1000 / 60) % 60)
      this.s = Math.floor((leftTime / 1000) % 60)
    }
    //递归每秒调用countTime方法，显示动态时间效果
    setTimeout(this.countTime, 1000)
    // return d+h+m+s
  }
  export{
    countTime
  }



  /**
* 一维数组转二位数组
* @param {Array} data 需要转的原数组
*/
function transformArrTo(data) {
    let newArr = [];
    while(data.length >= 2) {
    newArr.push(data.splice(0,2));
    }
    return newArr;
}
export{transformArrTo}



// 验证重复元素，有重复返回true；否则返回false
function isRepeat(arr) {
    var hash = {};
    for(var i in arr) {
      if(hash[arr[i]]) {
        return true;
      }
      // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
      hash[arr[i]] = true;
    }
    return false;
}
export{isRepeat}

/**
 * 数组去重
 */
function unique(arr) {
    if (!Array.isArray(arr)) {
        return
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        if (array .indexOf(arr[i]) === -1) {
            array .push(arr[i])
        }
    }
    return array;
}
export{unique}


// 把客户端时间转换为北京时间
function getBeijingtime() {
    //获得当前运行环境时间
    var d = new Date();
    currentDate = new Date();
    tmpHours = currentDate.getHours();
    //算得时区
    var time_zone = -d.getTimezoneOffset() / 60;
    if (time_zone < 0) {
        time_zone = Math.abs(time_zone) + 8; currentDate.setHours(tmpHours + time_zone);
    } else {
        time_zone -= 8; currentDate.setHours(tmpHours - time_zone);
    }
    return currentDate;
}
export{getBeijingtime }




// 将数组array分成长度为subGroupLength的小数组并返回新数组
function group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while(index < array.length) {
          newArray.push(array.slice(index, index += subGroupLength));
      }
      return newArray;
  }

export {group}

// 判断一个视频是否可以播放
function videoShow(url) {
    var video = document.createElement('video');
    let msg = '';
    video.onload = function() {
        alert('成功');
    }
    video.onerror = function() {
        msg = 'no'
        return msg;
    }
    video.src = url;
    //不同浏览器情况不同，这里判断在该浏览器是否可以播放
    video.oncanplaythrough = function() {
        msg = 'yes'
        return msg;
    };
}
export {videoShow}




//判断图片是否存在
function CheckImgExists(imgurl) {
    var ImgObj = new Image(); //判断图片是否存在  
    ImgObj.src = imgurl;  
    //存在图片
    if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
        return true;
    } else {  
        return false;
    }   
}
export {CheckImgExists}