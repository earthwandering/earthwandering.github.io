var hack = null;

function getImgsForPhotoset(photosetId, userId, flickrKey) {
	var flickrargs = {format:'json', api_key: flickrKey, user_id: userId, photoset_id: photosetId, method: 'flickr.photosets.getPhotos'};	
	console.log("Loading photos with args: " + JSON.stringify(flickrargs) + "\n");

	var imgs = {};		
	
	$.getJSON(flickrbase, flickrargs, function(data) {		
		console.log("photoset data:\n" + JSON.stringify(data) + "\n\n");
		
		hack = data
		
		console.log("photos: " + data.photoset.photo);
		
		$.each(data.photoset.photo, function(index, photo) {
			console.log("got one" + index);
		});
		
		console.log("Done iterating over data\n");
		
	});

}

getImg(photodata) {
	return $('img');
}