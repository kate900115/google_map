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
			words = type.split(':');
			if (words[0]=='nearby'){
				var request = {
					location:AnnArbor,
					radius: DEFAULT_RADIUS,
					type:words[1]
				};
				getNearbySearch(map, request);
			}
			if (words[0]=='find'){
				var request = {
					location:AnnArbor,
					radius: DEFAULT_RADIUS,
					query:words[1]
				};
				getTextSearch(map, request);
			}
		});
		search_bar.addTo($('body'));
		$('#button-triangle').on('click',function(){
			$('#listbox-wrapper').toggleClass('visible');
		});
		$('#listbox-wrapper').hide();
	}
	
	function getTextSearch(map, request){
		console.log("new text request!");
		$('#listbox-wrapper').show();		
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
  		service.textSearch(request, function(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				console.log(results);
    			for (var i = 0; i < results.length; i++) {
					var place = results[i];
					createMarker(map,results[i]);
				}
			}
		});
	}
	
	function getNearbySearch(map, request){
		console.log("new request!");
		$('#listbox-wrapper').show();		
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
					createMarker(map,results[i]);
				}
			}
		});
	}
		function createMarker(map, place){
			console.log(place);
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
				var service = new google.maps.places.PlacesService(map);
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
					console.log(result);
					var pic_url;
					if (result.photos[0].length!==0){
						pic_url = result.photos[0].getUrl({'maxWidth':100, 'maxHeight':80});
					}
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
					displayInfo(map,result);
				});
			});
			previousMarkers.push(marker);
		}

		function displayInfo(map,place){
			var service = new google.maps.places.PlacesService(map);
			service.getDetails(place, function(result, status){
				if (status!== google.maps.places.PlacesServiceStatus.OK){
					console.error(status);
					return;
				}
				$('#listbox-wrapper').addClass('visible');
				var pic_url;
				if (place.photos.length!==0){
					pic_url=place.photos[0].getUrl({'maxWidth':408, 'maxHeight':300});
				}
				
				var pic_vec= pic_url.split("w408-h300-");
				var picurl=pic_vec[0]+pic_vec[1];
				$('#listbox-img img').attr('src', picurl);
				$('.place-name').text(place.name);
				var stars;
				if (place.rating<0.5){
					stars = '♡';
				}
				else if (place.rating<1.2){
					stars = '♥';
				}
				else if (place.rating<1.7){
					stars = '♥♡';
				}
				else if (place.rating<2.2){
					stars = '♥♥';
				}
				else if (place.rating<2.7){
					stars = '♥♥♡';
				}
				else if (place.rating<3.2){
					stars = '♥♥♥';
				}
				else if (place.rating<3.7){
					stars = '♥♥♥♡';
				}
				else if (place.rating<4.2){
					stars = '♥♥♥♥';
				}
				else if (place.rating<4.7){
					stars = '♥♥♥♥♡';
				}
				else {
					stars = '♥♥♥♥♥';
				}	

				$('.place-rating').text('raing:'+stars+' - '+place.rating);
				$('.place-type').text('type:'+place.types[0]);
				$('#address').text('address:'+place.formatted_address);
				$('#phone-num').text('phone:'+place.international_phone_number);
				var web_addr = '<a>'+place.website+'</a>';
				$('#web').empty();
				$(web_addr).appendTo($('#web'));
				$('#web a').attr('href',place.website);
				
			//	$('#web').text('website:'+place.website);
				var isopenning;
				if (place.opening_hours.open_now){
					isopenning = 'Open now';
				}
				else{
					isopenning = 'Close now';
				}
				$('#isopen').text(isopenning);
				$('li').remove();
				for(var i=0; i<place.opening_hours.weekday_text.length; i++){
					var weekday_opening = '<li>'+place.opening_hours.weekday_text[i]+'</li>';
					$(weekday_opening).appendTo($('#open_hours'));
					
				}
				var price;
				if (place.price_level===1){
					price='$';
				}
				else if(place.price_level===2){
					price='$$';
				}
				else if(place.price_level===3){
					price='$$$';
				}
				else if(place.price_level===4){
					price='$$$$';
				}
				else if(place.price_level===5){
					price='$$$$$';
				}
				else{
					price='no price data';
				}
				$('#price').text('price: '+price);
			
			});
		}
	
	initMap();
});
