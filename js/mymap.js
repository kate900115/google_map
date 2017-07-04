$(function(){
	var DEFAULT_ZOOM =15;
	var GOOGLE_API_KEY = 'AIzaSyD9SwX4CKr1CIRSVehIMKNsbHi2StHbCkM';
	var DEFAULT_RADIUS = 5000;

	function initMap(){
		var position = {lat:42.28, lng:-83.74};
		var map = new google.maps.Map(document.getElementById('map'),{
			zoom: DEFAULT_ZOOM,
			center: position
		});

		var service = new google.maps.places.PlacesService(map);
		var infoWindow = new google.maps.InfoWindow();
	/*	var marker = new google.maps.Marker({
			position: position,
			map: map
		});*/
		var request = {
			location: position,
			radius: DEFAULT_RADIUS,
			type: ['store']

		};

		service.nearbySearch(request, function(results, status){
			if (status===google.maps.places.PlacesServiceStatus.OK){
				for (var i=0; i<results.length; i++){
					var place = results[i];
					createMarker(results[i]);
				}
			}
		});

		function createMarker(place){
			var marker= new google.maps.Marker({
				map:map,
				position: place.geometry.location,
				icon:{
					url:'/static/marker2.png',
					anchor: new google.maps.Point(10,10),
					scaleSize: new google.maps.Size(10,17)
				}	
			});
			google.maps.event.addListener(marker, 'click', function(){
				service.getDetails(place, function(result, status){
					if (status!==google.maps.places.PlacesServiceStatus.OK){
						console.error(status);
						return;
					}
					var temp = result.photos[0].getUrl({'maxWidth':100, 'maxheight':80});
					console.log(temp);
					var content = 
					'<div id="marker_content"><img src = "'+temp+'"></img>'+
						'<p>'+result.name+'</p>'+
					'</div>';
					infoWindow.setContent(content);
					infoWindow.open(map, marker);
					displayInfo(result);
				});
			});
		}

		function displayInfo(place){
			service.getDetails(place, function(result, status){
				if (status!== google.maps.places.PlacesServiceStatus.OK){
					console.error(status);
					return;
				}
				$('#listbox-img img').attr('src', place.photos[0].getUrl({'maxWidth':400, 'maxheight':300}));
				$('.place-name').text(place.name);
				$('.place-rating').text(place.rating);
				$('.place-type').text(place.types);
				$('#listbox-wrapper').show();
			});
		}
	
	/*	$.ajax({
			url: '/nearby_search',
			data: {
				'key':GOOGLE_API_KEY,
				'location': position.lat+','+position.lng,
				'radius': RADIUS
				 
			}	,
			success:function(res){
				debugger;
			},
			failure:function(res){
				debugger;
			}
		
		});*/
	}
	initMap();
});
