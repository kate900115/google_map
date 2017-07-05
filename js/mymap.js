$(function(){
	var DEFAULT_ZOOM =15;
	var GOOGLE_API_KEY = 'AIzaSyD9SwX4CKr1CIRSVehIMKNsbHi2StHbCkM';
	var DEFAULT_RADIUS = 5000;
	var previousInfoWindow = new google.maps.InfoWindow();
	var previousMarker;
	var previousMarkers=[];
	
	function initMap(){
		var AnnArbor = {lat:42.28, lng:-83.74};
		var map = new google.maps.Map(document.getElementById('map'),{
			zoom: DEFAULT_ZOOM,
			center: AnnArbor
		});
	
		var search_bar = new SearchBar(function(type){
			var request = {
				location:AnnArbor,
				radius: DEFAULT_RADIUS,
				type:type
			};
			getNearbySearch(map, request);
		});
		search_bar.addTo($('body'));
		$('#button-triangle').on('click',function(){
			$('#listbox-wrapper').toggleClass('visible');
		});
	}
			
	
	function getNearbySearch(map, request){
		console.log("new request!");
		for (var i=0; i<previousMarkers.length; i++){
			previousMarkers[i].setVisible(false);
		}
		previousMarkers = [];
		if (previousInfoWindow){
			previousInfoWindow.close();
		}
		if ($('#listbox-wrapper').hasClass('visible')){
			$('#listbox-wrapper').toggleClass('visible');
		}
		var service = new google.maps.places.PlacesService(map);
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
				service.getDetails({
					placeId:place.place_id
				}, function(result, status){
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
					var pic_vec = pic_url.split("w100-h80-");
					var picurl=pic_vec[0]+pic_vec[1];
					var content = 
					'<div id="marker_content"><img src = "'+picurl+'"></img>'+
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
					$('#marker_content img').attr('width','100');	
					displayInfo(result);
				});
			});
			previousMarkers.push(marker);
		}

		function displayInfo(place){
			service.getDetails(place, function(result, status){
				if (status!== google.maps.places.PlacesServiceStatus.OK){
					console.error(status);
					return;
				}
				var pic_url=place.photos[0].getUrl({'maxWidth':408, 'maxHeight':300});
				var pic_vec= pic_url.split("w408-h300-");
				var picurl=pic_vec[0]+pic_vec[1];
				$('#listbox-img img').attr('src', picurl);
				$('.place-name').text(place.name);
				var stars;
				if (place.rating===0.5){
					stars = '♡';
				}
				else if (place.rating===1){
					stars = '♥';
				}
				else if (place.rating===1.5){
					stars = '♥♡';
				}
				else if (place.rating===2){
					stars = '♥♥';
				}
				else if (place.rating===2.5){
					stars = '♥♥♡';
				}
				else if (place.rating===3){
					stars = '♥♥♥';
				}
				else if (place.rating===3.5){
					stars = '♥♥♥♡';
				}
				else if (place.rating===4){
					stars = '♥♥♥♥';
				}
				else if (place.rating===4.5){
					stars = '♥♥♥♥♡';
				}
				else {
					stars = '♥♥♥♥♥';
				}	

				$('.place-rating').text('raing:'+stars);
				$('.place-type').text('type:'+place.types[0]);
				$('#listbox-wrapper').addClass('visible');
			});
		}
	}
	initMap();
});
