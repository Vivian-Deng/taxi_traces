
//自定义canvas图层
function CanvasLayer(options) {
    this._map = options.map;
    //canvas画布
    this.canvas = null;
    //画笔
    this.context = null;
    this.zIndex = options.zIndex || 50;
    //数据
    this.geometries = [];
    this.carCounts=0;
    this.sparseCounts=0;
    this.normalCounts=0;
    this.crowdCounts=0;
    //动画标志
    this.animationFlag = true;
    //鼠标是否进行了拖拽或者缩放操作 是的话重新计算坐标点
    this.mouseDragedOrZoomed = false;
    //为地图绑定鼠标事件
    this.mouseInteract();
    this.initialize();

}

//初始化
CanvasLayer.prototype.initialize = function () {
    var canvasContainer= this._map.getCanvasContainer();
    //console.log(canvasContainer);
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    canvasContainer.appendChild(this.canvas);

    //this.canvas.id="canvas-2d";
    this.canvas.width=this._map.getCanvas().width;
    this.canvas.height=this._map.getCanvas().height;
    this.canvas.style.cssText = 'position:absolute;'  +'left:0;' + 'top:0;' + 'z-index:' + this.zIndex + ';'+ 'width:'+this.canvas.width+'px;'+ 'height:'+this.canvas.height+'px;';

    return this.canvas;
}

CanvasLayer.prototype.show = function () {
    this.initialize();
    this.canvas.style.display = 'block';
};

CanvasLayer.prototype.hide = function () {
    this.canvas.style.display = 'none';
};


CanvasLayer.prototype.draw = function () {
    var self = this;
    clearTimeout(self.timeoutID);
    self.timeoutID = setTimeout(function () {
        self._drawLine();
    }, 15);
};
//渲染 绘图
CanvasLayer.prototype._drawCircle = function () {
    this.context.fillStyle = 'rgba(0,0,0,.93)';
    var prev = this.context.globalCompositeOperation;
    this.context.globalCompositeOperation = 'destination-in';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.globalCompositeOperation = prev;
    if (this.animationFlag) {
        //样式设置
        //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var sparseCounts=0;
        var normalCounts=0;
        var crowdCounts=0;
        var i=this.geometries.length;
        while(i--){
            var geo = this.geometries[i];
            var len=geo.path.length;
            //console.log(carCounts);
            geo.renderCircle(this.context, this.dateCurrent, this.mouseDragedOrZoomed); //移动圆点
            if (geo.status=="#5BFF53"){sparseCounts++;}
            if (geo.status=="#FAFA50"){normalCounts++;}
            if (geo.status=="#FF4344"){crowdCounts++;}
            if(this.dateCurrent>geo.path[len-1].time){
                this.geometries.splice(i,1);
            }
        }

        this.sparseCounts=sparseCounts;
        this.normalCounts=normalCounts;
        this.crowdCounts=crowdCounts;
        this.carCounts=this.sparseCounts+this.normalCounts+this.crowdCounts;

        this.mouseDragedOrZoomed = false;
    }
    else {
        this.mouseDragedOrZoomed = true;
    }

}

CanvasLayer.prototype._drawImg = function () {

    if (this.animationFlag) {
        //样式设置
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (var i = 0; i < this.geometries.length; i++) {
            var geo = this.geometries[i];
            geo.renderImg(this.canvas,this.context, this.dateCurrent, this.mouseDragedOrZoomed);//移动圆点
        }

        this.mouseDragedOrZoomed = false;
        } else {
            this.mouseDragedOrZoomed = true;
        }
}


CanvasLayer.prototype.show = function () {
    this.initialize();
    this.canvas.style.display = 'block';
};

CanvasLayer.prototype.hide = function () {
    this.canvas.style.display = 'none';
};


//绑定鼠标事件
CanvasLayer.prototype.mouseInteract = function () {
    var self = this;
    self._map.on('movestart', function () {
        self.animationFlag = false;
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
    });

    self._map.on('moveend', function () {
        self.animationFlag = true;
    });

    self._map.on('zoomstart', function () {
        self.animationFlag = false;
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
    });

    self._map.on('zoomend', function () {
        self.animationFlag = true;
    });
};
