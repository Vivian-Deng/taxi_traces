//几何要素
//包括点 线
//点
var tempFileCanvas;
var particle = new Image();
particle.src ="data/particle.png";

function MarkerPoint(options) {
    this.carID=options.carID;
    this.longitude = options.longitude;
    this.latitude = options.latitude;
    this.time = options.time;
    this.count=options.count;
    this.location = [this.longitude, this.latitude];
}

//线
function MarkLine(opts) {
    this.Map = opts.map;
    //数据
    this.path = opts.path || [];
    //this.isDrawing=false;
    this.status=null
    //初始坐标
    //起点
    this.startPoint = this.project(this.path[0].location);
    //中间点
    this.snapPoint = this.project(this.path[0].location);
    //目标点
    this.targetPoint = this.project(this.path[1].location);
    //计数器 目标节点索引
    this.counts = 1;

}

MarkLine.prototype.project=function(d) {
    return this.Map.project(new mapboxgl.LngLat(+d[0], +d[1]));
}

MarkLine.prototype.colorize=function (map,img, r, g, b, a) {
    if (!img)
        return img;

    if (!tempFileCanvas){
        var canvasContainer= this.Map.getCanvasContainer();
        tempFileCanvas = document.createElement('canvas')
        canvasContainer.appendChild(tempFileCanvas);
    }

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


MarkLine.prototype.afterDragOrZoom =function(){
    var disX = this.snapPoint.x - this.startPoint.x,
        disY = this.snapPoint.y - this.startPoint.y;

    this.startPoint = this.project(this.path[this.counts - 1].location);
    this.targetPoint = this.project(this.path[this.counts].location);

    this.snapPoint.x = this.startPoint.x + disX;
    this.snapPoint.y = this.startPoint.y + disY;
}


MarkLine.prototype.renderCircle=function (context, dateCurent, isAfterDragOrZoom) {
    //渲染 绘制移动的圆

    if (dateCurent<this.path[0].time || this.counts == this.path.length - 1) {
        this.status=null;
        return;
    }

    //计算当前时间是否在区间内
    var disDate = (this.path[this.counts].time - this.path[this.counts - 1].time),
        disDate1 = dateCurent - this.path[this.counts - 1].time;

    if (isAfterDragOrZoom) {
        this.afterDragOrZoom();
    }

    this.status=this.path[this.counts].count;
    var angle=Angle(this.startPoint,this.targetPoint);

    var distanceToTarget = getDistance(this.startPoint.x, this.startPoint.y, this.targetPoint.x, this.targetPoint.y);
    var step = distanceToTarget * (disDate1 / disDate);
    var vx = Math.cos(angle) * step;
    var vy = Math.sin(angle) * step;

    if(dateCurent>this.path[this.counts].time){
        this.startPoint.x = this.targetPoint.x;
        this.startPoint.y = this.targetPoint.y;
        this.snapPoint.x = this.startPoint.x;
        this.snapPoint.y = this.startPoint.y;
        this.counts++;

        this.targetPoint = this.project(this.path[this.counts].location);
    } else {
        this.snapPoint.x = this.startPoint.x+vx;
        this.snapPoint.y = this.startPoint.y+vy;
    }


    context.fillStyle=this.path[this.counts].count;
    context.beginPath();
    context.arc(this.snapPoint.x, this.snapPoint.y,1.5,0,Math.PI*2,true);
    context.closePath();
    context.fill();


}

MarkLine.prototype.renderImg=function (canvas,context, dateCurent, isAfterDragOrZoom) {
    //渲染 绘制移动的圆
    if (this.counts == this.path.length - 1) {
        //this.counts = 1;
        return;
    }

    var img=this.colorize(this.Map,particle,255,255,11,1);


    //计算当前时间是否在区间内
    var disDate = (this.path[this.counts].time - this.path[this.counts - 1].time),
        disDate1 = dateCurent - this.path[this.counts - 1].time;

    var len=this.path.length;
    var disDate2= this.path[len - 1].time-dateCurent;

    if (disDate1 < 0) {
        return;
    }
    if (disDate2 <=0) {
        return;
    }

    if (isAfterDragOrZoom) {
        this.afterDragOrZoom();
    }

    var angle=Angle(this.startPoint,this.targetPoint);

    var distanceToTarget = getDistance(this.startPoint.x, this.startPoint.y, this.targetPoint.x, this.targetPoint.y);
    var step = distanceToTarget * (disDate1 / disDate);
    var vx = Math.cos(angle) * step;
    var vy = Math.sin(angle) * step;

    if(dateCurent>this.path[this.counts].time){
        this.startPoint.x = this.targetPoint.x;
        this.startPoint.y = this.targetPoint.y;
        this.snapPoint.x = this.startPoint.x;
        this.snapPoint.y = this.startPoint.y;
        this.counts++;

        this.targetPoint = this.project(this.path[this.counts].location);

    } else {
        this.snapPoint.x = this.startPoint.x+vx;
        this.snapPoint.y = this.startPoint.y+vy;
    }

    if(this.counts==1 || this.counts>=this.path.length -2){
        this.Map.flyTo({
            center: this.path[this.counts].location,
            zoom: 16,
            bearing: 0,
            speed:6,
            curve: 1, // change the speed at which it zooms out
        });
    }

    else{
        this.Map.flyTo({
            center: this.path[this.counts].location,
            zoom: 16,
            bearing: 0,
            speed:0.2,
            curve: 1, // change the speed at which it zooms out
            // This can be any easing function: it takes a number between
            // 0 and 1 and returns another number between 0 and 1.
            easing: function (t) {
                return t;
            }
        });
    }


    context.drawImage(img,this.snapPoint.x-15,this.snapPoint.y-15,30,30);


}



