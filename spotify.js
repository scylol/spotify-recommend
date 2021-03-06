var getFromApi = function(endpoint, query={}) {
	const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
	Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
	
	return fetch(url).then(function(response) {
		if (!response.ok) {
			return Promise.reject(response.statusText);
		}
		return response.json();
	});
};


var getArtist = function(name) {
	var artist;
	
	return getFromApi('search', {q: name, limit: 1, type: 'artist'})
	.then(item => {
		artist = item.artists.items[0];
		return getFromApi(`artists/${artist.id}/related-artists`);
	})
	.then(item => { 
		artist.related = item.artists;
		let topTracksPromise = artist.related.map((artist) => {
			return getFromApi(`artists/${artist.id}/top-tracks`, {country: 'US'});
		});
		return Promise.all(topTracksPromise);
	})	
	.then(eachArtist => {
		for(let i = 0; i < eachArtist.length; i++) {
			artist.related[i].tracks = eachArtist[i].tracks;
		}
		return artist;
	})
	.catch(function(err) {
		console.log(err);
	});
	
};



