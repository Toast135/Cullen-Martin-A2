
//------------------------------------------------------------------------------------------------------
//Service Fee: $85 if the customer’s phone is "not warranty", else $0.00
//------------------------------------------------------------------------------------------------------
$('#warranty').change(function(){
	if (this.checked) {
		$('#serviceFee').val('0.00');
	} else {
		$('#serviceFee').val('85.00');
	}
});

let courtesyList = [{item: 'iPhone', bond: 275},
					{item: 'otherPhone', bond: 100},
					{item: 'charger', bond: 30}
				   ];
				   
let appState = {customerType: 'customer',
				courtesyPhone: {item: 'none', bond: 0},
				courtesyCharger: {item: 'none', bond: 0}
			  };
			  
//add btn onclick event
$('#addBtn').click(function(e){
	e.preventDefault();
	//get selected item
	let selectedItemText = $('#itemList').find(":selected").text();
	let selectedItemValue = $('#itemList').find(":selected").val();
	let selectedItemBond = courtesyList.find(foundItem => foundItem.item.toLowerCase() == selectedItemValue.toLowerCase()).bond;

	//HTML code of item
		let newRow = `
			<tr class="newSelectedItem">
				<td>${selectedItemText}</td>
				<td>${selectedItemBond}</td>
			<tr>
		`;
	//add new item to table if it doesnt exist already
	if(appState.courtesyPhone.item == 'none' && selectedItemValue.toLowerCase().includes('phone')) {
		//add new row
		$('#borrowItems').append(newRow);
		//update appstate
		appState.courtesyPhone.item = selectedItemValue;
		appState.courtesyPhone.bond = selectedItemBond;
		//update bond
		if($('#customerType').is(':checked')) {
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
		} else {
			$('#bond').val(0);
		}
	//same thing but for 'charger' item
	} else if (appState.courtesyCharger.item == 'none' && selectedItemValue.toLowerCase().includes('charger')) {
		$('#borrowItems').append(newRow);
		appState.courtesyCharger.item = selectedItemValue;
		appState.courtesyCharger.bond = selectedItemBond;
		if($('#customerType').is(':checked')) {
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
		} else {
			$('#bond').val(0);
		}
	} else {
		alert('This item was already added')
	}
	
});


//remove btn onclick event
$('#removeBtn').click(function(e) {
	//prevent default button functions
	e.preventDefault();

	//remove all added rows with class="newSelectedItem"
	$('.newSelectedItem').remove();

	//update appstate
	appState.courtesyPhone = {item: 'none', bond: 0};
	appState.courtesyCharger = {item: 'none', bond: 0};
	if($('#customerType').is(':checked')) {
		$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
	} else {
		$('#bond').val(0);
	}
});

//change 'customerType' event
$('#customerType').click(function(){
	appState.customerType = 'customer';
	$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
});

$('#businessType').click(function(){
	appState.customerType = 'business';
	$('#bond').val(0);
});

//update total fee
$('#addBtn,#removeBtn,#customerType,#businessType').on('click',function(){
	var value1 = parseFloat($('#bond').val()) || 0;
  var value2 = parseFloat($('#serviceFee').val()) || 0;
  $('#totalFee').val(value1 + value2);
});

$('#warranty').on('change',function(){
	var value1 = parseFloat($('#bond').val()) || 0;
  var value2 = parseFloat($('#serviceFee').val()) || 0;
  $('#totalFee').val(value1 + value2);
});

//update GST
$('#addBtn,#removeBtn,#customerType,#businessType').on('click',function(){
	var value1 = parseFloat($('#bond').val()) || 0;
  var value2 = parseFloat($('#serviceFee').val()) || 0;
  $('#gst').val(((value1 + value2)*1.15)-(value1 + value2));
});

$('#warranty').on('change',function(){
	var value1 = parseFloat($('#bond').val()) || 0;
  var value2 = parseFloat($('#serviceFee').val()) || 0;
  $('#gst').val(((value1 + value2)*1.15)-(value1 + value2));
});

//update total fee + GST
$('#addBtn,#removeBtn,#customerType,#businessType').on('click',function(){
	var value1 = parseFloat($('#bond').val()) || 0;
    var value2 = parseFloat($('#serviceFee').val()) || 0;
    $('#totalFeeGst').val((value1 + value2)*1.15);
});

$('#warranty').on('change',function(){
	var value1 = parseFloat($('#bond').val()) || 0;
  var value2 = parseFloat($('#serviceFee').val()) || 0;
  $('#totalFeeGst').val((value1 + value2)*1.15);
});

//autocomplete address
var placeSearch, autocomplete;

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('address')),
      {types: ['geocode']});
  autocomplete.setComponentRestrictions( {'country': 'nz'});
  autocomplete.addListener('place_changed', fillInAddress);
}


function fillInAddress() {
  var place = autocomplete.getPlace();

  var address = '';
  //find address info and insert new values
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    switch (addressType){
      case 'subpremise':
        address = place.address_components[i]['short_name'] + '/' + address;
      break;
      case 'street_number':
        address = address + place.address_components[i]['short_name'] + ' ';
      break;
      case 'route':
        address += place.address_components[i]['long_name'];
      break;
	  case 'sublocality_level_1':
        document.getElementById('suburb').value = place.address_components[i]['long_name'];
      break;
      case 'locality':
        document.getElementById('city').value = place.address_components[i]['long_name'];
      break;
      case 'postal_code':
        document.getElementById('postal_code').value = place.address_components[i]['short_name'];
      break;
    }
  }
  
  document.getElementById('address').value = address;
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}


//----------------------------------------------------
//FAQs page
//----------------------------------------------------
let proxy = 'https://cors-anywhere.herokuapp.com/';
let url = 'http://danieldangs.com/itwd6408/json/faqs.json';

//query JSON file
$.getJSON(
	proxy + url, 
	function(data){
		//loop through all questions and display them on webpage
		$.each(data, function(i, question) { //i=index , question
			//extract question and answer
			let content = `
				<div class="col-12 p-2 ms-5 me-5 mb-4" style="background-color: var(--q-and-a-color); width: 90%;">
					<h4>${question.question}</h4>
					<p>${question.answer}</p>
				</div>
			`;
			//append question to the list
			$('#questions').append(content)
		});
	} 
);

//search function 
$('#search-box').on('keyup', function(){
	//get entered keyword
	let keywords = $(this).val().toLowerCase();
	//loop through all questions/answers and find if q&a contains entered keyword, then hide all others
	$('#questions div').filter(function(){
		$(this).toggle($(this).html().toLowerCase().indexOf(keywords) > -1);
	});
});

//----------------------------------------------------
//Print booking form
//----------------------------------------------------

//assign form values to variables
$('#formsubmit').on('click', function(){
  let title = $('#title').val()
  let fname = $('#fname').val()
  let lname = $('#lname').val()
  let address = $('#address').val()
  let suburb = $('#suburb').val()
  let city = $('#city').val()
  let postal_code = $('#postal_code').val()
  let phoneNumber = $('#phoneNumber').val()
  let email = $('#email').val()
  let purchaseDate = $('#purchaseDate').val()
  let repairDate = $('#repairDate').val()
  let imei = $('#imei').val()
  let make = $('#make').val()
  let modelNumber = $('#modelNumber').val()
  let faultCategory = $('#faultCategory').val()
  let description = $('#description').val()
  let bond = $('#bond').val()
  let serviceFee = $('#serviceFee').val()
  let totalFee = $('#totalFee').val()
  let gst = $('#gst').val()
  let totalFeeGst = $('#totalFeeGst').val()

  //send form values to local storage
  localStorage.setItem('formData', JSON.stringify({
    title: title,
    fname: fname,
    lname: lname,
    address: address,
    suburb: suburb,
    city: city,
    postal_code: postal_code,
    phoneNumber: phoneNumber,
    email: email,
    purchaseDate: purchaseDate,
    repairDate: repairDate,
    imei: imei,
    make: make,
    modelNumber: modelNumber,
    faultCategory: faultCategory,
    description: description,
    bond: bond,
    serviceFee: serviceFee,
    totalFee: totalFee,
    gst: gst,
    totalFeeGst: totalFeeGst
  }));
});

//load values from local storage and append to html
$(window).on('load', function() {
  var storage = localStorage.getItem('formData');
  if (storage) {
    storage = JSON.parse(storage);
    $('#booking-title').append(storage.title," ",storage.fname," ",storage.lname);
    $('#booking-address').append(storage.address);
    $('#booking-suburb').append(storage.suburb," ",storage.city, " ",storage.postal_code);
    $('#booking-phoneNumber').append(storage.phoneNumber);
    $('#booking-email').append(storage.email);
    $('#booking-purchaseDate').append(storage.purchaseDate);
    $('#booking-repairDate').append(storage.repairDate);
    $('#booking-imei').append(storage.imei);
    $('#booking-make').append(storage.make);
    $('#booking-modelNumber').append(storage.modelNumber);
    $('#booking-faultCategory').append(storage.faultCategory);
    $('#booking-description').append(storage.description);
    $('#booking-bond').append(storage.bond);
    $('#booking-serviceFee').append(storage.serviceFee);
    $('#booking-totalFee').append(storage.totalFee);
    $('#booking-gst').append(storage.gst);
    $('#booking-totalFeeGst').append(storage.totalFeeGst)
  }

  //get current date
  let currentFullDate = new Date();
  let day = currentFullDate.getDate();
  let month = currentFullDate.getMonth() + 1;
  let year = currentFullDate.getFullYear();
  let currentDate = `${day} ${month}, ${year}`;
  $('#booking-currentDate').append(currentDate)

  //get payment due date
  let paymentDay = currentFullDate.getDate() + 5;
  let paymentDate = `${paymentDay} ${month}, ${year}`;
  $('#booking-paymentDate').append(paymentDate)
})

//----------------------------------------------------
//JavaScript page
//----------------------------------------------------

//hide all content initially 
$('.JSWindow').hide();

//change button colour and show corresponding section
$('.btn-demo-area button').on('click', function() {
	$('.btn-demo-area button').css('background-color', '#017dca');
	$(this).css('background-color', 'orange');
	$('.JSWindow').hide();
	$('.JSWindow').eq($(this).index()).show(1000);
});

//Chatbot
const inputField = document.getElementById("input");
inputField.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    let input = inputField.value;
    inputField.value = "";
    output(input);
  }
});

function output(input) {
  let product;
  let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");
  text = text
    .replace(/ a /g, " ")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "")
    .replace(/r u/g, "are you");

  addChatEntry(input, product);
}

function compare(utterancesArray, answersArray, string) {
  let reply;
  let replyFound = false;
  for (let x = 0; x < utterancesArray.length; x++) {
    for (let y = 0; y < utterancesArray[x].length; y++) {
      if (utterancesArray[x][y] === string) {
        let replies = answersArray[x];
        reply = replies[Math.floor(Math.random() * replies.length)];
        replyFound = true;
        break;
      }
    }
    if (replyFound) {
      break;
    }
  }
  return reply;
}

function addChatEntry(input, product) {
  const messagesContainer = document.getElementById("messages");
  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.className = "user response";
  userDiv.innerHTML = `<span>${input}</span>`;
  messagesContainer.appendChild(userDiv);

  let botDiv = document.createElement("div");
  let botText = document.createElement("span");
  botDiv.id = "bot";
  botDiv.className = "bot response";
  botText.innerText = "Typing...";
  botDiv.appendChild(botText);
  messagesContainer.appendChild(botDiv);

  messagesContainer.scrollTop =
    messagesContainer.scrollHeight - messagesContainer.clientHeight;

  setTimeout(() => {
    botText.innerText = `${product}`;
  }, 2000);
}

//Upload image
const image_input = document.querySelector("#image-input");

image_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});