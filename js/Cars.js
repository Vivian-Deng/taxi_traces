/**
 * Created by Administrator on 2018/4/15 0015.
 */
function playTheCar(tarr) {
    $.getJSON ("data/shanghai7h-12h2.txt", function (data) {
        tarr = data;
        tarr.forEach(function (pt) {
            var origin = [], destination = [];
            for (var i = 0; i < pt.length; i + 2) {
                origin = [pt[i].lon, pt[i].lat];
                destination = [pt[i + 1].lon, pt[i + 1].lat];
                var route = {//从每个起点到终点的路线
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                origin,
                                destination
                            ]
                        }
                    }]
                };
                var point = {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": origin
                        }
                    }]

                }
                var lineDistance = turf.lineDistance(route.features[0], 'meters');
                var counter = 0;//计数器
                //map.on('load', function () {
                    // Add a source and layer displaying a point which will be animated in a circle.
                    map.addSource('route', {
                        "type": "geojson",
                        "data": route
                    });

                    map.addSource('point', {
                        "type": "geojson",
                        "data": point
                    });

                    map.addLayer({
                        "id": "route",
                        "source": "route",
                        "type": "line",
                        "paint": {
                            "line-width": 2,
                            "line-color": "#007cbf"
                        }
                    });

                    map.addLayer({
                        "id": "point",
                        "source": "point",
                        "type": "symbol",
                        "layout": {
                            "icon-image": "airport-15",
                            "icon-rotate": 90,
                            "icon-allow-overlap": true
                        }
                    });

                    function animate() {
                        // 根据计数器指示将点更新到新位置
                        point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[counter];

                        // Update the source with this new data.
                        map.getSource('point').setData(point);

                        // Request the next frame of animation so long as destination has not
                        // been reached.
                        if (point.features[0].geometry.coordinates[0] !== destination[0]) {
                            requestAnimationFrame(animate);
                        }

                        counter = counter + 1;
                    }

                    // Start the animation.
                    animate(counter);

            }
        });
    });

}