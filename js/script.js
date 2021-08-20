const myLatLng = {lat: 48.1516870, lng: 17.0731559}

function myMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const mapProp = {
        center: myLatLng,
        zoom: 16
    }
    const viewProp = {
        position: myLatLng,
        pov: {
            heading: 34,
            pitch: 10,
        }
    }

    const map = new google.maps.Map(document.getElementById('googleMap'), mapProp)
    const panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'), viewProp);

    map.setStreetView(panorama);
    directionsRenderer.setMap(map);

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        label: {
            text: 'STU FEI Bratislava',
        }
    })

    const popText = myLatLng.lat + '<br>' + myLatLng.lng
    const popUp = new google.maps.InfoWindow({
        content: popText,
    })
    marker.addListener('click', () => {
        popUp.open(map, marker)
    })
    const onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
    };

    document.getElementById("generate").addEventListener("click", onChangeHandler);
}



function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    const mode = document.getElementById("mode").value;
    const start = document.getElementById("startPosition").value
    directionsService.route(
        {
            origin: {query: start},
            destination: myLatLng,
            travelMode: google.maps.TravelMode[mode],
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
            origins: [start],
            destinations: [myLatLng],
            travelMode: google.maps.TravelMode[mode],
            avoidHighways: false,
            avoidTolls: false,
        },
        (response, status) => {
            if (status !== "OK") {
                alert("Error was: " + status);
            } else {
                const result = response.rows[0].elements[0]
                console.log(result, response.rows)
                const distance = `${result.distance.text} (${result.duration.text})`;
                document.getElementById('time').innerHTML = distance;
            }
        });


}
