var DEFAULT_ZOOM =8;
var GOOGLE_API_KEY = 'AIzaSyD9SwX4CKr1CIRSVehIMKNsbHi2StHbCkM';
var RADIUS = 500;
$(function(){
	function initMap(){
		var position = {lat:42.28, lng:-83.74};
		var map = new google.maps.Map(document.getElementById('map'),{
			zoom: DEFAULT_ZOOM,
			center: position
		});
		var marker = new google.maps.Marker({
			position: position,
			map: map
		});
	
		$.ajax({
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
		
		});
	}
	initMap();
});
