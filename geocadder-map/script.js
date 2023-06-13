// first modal - toggle filter

$(".welcome-close-button").on("click", function () {
  $("div.visible-filter-box").removeClass("visible-filter-box");
});
// end first modal - toggle filter

// second modal - toggle legend

$(".button-toggle-legend").on("click", function () {
  $("div.toggle-legend-box").addClass("visible-legend-box");
});

$(".welcome-close-button").on("click", function () {
  $("div.visible-legend-box").removeClass("visible-legend-box");
});
// end second modal - toggle legend

mapboxgl.accessToken =
  "pk.eyJ1IjoibWxvZ3VlMTgiLCJhIjoiY2xleDF2NWU3MDBwbTNwcXAzc3ZzZDBncCJ9.0jUklDsFUa8A3DwGlnMwRg";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mlogue18/clhpylvtq01vq01pg85m6d443",
  center: [-81.353806, 28.28678],
  zoom: 6,
  // preserveDrawingBuffer: true,
  // customAttribution:
  //   'created by <a style="padding: 0 3px 0 3px; color:#ffffff; background-color: #61b39e;" target="_blank" href=http://www.geocadder.bg/en/portfolio.html>GEOCADDER</a>',
});

// start registering a new control position - "top-right"
function registerControlPosition(map, positionName) {
  if (map._controlPositions[positionName]) {
    return;
  }
  var positionContainer = document.createElement('div');
  positionContainer.className = `mapboxgl-ctrl-${positionName}`;
  map._controlContainer.appendChild(positionContainer);
  map._controlPositions[positionName] = positionContainer;
}
registerControlPosition(map, "top-center")
// end registering a new control position - "top-right"



var zoomButton = new mapboxgl.NavigationControl({ showCompass: false });
map.addControl(zoomButton, "bottom-right");



/* Adding custom control / custom button for chanigng base map style*/
class MapboxGLButtonControl {
  constructor({ className = "", title = "", eventHandler = evtHndlr }) {
    this._className = className;
    this._title = title;
    this._eventHandler = eventHandler;
  }

  onAdd(map) {
    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon" + " " + this._className;
    this._btn.type = "button";
    this._btn.title = this._title;
    this._btn.onclick = this._eventHandler;

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

var currentStyle = "streets-v8";
/* Event Handlers */
function one(event) {
  if (currentStyle === "streets-v8") {
    currentStyle = "satellite-streets-v11";
  } else {
    currentStyle = "streets-v8";
  }
  map.setStyle("mapbox://styles/mapbox/" + currentStyle);
}

/* Instantiate new controls with custom event handlers */
const ctrlPoint = new MapboxGLButtonControl({
  className: "toggle-layers-control",
  title: "Change base map",
  eventHandler: one,
});

map.addControl(ctrlPoint, "bottom-right");

// ctrlPoint._container.parentNode.className="mapboxgl-ctrl-top-center"

/* end adding custom control / custom button for changing the base map style*/

/* start legend custom control button */

/* Event Handlers */
function two(event) {
  $("div.toggle-legend-box").addClass("visible-legend-box");
}

/* Instantiate new controls with custom event handlers */
const ctrlTwoPoint = new MapboxGLButtonControl({
  className: "toggle-legend-control",
  title: "View legend",
  eventHandler: two,
});

map.addControl(ctrlTwoPoint, "top-center");
// ctrlTwoPoint._container.parentNode.className="mapboxgl-ctrl-top-center"
/* end filter custom control button */

/* start filter custom control button */

/* Event Handlers */
function three(event) {
  $("div.toggle-filter-box").addClass("visible-filter-box");
}

/* Instantiate new controls with custom event handlers */
const ctrlThreePoint = new MapboxGLButtonControl({
  className: "toggle-filter-control",
  title: "View filter",
  eventHandler: three,
});

map.addControl(ctrlThreePoint, "top-center");
/* end filter custom control button */

// Add the geocoding control to the map.
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  countries: "us",
  language: "en-US",
  placeholder: "Search for address ...",
});
map.addControl(geocoder, "top-center");
// End adding the geocoding control to the map.

var bounds = new mapboxgl.LngLatBounds();

/// loading POIs data from Google Sheets table///
$.getJSON(
  "https://sheets.googleapis.com/v4/spreadsheets/1dfFzWl13UcWMeHQbWpO83ghaxX5nfvbzSTQCB0GI-Z8/values/Sheet1!A2:J3000?majorDimension=ROWS&key=AIzaSyBPveIspvYmuPb50c30cjIAb0wm8yj0wTc",
  function (response) {
    response.values.forEach(function (marker) {
      var name = marker[1];

      var propertyType = marker[4]; // Development Stage
      var propertyTypeSmallLetters = propertyType
        .toLowerCase()
        .replace(/\s/g, "-");
      var propertyTypeSmallLetters = propertyTypeSmallLetters
        .replaceAll(",", "")
        .replaceAll("/", "-");

      var developmentStage = marker[5]; // Ownership Type
      var developmentStageSmallLetters = developmentStage
        .toLowerCase()
        .replace(/\s/g, "-");
      var developmentStageSmallLetters = developmentStageSmallLetters
        .replaceAll(",", "")
        .replaceAll("/", "-");

      var estimatedCompletion = marker[6]; // Estimated Completion

      var address = marker[3];

      var longitude = parseFloat(marker[3]);
      var latitude = parseFloat(marker[2]);

      var description = marker[7];

      var website = marker[8];

      var image = marker[9];

      var id = marker[0];

      var selectedPointDetails =
        "<div data-property-type-visible='true' data-tool-visible='true' data-estimated-completion-visible='true' data-property-type='" +
        propertyTypeSmallLetters +
        "' data-development-stage='" +
        developmentStageSmallLetters +
        "' data-estimated-completion='" +
        estimatedCompletion +
        "' class='sidebar-details-points " +
        propertyTypeSmallLetters +
        " " +
        developmentStageSmallLetters +
        "' id='sidebar-details-point-id-" +
        id +
        "'>";

      selectedPointDetails += "<p class='point-title'>" + name + "</p>";

      selectedPointDetails +=
        "<div class='sidebar-points-additional-info'  id='sidebar-point-additional-info-" +
        id +
        "'><p class='point-description'>" +
        propertyType +
        " | " +
        developmentStage +
        "</div></div>";

      $("#sidebar").append(selectedPointDetails);

      $("sidebar-point-additional-info-" + id).css("display", "none");

      bounds.extend([longitude, latitude]);

      var popupContent = "<span class='popup-sidebar-close-button'>X</span>";
      if (name) {
        popupContent += "<div class='title-popup-sidebar'><b>" + name + "</b></div><hr>";
      }

      popupContent += "<p>Property Type : <b>" + propertyType + "</b></p>";
      popupContent +=
        "<p>Development Stage : <b>" + developmentStage + "</b></p>";
      popupContent +=
        "<p>Estimated Completion : <b>" + estimatedCompletion + "</b></p>";

      if (website) {
        popupContent +=
          "<span class='popup-links'><img class='address-icon' src='https://assets.yimby.ai/geocadder-map/icons/website.svg'><a class='web-links address-text' target='_blank' href='" +
          website +
          "'>Link to Article</a></span>";
      }

      if (description) {
        popupContent += "<p class='description-text'>" + description + "</p>";
      }

      if (image) {
        popupContent += "<img class='popup-image' src='" + image + "'>";
      }

      popup = new mapboxgl.Popup({ closeOnClick: false }).setHTML("<div>" + name + "</div>");

      // create a HTML element for each feature
      var el = document.createElement("div");
      el.className = "marker";
      el.id = id;
      $(el).attr("data-development-stage", developmentStageSmallLetters);
      $(el).attr("data-property-type", propertyTypeSmallLetters);
      $(el).attr("data-estimated-completion", estimatedCompletion);

      $(el).attr("data-development-stage-visible", "true");
      $(el).attr("data-property-type-visible", "true");
      $(el).attr("data-estimated-completion-visible", "true");

      var markerObj = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map);

      el.style.backgroundImage =
        "url(https://assets.yimby.ai/geocadder-map/icons/" + developmentStageSmallLetters + ".png)";

      el.addEventListener("click", (e) => {
        // flyToStoreOnMarkerClick(markerObj);
        createPopup(markerObj);

        $("#sidebar-popup").css("display", "block");
        $("#sidebar-popup").html(popupContent)
        $("#sidebar").css("display", "none");

        $(".popup-sidebar-close-button").click(function () {
          $("#sidebar").css("display", "block");
          $("#sidebar-popup").css("display", "none");
          $(".mapboxgl-popup").remove();
        });

        e.stopPropagation();

        // scroll to the selected item in the sidebar
        var selectedItem = document.getElementById(
          "sidebar-details-point-id-" + id
        );
        selectedItem.scrollIntoView({ behavior: "smooth", inline: "start" });
        // end scrolling to the selected item in the sidebar

        $(".sidebar-details-points").removeClass("active");

        $("#sidebar-point-additional-info-" + id).css("display", "block");
        $("#sidebar-details-point-id-" + id).addClass("active");
      });

      $(".sidebar-details-points").click(function (e) {
        var currentSidebaritemId = e.currentTarget.id;
        var currentId = currentSidebaritemId.split("-")[4];

        if (currentId === id) {
          var popupContent = "<span class='popup-sidebar-close-button'>X</span>";
          if (name) {
            popupContent += "<div class='title-popup-sidebar'><b>" + name + "</b></div><hr>";
          }

          popupContent += "<p>Property Type : <b>" + propertyType + "</b></p>";
          popupContent +=
            "<p>Development Stage : <b>" + developmentStage + "</b></p>";
          popupContent +=
            "<p>Estimated Completion : <b>" + estimatedCompletion + "</b></p>";

          if (website) {
            popupContent +=
              "<span class='popup-links'><img class='address-icon' src='https://assets.yimby.ai/geocadder-map/icons/website.svg'><a class='web-links address-text' target='_blank' href='" +
              website +
              "'>Link to Article</a></span>";
          }

          if (description) {
            popupContent +=
              "<p class='description-text'>" + description + "</p>";
          }

          if (image) {
            popupContent += "<img class='popup-image' src='" + image + "'>";
          }

          const popUps = document.getElementsByClassName("mapboxgl-popup");
          if (popUps[0]) popUps[0].remove();

          popup = new mapboxgl.Popup({ closeOnClick: false }).setHTML(
            "<div>" + name + "</div>"
          );

          var markerObj = new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .setPopup(popup)
            .addTo(map);

          $("#sidebar-popup").css("display", "block");
          $("#sidebar-popup").html(popupContent)
          $("#sidebar").css("display", "none");

          popup.addTo(map);


          $(".popup-sidebar-close-button").click(function () {
            $("#sidebar").css("display", "block");
            $("#sidebar-popup").css("display", "none");
            $(".mapboxgl-popup").remove();
          });


          // flyToStoreOnMarkerClick(markerObj);
        }

        $(".sidebar-details-points").removeClass("active");

        $("#sidebar-details-point-id-" + currentId).addClass("active");
      });
    });

    map.on("zoomend", function () {
      var visiblePointsIds = getVisibleMarkers();
      $(".sidebar-details-points").each(function (
        sidebarNumber,
        sidebarElement
      ) {
        $(sidebarElement).css("display", "none");
        var idOnlyArray = $(sidebarElement).attr("id").split("-");
        var idOnly = idOnlyArray[4];
        visiblePointsIds.forEach(function (visiblePointId) {
          if (visiblePointId == idOnly) {
            $("#sidebar-details-point-id-" + idOnly).css("display", "block");
          }
        });
      });
    });

    map.on("moveend", function () {
      var visiblePointsIds = getVisibleMarkers();
      $(".sidebar-details-points").each(function (
        sidebarNumber,
        sidebarElement
      ) {
        $(sidebarElement).css("display", "none");
        var idOnlyArray = $(sidebarElement).attr("id").split("-");
        var idOnly = idOnlyArray[4];
        visiblePointsIds.forEach(function (visiblePointId) {
          if (visiblePointId == idOnly) {
            $("#sidebar-details-point-id-" + idOnly).css("display", "block");
          }
        });
      });
    });

    map.fitBounds(bounds, { padding: 100 });

    $(".mapboxgl-canvas").click(function () {
      $(".mapboxgl-popup").remove();
      checkList.classList.remove("visible");
      checkListTwo.classList.remove("visible");
    });
  }
);

// map.on('render', function () {
//   getVisibleMarkers()
// })





$(".mapboxgl-canvas").click(function () {
  $("#sidebar").css("display", "block");
  $("#sidebar-popup").css("display", "none");
});


//////////////// open/close dropdown menu for property type filter
var checkList = document.getElementById("list1");
checkList.getElementsByClassName("anchor")[0].onclick = function (evt) {
  if (checkList.classList.contains("visible"))
    checkList.classList.remove("visible");
  else checkList.classList.add("visible");
};
//////////////

//////////// open/close dropdown menu for development stage filter
var checkListTwo = document.getElementById("list2");
checkListTwo.getElementsByClassName("anchor")[0].onclick = function (evt) {
  if (checkListTwo.classList.contains("visible"))
    checkListTwo.classList.remove("visible");
  else checkListTwo.classList.add("visible");
};
////////////////

//////////// open/close dropdown menu for estimated completion filter
var checkListThree = document.getElementById("list3");
checkListThree.getElementsByClassName("anchor")[0].onclick = function (evt) {
  if (checkListThree.classList.contains("visible"))
    checkListThree.classList.remove("visible");
  else checkListThree.classList.add("visible");
};
////////////////
$("input[type='checkbox'][name='filter-by-property-type-input']").click(
  function () {
    var currentPropertyType = $(this).val();
    if ($(this).is(":checked")) {
      $("[data-property-type='" + currentPropertyType + "']").each(function (
        index
      ) {
        $(this).attr("data-property-type-visible", "true");
        if ($(this).attr("data-development-stage-visible") === "true") {
          $(this).css("display", "block");
        }
      });
    } else {
      $("[data-property-type='" + currentPropertyType + "']").each(function (
        index
      ) {
        $(this).attr("data-property-type-visible", "false");
        $(this).css("display", "none");
      });
    }

    var visiblePointsIds = getVisibleMarkers();
    $(".sidebar-details-points").each(function (sidebarNumber, sidebarElement) {
      $(sidebarElement).attr("data-property-type-visible", "false");
      $(sidebarElement).css("display", "none");
      var idOnlyArray = $(sidebarElement).attr("id").split("-");
      var idOnly = idOnlyArray[4];
      visiblePointsIds.forEach(function (visiblePointId) {
        if (visiblePointId == idOnly) {
          $(sidebarElement).css("display", "block");
          $(sidebarElement).attr("data-property-type-visible", "true");
        }
      });
    });
  }
);

$("input[type='checkbox'][name='filter-by-development-stage-input']").click(
  function () {
    var currentDevelpmentStage = $(this).val();
    if ($(this).is(":checked")) {
      $("[data-development-stage='" + currentDevelpmentStage + "']").each(
        function (index) {
          $(this).attr("data-development-stage-visible", "true");
          if ($(this).attr("data-property-type-visible") === "true") {
            $(this).css("display", "block");
          }
        }
      );
    } else {
      $("[data-development-stage='" + currentDevelpmentStage + "']").each(
        function (index) {
          $(this).attr("data-development-stage-visible", "false");
          $(this).css("display", "none");
        }
      );
    }

    var visiblePointsIds = getVisibleMarkers();
    $(".sidebar-details-points").each(function (sidebarNumber, sidebarElement) {
      $(sidebarElement).css("display", "none");
      var idOnlyArray = $(sidebarElement).attr("id").split("-");
      var idOnly = idOnlyArray[4];
      visiblePointsIds.forEach(function (visiblePointId) {
        if (visiblePointId == idOnly) {
          $("#sidebar-details-point-id-" + idOnly).css("display", "block");
        }
      });
    });
  }
);

$("input[type='checkbox'][name='filter-by-estimated-completion-input']").click(
  function () {
    var currentEstimatedCompletion = $(this).val();
    if ($(this).is(":checked")) {
      $(
        "[data-estimated-completion='" + currentEstimatedCompletion + "']"
      ).each(function (index) {
        $(this).attr("data-estiamted-completion-visible", "true");
        if ($(this).attr("data-development-stage-visible") === "true") {
          $(this).css("display", "block");
        }
      });
    } else {
      $(
        "[data-estimated-completion='" + currentEstimatedCompletion + "']"
      ).each(function (index) {
        $(this).attr("data-estimated-completion-visible", "false");
        $(this).css("display", "none");
      });
    }

    var visiblePointsIds = getVisibleMarkers();
    $(".sidebar-details-points").each(function (sidebarNumber, sidebarElement) {
      $(sidebarElement).css("display", "none");
      var idOnlyArray = $(sidebarElement).attr("id").split("-");
      var idOnly = idOnlyArray[4];
      visiblePointsIds.forEach(function (visiblePointId) {
        if (visiblePointId == idOnly) {
          $("#sidebar-details-point-id-" + idOnly).css("display", "block");
        }
      });
    });
  }
);

map.on("render", function () {
  getVisibleMarkers();
});

function scrollToTheSelectedItem(currentPointId) {
  $(".sidebar-details-points").removeClass("active");

  $("#sidebar-point-additional-info-" + currentPointId).css("display", "block");
  $("#sidebar-details-point-id-" + currentPointId).addClass("active");

  // scroll to the selected item in the sidebar
  var selectedItem = document.getElementById(
    "sidebar-details-point-id-" + currentPointId
  );
  selectedItem.scrollIntoView({ behavior: "smooth", inline: "start" });
  // end scrolling to the selected item in the sidebar
}

// function flyToStoreOnSidebarClick(currentFeature) {
//   map.flyTo({
//     center: currentFeature["_lngLat"],
//     zoom: 14,
//     offset: [0, -150],
//     // speed: 20,
//   });
// }

// function flyToStoreOnMarkerClick(currentFeature) {
//   map.flyTo({
//     center: currentFeature["_lngLat"],
//     offset: [0, -150],
//     // speed: 20,
//   });
// }

/**
 * Create a Mapbox GL JS `Popup`.
 **/
function createPopup(currentFeature) {
  const popUps = document.getElementsByClassName("mapboxgl-popup");
  if (popUps[0]) popUps[0].remove();

  const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature["_lngLat"])
    .setHTML(currentFeature["_popup"]["_content"]["innerHTML"])
    .addTo(map);
  $("#sidebar-popup").html(currentFeature["_popup"]["_content"]["innerHTML"])
}

/* check if point is withing map view */
function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

function getVisibleMarkers() {
  var cc = map.getContainer();
  var els = cc.getElementsByClassName("marker");
  var ccRect = cc.getBoundingClientRect();
  var visibles = [];
  var visiblesIds = [];
  for (var i = 0; i < els.length; i++) {
    var el = els.item(i);
    var elRect = el.getBoundingClientRect();
    intersectRect(ccRect, elRect) && visibles.push(el);
  }
  if (visibles.length > 0) {
    visibles.forEach(function (visible) {
      var visibleId = $(visible).attr("id");
      visiblesIds.push(visibleId);
    });
  }
  return visiblesIds;
}
/* end checking if point is withing map view */
