var cancellationDataList = [];
var earlyBirdDataList = [];
var freeNightDataList = [];
var minimumDurationDataList = [];
var gNoContracts=false;
var gResorts = [];
var zindex = 10;
var pageNumber = 0;
var posTopTab01Original = 0;
var posTopTab02Original = 0;
var posTopTab03Original = 0;
var posTopTab04Original = 0;


$(function() {
	
	$('#wait').hide();
	$( "#suggestedRates" ).draggable();
	$( "#amendedRates" ).draggable();
	$( "#tab02" ).draggable();
	$( "#tab03" ).draggable();
	$( "#tab04" ).draggable();
	$( "#otherRatesModal" ).draggable();
	
	loadResort();
	
  	var $tabButtonItem = $('#tab-button li'),
    $tabSelect = $('#tab-select'),
    $tabContents = $('.tab-contents'),
    activeClass = 'is-active';

  	$tabButtonItem.first().addClass(activeClass);
  	$tabContents.not(':first').hide();

  	$tabButtonItem.find('a').on('click', function(e) {
    	var target = $(this).attr('href');

    	$tabButtonItem.removeClass(activeClass);
    	$(this).parent().addClass(activeClass);
    	$tabSelect.val(target);
    	$tabContents.hide();
    	$(target).show();
    	e.preventDefault();
  	});

  	$tabSelect.on('change', function() {
    	var target = $(this).val(),
        targetSelectNum = $(this).prop('selectedIndex');

    	$tabButtonItem.removeClass(activeClass);
    	$tabButtonItem.eq(targetSelectNum).addClass(activeClass);
    	$tabContents.hide();
    	$(target).show();
  	});
});

/* Load All Cities */
function loadResort(){
	$.ajax({
        url: "/city/allcity",
        type: 'GET',
        dataType: "json",
        beforeSend: function () {
            $('#wait').show();
        },
        success: function (data) {
            console.log(data);
			if (data != null){
				gResorts = data; 
			}
            $('#wait').hide();
        },
        error: function (data, status, er) {
        	$('#wait').hide();
            console.log(data);
            console.log(status);
            console.log(er);
        }
    });
	
}
function getResortOptions() {
	var resortSelect = "";
	resortSelect += "	   	<select onchange='showSeasonsTable()' class=\"form-control\" id=\"resort\" style=\"height: 30px;font-size: 12px;\">";
	resortSelect += "	   		<option value=\"\">"+ "-- Select a Resort --" +"</option>";
	for(var k=0; k <gResorts.length; k++){
		resortSelect += "	   		<option value="+ gResorts[k].cityCode +">"+ gResorts[k].cityName +"</option>";
	}	
  	resortSelect += "	   	</select>";
  	return resortSelect;
}

/* Close all active windows */
function closeAllWindows() {
	pageNumber = 0;
	$('#suggestedRates').css('display','none');
	$('#amendedRates').css('display','none');
	$('#otherRatesModal').css('display','none');
	$('#tab02').css('display','none');
	$('#tab03').css('display','none');
	$('#tab04').css('display','none');
}
/* Authenticate and Validate Hotels for given Hotel code, password and Year */
function validateHotel() {
	var hotelCode = $('#hotelCode').val();
	var password = $('#password').val();
	var forYear = $('#forYear').val();
	if (hotelCode == ""){
		alert("Please enter Hotel Code");
		$('#hotelCode').focus();
		return true;
	}
	if (password == ""){
		alert("Please enter Hotel Password");
		$('#password').focus();
		return true;
	}
	if (forYear == ""){
		alert("Please enter For year");
		$('#forYear').focus();
		return true;
	}
	/* Hide the other dives apart from the Tabs*/
	$('#suggestedRates').css('display','none');
	$('#amendedRates').css('display','none');
	$('#otherRatesModal').css('display','none');
	gNoContracts=false;
	$.ajax({
        url: "/pickservice/hotel/copyopen",
        type: 'POST',
        data: {
        	hotelCode: hotelCode,
        	hotelPassword: password,
        	forYear: forYear
        },
        dataType: "json",
        
        beforeSend: function () {
            $('#wait').show();
        },
        success: function (data) {
            console.log(data);
            var hotelCode = "";
            var hotelList = data.mapperHotelList;
            if (data != null && hotelList.length > 0){
				for(var i=0; i <hotelList.length; i++){  
					var forYear = hotelList[i].forYear;
					hotelCode = hotelList[i].hotelCode;
					var hotelName = hotelList[i].hotelName;
					var seasonsList = hotelList[i].mapperSeasonsList;
					$('#validHotelName').empty();
					$('#validHotelName').append(hotelName);
					//$('#tab01').empty();
					
					var divStr="";
					var divStr1="";
					var tab03FirstTime = true;
					var tab01FirstTime = true;
					for(var j=0; j <seasonsList.length; j++){
						var copyFromActiveContract = seasonsList[j].copyFromActiveContract;
						var copyFromCoreContract = seasonsList[j].copyFromCoreContract;
						var copyFromDates = seasonsList[j].copyFromDates;
						var copyFromSeasonCode = seasonsList[j].copyFromSeasonCode;
						var copyToActiveContract = seasonsList[j].copyToActiveContract;
						var copyToCoreContract = seasonsList[j].copyToCoreContract;
						var copyToDates = seasonsList[j].copyToDates;
						var copyToSeasonCode = seasonsList[j].copyToSeasonCode;
						/* This is for Tab03 */
						if (tab03FirstTime){
							var resortSelect = getResortOptions();
							$('#resortList').empty();
							$('#resortList').append(resortSelect);
							
							$('#seasonTableHotels').empty();
    						divStr1 += "			<thead>";
      						divStr1 += "				<tr>";
        					divStr1 += "				<th class=\"rates-row-th table-border-top\">From</th >";
        					divStr1 += "				<th class=\"rates-row-th table-border-top\">To</th >";
        					divStr1 += "				<th class=\"rates-row-th table-border-top\">Select</th >";
     	 					divStr1 += "			</tr>";
    						divStr1 += "		</thead>";
    						divStr1 += "		<tbody>";
							tab03FirstTime = false;
						}
    					divStr1 += "			<tr>";
        				divStr1 += "				<td class=\"td-season-style\" style=\"border-bottom: transparent !important;\">" + copyFromSeasonCode + "</td>";
        				divStr1 += "				<td class=\"td-season-style\" style=\"border-bottom: transparent !important;\">" + copyToSeasonCode + "</td >";
        				divStr1 += "				<td class=\"td-season-style\" rowspan='2'><label style=\"margin-left: 10px;\"><input id='" + hotelCode + "]" + copyFromSeasonCode + "]" + copyToSeasonCode + "]" +updatedContract+ "]" + hotelName + "]" + copyToDates + "]" + copyFromActiveContract + ")' type=\"radio\" name=\"optradio\"></label></td >";
      					divStr1 += "			</tr>";
      					divStr1 += "			<tr>";
      					divStr1 += "				<td class=\"td-season-style\" style=\"border-top: transparent !important;\">" + copyFromDates + "</td>";
      					divStr1 += "				<td class=\"td-season-style\" style=\"border-top: transparent !important;\">" + copyToDates + "</td>";
      					divStr1 += "			</tr>";
						/* End of This is for Tab03 */
						
						if (tab01FirstTime){
							tab01FirstTime = false;
							$('#tab01Header1').empty();
							$('#tab01Header2').empty();
							$('#tab01Header1').append("Hotel " + hotelCode);
							$('#tab01Header2').append("Contract statuses for " + forYear);
						}
						divStr += "<div class='row tab-contents-row season-row'>";
  						divStr += "<div class='col-lg-5 tab-contens-col season-col-5' style=\"padding-right: 0px !important;padding-left: 0px !important;\">";
  						divStr += "<input type='text' disabled id='sesonCode' class='form-control contract-set-text' value='" + copyFromSeasonCode + ":" + copyFromDates + " : " + copyFromActiveContract + " (Active)' style=\"background-color: #da0620 !important;color: #ffffff !important;\">";
  						divStr += "</div>";
  						var updatedContract = false;
  						if (copyToActiveContract == "OK To Copy"){
  							divStr += "<div class='col-lg-5 tab-contents-col season-col-5' style=\"padding-right: 0px !important;padding-left: 0px !important;\">";
  							divStr += "<input type='text' disabled id='sesonCode' class='form-control contract-set-text' value='" + copyToSeasonCode + ":" + copyToDates + " (Awaiting)' style=\"background-color: #70b603 !important;color: #ffffff !important;\" title=\"Ready to negotiate Rates\">";
  							divStr += "</div>";
						}else{
							updatedContract = true;
  							divStr += "<div class='col-lg-5 tab-contents-col season-col-5' style=\"padding-right: 0px !important;padding-left: 0px !important;\">";
  							divStr += "<input type='text' disabled id='sesonCode' class='form-control contract-set-text' value='" + copyToSeasonCode + ":" + copyToDates + " :" + copyToActiveContract + " (Active)' style=\"background-color: #da0620 !important;color: #ffffff !important;\">";
  							divStr += "</div>";
  						}
  						
  						divStr += "<div class='col-lg-2 tab-contents-col season-col-2'>";
  						if (copyToActiveContract == "OK To Copy"){
  							divStr += "<button type='button' onclick='suggestRates(\"" + hotelCode + "\",\"" + copyFromSeasonCode + "\",\"" + copyToSeasonCode + "\"," +updatedContract+ ",\"" + hotelName + "\",\"" + copyToDates + "\",\"" + copyFromActiveContract + "\")'  data-hotelcode='"+hotelCode+"' data-oldseasoncode='"+copyFromSeasonCode+"' data-newseasoncode='"+copyToSeasonCode+"' class='btn btn-submit btn-contracts'>Suggest Rates</button>";
  							
  						}else{
							divStr += "&nbsp;";
						}
  						divStr += "</div>";
  						divStr += "</div>"; 
					}
					if (divStr == ""){
						gNoContracts=true;
						divStr = "<h2 class='h2-no-contract-text'> No Contracts Setup For Previous Season / Seasons Not Setup </h2>";
						$('#tab01SeasonsDetails').empty();
  						$('#tab01SeasonsDetails').append(divStr);
  						$('#tab01Header1').empty();
						$('#tab01Header2').empty();
						$('#tab01Header1').append("Hotel " + hotelCode);
						$('#tab01Header2').append("Contract statuses for " + forYear);
						//$('#tab01').append("<h2 class='h2-no-contract-text'> No Contracts Setup For Previous Season / Seasons Not Setup </h2>");
						//$('#tab03').append("<h2 class='h2-no-contract-text'> No Contracts Setup For Previous Season / Seasons Not Setup </h2>");
						/* This is for Tab03 */
						$('#seasonTableHotels').empty();
						$('#seasonTableHotels').append(divStr);
						/* End of This is for Tab03 */
						
					}else{
						gNoContracts=false;
						/* This is for Tab03 */
						divStr1 += "		</tbody>";
						$('#seasonTableHotels').empty();
						$('#seasonTableHotels').append(divStr1);
  						
  						/* End of This is for Tab03 */ 
  						$('#tab01SeasonsDetails').empty();
  						$('#tab01SeasonsDetails').append(divStr);
						//$('#tab01').append(divStr);
					}
				}
				$('.validate-hotel').css('display','block');
				enabledDisabledElements(1);
				//posTopTab01Original = $("#tab01").offset().top;
			}else{
				gNoContracts=true;
				$('#tab01').empty();
				$('#tab01').append("<h2 class='h2-no-contract-text'> No Contracts Setup For Previous Season / Seasons Not Setup </h2>");
				$('.validate-hotel').css('display','block');
				enabledDisabledElements(1);
				//posTopTab01Original = $("#tab01").offset().top;
			}
			
			var templateDataList = data.mapperTemplateDataList;
			if (templateDataList.length > 0){
				for(var j=0; j <templateDataList.length; j++){
					if (templateDataList[j].templateHotelCode != hotelCode){
						var terminationDate = templateDataList[j].terminationDate;
						var roomThStr="";
						var roomFirstTrStr="";
						var roomNextTrStr="";
						var tableStr = "";
						var roomThFirstTime = true;
						var subDivContents = "";
						var currencyCode = templateDataList[j].currencyCode;
						var templateHotelCode = templateDataList[j].templateHotelCode
						var templateHotelName = templateDataList[j].templateHotelName;
						var newTemplateHotelName = concertToLowar(templateHotelName);
						var templateRateNotes = templateDataList[j].templateRateNotes;
						var newTemplateRateNotes = concertToLowar(templateRateNotes);
						$('#tab04Header1').empty();
						$('#tab04Header1').append(newTemplateRateNotes + " based on " + newTemplateHotelName + "(" + templateHotelCode + ")");
						
						var templateDatesList = templateDataList[j].mapperTemplateDatesList;
						for(var m=0; m <templateDatesList.length; m++){
							var contractDate = templateDatesList[m].contractDate;
							var contractNextDate = "";
							if (templateDatesList[m+1] === undefined){
								contractNextDate = terminationDate;
							}else{
								contractNextDate = templateDatesList[m+1].contractDate;
								if (contractNextDate != null){
									contractNextDate = getPreviousDate(contractNextDate);
								}else{
									contractNextDate = terminationDate;
								}
							}
							
							var mapperRoomsList = templateDatesList[m].mapperTemplateRoomsList;
							if (roomThFirstTime){
								roomThStr += "<table class=\"table table-bordered suggested-table\">";	
								roomThStr += "<thead>";
								roomThStr += "<tr>";
								roomThStr += "<th class=\"rates-row-th table-border-top\">Dates</th>";
								roomFirstTrStr +="<tbody><tr><td class='td-dates-first rates-row-first-tr table-border-top' style=\"width: 100px;border-bottom: transparent !important;\">"+templateDataList[j].seasonCode+"</td>"
							}
							var contractDateArr=contractDate.split(" ");
							var contractDateStr=contractDateArr[0] + contractDateArr[1];
							var contractNextDateArr=contractNextDate.split(" ");
							var contractNextDateStr=contractNextDateArr[0] + contractNextDateArr[1];
							roomNextTrStr +="<tr>";
							roomNextTrStr +="<td class='td-dates rates-row-second-tr table-border-top'>" +contractDateStr+ "-" + contractNextDateStr + "</td>";
							for(var n=0; n <mapperRoomsList.length; n++){
								if (roomThFirstTime){
									roomThStr += "<th class=\"rates-row-th table-border-top\" colspan='2'>" + mapperRoomsList[n].roomCode + "</th>";
									roomFirstTrStr +="<td class=\"td-dates-first rates-row-first-tr table-border-top\" rowspan=\"2\" style=\"border-right: transparent !important;\">Adult</td><td class=\"td-dates-first rates-row-first-tr table-border-top\" rowspan=\"2\" style=\"border-left: transparent !important;\">Child</td>";
								}
								var adRate = mapperRoomsList[n].adultRate;
								var adRateStr ="--"
								if (adRate !=null && adRate != ""){
									var adRateAr = adRate.split(".");
									adRateStr = adRateAr[0];
								}
								var chRate = mapperRoomsList[n].childRate;
								var chRateStr ="--"
								if (chRate !=null && chRate != ""){
									var chRateAr = chRate.split(".");
									chRateStr = chRateAr[0];
								}
								roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-right: transparent !important;\">" +adRateStr+ "</td>";
								roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-left: transparent !important;\">" +chRateStr+ "</td>";
							}
							if (roomThFirstTime){
								roomThStr += "</tr></thead>";
								roomFirstTrStr +="</tr>";
								roomFirstTrStr +="<tr><td class='td-dates-first rates-row-first-tr table-border-top' style=\"width: 100px;border-top: transparent !important;\">("+contractDate+"-"+terminationDate+")</td>"
							}
							roomNextTrStr +="</tr>";
							roomThFirstTime = false;
						}
						tableStr = roomThStr + roomFirstTrStr + roomNextTrStr + "</tbody></table>";
						$('#tab04BestHotelTable').empty();
						$('#tab04BestHotelTable').append(tableStr);
					}
				}
			}	
			
			
			
			
			//$('#tab01').css('display','block');
			showSuggest();
			
			var contractDataList = data.mapperContractDataList;
			if (contractDataList.length > 0){
				var divContents = "";
				var firstTime=true;
				for(var j=0; j <contractDataList.length; j++){
					
					if (contractDataList[j].contractType == "A"){
						var roomThStr="";
						var roomFirstTrStr="";
						var roomNextTrStr="";
						var tableStr = "";
						var roomThFirstTime = true;
						var subDivContents = "";
						var terminationDate = contractDataList[j].terminationDate;
						var currencyCode = contractDataList[j].currencyCode;
						
						if (firstTime){
							subDivContents += "<div class=\"row\">";
							subDivContents += "	<div class=\"col-lg-12\">";
	  						subDivContents += "		<label for=\"hotelCode\" class=\"tab01-content-close\" onclick=\"closePreviousRates()\">X</label>";
	  						subDivContents += "	</div>";
							subDivContents += "</div>";
							
							subDivContents += "<div class=\"row\">";
	  						subDivContents += "	<div class=\"col-lg-12 page-number-col-top\">";
	  						subDivContents += "		<label for=\"hotelCode\" class=\"page-number\" id='tab02PageNumber'>2</label>";
	  						subDivContents += "	</div>";
							subDivContents += "</div>";
							
							subDivContents += "<div class=\"row tab03-row-1\">";
							subDivContents += "	<div class=\"col-lg-12\">";
							
							subDivContents += "	<table class=\"table\" style=\"margin-top: -15px;\">";
    						subDivContents += "	<tbody>";
      						subDivContents += "		<tr>";
        					subDivContents += "			<td class=\"suggested-rate-table-td\" width=\"10%\">&nbsp;</td>";
        					subDivContents += "			<td class=\"suggested-rate-table-td td-color td-font-3\" width=\"80%\" align=\"center\">Last Active Contracts for "+hotelCode+ " </td>";
        					subDivContents += "			<td class=\"suggested-rate-table-td\" width=\"10%\">&nbsp;</td>";
      						subDivContents += "		</tr>";
    						subDivContents += "	</tbody>";
  							subDivContents += "	</table>";
	  						subDivContents += "	</div>";
							subDivContents += "</div>";
							
							
  							firstTime = false;
						}
						
						
						subDivContents += "<div class=\"row pre-rates-row\" style=\"margin-top: 10px;\">";
  						subDivContents += "	<div class=\"col-lg-1 pre-rates-col-1\">";
  						subDivContents += "		<button type=\"button\" id='btn" + contractDataList[j].seasonCode + "' onclick=\"showTable('" + contractDataList[j].seasonCode + "')\" class='btn btn-submit btn-contracts'>+</button>";
  						subDivContents += "	</div>";
  						subDivContents += "	<div class=\"col-lg-9 pre-rates-col-9\">";
  						subDivContents += "		<lable class=\"pre-contracts-header-text\">Contracts For Season Code: " + contractDataList[j].seasonCode +"(in "+currencyCode+")</lable>";
  						subDivContents += "	</div>";
  						
  						
  						subDivContents += "</div>";
						subDivContents += "<div class=\"row pre-rates-row\" style=\"display: none;\" id='div" + contractDataList[j].seasonCode + "'>";
  						subDivContents += "<div class=\"col-lg-12\">";
						var contractDatesList = contractDataList[j].mapperContractDatesList;
						for(var m=0; m <contractDatesList.length; m++){
							var contractDate = contractDatesList[m].contractDate;
							
							var contractNextDate = "";
							if (contractDatesList[m+1] === undefined){
								contractNextDate = terminationDate;
							}else{
								contractNextDate = contractDatesList[m+1].contractDate;
								if (contractNextDate != null){
									contractNextDate = getPreviousDate(contractNextDate);
								}else{
									contractNextDate = terminationDate;
								}
							}
							
							var mapperRoomsList = contractDatesList[m].mapperRoomsList;
							if (roomThFirstTime){
								roomThStr += "<table class=\"table table-bordered suggested-table\">";	
								roomThStr += "<thead>";
								roomThStr += "<tr>";
								roomThStr += "<th class=\"rates-row-th table-border-top\">Dates</th>";
								//roomFirstTrStr +="<tbody><tr><td class='td-dates-first rates-row-first-tr'>"+contractDataList[j].seasonCode+"("+contractDate+"-"+terminationDate+")</td>";
								roomFirstTrStr +="<tbody><tr><td class='td-dates-first rates-row-first-tr table-border-top' style=\"width: 100px;border-bottom: transparent !important;\">"+contractDataList[j].seasonCode+"</td>"
							}
							var contractDateArr=contractDate.split(" ");
							var contractDateStr=contractDateArr[0] + contractDateArr[1];
							var contractNextDateArr=contractNextDate.split(" ");
							var contractNextDateStr=contractNextDateArr[0] + contractNextDateArr[1];
							roomNextTrStr +="<tr>";
							roomNextTrStr +="<td class='td-dates rates-row-second-tr table-border-top'>" +contractDateStr+ "-" + contractNextDateStr + "</td>";
							for(var n=0; n <mapperRoomsList.length; n++){
								if (roomThFirstTime){
									roomThStr += "<th class=\"rates-row-th table-border-top\" colspan='2'>" + mapperRoomsList[n].roomCode + "</th>";
									roomFirstTrStr +="<td class=\"td-dates-first rates-row-first-tr table-border-top\" rowspan=\"2\" style=\"border-right: transparent !important;\">Adult</td><td class=\"td-dates-first rates-row-first-tr table-border-top\" rowspan=\"2\" style=\"border-left: transparent !important;\">Child</td>";
								}
								var adRate = mapperRoomsList[n].adultRate;
								var adRateStr ="--"
								if (adRate !=null && adRate != ""){
									var adRateAr = adRate.split(".");
									adRateStr = adRateAr[0];
								}
								var chRate = mapperRoomsList[n].childRate;
								var chRateStr ="--"
								if (chRate !=null && chRate != ""){
									var chRateAr = chRate.split(".");
									chRateStr = chRateAr[0];
								}
								roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-right: transparent !important;\">" +adRateStr+ "</td>";
								roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-left: transparent !important;\">" +chRateStr+ "</td>";
							}
							if (roomThFirstTime){
								roomThStr += "</tr></thead>";
								roomFirstTrStr +="</tr>";
								roomFirstTrStr +="<tr><td class='td-dates-first rates-row-first-tr table-border-top' style=\"width: 100px;border-top: transparent !important;\">("+contractDate+"-"+terminationDate+")</td>"
							}
							roomNextTrStr +="</tr>";
							roomThFirstTime = false;
						}
						tableStr = roomThStr + roomFirstTrStr + roomNextTrStr + "</tbody></table>";
						subDivContents += tableStr;
						subDivContents += "</div>";
						subDivContents += "</div>";
						divContents += subDivContents;
							
					}
				}
				$('#tab02').empty();
				$('#tab02').append(divContents);
				
				
			}else{
				$('#tab02').empty();
			}
            
            $('#wait').hide();
        },
        error: function (data, status, er) {
        	$('#wait').hide();
            console.log(data);
            console.log(status);
            console.log(er);
        }
    });
	
}

function concertToLowar(sendStr){
	var rtnStr = "";
	var sendStrArr = sendStr.split(" ");
	for(var p=0; p <sendStrArr.length; p++){
		rtnStr += sendStrArr[p].substring(0, 1) + sendStrArr[p].substring(1, sendStrArr[p].lenght).toLowerCase() + " ";
	}
	return  rtnStr;
}


function showHideRates(notes){
	if($("#tab01_best_hotel").is(":visible")){
		$('#tab01_best_hotel').css('display','none');
		$('#btnShowHideRates').empty();
		var ntnStr = "<button class=\"btn btn-info\" style='font-size:12px;margin-top: 10px;height:27px;padding-top: 3px;' onclick=\"showHideRates('"+notes+"')\">Show "+notes+"</button>";
		$('#btnShowHideRates').append(ntnStr);
		
	}else{
		$('#tab01_best_hotel').css('display','block');
		$('#btnShowHideRates').empty();
		var ntnStr = "<button class=\"btn btn-info\" style='font-size:12px;margin-top: 10px;height:27px;padding-top: 3px;' onclick=\"showHideRates('"+notes+"')\">Hide "+notes+"</button>";
		$('#btnShowHideRates').append(ntnStr);
	}
	
}

function getHotels() {
	var selectedSeason = $('input[type=radio][name=optradio]:checked').attr('id');
	var resort = $('#resort').val();
	var resortName = $( "#resort option:selected" ).text();
	var requestType = "R";
	if (resort == null || resort == ""){
		alert("Please select a resort");
		$('#resort').focus();
		return true;
	}
	if (selectedSeason == null || selectedSeason == ""){
		alert("Please select a season");
		return true;
	}
	var selectedSeasonArr = selectedSeason.split("]");
	var oldSeasonCode = selectedSeasonArr[1];
	var newSeasonCode = selectedSeasonArr[2];
	$('#hotelDiv').empty();
	
	$.ajax({
        url: "/pickservice/hotel/gethotel",
        type: 'POST',
        data: {
        	newSeasonCode: newSeasonCode,
        	oldSeasonCode: oldSeasonCode,
        	requestType: requestType,
        	resortCode: resort 
        },
        dataType: "json",
        beforeSend: function () {
            $('#wait').show();
        },
        success: function (data) {
            console.log(data);
            var hotelStr = "";
            if (data != null){
				var hotelList = data.mapperHotelList;
				if (hotelList.length > 0){
					var foundHotel = false;
					hotelStr += "	<div class=\"col-lg-5 tab03-resort-col-5\">";
					hotelStr += "	   	<label for=\"hotelCode\" class=\"auth-contents-lable\">Select a Hotel</label>";
					hotelStr += "	   	<select class=\"form-control\" id=\"selectedHotelCode\" style=\"height: 30px;font-size: 12px;\">";
					for(var j=0; j <hotelList.length; j++){
						foundHotel = true;
						var optValue="";
						var mainHotelCode = hotelList[j].mainHotelCode;
						optValue += mainHotelCode + "]";
						var subHotelList = hotelList[j].mapperSubHotelsList;
						if (subHotelList.length > 0){
							for(var m=0; m <subHotelList.length; m++){
								if (subHotelList[m].subHotelCode == mainHotelCode){
									optValue += subHotelList[m].activeContractIdentifier;
									break;
								}
							}	
						}	
						var selectedHotelName = hotelList[j].mainHotelName;
						var newHotelName = "";
						var selectedHotelNameArr = selectedHotelName.split(" ");
						for(var p=0; p <selectedHotelNameArr.length; p++){
							newHotelName += selectedHotelNameArr[p].substring(0, 1) + selectedHotelNameArr[p].substring(1, selectedHotelNameArr[p].lenght).toLowerCase() + " ";
						}
						newHotelName = newHotelName + "(" + mainHotelCode + ")";
						hotelStr += "	   		<option value="+ optValue +">"+ newHotelName +"</option>";
					}
					if (foundHotel){
						hotelStr += "	   	</select>";
  						hotelStr += "    </div>";
  						hotelStr += "    <div class=\"col-lg-4 tab03-resort-col-4\">";
  						hotelStr += "    	<label for=\"exampleInputEmail1\" class=\"auth-contents-lable\">&nbsp;</label>";
  						hotelStr += "    	<button type=\"button\" class=\"btn btn-submit auth-btn\" onclick=\"suggestRatesFromResort()\" style=\"margin-top: 23px;\">Suggest Rates</button>";
  						hotelStr += "    </div>";
  						$('#hotelDiv').append(hotelStr);
					}else{
						$('#hotelDiv').append("<h2 class='h2-no-contract-text'> No Hotels Available for the Resort in the Season selected.</h2>");
					}
				}else{
					$('#hotelDiv').append("<h2 class='h2-no-contract-text'> No Hotels Available for the Resort in the Season selected.</h2>");
				}				
			}else{
				$('#hotelDiv').append("<h2 class='h2-no-contract-text'> No Hotels Available for the Resort in the Season selected.</h2>");
			}
            $('#wait').hide();
        },
        error: function (data, status, er) {
        	$('#wait').hide();
        	$('#hotelDiv').append("<h2 class='h2-no-contract-text'> No Hotels Available for the Resort in the Season selected.</h2>");
            console.log(data);
            console.log(status);
            console.log(er);
        }
    });
	
}

function suggestRatesFromResort(){
	var selectedSeason = $('input[type=radio][name=optradio]:checked').attr('id');
	var hotelCodeStr = $('#selectedHotelCode').val();
	var hotelCodeArr = hotelCodeStr.split("]");
	var hotelCode = hotelCodeArr[0];
	var copyFromActiveContract = hotelCodeArr[1];
	var hotelName = $( "#selectedHotelCode option:selected" ).text();
	hotelName = hotelName.substring(0, (hotelName.length - 6));
	
	var selectedSeasonArr = selectedSeason.split("]");
	var oldSeasonCode = selectedSeasonArr[1];
	var newSeasonCode = selectedSeasonArr[2];
	var copyToDates = selectedSeasonArr[5];
	
	var updatedContract = false;
	suggestRates(hotelCode,oldSeasonCode,newSeasonCode,updatedContract,hotelName,copyToDates,copyFromActiveContract);
}


function suggestRates(hotelCode,oldSeasonCode,newSeasonCode,updatedContract,hotelName,copyToDates,copyFromActiveContract){
	
	
	$.ajax({
        url: "/pickservice/hotel/dets",
        type: 'POST',
        data: {
        	newSeasonCode: newSeasonCode,
        	oldSeasonCode: oldSeasonCode,
        	mainHotelCode: hotelCode
        },
        dataType: "json",
        beforeSend: function () {
            $('#wait').show();
        },
        success: function (data) {
            console.log(data);
            if (data != null){
				var contractDataList = data.mapperContractDataList;
				
				if (contractDataList.length > 0){
					paginate("suggestedRatesPageNumber");
					$('#suggestedRates').css('display','block');
					$('#suggestedRates').focus();
					var roomThStr="";
					var roomFirstTrStr="";
					var roomNextTrStr="";
					var tableStr = "";
					var roomThFirstTime = true;
					for(var j=0; j <contractDataList.length; j++){
						if (contractDataList[j].contractType == "A"){
							var currencyCode = contractDataList[j].currencyCode;
							var mainHotelCode = hotelCode;
							var mainHotelName = hotelName;
							var terminationDate = contractDataList[j].terminationDate;
							
	
							$('#suggestedContractHeader1').empty();
							$('#suggestedContractHeader1').append("Contract Rates(" + currencyCode + ")");
							$('#suggestedContractHeader2').empty();
							var rtnStr = concertToLowar(mainHotelName);
							$('#suggestedContractHeader2').append("Hotel " + mainHotelCode + ":" + rtnStr);
							
							
							var contractDatesList = contractDataList[j].mapperContractDatesList;
							for(var m=0; m <contractDatesList.length; m++){
								var contractDate = contractDatesList[m].contractDate;
								var contractNextDate = "";
								if (contractDatesList[m+1] === undefined){
									contractNextDate = terminationDate;
								}else{
									contractNextDate = contractDatesList[m+1].contractDate;
									if (contractNextDate != null){
										//31 MAR 22
										contractNextDate = getPreviousDate(contractNextDate);
									}else{
										contractNextDate = terminationDate;
									}
								}
								var mapperRoomsList = contractDatesList[m].mapperRoomsList;
								if (roomThFirstTime){
									roomThStr += "<table class=\"table table-bordered suggested-table\">";	
									roomThStr += "<thead>";
									roomThStr += "<tr>";
									roomThStr += "<th class=\"rates-row-th table-border-top\">Dates</th>";
									
									roomFirstTrStr +="<tbody><tr><td class='td-dates-first rates-row-first-tr table-border-top' style=\"width: 100px;border-bottom: transparent !important;\">"+newSeasonCode+"</td>"
								}
								var contractDateArr=contractDate.split(" ");
								var contractDateStr=contractDateArr[0] + contractDateArr[1];
								var contractNextDateArr=contractNextDate.split(" ");
								var contractNextDateStr=contractNextDateArr[0] + contractNextDateArr[1];
								
								roomNextTrStr +="<tr>";
								roomNextTrStr +="<td class='td-dates rates-row-second-tr table-border-top'>" +contractDateStr+ "-" + contractNextDateStr + "</td>";
								for(var n=0; n <mapperRoomsList.length; n++){
									if (roomThFirstTime){
										roomThStr += "<th class=\"rates-row-th table-border-top\" title='" + mapperRoomsList[n].roomDescription + "' colspan='2'>" + mapperRoomsList[n].roomCode + "</th>";
										roomFirstTrStr +="<td class=\"td-dates-first rates-row-first-tr table-border-top\" rowspan=\"2\" style=\"border-right: transparent !important;\">Adult</td><td class=\"td-dates-first rates-row-first-tr table-border-top\" rowspan=\"2\" style=\"border-left: transparent !important;\">Child</td>";
									}
									var adRate = mapperRoomsList[n].adultRate;
									var adRateStr ="--"
									if (adRate !=null && adRate != ""){
										var adRateAr = adRate.split(".");
										adRateStr = adRateAr[0];
									}
									var chRate = mapperRoomsList[n].childRate;
									var chRateStr ="--"
									if (chRate !=null && chRate != ""){
										var chRateAr = chRate.split(".");
										chRateStr = chRateAr[0];
									}
									roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-right: transparent !important;\">" +adRateStr+ "</td>";
									roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-left: transparent !important;\">" +chRateStr+ "</td>";
								}
								if (roomThFirstTime){
									roomThStr += "</tr></thead>";
									roomFirstTrStr +="</tr>";
									roomFirstTrStr +="<tr><td class='td-dates-first rates-row-first-tr table-border-top' style=\"width: 100px;border-top: transparent !important;\">("+copyToDates+")</td>"
								}
								roomNextTrStr +="</tr>";
								roomThFirstTime = false;
								
							}
							tableStr += roomThStr + roomFirstTrStr + roomNextTrStr + "</tbody></table>";
							$('#suggestedRatesTable').empty();
							$('#suggestedRatesTable').append(tableStr);
							
							var hraaRequestBtn = "";
							var hraaReverseBtn = "";
							//hotelCode,oldSeasonCode,newSeasonCode,updatedContract,hotelName,copyToDates,copyFromActiveContract
							hraaRequestBtn = "<button type=\"button\" class=\"btn btn-submit btn-contract\" onclick='hraaRequestFun(\""+newSeasonCode+"\",\""+oldSeasonCode+"\",\""+copyFromActiveContract+"\",\""+hotelCode+"\")'>Request HRAA Approval</button>";
							hraaReverseBtn = "<button type=\"button\" class=\"btn btn-submit btn-contract\" onclick='hraaReverseFun(\""+newSeasonCode+"\",\""+oldSeasonCode+"\",\""+hotelCode+"\")'>Reverse HRAA Request</button>";
							
							amendedBtn = "<button type=\"button\" class=\"btn btn-submit auth-btn\" style=\"margin-top: 0px;height: 26px !important;float: right;\" onclick='showAmendedRates(\""+newSeasonCode+"\",\""+oldSeasonCode+"\",\""+hotelCode+"\",\"" + mainHotelName + "\")'>Show Rates</button>";
							
							var amendedMsg = "<p style=\"font-family: 'Arial Bold','Arial',sans-serif;font-weight: 700;font-style: normal;font-size: 13px;color: #f59a23;text-decoration: underline;\">Updarte the Previous Rates By:</p>";
							$('#amendedRateMessage').empty();
							$('#amendedRateMessage').append(amendedMsg);
							
							var amendedTable = "";
							amendedTable += "<table class=\"table table-bordered suggested-table\">";
    						amendedTable += "		<thead>";
      						amendedTable += "			<tr>";
        					amendedTable += "				<th class=\"table-th\"></th >";
        					amendedTable += "				<th class=\"table-th\">AD</th >";
        					amendedTable += "				<th class=\"table-th\">CH</th >";
     	 					amendedTable += "			</tr>";
    						amendedTable += "		</thead>";
    						amendedTable += "		<tbody>";
      						amendedTable += "			<tr>";
        					amendedTable += "				<td class=\"table-th\">Value("+ currencyCode +")</td>";
        					amendedTable += "				<td class=\"table-tr\"><input type=\"text\" id=\"rateAdValue\" class=\"form-control auth-contents-textbox\" maxlength=\"4\" style=\"width: 35px;\"></td >";
        					amendedTable += "				<td class=\"table-tr\"><input type=\"text\" id=\"rateChValue\" class=\"form-control auth-contents-textbox\" maxlength=\"4\" style=\"width: 35px;\"></td >";
      						amendedTable += "			</tr>";
      						amendedTable += "			<tr>";
        					amendedTable += "				<td colSpan=\"3\" align=\"center\" class=\"table-th\">OR</td>";
      						amendedTable += "			</tr>";		
      						amendedTable += "			<tr>";
        					amendedTable += "				<td class=\"table-th\">%</td>";
        					amendedTable += "				<td class=\"table-tr\"><input type=\"text\" id=\"rateAdPercentage\" class=\"form-control auth-contents-textbox\" maxlength=\"4\" style=\"width: 35px;\"></td >";
        					amendedTable += "				<td class=\"table-tr\"><input type=\"text\" id=\"rateChPercentage\" class=\"form-control auth-contents-textbox\" maxlength=\"4\" style=\"width: 35px;\"></td >";
      						amendedTable += "			</tr>";
      						amendedTable += "			<tr>";
        					amendedTable += "				<td colSpan=\"3\" align=\"right\" class=\"table-th\">" + amendedBtn + "</td>";
      						amendedTable += "			</tr>";	
    						amendedTable += "		</tbody>";
    						amendedTable += "	</table>"; 
							$('#amendedRateTable').empty();
							$('#amendedRateTable').append(amendedTable);
							
							$('#amendedRatedBtn').empty();
							$('#amendedRatedBtn').append(amendedBtn);
							
							$('#hraaRequest').empty();
							$('#hraaRequest').append(hraaRequestBtn + "&nbsp;&nbsp;" + hraaReverseBtn);
							
							$('#rateAdValue').val("");
							$('#rateChValue').val("");
							$('#rateAdPercentage').val("");
							$('#rateChPercentage').val("");
							
							
							
						}
					}
				}else{
					$('#hraaRequest').empty();
					$('#hraaReverse').empty();
					$('#suggestedRates').css('display','none');
					alert("No contracts to display / Seasons not setup ");
					$('#wait').hide();
					return;
				}
				$('#otherRates').empty();
				var otherRatesStr = "";
				cancellationDataList = data.mapperCancellationDataList;
				if (cancellationDataList.length > 0){
					var type="PCX";
					otherRatesStr += "<div class=\"row\" id=\"suggestedRatesCancellation\">";
		  			otherRatesStr += "	<div class=\"col-lg-12\">";
		  			//otherRatesStr += "		<button type=\"button\" class=\"btn btn-primary other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Cancellation Charges</button>";
		  			otherRatesStr += "		<span class=\"other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Cancellation Charges</span>";
		  			
		  			//otherRatesStr += "		<p class=\"other-contract-names\" data-toggle=\"modal\" data-target=\"#otherRatesModal\">Cancellation Charges</p>";
		  			otherRatesStr += "	</div>";
		  			otherRatesStr += "</div>";	
				}	
				earlyBirdDataList = data.mapperEarlyBirdDataList;
				if (earlyBirdDataList.length > 0){
					var type="EBD";
					otherRatesStr += "<div class=\"row\" id=\"suggestedRatesCancellation\">";
		  			otherRatesStr += "	<div class=\"col-lg-12\">";
		  			//otherRatesStr += "		<button type=\"button\" class=\"btn btn-primary other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Early Birds</button>";
		  			otherRatesStr += "		<span class=\"other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Early Birds</span>";
		  			//otherRatesStr += "		<p class=\"other-contract-names\">Early Birds</p>";
		  			otherRatesStr += "	</div>";
		  			otherRatesStr += "</div>";	
				}	
				freeNightDataList = data.mapperFreeNightDataList;
				if (freeNightDataList.length > 0){
					var type="HFR";
					otherRatesStr += "<div class=\"row\" id=\"suggestedRatesCancellation\">";
		  			otherRatesStr += "	<div class=\"col-lg-12\">";
		  			//otherRatesStr += "		<p class=\"other-contract-names\">Free Nights</p>";
		  			//otherRatesStr += "		<button type=\"button\" class=\"btn btn-primary other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Free Nights</button>";
		  			otherRatesStr += "		<span class=\"other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Free Nights</span>";
		  			otherRatesStr += "	</div>";
		  			otherRatesStr += "</div>";	
				}	
				minimumDurationDataList = data.mapperMinimumDurationDataList;
				if (minimumDurationDataList.length > 0){
					
					var type="HMN";
					otherRatesStr += "<div class=\"row\" id=\"suggestedRatesCancellation\">";
		  			otherRatesStr += "	<div class=\"col-lg-12\">";
		  			//otherRatesStr += "		<p class=\"other-contract-names\">Minimum Duration</p>";
		  			//otherRatesStr += "		<button type=\"button\" class=\"btn btn-primary other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Minimum Duration</button>";
		  			otherRatesStr += "		<span class=\"other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Minimum Duration</span>";
		  			otherRatesStr += "	</div>";
		  			otherRatesStr += "</div>";	
				}	
				$('#otherRates').append(otherRatesStr);
				
			}
            $('#wait').hide();
            if($("#suggestedRates").is(":visible")){
				//$("#suggestedRates").attr("tabindex",-1).focus();
				$('html, body').animate({ scrollTop: $('#suggestedRates').offset().top }, 'slow');
				//$('#suggestedRates').focus();
				zindex ++;
				$("#suggestedRates").css('z-index', zindex);
			}
            
        },
        error: function (data, status, er) {
        	$('#wait').hide();
            console.log(data);
            console.log(status);
            console.log(er);
        }
    });
}
/**
* Find Previous date
*/
function getPreviousDate(dateStr) {
	var dateParts = dateStr.split(" ");
	var day = dateParts[0];
	var month = getMonthNo(dateParts[1]);
	var year = "20" + dateParts[2];
	if (day.length < 2) {
		day = '0' + day;	
	}
	var dateDate = new Date(year, month, day); 
	dateDate.setDate(dateDate.getDate() - 1);

	var day1 = dateDate.getDate();
	var dayNew = "";
	if (day1.toString().length < 2) {
		dayNew = '0' + day1;	
	}else{
		dayNew = day1.toString();
	}
	var month1 = getMonthStr(dateDate.getMonth());
	var year1 = dateDate.getFullYear().toString();
 	var newDate = dayNew + " " + month1 + " " + year1.substring(2, 4);
	return newDate;
}
/* get months string */
function getMonthStr(monthNo) {
	var monthArr = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
	for(var j=0; j <12; j++){
		if (monthNo == j){
			return monthArr[j];
		}
	}	

}
/* get months number */
function getMonthNo(monthStr) {
	var monthArr = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
	var monthNoArr = ["00","01","02","03","04","05","06","07","08","09","10","11"];
	for(var j=0; j <monthArr.length; j++){
		if (monthStr == monthArr[j]){
			return monthNoArr[j];
		}
	}
}

/* Show previous contract details */
function showTable(id){
	var btnText = $('#btn' + id).text();
	if (btnText == "+"){
		$('#btn' + id).text("-");
		$('#div' + id).css('display','block');
	}else{
		$('#btn' + id).text("+");
		$('#div' + id).css('display','none');
	}
	
}
function tabMoveToFront(divId) {
	zindex ++;
	$("#" + divId).css('z-index', zindex);
}

function showSuggest(){
	$("#btnTab01").addClass("btn-active-status");
	$("#btnTab02").removeClass("btn-active-status");
	$("#btnTab03").removeClass("btn-active-status");
	$("#btnTab04").removeClass("btn-active-status");
	$('#tab01').css('display','block');
	posTopTab01Original = $("#tab01").offset().top;
}
function showPrevious(){
	if (gNoContracts){
		$('#tab01').css('display','none');
	}
	
	paginate("tab02PageNumber");
	
	$("#btnTab02").addClass("btn-active-status");
	$("#btnTab01").removeClass("btn-active-status");
	$("#btnTab03").removeClass("btn-active-status");
	$("#btnTab04").removeClass("btn-active-status");
	
	$('#tab02').css('display','block');
	zindex ++;
	$('#tab02').css('z-index', zindex);
	$('html, body').animate({ scrollTop: $('#tab02').offset().top }, 'slow');
	
	var posTopTab01 = $("#tab01").offset().top;
	var posLeftTab01 = $("#tab01").position().left;
	var widthTab01 = $("#tab01").width();
	
	var divTopPos = 0;
	if($("#tab03").is(":visible") && $("#tab04").is(":visible")){
		divTopPos = (posTopTab01 + 180);
	}else{
		if($("#tab03").is(":visible") || $("#tab04").is(":visible")){
			divTopPos = (posTopTab01 + 120);
		}else{
			divTopPos = (posTopTab01 + 60);
		}	
	}	
	
	$('#tab02').css('width',widthTab01 + "px");
	$('#tab02').css('top',divTopPos + "px");
	$('#tab02').css('left',posLeftTab01 + "px");
	
	posTopTab02Original = $("#tab02").offset().top;

}

function showOtherHotels(){
	if (gNoContracts){
		$('#tab01').css('display','none');
	}
	paginate("tab03PageNumber");
	
	$("#btnTab03").addClass("btn-active-status");
	$("#btnTab01").removeClass("btn-active-status");
	$("#btnTab02").removeClass("btn-active-status");
	$("#btnTab04").removeClass("btn-active-status");
		
	$('#tab03').css('display','block');
	zindex ++;
	$('#tab03').css('z-index', zindex);
	$('html, body').animate({ scrollTop: $('#tab03').offset().top }, 'slow');
	
	var posTopTab01 = $("#tab01").offset().top;
	var posLeftTab01 = $("#tab01").position().left;
	var widthTab01 = $("#tab01").width();
	
	var divTopPos = 0;
	if($("#tab02").is(":visible") && $("#tab04").is(":visible")){
		divTopPos = (posTopTab01 + 180);
	}else{
		if($("#tab02").is(":visible") || $("#tab04").is(":visible")){
			divTopPos = (posTopTab01 + 120);
		}else{
			divTopPos = (posTopTab01 + 60);
		}	
	}	
	
	$('#tab03').css('width',widthTab01 + "px");
	$('#tab03').css('top',divTopPos + "px");
	$('#tab03').css('left',posLeftTab01 + "px");
	
	posTopTab03Original = $("#tab03").offset().top;	
	
}
function showTemplates() {
	if (gNoContracts){
		$('#tab01').css('display','none');
	}
	paginate("tab04PageNumber");
	
	$("#btnTab04").addClass("btn-active-status");
	$("#btnTab01").removeClass("btn-active-status");
	$("#btnTab02").removeClass("btn-active-status");
	$("#btnTab03").removeClass("btn-active-status");
		
	$('#tab04').css('display','block');
	zindex ++;
	$('#tab04').css('z-index', zindex);
	$('html, body').animate({ scrollTop: $('#tab04').offset().top }, 'slow');
	
	var posTopTab01 = $("#tab01").offset().top;
	var posLeftTab01 = $("#tab01").position().left;
	var widthTab01 = $("#tab01").width();
	
	var divTopPos = 0;
	if($("#tab02").is(":visible") && $("#tab03").is(":visible")){
		divTopPos = (posTopTab01 + 180);
	}else{
		if($("#tab02").is(":visible") || $("#tab03").is(":visible")){
			divTopPos = (posTopTab01 + 120);
		}else{
			divTopPos = (posTopTab01 + 60);
		}	
	}	
	
	$('#tab04').css('width',widthTab01 + "px");
	$('#tab04').css('top',divTopPos + "px");
	$('#tab04').css('left',posLeftTab01 + "px");

	posTopTab04Original = $("#tab04").offset().top;	

}

function paginate(divId){
	if($("#"+divId).is(":visible")){
	}else{
		pageNumber ++;
		$('#' + divId).empty();
		$('#' + divId).append(pageNumber + "");
	}	
	
}



function enabledDisabledElements(no) {
	if (no == 1){
		$('.element-style').attr('disabled','disabled'); 
	}else{
		$('.element-style').removeAttr('disabled');
	}
	
}

function resetHotel(){
	enabledDisabledElements(2);
	$('#hotelCode').val("");
	$('#password').val("");
	$('#forYear').val("");
	$('#hotelCode').focus();
	$('#validHotelName').empty();
	//$('#tab01').empty();
	$('#tab02').empty();
	$('.validate-hotel').css('display','none');
	$('#suggestedRates').css('display','none');
	
	$('#amendedRates').css('display','none');
	
	$('#otherRatesModal').css('display','none');
	
	$('#tab01').css('display','none');
	$('#tab02').css('display','none');
	$('#tab03').css('display','none');
	
	location.reload();
}

function activeDiv() {
	$("#suggestedRates").addClass("zindex_reduce");
}

function closeSuggestedRates(){
	$('#suggestedRates').css('display','none');
}

function closeAmendedRates(){
	$('#amendedRates').css('display','none');
}


/**
* display other rates like canx in the rates display section
*/
function displayOtherRates(type) {
	if (type == "PCX"){
		$('#otherContractHeader').empty();
		$('#otherContractHeader').append("Cancellation Charges");
		$('#otherRatesTable').empty();
		if (cancellationDataList.length>0){
			var tableStr = "";
			tableStr += "<table class='table table-bordered suggested-table'>";
			tableStr += "<thead>";
			tableStr += "<tr>";
   			tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>Policy Type</th>";
        	tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>Policy Description</th>";
        	tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>From Arr. Date</th>";
        	tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>To Arr. Date</th>";
        	tableStr += "<th class='rates-row-th table-border-top' colspan='4'>Cancellation Basis</th>";
        	tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>Narrative</th>";
        	tableStr += "</tr>";
        	tableStr += "<tr>";
        	tableStr += "<th class='rates-row-th table-border-top'>Nigths</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>Perc. %</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>Graduated Policy</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>Whole Booking</th>";
        	tableStr += "</tr>";
        	tableStr += "</thead>";
    		tableStr += "<tbody>";
    		for(var j=0; j <cancellationDataList.length; j++){
        			tableStr += "<tr>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + cancellationDataList[j].policyTypeCode + "</td>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + cancellationDataList[j].policyTypeDesc + "</td>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + cancellationDataList[j].fromArrivalDates + "</td>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + cancellationDataList[j].toArrivalDates + "</td>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + cancellationDataList[j].noOfNights + "</td>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + cancellationDataList[j].percentageCharge + "</td>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'></td>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + cancellationDataList[j].wholeBkgIndicator + "</td>";
        			var narrative = "";
        			for(var m=0; m <cancellationDataList[j].mapperCancellationDatesList.length; m++){
						if (cancellationDataList[j].mapperCancellationDatesList[m].canxPolicyDesc != null){
							narrative += cancellationDataList[j].mapperCancellationDatesList[m].canxPolicyDesc + ", ";	
						}
					}
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>"+narrative+"</td>";
      				tableStr += "</tr>";
      		}		
    		tableStr += "</tbody>";
  			tableStr += "</table>";
			$('#otherRatesTable').append(tableStr);	
		}
	}
	if (type == "EBD"){
		$('#otherContractHeader').empty();
		$('#otherContractHeader').append("Early Bird");
		$('#otherRatesTable').empty();
		if (earlyBirdDataList.length>0){
			var tableStr = "";
			tableStr += "<table class='table table-bordered suggested-table'>";
			tableStr += "<thead>";
			tableStr += "<tr>";
   			tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>Occupancy</th>";
        	tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>Early Bird Type</th>";
        	tableStr += "<th class='rates-row-th table-border-top' colspan='2'>Booking Dates</th>";
        	tableStr += "<th class='rates-row-th table-border-top' colspan='2'>Arrival Dates</th>";
        	tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>Days in Advance/Discount %</th>";
        	tableStr += "</tr>";
        	tableStr += "<tr>";
        	tableStr += "<th class='rates-row-th table-border-top'>From</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>To</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>From</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>To</th>";
        	tableStr += "</tr>";
        	tableStr += "</thead>";
    		tableStr += "<tbody>";
    		for(var j=0; j <earlyBirdDataList.length; j++){
        			tableStr += "<tr>";
        			var roomType = "";
        			if (earlyBirdDataList[j].accommodationOccup == ""){
						roomType = "All";
					}else{
						roomType = earlyBirdDataList[j].accommodationOccup;
					}
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + roomType + "</td>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + earlyBirdDataList[j].earlyBirdCodeType + "</td>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + earlyBirdDataList[j].fromBookingDate + "</td>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + earlyBirdDataList[j].toBookingDate + "</td>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + earlyBirdDataList[j].fromArrivalDate + "</td>";
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + earlyBirdDataList[j].toArrivalDate + "</td>";
        			var narrative = "";
        			for(var m=0; m <earlyBirdDataList[j].mapperEarlyBirdHotelsList.length; m++){
						if (earlyBirdDataList[j].mapperEarlyBirdHotelsList[m].discountPercentage != null){
							narrative += earlyBirdDataList[j].mapperEarlyBirdHotelsList[m].discountPercentage + ", ";	
						}
					}
        			tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>"+narrative+"</td>";
      				tableStr += "</tr>";
      		}		
    		tableStr += "</tbody>";
  			tableStr += "</table>";
			$('#otherRatesTable').append(tableStr);	
		}	
		
		
	}
	if (type == "HFR"){
		$('#otherContractHeader').empty();
		$('#otherContractHeader').append("Free Nights");
		$('#otherRatesTable').empty();
		if (freeNightDataList.length>0){
			var tableStr = "";
			tableStr += "<table class='table table-bordered suggested-table'>";
			tableStr += "<thead>";
			tableStr += "<tr>";
   			tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>Occupancy</th>";
        	tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>From Date</th>";
        	tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>To Date</th>";
        	tableStr += "<th class='rates-row-th table-border-top' colspan='2'>Duration</th>";
        	tableStr += "<th class='rates-row-th table-border-top' colspan='2'>No of Free Nights</th>";
        	tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>Type</th>";
        	tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>Calculation</th>";
        	tableStr += "</tr>";
        	tableStr += "<tr>";
        	tableStr += "<th class='rates-row-th table-border-top'>AD</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>CH</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>AD</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>CH</th>";
        	tableStr += "</tr>";
        	tableStr += "</thead>";
    		tableStr += "<tbody>";
    		for(var j=0; j <freeNightDataList.length; j++){
        			
        			var roomType = "";
        			if (freeNightDataList[j].roomOccupancy == ""){
						roomType = "All";
					}else{
						roomType = freeNightDataList[j].roomOccupancy;
					}
					for(var m=0; m <freeNightDataList[j].mapperFreeNightDatesList.length; m++){
						tableStr += "<tr>";
						tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + roomType + "</td>";
        				tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + freeNightDataList[j].fromDate + "</td>";
        				tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + freeNightDataList[j].toDate + "</td>";
        				tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + freeNightDataList[j].mapperFreeNightDatesList[m].noOfNightsAdult + "</td>";
        				tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + freeNightDataList[j].mapperFreeNightDatesList[m].noOfNightsChild + "</td>";
        				tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + freeNightDataList[j].mapperFreeNightDatesList[m].noOfFreeNights + "</td>";
        				tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + freeNightDataList[j].mapperFreeNightDatesList[m].noOfFreeNightsChild + "</td>";
        				if (freeNightDataList[j].mapperFreeNightDatesList[m].freeNightType != null){
							tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + freeNightDataList[j].mapperFreeNightDatesList[m].freeNightType + "</td>";
						}else{
							tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + "" + "</td>";
						}
						if (freeNightDataList[j].mapperFreeNightDatesList[m].freeNightCalc != null){
							tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + freeNightDataList[j].mapperFreeNightDatesList[m].freeNightCalc + "</td>";
						}else{
							tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + "" + "</td>";
						}
						tableStr += "</tr>";
					}	
      				
      		}		
    		tableStr += "</tbody>";
  			tableStr += "</table>";
			$('#otherRatesTable').append(tableStr);	
		}	
		
	}	
	if (type == "HMN"){
		$('#otherContractHeader').empty();
		$('#otherContractHeader').append("Minimum Duaration");
		$('#otherRatesTable').empty();
		if (minimumDurationDataList.length>0){
			var tableStr = "";
			tableStr += "<table class='table table-bordered suggested-table'>";
			tableStr += "<thead>";
			tableStr += "<tr>";
   			tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>Accom Code</th>";
        	tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>From Date</th>";
        	tableStr += "<th class='rates-row-th table-border-top' rowspan='2'>To Date</th>";
        	tableStr += "<th class='rates-row-th table-border-top' colspan='7'>Minimum Durations</th>";
        	tableStr += "</tr>";
        	tableStr += "<tr>";
        	tableStr += "<th class='rates-row-th table-border-top'>Mon</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>Tue</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>Wed</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>Thu</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>Fri</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>Sat</th>";
        	tableStr += "<th class='rates-row-th table-border-top'>Tun</th>";
        	tableStr += "</tr>";
        	tableStr += "</thead>";
    		tableStr += "<tbody>";
    		for(var j=0; j <minimumDurationDataList.length; j++){
        			
        			var roomType = "";
        			if (minimumDurationDataList[j].roomOccupancy == ""){
						roomType = "All";
					}else{
						roomType = minimumDurationDataList[j].roomOccupancy;
					}
					for(var m=0; m <minimumDurationDataList[j].mapperMinimumDurationHotelsList.length; m++){
						tableStr += "<tr>";
						tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + roomType + "</td>";
        				tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].fromDate + "</td>";
        				tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].toDate + "</td>";
        				
        				if (minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForMon != null){
        					tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForMon + "</td>";
        				}else{
							tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + "" + "</td>";
        				}
        				if (minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForTue != null){
        					tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForTue + "</td>";
        				}else{
							tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + "" + "</td>";
        				}	
        				if (minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForWed != null){
        					tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForWed + "</td>";
        				}else{
							tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + "" + "</td>";
        				}		
        				if (minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForThu != null){
        					tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForThu + "</td>";
        				}else{
							tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + "" + "</td>"; 
        				}		
        				if (minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForFri != null){
        					tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForFri + "</td>";
        				}else{
							tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + "" + "</td>";
        				}	
        				if (minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForSat != null){
        					tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForSat + "</td>";
        				}else{
							tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + "" + "</td>";
        				}		
        				if (minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForSun != null){
        					tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + minimumDurationDataList[j].mapperMinimumDurationHotelsList[m].minDurForSun + "</td>";
        				}else{
							tableStr += "<td class='td-dates rates-row-second-tr table-border-top'>" + "" + "</td>";
        				}			
						tableStr += "</tr>";
					}	
      				
      		}		
    		tableStr += "</tbody>";
  			tableStr += "</table>";
			$('#otherRatesTable').append(tableStr);	
		}	
		
	}	

	$('#otherRatesModal').css('margin-top',"-250px");
	$('#otherRatesModal').css('display','block');
	zindex ++;
	$('#otherRatesModal').css('z-index', zindex);
	
}
function closeOtherRates() {
	$('#otherRatesModal').css('display','none');
}
function closePreviousRates() {
	$('#tab02').css('display','none');
	$("#btnTab02").removeClass("btn-active-status");
}
function closeTab03() {
	$('#tab03').css('display','none');
	$("#btnTab03").removeClass("btn-active-status");
}
function closeTab01() {
	$('#tab01').css('display','none');
}
function closeTab04() {
	$('#tab04').css('display','none');
	$("#btnTab04").removeClass("btn-active-status");
}
/**
* Update previous Contract to New Season
*/
function hraaRequestFun(newSeasonCode,oldSeasonCode,copyFromActiveContract,hotelCode) {
	var rateAdValue = $('#rateAdValue').val();
	var rateChValue = $('#rateChValue').val();
	var rateAdPercentage = $('#rateAdPercentage').val();
	var rateChPercentage = $('#rateChPercentage').val();
	
	if (rateAdValue != "" && rateAdPercentage !=""){
		alert("You cannot enter both Value and Percentage");
		$('#rateValue').focus();
		return true;
	}

	$.ajax({
        url: "/pickservice/hotel/udpdets",
        type: 'POST',
        data: {
        	newSeasonCode: newSeasonCode,
        	oldSeasonCode: oldSeasonCode,
        	mainHotelCode: hotelCode,
        	contractIdentifierCode: copyFromActiveContract,
        	rateAdValue: rateAdValue,
        	rateChValue: rateChValue,
        	rateAdPercentage: rateAdPercentage,
        	rateChPercentage: rateChPercentage
        },
        dataType: "json",
        
        beforeSend: function () {
            $('#wait').show();
        },
        success: function (data) {
            console.log(data);
            if (data != null){
				alert("Updated Previous contract("+copyFromActiveContract+") from " + oldSeasonCode + " to " + newSeasonCode);
			} else{
				alert("Updated Error");
			}
			if (data != null){
				var contractDataList = data.udpMapperContractDataList;
				if (contractDataList.length > 0){
					var roomThStr="";
					var roomFirstTrStr="";
					var roomNextTrStr="";
					var tableStr = "";
					var roomThFirstTime = true;
					for(var j=0; j <contractDataList.length; j++){
						if (contractDataList[j].contractType == "A"){
							var currencyCode = contractDataList[j].currencyCode;
							var mainHotelCode = hotelCode;
							//var mainHotelName = hotelName;
							var terminationDate = contractDataList[j].terminationDate;
	
							
							var contractDatesList = contractDataList[j].udpMapperContractDatesList;
							for(var m=0; m <contractDatesList.length; m++){
								var contractDate = contractDatesList[m].contractDate;
								var contractNextDate = "";
								if (contractDatesList[m+1] === undefined){
									contractNextDate = terminationDate;
								}else{
									contractNextDate = contractDatesList[m+1].contractDate;
									if (contractNextDate != null){
										contractNextDate = getPreviousDate(contractNextDate);
									}else{
										contractNextDate = terminationDate;
									}
								}
								var mapperRoomsList = contractDatesList[m].udpMapperRoomsList;
								if (roomThFirstTime){
									roomThStr += "<table class=\"table table-bordered suggested-table\">";	
									roomThStr += "<thead>";
									roomThStr += "<tr>";
									roomThStr += "<th class=\"rates-row-th table-border-top\">Dates</th>";
									
									//roomFirstTrStr +="<tbody><tr><td class='td-dates-first rates-row-first-tr'>"+newSeasonCode+" ("+contractDate+"-"+terminationDate+")</td>"
									
									roomFirstTrStr +="<tbody><tr><td class='td-dates-first rates-row-first-tr table-border-top' style=\"width: 100px;border-bottom: transparent !important;\">"+newSeasonCode+"</td>"
								}
								var contractDateArr=contractDate.split(" ");
								var contractDateStr=contractDateArr[0] + contractDateArr[1];
								var contractNextDateArr=contractNextDate.split(" ");
								var contractNextDateStr=contractNextDateArr[0] + contractNextDateArr[1];
								roomNextTrStr +="<tr>";
								roomNextTrStr +="<td class='td-dates rates-row-second-tr table-border-top'>" +contractDateStr+ "-" + contractNextDateStr + "</td>";
								for(var n=0; n <mapperRoomsList.length; n++){
									if (roomThFirstTime){
										roomThStr += "<th class=\"rates-row-th table-border-top\" title='" + mapperRoomsList[n].roomDescription + "' colspan='2'>" + mapperRoomsList[n].roomCode + "</th>";
										roomFirstTrStr +="<td class=\"td-dates-first rates-row-first-tr table-border-top\" rowspan=\"2\" style=\"border-right: transparent !important;\">Adult</td><td class=\"td-dates-first rates-row-first-tr table-border-top\" rowspan=\"2\" style=\"border-left: transparent !important;\">Child</td>";
									}
									var adRate = mapperRoomsList[n].adultRate;
									var adRateStr ="--"
									if (adRate !=null && adRate != ""){
										var adRateAr = adRate.split(".");
										adRateStr = adRateAr[0];
									}
									var chRate = mapperRoomsList[n].childRate;
									var chRateStr ="--"
									if (chRate !=null && chRate != ""){
										var chRateAr = chRate.split(".");
										chRateStr = chRateAr[0];
									}
									/*roomNextTrStr +="<td class=\"rates-row-second-tr\" style=\"color: red !important;\">" +adRateStr+ "</td>";
									roomNextTrStr +="<td class=\"rates-row-second-tr\" style=\"color: red !important;\">" +chRateStr+ "</td>";*/
									roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-right: transparent !important;color: red !important;\">" +adRateStr+ "</td>";
									roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-left: transparent !important;color: red !important;\">" +chRateStr+ "</td>";
								}
								if (roomThFirstTime){
									roomThStr += "</tr></thead>";
									roomFirstTrStr +="</tr>";
									roomFirstTrStr +="<tr><td class='td-dates-first rates-row-first-tr table-border-top' style=\"width: 100px;border-top: transparent !important;\">("+contractDate+"-"+terminationDate+")</td>"
								}
								roomNextTrStr +="</tr>";
								roomThFirstTime = false;
								
							}
							tableStr += roomThStr + roomFirstTrStr + roomNextTrStr + "</tbody></table>";
							$('#suggestedRatesTable').empty();
							$('#suggestedRatesTable').append(tableStr);
							
							var hraaRequestBtn = "";
							var hraaReverseBtn = "";
							//hotelCode,oldSeasonCode,newSeasonCode,updatedContract,hotelName,copyToDates,copyFromActiveContract
							hraaRequestBtn = "";
							hraaReverseBtn = "<button type=\"button\" class=\"btn btn-submit btn-contract\" onclick='hraaReverseFun(\""+newSeasonCode+"\",\""+oldSeasonCode+"\",\""+hotelCode+"\")'>Reverse HRAA Request</button>";
							
							$('#amendedRateMessage').empty(); 
							$('#amendedRateTable').empty();
							
							$('#amendedRatedBtn').empty();
							$('#amendedRatedBtn').append(amendedBtn);
							
							$('#hraaRequest').empty();
							$('#hraaRequest').append(hraaReverseBtn);
							
							$('#rateAdValue').val("");
							$('#rateChValue').val("");
							$('#rateAdPercentage').val("");
							$('#rateChPercentage').val("");
							
						}
					}
				}else{
					$('#hraaRequest').empty();
					$('#hraaReverse').empty();
					$('#suggestedRates').css('display','none');
					alert("No Updated contracts to display");
					$('#wait').hide();
					return;
				}
				$('#otherRates').empty();
				var otherRatesStr = "";
				cancellationDataList = data.udpMapperCancellationDataList;
				if (cancellationDataList.length > 0){
					var type="PCX";
					otherRatesStr += "<div class=\"row\" id=\"suggestedRatesCancellation\">";
		  			otherRatesStr += "	<div class=\"col-lg-12\">";
		  			//otherRatesStr += "		<button type=\"button\" class=\"btn btn-primary other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Cancellation Charges</button>";
		  			otherRatesStr += "		<span class=\"other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Cancellation Charges</span>";
		  			
		  			//otherRatesStr += "		<p class=\"other-contract-names\" data-toggle=\"modal\" data-target=\"#otherRatesModal\">Cancellation Charges</p>";
		  			otherRatesStr += "	</div>";
		  			otherRatesStr += "</div>";	
				}	
				earlyBirdDataList = data.udpMapperEarlyBirdDataList;
				if (earlyBirdDataList.length > 0){
					var type="EBD";
					otherRatesStr += "<div class=\"row\" id=\"suggestedRatesCancellation\">";
		  			otherRatesStr += "	<div class=\"col-lg-12\">";
		  			//otherRatesStr += "		<button type=\"button\" class=\"btn btn-primary other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Early Birds</button>";
		  			otherRatesStr += "		<span class=\"other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Early Birds</span>";
		  			//otherRatesStr += "		<p class=\"other-contract-names\">Early Birds</p>";
		  			otherRatesStr += "	</div>";
		  			otherRatesStr += "</div>";	
				}	
				freeNightDataList = data.udpMapperFreeNightDataList;
				if (freeNightDataList.length > 0){
					var type="HFR";
					otherRatesStr += "<div class=\"row\" id=\"suggestedRatesCancellation\">";
		  			otherRatesStr += "	<div class=\"col-lg-12\">";
		  			//otherRatesStr += "		<p class=\"other-contract-names\">Free Nights</p>";
		  			//otherRatesStr += "		<button type=\"button\" class=\"btn btn-primary other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Free Nights</button>";
		  			otherRatesStr += "		<span class=\"other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Free Nights</span>";
		  			otherRatesStr += "	</div>";
		  			otherRatesStr += "</div>";	
				}	
				minimumDurationDataList = data.udpMapperMinimumDurationDataList;
				if (minimumDurationDataList.length > 0){
					
					var type="HMN";
					otherRatesStr += "<div class=\"row\" id=\"suggestedRatesCancellation\">";
		  			otherRatesStr += "	<div class=\"col-lg-12\">";
		  			//otherRatesStr += "		<p class=\"other-contract-names\">Minimum Duration</p>";
		  			//otherRatesStr += "		<button type=\"button\" class=\"btn btn-primary other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Minimum Duration</button>";
		  			otherRatesStr += "		<span class=\"other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Minimum Duration</span>";
		  			otherRatesStr += "	</div>";
		  			otherRatesStr += "</div>";	
				}	
				$('#otherRates').append(otherRatesStr);
			}
            $('#wait').hide();
        },
        error: function (data, status, er) {
        	$('#wait').hide();
        	alert("Updated Error");
            console.log(data);
            console.log(status);
            console.log(er);
        }
    });
}
/**
* Reverse Updated Contract
*/
function hraaReverseFun(newSeasonCode,oldSeasonCode,hotelCode) {
	$.ajax({
        url: "/pickservice/hotel/revCopydets",
        type: 'POST',
        data: {
        	newSeasonCode: newSeasonCode,
        	oldSeasonCode: oldSeasonCode,
        	hotelCode: hotelCode
        },
        dataType: "json",
        
        beforeSend: function () {
            $('#wait').show();
        },
        success: function (data) {
            console.log(data);
            if (data != null){
				alert("Data Has Been Reversed from " + newSeasonCode + " in " + hotelCode + " hotel");
			}else{
				alert("Error in Reversed Updated contract");
			}
            
            $('#wait').hide();
        },
        error: function (data, status, er) {
        	$('#wait').hide();
        	alert("Error in Reversed Updated contract");
            console.log(data);
            console.log(status);
            console.log(er);
        }
    });
}

function showAmendedRates(newSeasonCode,oldSeasonCode,hotelCode,hotelName){
	var rateAdValue = $('#rateAdValue').val();
	var rateChValue = $('#rateChValue').val();
	var rateAdPercentage = $('#rateAdPercentage').val();
	var rateChPercentage = $('#rateChPercentage').val();
	if (rateAdValue != "" && rateAdPercentage !=""){
		alert("You cannot enter both Value and Percentage");
		$('#rateValue').focus();
		return true;
	}
	var rateValueFlag=false;
	if (rateAdValue !=""){
		rateValueFlag = true;
	}
	var ratePercentageFlag=false;
	if (rateAdPercentage !=""){
		ratePercentageFlag = true;
	}

	$.ajax({
        url: "/pickservice/hotel/dets",
        type: 'POST',
        data: {
        	newSeasonCode: newSeasonCode,
        	oldSeasonCode: oldSeasonCode,
        	mainHotelCode: hotelCode
        },
        dataType: "json",
        beforeSend: function () {
            $('#wait').show();
        },
        success: function (data) {
            console.log(data);
            if (data != null){
				var contractDataList = data.mapperContractDataList;
				if (contractDataList.length > 0){
					/* no amend screen and displays the rate display screen only */
					//$('#amendedRates').css('display','block');
					var roomThStr="";
					var roomFirstTrStr="";
					var roomNextTrStr="";
					var tableStr = "";
					var roomThFirstTime = true;
					for(var j=0; j <contractDataList.length; j++){
						if (contractDataList[j].contractType == "A"){
							var currencyCode = contractDataList[j].currencyCode;
							var mainHotelCode = hotelCode;
							//var mainHotelName = hotelName;
							var terminationDate = contractDataList[j].terminationDate;
							
	
							$('#suggestedContractHeader3').empty();
							$('#suggestedContractHeader3').append("Contract Rates(" + currencyCode + ")");
							$('#suggestedContractHeader4').empty();
							$('#suggestedContractHeader4').append("Hotel " + mainHotelCode + ":" + hotelName);
							
							
							var contractDatesList = contractDataList[j].mapperContractDatesList;
							for(var m=0; m <contractDatesList.length; m++){
								var contractDate = contractDatesList[m].contractDate;
								var contractNextDate = "";
								if (contractDatesList[m+1] === undefined){
									contractNextDate = terminationDate;
								}else{
									contractNextDate = contractDatesList[m+1].contractDate;
									if (contractNextDate != null){
										contractNextDate = getPreviousDate(contractNextDate);
									}else{
										contractNextDate = terminationDate;
									}
								}
								var mapperRoomsList = contractDatesList[m].mapperRoomsList;
								if (roomThFirstTime){
									roomThStr += "<table class=\"table table-bordered suggested-table\">";	
									roomThStr += "<thead>";
									roomThStr += "<tr>";
									roomThStr += "<th class=\"rates-row-th table-border-top\">Dates</th>";
									
									//roomFirstTrStr +="<tbody><tr><td class='td-dates-first rates-row-first-tr'>"+newSeasonCode+" ("+contractDate + "-" + terminationDate +")</td>"
									roomFirstTrStr +="<tbody><tr><td class='td-dates-first rates-row-first-tr table-border-top' style=\"width: 100px;border-bottom: transparent !important;\">"+newSeasonCode+"</td>"
								}
								var contractDateArr=contractDate.split(" ");
								var contractDateStr=contractDateArr[0] + contractDateArr[1];
								var contractNextDateArr=contractNextDate.split(" ");
								var contractNextDateStr=contractNextDateArr[0] + contractNextDateArr[1];
								roomNextTrStr +="<tr>";
								roomNextTrStr +="<td class='td-dates rates-row-second-tr table-border-top'>" +contractDateStr+ "-" + contractNextDateStr + "</td>";
								for(var n=0; n <mapperRoomsList.length; n++){
									if (roomThFirstTime){
										roomThStr += "<th class=\"rates-row-th table-border-top\" title='" + mapperRoomsList[n].roomDescription + "' colspan='2'>" + mapperRoomsList[n].roomCode + "</th>";
										roomFirstTrStr +="<td class=\"td-dates-first rates-row-first-tr table-border-top\" rowspan=\"2\" style=\"border-right: transparent !important;\">Adult</td><td class=\"td-dates-first rates-row-first-tr table-border-top\" rowspan=\"2\" style=\"border-left: transparent !important;\">Child</td>";
									}
									
									
									var adRate = mapperRoomsList[n].adultRate;
									var adRateStr ="--"
									if (adRate !=null && adRate != ""){
										if (rateValueFlag){
											adRate = parseFloat(adRate) + parseFloat(rateAdValue);
										}
										if (ratePercentageFlag){
											adRate = parseFloat(adRate) + (parseFloat(adRate) * parseFloat(rateAdPercentage)) / 100;
										}
										var adRateAr = adRate.toString().split(".");
										
										adRateStr = adRateAr[0];
									}
									var chRate = mapperRoomsList[n].childRate;
									var chRateStr ="--"
									if (chRate !=null && chRate != ""){
										if (rateValueFlag && rateChValue != ""){
											chRate = parseFloat(chRate) + parseFloat(rateChValue);
										}
										if (ratePercentageFlag && rateChPercentage != ""){
											chRate = parseFloat(chRate) + (parseFloat(chRate) * parseFloat(rateChPercentage)) / 100;
										}
										var chRateAr = chRate.toString().split(".");
										chRateStr = chRateAr[0];
									}
									roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-right: transparent !important;\">" +adRateStr+ "</td>";
									roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-left: transparent !important;\">" +chRateStr+ "</td>";
								}
								if (roomThFirstTime){
									roomThStr += "</tr></thead>";
									roomFirstTrStr +="</tr>";
									roomFirstTrStr +="<tr><td class='td-dates-first rates-row-first-tr table-border-top' style=\"width: 100px;border-top: transparent !important;\">("+contractDate + "-" + terminationDate+")</td>"
								}
								roomNextTrStr +="</tr>";
								roomThFirstTime = false;
								
							}
							tableStr += roomThStr + roomFirstTrStr + roomNextTrStr + "</tbody></table>";
							$('#suggestedRatesTable').empty();
							$('#suggestedRatesTable').append(tableStr);
							/* no amend screen and displays the rate display screen only */
							/*$('#amendedRatesTable').empty();
							$('#amendedRatesTable').append(tableStr);*/
						}
					}
				}else{
					$('#amendedRates').css('display','none');
					alert("No contracts to display");
					$('#wait').hide();
					return;
				}
				$('#otherAmendedRates').empty();
				var otherRatesStr = "";
				cancellationDataList = data.mapperCancellationDataList;
				if (cancellationDataList.length > 0){
					var type="PCX";
					otherRatesStr += "<div class=\"row\" id=\"suggestedRatesCancellation\">";
		  			otherRatesStr += "	<div class=\"col-lg-12\">";
		  			//otherRatesStr += "		<button type=\"button\" class=\"btn btn-primary other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Cancellation Charges</button>";
		  			otherRatesStr += "		<span class=\"other-contract-names-1\" onclick='displayOtherRates(\""+type+"\")'>Cancellation Charges</span>";
		  			otherRatesStr += "	</div>";
		  			otherRatesStr += "</div>";	
				}	
				earlyBirdDataList = data.mapperEarlyBirdDataList;
				if (earlyBirdDataList.length > 0){
					var type="EBD";
					otherRatesStr += "<div class=\"row\" id=\"suggestedRatesCancellation\">";
		  			otherRatesStr += "	<div class=\"col-lg-12\">";
		  			//otherRatesStr += "		<button type=\"button\" class=\"btn btn-primary other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Early Birds</button>";
		  			otherRatesStr += "		<span class=\"other-contract-names-1\" onclick='displayOtherRates(\""+type+"\")'>Early Birds</span>";
		  			otherRatesStr += "	</div>";
		  			otherRatesStr += "</div>";	
				}	
				freeNightDataList = data.mapperFreeNightDataList;
				if (freeNightDataList.length > 0){
					var type="HFR";
					otherRatesStr += "<div class=\"row\" id=\"suggestedRatesCancellation\">";
		  			otherRatesStr += "	<div class=\"col-lg-12\">";
		  			otherRatesStr += "		<span class=\"other-contract-names-1\" onclick='displayOtherRates(\""+type+"\")'>Free Nights</span>";
		  			//otherRatesStr += "		<button type=\"button\" class=\"btn btn-primary other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Free Nights</button>";
		  			otherRatesStr += "	</div>";
		  			otherRatesStr += "</div>";	
				}	
				minimumDurationDataList = data.mapperMinimumDurationDataList;
				if (minimumDurationDataList.length > 0){
					
					var type="HMN";
					otherRatesStr += "<div class=\"row\" id=\"suggestedRatesCancellation\">";
		  			otherRatesStr += "	<div class=\"col-lg-12\">";
		  			otherRatesStr += "		<span class=\"other-contract-names-1\" onclick='displayOtherRates(\""+type+"\")'>Minimum Duration</span>";
		  			//otherRatesStr += "		<button type=\"button\" class=\"btn btn-primary other-contract-names\" onclick='displayOtherRates(\""+type+"\")'>Minimum Duration</button>";
		  			otherRatesStr += "	</div>";
		  			otherRatesStr += "</div>";	
				}	
				$('#otherAmendedRates').append(otherRatesStr);
			}
            $('#wait').hide();
        },
        error: function (data, status, er) {
        	$('#wait').hide();
            console.log(data);
            console.log(status);
            console.log(er);
        }
    });
}






