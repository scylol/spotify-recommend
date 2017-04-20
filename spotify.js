var getFromApi = function(endpoint, query={}) {
    const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
    //console.log(url);
    return fetch(url).then(function(response) {
        if (!response.ok) {
            return Promise.reject(response.statusText);
        }
        return response.json();
    });
};


var artist;
var getArtist = function(name) {
    const artistUrl = new URL(`https://api.spotify.com/v1/artists/${artist.id}/related-artists`);

    console.log(name);
    return getFromApi('search', query={q: name, limit: 1, type: 'artist'})
    .then(item => {
        artist = item.artists.items[0];
       // return artist;
        return fetch(artistUrl).then(function(response) {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }
            let artistRelated = response.artist;
            return artistRelated;
        })
        .catch(function(err) {
        console.log(err);
    });
});