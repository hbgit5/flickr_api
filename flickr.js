var flickr_api_key = '57657b59ac543231802f9b3093c35a3e';
var flickr_api_url = 'https://api.flickr.com/services/rest';
var flickr_photo_url = 'https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_s.jpg';

var photos_container;
var current_flickr_page = 1;
var map;
var markers = [];
google.maps.event.addDomListener(window, 'load', initialize);
$(function () {
    photos_container = $('#photos_container');
    $('#search-btn').click(function () {
        //1.get the value from the search field
        var search_value = $('#flickr-search').val();

        //2.search flickr with that value
        search(search_value, 3, current_flickr_page);

    });

    $('#next-btn').click(function () {
        current_flickr_page++;
        var search_value = $('#flickr-search').val();
        search(search_value, 50, current_flickr_page);

    });

});

function search(tag_values, count, currentpage) {
    //photos_container.empty();
    for(var i=0; i<markers.length; i++) {
    markers[i].setMap(null);
    }
    markers=[];

    var params = {
        method: "flickr.photos.search",
        api_key: flickr_api_key,
        tags: tag_values,
        per_page: count,
        format: "json",
        nojsoncallback: 1,
        page: currentpage,
        has_geo: 1,
        extras: "geo"
    }

    $.getJSON(flickr_api_url, params,
        function (response) {
            console.log(response);
            var photos = response.photos.photo;
            console.log(photos);
            for (var i = 0; i < photos.length; i++) {

                /*var url = "https:farm"+photos[i].farm+
            ".staticflickr.com/"+photos[i].server+
            "/"+ photos[i].id +
            "_"+photos[i].secret +
            "_m.jpg";
            */
                //The following variable/replace takes the place of string contantination that we originally used. 
                var url = flickr_photo_url
                    .replace('{farm-id}', photos[i].farm)
                    .replace('{server-id}', photos[i].server)
                    .replace('{id}', photos[i].id)
                    .replace('{secret}', photos[i].secret);
                
                var lat=photos[i].latitude;
                var lng=photos[i].longitude;
        
                // To add the marker to the map, use the 'map' property
    var marker = new google.maps.Marker({
        position:new google.maps.LatLng(lat,lng),
        icon: url,
        title: photos[i].title
    });
  

    marker.setMap(map);
                markers.push(marker);
                
                /*
                var figure = $('<figure>');
                var img = $('<img>').addClass('image')
                    .attr('src', url);
                figure.append(img);
                photos_container.append(figure);
                */
                /*img.animate({
                        opacity: 1

                    },
                    1000);
                    */
            }
        }
    );
}

function initialize() {
    var mapOptions = {
        center: {
            lat: 32.7150,
            lng: -117.1625
        },
        zoom: 8
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    var myLatlng = new google.maps.LatLng(32.7150, -117.1625);


}
    