function newPath(timePrev,timeCurrent,tarr,animationLayer){
    var i=tarr.length;
    //console.log(i);
    while(i--){
        var pathPoints = [];
        var ptTime=new Date(tarr[i][0].time);
        /*console.log(timePrev);
        console.log(ptTime);
        console.log(timeCurrent);*/
        if(timePrev<=ptTime && ptTime<=timeCurrent){
            //console.log("hello");
            for (var j = 0; j < tarr[i].length; j++) {

                pathPoints.push(new MarkerPoint({
                    carID:tarr[i][j].carID,
                    longitude: tarr[i][j].lon,
                    latitude:tarr[i][j].lat,
                    time: new Date(tarr[i][j].time),
                    count:tarr[i][j].count
                }))
            }
            var markLine = new MarkLine({
                map: map,
                path: pathPoints,
                styleOptions: defalutOptions
            });
            //console.log(markLine);

            animationLayer.geometries.push(markLine);
            tarr.splice(i,1);
        }
    }

    return animationLayer;

}
//参数合并
function mergeParams(userOptions, options) {
    Object.keys(userOptions).forEach(function (key) {
        options[key] = userOptions[key];
    });
};

    function getDistance(p1x, p1y, p2x, p2y) {
        var xDistance = p1x - p2x;
        var yDistance = p1y - p2y;
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }



    /**
     * Created by Administrator on 2017/8/26.
     */


    //根据时间戳（毫秒），返回处理过后的时间。
    function getDate(ms) {
        var res;
        if (ms != undefined) {
            var today = new Date()
            today.setTime(ms);
        } else {
            var today = new Date();
        }

        var year, month, day, hour, minute, second;
        year = today.getFullYear();
        month = today.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        day = today.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        hour = today.getHours();
        if (hour < 10) {
            hour = '0' + hour;
        }
        minute = today.getMinutes();
        if (minute < 10) {
            minute = '0' + minute;
        }
        second = today.getSeconds();
        if (second < 10) {
            second = '0' + second;
        }
        res = {
            'y': year,
            'M': month,
            'd': day,
            'h': hour,
            "m": minute,
            "s": second,
            "time": year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second,
            "date": year + "-" + month + "-" + day
        }
        return res;
    }

    //求时间差的方法
    function dateDiff(date1, date2) {
        var type1 = typeof date1, type2 = typeof date2;
        if (type1 == 'string')
            date1 = stringToTime(date1);
        else
        { date1 = date1.getTime(); }
        if (type2 == 'string')
            date2 = stringToTime(date2);
        else
        { date2 = date2.getTime(); }
        return (date1 - date2) / 1000;//结果是秒
    }

    //字符串转成Time(dateDiff)所需方法
    function stringToTime(string) {
        var f = string.split(' ', 2);
        var d = (f[0] ? f[0] : '').split('-', 3);
        var t = (f[1] ? f[1] : '').split(':', 3);
        return (new Date(
            parseInt(d[0], 10) || null,
            (parseInt(d[1], 10) || 1) - 1,
            parseInt(d[2], 10) || null,
            parseInt(t[0], 10) || null,
            parseInt(t[1], 10) || null,
            parseInt(t[2], 10) || null
        )).getTime();
    };

function colorize(img, r, g, b, a) {
    if (!img)
        return img;

    if (!tempFileCanvas)
        tempFileCanvas = document.createElement("canvas");

    if (tempFileCanvas.width != img.width)
        tempFileCanvas.width = img.width;

    if (tempFileCanvas.height != img.height)
        tempFileCanvas.height = img.height;

    var imgCtx = tempFileCanvas.getContext("2d"),
        imgData, i;
    imgCtx.drawImage(img, 0, 0);

    imgData = imgCtx.getImageData(0, 0, img.width, img.height);

    i = imgData.data.length;
    while((i -= 4) > -1) {
        imgData.data[i + 3] = imgData.data[i] * a;
        if (imgData.data[i + 3]) {
            imgData.data[i] = r;
            imgData.data[i + 1] = g;
            imgData.data[i + 2] = b;
        }
    }

    imgCtx.putImageData(imgData, 0, 0);
    return tempFileCanvas;
}

function Angle(point1,point2) {
    var angle;
    if (point1.x != point2.x && point1.y != point2.y) {
        angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);//斜率存在
    } else if (point1.x == point2.x) {
        angle = (point1.x <= point2.x ? 1 : -1) * Math.PI / 2;//垂直线
    } else {
        angle = 0;//水平线
    }
    return angle;
};

function random(min, max) {
    return Math.random() * (max - min) + min;
}

