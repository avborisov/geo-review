ymaps.ready(init);

const LOCAL_STORAGE_NAME = 'YMapData'
const reviewForm = document.querySelector('#review-form');
const closeBtn = document.querySelector('#close-btn');
const formHeaderText = document.querySelector('#header-text');
const saveBtn = document.querySelector('#save-btn');
const nameInput = document.querySelector('#name-input');
const placeInput = document.querySelector('#place-input');
const textInput = document.querySelector('#text-input');

const reviewHeaderNameInput = document.querySelector('#review-header-name');
const reviewHeaderPlace = document.querySelector('#review-header-place');
const reviewText = document.querySelector('#review-text');

var myMap, myClusterer, currentCoords;

closeBtn.addEventListener('click', () => {
    reviewForm.style.display = 'none';
});

saveBtn.addEventListener('click', () => {
    addData(currentCoords, nameInput.value, placeInput.value, textInput.value);
    reviewForm.style.display = 'none';
});

function showForm(e) {
    currentCoords = e.get('coords');
    let pageX = e.get('domEvent').get('pageX');
    let pageY = e.get('domEvent').get('pageY');

    nameInput.value = '';
    placeInput.value = '';
    textInput.value = '';

    reviewForm.style.left = pageX + "px";
    reviewForm.style.top = pageY + "px";
    reviewForm.style.display = 'block';
}

function showFormWithData(e, index) {
    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || [];
    let info = data[index];

    currentCoords = info.coords;
    reviewHeaderNameInput.textContent = info.name;
    reviewHeaderPlace.textContent = info.place + ' ' + info.time;
    reviewText.textContent = info.comment;

    reviewForm.style.left = e.pageX + "px";
    reviewForm.style.top = e.pageY + "px";
    reviewForm.style.display = 'block';

    let myGeocoder = ymaps.geocode(currentCoords);
    myGeocoder.then(
        function (res) {
            var street = res.geoObjects.get(0);
            var name = street.properties.get('name');
            formHeaderText.textContent = name;
        }
    );
}

function init(){
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 7
    });

    myMap.events.add('click', (e) => {
        showForm(e);

        let myGeocoder = ymaps.geocode(currentCoords);
        myGeocoder.then(
            function (res) {
                var street = res.geoObjects.get(0);
                var name = street.properties.get('name');
                formHeaderText.textContent = name;
            }
        );
    });

    myMap.geoObjects.events.add('click', (e) => {
        let target = e.get('target').properties._data;
        if(target.hasOwnProperty('geoObjects')){
            // show carousel
        } else {
            // show form
            e.preventDefault();
            showForm(e);

            let info = target.info;

            currentCoords = info.coords;

            reviewHeaderNameInput.textContent = info.name;
            reviewHeaderPlace.textContent = info.place + ' ' + info.time;
            reviewText.textContent = info.comment;

            let myGeocoder = ymaps.geocode(currentCoords);
            myGeocoder.then(
                function (res) {
                    var street = res.geoObjects.get(0);
                    var name = street.properties.get('name');
                    formHeaderText.textContent = name;
                }
            );
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('balloon-link')) {
            myMap.balloon.close();
            showFormWithData(e, e.target.id);
        }
    });

    myMap.balloon.events.add('click', (e) =>  {
        let domTarget = e.get('domEvent');
    });

    // Создание кластеризатора с макетом-каруселью
    myClusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        // Используем макет "карусель"
        clusterBalloonContentLayout: "cluster#balloonCarousel",
        // Запрещаем зацикливание списка при постраничной навигации
        clusterBalloonCycling: false,
        // Настройка внешнего вида панели навигации.
        clusterBalloonPagerType: "numeric",
        // Количество элементов в панели навигации
        clusterBalloonPagerSize: 6
    });

    myMap.geoObjects.add(myClusterer);
    redrawPoints();

}

function redrawPoints() {

    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || [];
    let myGeoObjects = [];

    for (let index = 0; index < data.length; index++) {

        let myGeocoder = ymaps.geocode(data[index].coords);
        myGeocoder.then(
            function (res) {
                let street = res.geoObjects.get(0);
                let name = street.properties.get('name');

                let newGeoObject = new ymaps.GeoObject({
                    geometry: {type: "Point", coordinates: data[index].coords},
                    properties: {
                        info: data[index],
                        balloonContentHeader: data[index].place,
                        balloonContentBody: '<a href="#" class="balloon-link" id="' + index + '">'
                            + name + '</a><br><br>' + data[index].comment,
                        population: 11848762
                    }
                });
                myGeoObjects.push(newGeoObject);
                myClusterer.removeAll();
                myClusterer.add(myGeoObjects);
            }
        );
    }
}

function addData(coords, name, place, comment) {

    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || [];

    let newPoint = {};
    newPoint.coords = coords;
    newPoint.name = name;
    newPoint.place = place;
    newPoint.comment = comment;

    let now = new Date();
    newPoint.time = now.getFullYear() + '.' + now.getMonth() + "." + now.getDate() + ' ' + now.getHours() + ":" +
        now.getMinutes() + ":" + now.getSeconds();

    data.push(newPoint);
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(data));

    redrawPoints();

}
