class SearchBar{
	constructor(callback){
		this.template=`
			<div class="search-bar">
				<table id="search-bar-table"><tbody>
					<tr>
						<td><input id="search" type="text" placeholder="Please type the keyword." /></td>
						<td><img id="search_icon" src="/static/search_icon.png"></td>
					</tr>
				</tbody></table>
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
