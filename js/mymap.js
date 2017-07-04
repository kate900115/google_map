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
		var previousInfoWindow = new google.maps.InfoWindow();
			var previousMarker;
			
		var request = {
			location: position,
			radius: DEFAULT_RADIUS,
			type: ['store']

		};

		service.nearbySearch(request, function(results, status){
			if (status===google.maps.places.PlacesServiceStatus.OK){
				for (var i=0; i<results.length; i++){
					createMarker(results[i]);
				}
			}
		});

		function createMarker(place){
			var marker= new google.maps.Marker({
				map:map,
				position: place.geometry.location,
				icon:{
					url:'/static/heart.png',
					anchor: new google.maps.Point(10,10),
					scaleSize: new google.maps.Size(10,17)
				}	
			});
		marker.addListener('click', function(){
				service.getDetails(place, function(result, status){
					if (status!==google.maps.places.PlacesServiceStatus.OK){
						console.error(status);
						return;
					}
					if (previousMarker){
						previousMarker.setAnimation(null);
					}
					marker.setAnimation(google.maps.Animation.BOUNCE);
					previousMarker = marker;
					var pic_url = result.photos[0].getUrl({'maxWidth':100, 'maxHeight':80});
					console.log(pic_url);
					var content = 
					'<div id="marker_content"><img src = "'+pic_url+'"></img>'+
						'<p>'+result.name+'</p>'+
					'</div>';
					if (previousInfoWindow){
						previousInfoWindow.close();
					}		
					var infoWindow = new google.maps.InfoWindow();
					map.setCenter(marker.getPosition());
					infoWindow.setContent(content);
					infoWindow.open(map, marker);
					previousInfoWindow = infoWindow;
				
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
				$('#listbox-img img').attr('src', place.photos[0].getUrl({'maxWidth':408, 'maxheight':300}));
				$('.place-name').text(place.name);
				$('.place-rating').text('raing:'+place.rating);
				$('.place-type').text('type:'+place.types[0]);
				$('#listbox-wrapper').show();
			});
		}
	}
	initMap();
});
