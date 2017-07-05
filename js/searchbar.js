class SearchBar{
	constructor(callback){
		this.template=`
			<div class="search-bar">
				<input id="search" type="text" placeholder="Please type the keyword." />
				<div class="search-icon"></div>
			</div>
		`
		this.callback = callback;
	}

	addTo($parent){
		$parent.append(this.template);
		var newfunc = this.callback;
		$('.search-bar').on('keyup', function(e){
			if(e.keyCode==13){
				newfunc($('#search')[0].value);
				console.log($('#search')[0].value);
			}
		});
	}

}
