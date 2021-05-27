


var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var overlay = new ol.Overlay(({
	element: container,
	autoPan: true,
	autoPanAnimation: {
		duration: 250
	}
})
);

    // var shouldUpdate = true;
    var center = [564429.04, 2317738.2];
    var zoom = 16.56631263565161;
    var rotation = 0;


// $("#document").ready(function() {
//Bai1
 	var format = 'image/png';
  	var bounds = [564182.125,2317466.0,564514.4375,2318014.0];
	var vung = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			ratio: 1,
			url: 'http://localhost:8080/geoserver/khiem/wms',
			params: {
				'FORMAT': format,
				'VERSION': '1.1.0',  
				STYLES: '',
				LAYERS: 'khiem:camhoangdc',
			}
		})
	});
	var duong = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			ratio: 1,
			url: 'http://localhost:8080/geoserver/khiem/wms',
			params: {
				'FORMAT': format,
				'VERSION': '1.1.0',  
				STYLES: '',
				LAYERS: 'khiem:camhoanggt',
			}
		})
	});
	var diem = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			ratio: 1,
			url: 'http://localhost:8080/geoserver/khiem/wms',
			params: {
				'FORMAT': format,
				'VERSION': '1.1.0',  
				STYLES: '',
				LAYERS: 'khiem:camhoangub',
			}
		})
	});
	var projection = new ol.proj.Projection({
		code: 'EPSG:3405',
		units: 'm',
		axisOrientation: 'neu'
	});
	var view = new ol.View({
		projection: projection,
		center: center,
		zoom: zoom,
		rotation: rotation
	});
	var map = new ol.Map({
		target: 'map',
		layers:[vung,duong,diem ],
		overlays: [overlay],
		view : view
	});
	

   map.getView().fit(bounds,map.getSize());


//    BÀI 2
	$("#checkvung").change(function(){
		if ($("#checkvung").is(":checked")){
			vung.setVisible(true)
		} else {
			vung.setVisible(false)
		}
	});
	$("#checkduong").change(function(){
		if ($("#checkduong").is(":checked")){
			duong.setVisible(true)
		} else {
			duong.setVisible(false)
		}
	});
	$("#checkdiem").change(function(){
		if ($("#checkdiem").is(":checked")){
			diem.setVisible(true)
		} else {
			diem.setVisible(false)
		}
	});


// BÀI 3
// console.log("abc");

	map.on('singleclick', function (evt) {
	  document.getElementById('info').innerHTML = "Loading... please wait...";
	  var view = map.getView();
	  var viewResolution = view.getResolution();
	  var source = vung.getSource();
	  var url = source.getFeatureInfoUrl(evt.coordinate, viewResolution,
	    view.getProjection(), { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
	//   console.log({url});
	//   console.log("123");
	  if (url) {
	  	// console.log("abc");
	    $.ajax({
	      type: "POST",
	      url: url,
	      contentType: "application/json; charset=utf-8",
	      dataType: 'json',
	      success: function (n) {
	        var content = "<div class='abc'>";
	        for (var i = 0; i < n.features.length; i++) {
	          var feature = n.features[i];
	          var featureAttr = feature.properties;
	          content += "<h4>Loại đất: " + featureAttr["txtmemo"]
	          + "</h4><h4>Diện tích: " + featureAttr["shape_area"]
	          + "</h4>"
	        }
	        content += "</div>";
			// if(featureAttr["txtmemo"] == ""){
				// $("#info").html("Mảng đất chưa được định nghĩa");
				// overlay.setPosition(evt.coordinate);
				// $("#popup-content").html("Mảnh đất chưa được định nghĩa");
			// }
			// else{
				$("#info").html(content);
				overlay.setPosition(evt.coordinate);
				$("#popup-content").html(content);

			// }
	        // var vectorSource = new ol.source.Vector({
	        //  features: (new ol.format.GeoJSON()).readFeatures(n)
	       	// 	});
	        // vectorLayer.setSource(vectorSource);
	      }
	    })
	  }
	  
	}); 


	// BÀI 4
	var styles = {
		'MultiPolygon': new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'red',
				width: 3
			})
		})
	};
	var styleFunction = function(feature) {
		return styles[feature.getGeometry().getType()];
	}
	var vectorLayer = new ol.layer.Vector({
		style: styleFunction
	});
	map.addLayer(vectorLayer);

	closer.onclick = function(){
		overlay.setPosition(undefined);
		closer.blur();
		return false;
	};


	// BÀI 5
	var updatePermalink = function(){
        // if (!shouldUpdate){
        //     shouldUpdate = true;
        //     return;
        // }
        var center = view.getCenter();
        var hash = '#map=' +
            view.getZoom() + '/' + 
            Math.round(center[0] * 100) / 100 + '/' +
            Math.round(center[1] * 100) / 100 + '/' +
            view.getRotation();
        var state = {
            zoom: view.getZoom(),
            center: view.getCenter(),
            rotation: view.getRotation()
        }
        window.history.pushState(state, 'map', hash)
    }
    map.on('moveend', updatePermalink)
    window.addEventListener('popstate', function(event) {
        if (event.state === null) {
            return
        }
        map.getView().setCenter(event.state.center);
        map.getView().setZoom(event.state.zoom);
        map.getView().setRotation(event.state.rotation);
        shouldUpdate = false;
    })
    function di_den_diem(x,y){
        var vi_tri = ol.proj.fromLonLat([x,y], projection);
        view.animate({
            center: vi_tri,
            duration: 2000,
            zoom: 20
        })
    }

// }); 



