FacilityLocator = (function() {
  function FacilityLocator() {}

  var map,
      allFacilities = [],
      filteredFacilities,
      markers = [],
      currentInfoBox,
      searchService,
      searchBox,
      searchQuery,
      searchCenter,
      infowindows = {};

  FacilityLocator.prototype.init = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.833, lng: -98.5833},
      zoom: 4,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      maxZoom: 12,
    });

    // Load facilities
    $.ajax({
      dataType: "json",
      url: "https://s3.amazonaws.com/facility-locator-data/facilities.json",
      success: function(data) {
        allFacilities = data;
        placeMarkers(data);

        // If the map has not yet loaded (which we test with map.getBounds()),
        // wait until it is to show the facilities list. Otherwise, show it
        // immediately
        if (map.getBounds() === undefined) {
          map.addListener('idle', listFacilities);
        } else {
          listFacilities();
        }
      }
    });

    searchService = new google.maps.places.PlacesService(map);

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    map.addListener('idle', listFacilities);

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      handlePlaceChanged();
    });

    // Handle click on "Search" button
    $(".searchButton").click(searchClick);

    $("#facilityType").change(function(evt) {
      filterFacilities(evt.target.value);
    });

    // Get user location from HTML5 location API if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(recenter, function() {});
    }
  };

  function showFacilityInfo(sid) {
    var infowindow = infowindows[sid][0],
        marker = infowindows[sid][1];

    if (currentInfoBox !== undefined) {
      currentInfoBox.close();
    }

    infowindow.open(map, marker);

    currentInfoBox = infowindow;
  }

  function searchClick() {
    var query = $("#pac-input").val();
    if (query.length === 0) {
      return;
    }

    searchService.textSearch({query: query}, function(places, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        fitMapBounds(places);
      }
    });
  }

  function recenter(position) {
    // Clear the facilities list, because hovering on a facility after the
    // setCenter will move the map to the location of that infowindow. Which
    // is confusing as heck for the user.
    $("#facilitiesList").html("");

    searchQuery = position.coords.latitude + ", " + position.coords.longitude;
    searchCenter = [position.coords.latitude, position.coords.longitude];

    // And let it propagate, since it seems not to work just clearing it like that
    setTimeout(function() {
      map.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      map.setZoom(12);
    }, 200);
  }

  function addressString(facility) {
    var zip = facility.zip ? facility.zip : "";

    return facility.address + ", "  +
           facility.city + ", " +
           facility.state + " " +
           zip;
  }

  function placeMarkers(facilities) {
    clearMarkers();

    $.each(facilities, function(i, facility) {
      var image = {
        url: markerURL(facility),
        anchor: new google.maps.Point(10, 33)
      };

      var marker = new google.maps.Marker({
        map: map,
        title: facility.title + " (" + facility.type + ")",
        position: {lat: facility.lat, lng: facility.lng},
        icon: image,
        anchorPoint: new google.maps.Point(0, -33)
      });

      var text = facilityHTML(facility);

      var infowindow = new google.maps.InfoWindow({
        content: text
      });

      google.maps.event.addListener(infowindow, 'domready', function() {
        infowindow.setContent(facilityHTML(facility));
      });

      infowindows[facility.sid] = [infowindow, marker];

      marker.addListener('click', function() {
        // Close any open infobox
        // XXX: Maybe should do this on clicking the map outside the infobox?
        if (currentInfoBox !== undefined) {
          currentInfoBox.close();
        }

        infowindow.open(map, marker);

        currentInfoBox = infowindow;
      });

      markers.push(marker);
    });
  }

  function markerURL(facility) {
    var types = ["VA Central Offices", "Regional Benefit Office",
      "Intake Site (Pre-Discharge Claims Assistance)", "National Cemetery",
      "VISN", "Outpatient Clinic", "VA Medical Center", "Vet Center"];

    var i = types.indexOf(facility.type) + 1;
    if (i === 0) { i = 1; }

    return 'markers/m' + i + '_40.png';
  }

  function clearMarkers() {
    for (var i=0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  function round10(n) {
    return Math.round(n*10) / 10;
  }

  // Convert meters to miles
  function metersToMiles(meters) {
    return meters / 1609.344;
  }

  // Find the facilities from a list of facilities that are with the given
  // bounds, and return it sorted by ascending distance from the given point
  function findFacilitiesInBounds(facilities, bounds, lat, lng) {
    var foundFacilities = [],
        distance,
        facilityPoint,
        facility;

    // If the user has searched for something, calculate the distances from
    // the center of their search, rather than the center of the map
    if (searchCenter) {
      lat = searchCenter[0];
      lng = searchCenter[1];
    }

    // The linear search seems to be fast enough for our 5000 sample sites
    for (var i=0; i < facilities.length; i++) {
      facility = facilities[i];
      facilityPoint = new google.maps.LatLng(facility.lat, facility.lng);
      if (bounds.contains(facilityPoint)) {
        distance = round10(metersToMiles(
            google.maps.geometry.spherical.computeDistanceBetween(
              facilityPoint, new google.maps.LatLng(lat, lng))));

        foundFacilities.push([distance, facility]);
      }
    }

    // sort by increasing distance
    foundFacilities.sort(function(a,b) { return a[0] < b[0] ? -1 : 1; });

    return foundFacilities;
  }

  function facilityHTML(facility, distance) {
    var title = '<span class="facilityTitle">' + facility.title + '</span>';

    var link = '';
    if (facility.url) {
      link = '<a class="facilityLink" href="' + facility.url +  '">website</a><br>\n';
    }

    var distanceString;
    if (distance !== undefined) {
      distanceString = " (" + distance + " miles)";
    } else {
      distanceString = "";
    }

    var center;
    if (searchCenter === undefined) {
      center = map.getCenter().lat() + "," + map.getCenter().lng();
    } else {
      center = searchCenter[0] + "," + searchCenter[1];
    }

    var facLatLng = facility.lat + "," + facility.lng;
    var directions = '<a href="https://www.google.com/maps/dir/' +
      center + '/' + facLatLng + '">driving directions</a>';

    var phone = facility.phone ? '<span class="facilityPhone"> Phone: </span>' +
      facility.phone + "<br>\n" : "";

    return title + distanceString + "<br>\n" +
      addressString(facility) + "<br>\n" +
      phone + link + directions;
  }

  // Get Facilities currently within the bounds of the map and update the
  // facilities list
  function listFacilities() {
    // if listFacilities is called before the facility list has loaded,
    // just bail out
    if (allFacilities.length  === 0) {
      return;
    }

    // Clear the facilities list
    $("#facilitiesList").html("");

    var bounds = map.getBounds();
    var centerLat = map.getCenter().lat();
    var centerLng = map.getCenter().lng();

    var facilities;
    if (filteredFacilities === undefined) {
      facilities = allFacilities;
    } else {
      facilities = filteredFacilities;
    }

    var foundFacilities = findFacilitiesInBounds(facilities, bounds, centerLat, centerLng);

    if (foundFacilities.length === 0) {
      $("#facilitiesList").html("No facilities found, try zooming out.");
      return;
    }

    for (i=0; i < foundFacilities.length; i++) {
      var distance = foundFacilities[i][0],
          facility = foundFacilities[i][1];

      var title;
      if (facility.url) {
        title = '<a class="facilityTitle" href="' + facility.url +  '">' + facility.title + '</a>';
      } else {
        title = '<span class="facilityTitle">' + facility.title + '</span>';
      }

      var li = "<li data-sid=" + facility.sid + ">" +
        facilityHTML(facility, distance) + "</li>";
      $("#facilitiesList").append(li);
    }

    // Now attach the infowindow-showing function to each li
    $("#facilitiesList li").hover(function(evt) {
      showFacilityInfo(evt.currentTarget.dataset.sid);
    });
    $("#facilitiesList li").click(function(evt) {
      showFacilityInfo(evt.currentTarget.dataset.sid);
    });
  }

  function handlePlaceChanged() {
    var places = searchBox.getPlaces();

    fitMapBounds(places);
  }

  function fitMapBounds(places) {
    if (places.length === 0) {
      return;
    }

    searchQuery = places[0].formatted_address;
    var loc = places[0].geometry.location;
    searchCenter = [loc.lat(), loc.lng()];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  }

  function filterFacilities(facilityType) {
    if (facilityType == "All") {
      filteredFacilities = undefined;
      listFacilities();
      return placeMarkers(allFacilities);
    }

    filteredFacilities = [];

    for (var i=0; i < allFacilities.length; i++) {
      var facility = allFacilities[i];
      if (facility.type == facilityType) {
        filteredFacilities.push(facility);
      }
    }

    // update the facility list
    listFacilities();

    return placeMarkers(filteredFacilities);
  }


  return FacilityLocator;
})();

// google needs a global callback
window.FacilityLocator = new FacilityLocator();
window.init = window.FacilityLocator.init;
