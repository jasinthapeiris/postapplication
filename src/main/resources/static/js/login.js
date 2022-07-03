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
posTopSuggestedRatesOriginal = 0;
posTopSuggestedRatesOtherHotelsOriginal = 0;

var noOfAddtionalDivesOpen = 0;


gTab01PageNumber = 0;
gTab02PageNumber = 0;
gTab03PageNumber = 0;
gTab04PageNumber = 0;

var gShowAllRatesIds = [];


$(function() {
	
	$('#wait').hide();
	$( "#suggestedRates" ).draggable();
	$( "#suggestedRatesOtherHotels" ).draggable();
	$( "#amendedRates" ).draggable();
	$( "#tab02" ).draggable();
	$( "#tab03" ).draggable();
	$( "#tab04" ).draggable();
	$( "#otherRatesModal" ).draggable();
	//$( "#displayAllRates" ).draggable();
	
	
	
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
	pageNumber = 1;
	$('#suggestedRates').css('display','none');
	$('#suggestedRatesOtherHotels').css('display','none');
	
	
	$('#amendedRates').css('display','none');
	$('#otherRatesModal').css('display','none');
	$('#tab02').css('display','none');
	$('#tab03').css('display','none');
	$('#tab04').css('display','none');
	gShowAllRatesIds = [];
	$('#showAllRatesBtn').css('display','none');
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
  							divStr += "<button type='button' onclick='suggestRates(\"" + hotelCode + "\",\"" + copyFromSeasonCode + "\",\"" + copyToSeasonCode + "\"," +updatedContract+ ",\"" + hotelName + "\",\"" + copyToDates + "\",\"" + copyFromActiveContract + "\",\"" + "MAINHOTEL" + "\")'  data-hotelcode='"+hotelCode+"' data-oldseasoncode='"+copyFromSeasonCode+"' data-newseasoncode='"+copyToSeasonCode+"' class='btn btn-submit btn-contracts'>Suggest Rates</button>";
  							
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
				var tableNo = 1;
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
	  						subDivContents += "		<label for=\"hotelCode\" class=\"tab01-content-close\" onclick=\"closePreviousRates()\" ontouchend=\"closePreviousRates()\">X</label>";
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
  						subDivContents += "		<button type=\"button\" id='btn" + contractDataList[j].seasonCode + "' onclick=\"showTable('" + contractDataList[j].seasonCode + "','"+tableNo+"')\" ontouchend=\"showTable('" + contractDataList[j].seasonCode + "','"+tableNo+"')\" class='btn btn-submit btn-contracts'>+</button>";
  						subDivContents += "	</div>";
  						subDivContents += "	<div class=\"col-lg-9 pre-rates-col-9\">";
  						subDivContents += "		<lable class=\"pre-contracts-header-text\">Contracts For Season Code: " + contractDataList[j].seasonCode +"(in "+currencyCode+")</lable>";
  						subDivContents += "	</div>";
  						
  						
  						subDivContents += "</div>";
						subDivContents += "<div class=\"row pre-rates-row\" style=\"display: none;background-color: #dda4a4;margin-left: 0px;margin-right: 0px;\" id='div" + contractDataList[j].seasonCode + "'>";
						subDivContents += "	<div class=\"row\">";
  						subDivContents += "		<div class=\"col-lg-12\">";
  						subDivContents += "			<label for=\"hotelCode\" class=\"tab01-content-close\" onclick=\"closeTab02SubRates('" + contractDataList[j].seasonCode + "')\" style=\"margin-right: 3px;\">X</label>";
  						subDivContents += "		</div>";
    					subDivContents += "	</div>";
    					subDivContents += "	<div class=\"row\">";
	  					subDivContents += "		<div class=\"col-lg-12 page-number-col-top\">";
						subDivContents += "			<label for=\"hotelCode\" class=\"page-number\" id='pageNumber" + contractDataList[j].seasonCode + "' style=\"margin-left: 1px;margin-top: -8px;\">"+gTab02PageNumber+"." +tableNo+ "</label>";
						tableNo ++;
						subDivContents += "		</div>";
						subDivContents += "	</div>";
						
						subDivContents += "<div class=\"row\">";
						subDivContents += "<div class=\"col-lg-12\">";
						subDivContents += "<table class=\"table\" style=\"margin-top: -14px;\">";
 						subDivContents += "	<tbody>";
   						subDivContents += "		<tr>";
     					subDivContents += "			<td class=\suggested-rate-table-td\" width=\"10%\" style=\"border-top: 0px;padding: 2px;\">&nbsp;</td>";
     					subDivContents += "			<td class=\"suggested-rate-table-td td-color td-font-1\" width=\"80%\" align=\"center\">Rates For Season Code: " + contractDataList[j].seasonCode +"(in "+currencyCode+")</td>";
     					subDivContents += "			<td class=\"suggested-rate-table-td\" width=\"10%\">&nbsp;</td>";
   						subDivContents += "		</tr>";
 						subDivContents += "	</tbody>";
						subDivContents += "</table>";
						subDivContents += "</div>";
						subDivContents += "</div>";
						
						
						
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
	$('#hotelDiv').css('display','none');
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
  						
  						
					}else{
						hotelStr = "<h2 class='h2-no-contract-text'> No Hotels Available for the Resort in the Season selected.</h2>";
						
					}
				}else{
					hotelStr = "<h2 class='h2-no-contract-text'> No Hotels Available for the Resort in the Season selected.</h2>";
				}				
			}else{
				hotelStr = "<h2 class='h2-no-contract-text'> No Hotels Available for the Resort in the Season selected.</h2>";
			}
			var hotelStrH = "";
            hotelStrH += "<div class=\"col-lg-12\">";
            hotelStrH += "<div class=\"row\" style=\"margin-left: -5px;margin-right: -7px;\">";
            hotelStrH += "<div class=\"col-lg-12\" style=\"margin-top: -200px;background-color: chocolate;margin-bottom: 69px;\">";
            
             hotelStrH += "<div class=\"row\">";
	  		 hotelStrH += "		<div class=\"col-lg-12\">";
	  		 hotelStrH += "			<label for=\"hotelCode\" class=\"tab03-content-close\" onclick=\"closeHotelDiv()\" ontouchend=\"closeHotelDiv()\">X</label>";
	  		 hotelStrH += "		</div>";
			 hotelStrH += "	</div>";
			 hotelStrH += "	<div class=\"row\">";
			 hotelStrH += "		<div class=\"col-lg-12 page-number-col-top\">";
	  		 hotelStrH += "			<label for=\"hotelCode\" class=\"page-number\">"+gTab03PageNumber+".1</label>";
	  		 hotelStrH += "		</div>";
			 hotelStrH += "	</div>";
            
            
            
            
            hotelStrH += "<div class=\"row\">";
            hotelStrH += hotelStr;
            hotelStrH += "</div>";
			hotelStrH += "</div>";
            hotelStrH += "</div>";
			hotelStrH += "</div>";
			
			$('#hotelDiv').append(hotelStrH);
			
			
			$('#hotelDiv').css('display','block');
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
	suggestRates(hotelCode,oldSeasonCode,newSeasonCode,updatedContract,hotelName,copyToDates,copyFromActiveContract,"OTHERHOTELS");
}


function suggestRates(hotelCode,oldSeasonCode,newSeasonCode,updatedContract,hotelName,copyToDates,copyFromActiveContract,category){
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
				createSuggestedRatesDiv(data,hotelCode,oldSeasonCode,newSeasonCode,updatedContract,hotelName,copyToDates,copyFromActiveContract,category);
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

function createSuggestedRatesDiv(data,hotelCode,oldSeasonCode,newSeasonCode,updatedContract,hotelName,copyToDates,copyFromActiveContract,category) {
	var contractDataList = data.mapperContractDataList;
	if (contractDataList.length > 0){
		if (category == "MAINHOTEL") {
			//paginate("suggestedRatesPageNumber");
			
			$('#suggestedRatesPageNumber').empty();
			$('#suggestedRatesPageNumber').append(gTab01PageNumber + ".1");
			
			
			var divCounts = noOfAddtionalDivesOpen;
			if($("#suggestedRates").is(":visible")) {
			}else{
				noOfAddtionalDivesOpen ++;
			}
			
			$('#suggestedRates').css('display','block');
			$('#suggestedRates').focus();
			
			gShowAllRatesIds.push("suggestedRates");
			$('#showAllRatesBtn').css('display','block');
			
			divPositining("suggestedRates",divCounts);

			posTopSuggestedRatesOriginal = $("#suggestedRates").offset().top;	
			
			
			
			
		}
		if (category == "OTHERHOTELS") {
			//paginate("suggestedRatesPageNumberOtherHotels");
			$('#suggestedRatesPageNumberOtherHotels').empty();
			$('#suggestedRatesPageNumberOtherHotels').append(gTab03PageNumber + ".2");
			
			var divCounts = noOfAddtionalDivesOpen;
			if($("#suggestedRatesOtherHotels").is(":visible")) {
			}else{
				noOfAddtionalDivesOpen ++;
			}
			$('#suggestedRatesOtherHotels').css('display','block');
			$('#suggestedRatesOtherHotels').focus();
			
			gShowAllRatesIds.push("suggestedRatesOtherHotels");
			$('#showAllRatesBtn').css('display','block');
			
			divPositining("suggestedRatesOtherHotels",divCounts);

			posTopSuggestedRatesOtherHotelsOriginal = $("#suggestedRatesOtherHotels").offset().top;	
			
		}	
		var tableStr = "";
		for(var j=0; j <contractDataList.length; j++){
			if (contractDataList[j].contractType == "A"){
				var currencyCode = contractDataList[j].currencyCode;
				var mainHotelCode = hotelCode;
				var mainHotelName = hotelName;
				var mainHotelNameRtn = concertToLowar(mainHotelName);
				var terminationDate = contractDataList[j].terminationDate;
				if (category == "MAINHOTEL") {			
					$('#suggestedContractHeader1').empty();
					$('#suggestedContractHeader1').append("Contract Rates(" + currencyCode + ")");
					$('#suggestedContractHeader2').empty();
					$('#suggestedContractHeader2').append("Hotel " + mainHotelCode + ":" + mainHotelNameRtn);
				}
				if (category == "OTHERHOTELS") {			
					$('#suggestedContractHeader1OtherHotels').empty();
					$('#suggestedContractHeader1OtherHotels').append("Contract Rates(" + currencyCode + ")");
					$('#suggestedContractHeader2OtherHotels').empty();
					$('#suggestedContractHeader2OtherHotels').append("Hotel " + mainHotelCode + ":" + mainHotelNameRtn);
				}	
				var contractDatesList = contractDataList[j].mapperContractDatesList;
				tableStr = createRateTable(contractDatesList,terminationDate,newSeasonCode,copyToDates);
				
				if (category == "MAINHOTEL") {
					$('#suggestedRatesTable').empty();
					$('#suggestedRatesTable').append(tableStr);
				}
				if (category == "OTHERHOTELS") {
					$('#suggestedRatesTableOtherHotels').empty();
					$('#suggestedRatesTableOtherHotels').append(tableStr);
				}
				
				var amendedMsg = "<p style=\"font-family: 'Arial Bold','Arial',sans-serif;font-weight: 700;font-style: normal;font-size: 13px;color: #f59a23;text-decoration: underline;\">Updarte the Previous Rates By:</p>";
				if (category == "MAINHOTEL") {
					$('#amendedRateMessage').empty();
					$('#amendedRateMessage').append(amendedMsg);
				}	
				if (category == "OTHERHOTELS") {
					$('#amendedRateMessageOtherHotels').empty();
					$('#amendedRateMessageOtherHotels').append(amendedMsg);
				}	
				if (category == "MAINHOTEL") {
					var amendedBtn = "<button type=\"button\" class=\"btn btn-submit auth-btn\" style=\"margin-top: 0px;height: 26px !important;float: right;\" onclick='showAmendedRates(\""+newSeasonCode+"\",\""+oldSeasonCode+"\",\""+hotelCode+"\",\"" + mainHotelName + "\")'>Show Rates</button>";
					var amendedTable = createAmendTable(amendedBtn,"",currencyCode);
					$('#amendedRateTable').empty();
					$('#amendedRateTable').append(amendedTable);
					//$('#amendedRatedBtn').empty();
					//$('#amendedRatedBtn').append(amendedBtn);
				}	
				if (category == "OTHERHOTELS") {
					var amendedBtn = "<button type=\"button\" class=\"btn btn-submit auth-btn\" style=\"margin-top: 0px;height: 26px !important;float: right;\" onclick='showAmendedRatesOtherHotels(\""+newSeasonCode+"\",\""+oldSeasonCode+"\",\""+hotelCode+"\",\"" + mainHotelName + "\")'>Show Rates</button>";
					var amendedTable = createAmendTable(amendedBtn,"OtherHotels",currencyCode);
					$('#amendedRateTableOtherHotels').empty();
					$('#amendedRateTableOtherHotels').append(amendedTable);
				}	
				
				var hraaRequestBtn = "";
				var hraaReverseBtn = "";
				if (category == "MAINHOTEL") {
					hraaRequestBtn = "<button type=\"button\" class=\"btn btn-submit btn-contract\" onclick='hraaRequestFun(\""+newSeasonCode+"\",\""+oldSeasonCode+"\",\""+copyFromActiveContract+"\",\""+hotelCode+"\")'>Request HRAA Approval</button>";
					hraaReverseBtn = "<button type=\"button\" class=\"btn btn-submit btn-contract\" onclick='hraaReverseFun(\""+newSeasonCode+"\",\""+oldSeasonCode+"\",\""+hotelCode+"\")'>Reverse HRAA Request</button>";
					$('#hraaRequest').empty();
					$('#hraaRequest').append(hraaRequestBtn + "&nbsp;&nbsp;" + hraaReverseBtn);
				}
				if (category == "OTHERHOTELS") {
					hraaRequestBtn = "<button type=\"button\" class=\"btn btn-submit btn-contract\" onclick='hraaRequestFunOtherHotels(\""+newSeasonCode+"\",\""+oldSeasonCode+"\",\""+copyFromActiveContract+"\",\""+hotelCode+"\")'>Request HRAA Approval</button>";
					hraaReverseBtn = "<button type=\"button\" class=\"btn btn-submit btn-contract\" onclick='hraaReverseFunOtherHotels(\""+newSeasonCode+"\",\""+oldSeasonCode+"\",\""+hotelCode+"\")'>Reverse HRAA Request</button>";
					$('#hraaRequestOtherHotels').empty();
					$('#hraaRequestOtherHotels').append(hraaRequestBtn + "&nbsp;&nbsp;" + hraaReverseBtn);
				}
				if (category == "MAINHOTEL") {
					$('#rateAdValue').val("");
					$('#rateChValue').val("");
					$('#rateAdPercentage').val("");
					$('#rateChPercentage').val("");
				}	
				if (category == "OTHERHOTELS") {
					$('#rateAdValueOtherHotels').val("");
					$('#rateChValueOtherHotels').val("");
					$('#rateAdPercentageOtherHotels').val("");
					$('#rateChPercentageOtherHotels').val("");
				}	
			}
		}
	}else{
		if (category == "MAINHOTEL") {
			$('#hraaRequest').empty();
			$('#hraaReverse').empty();
			$('#suggestedRates').css('display','none');
		}
		if (category == "OTHERHOTELS") {
			$('#hraaRequestOtherHotels').empty();
			$('#hraaReverseOtherHotels').empty();
			$('#suggestedRatesOtherHotels').css('display','none');
		}
		
		alert("No contracts to display / Seasons not setup ");
		$('#wait').hide();
		return;
	}
	if (category == "MAINHOTEL") {
		$('#otherRates').empty();
	}
	if (category == "OTHERHOTELS") {
		$('#otherRatesOtherHotels').empty();
	}
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
	if (category == "MAINHOTEL") {
		$('#otherRates').append(otherRatesStr);
	}
	if (category == "OTHERHOTELS") {
		$('#otherRatesOtherHotels').append(otherRatesStr);
	}
	if (category == "MAINHOTEL") {			
		if($("#suggestedRates").is(":visible")){
			//$('html, body').animate({ scrollTop: $('#suggestedRates').offset().top }, 'slow');
			zindex ++;
			$("#suggestedRates").css('z-index', zindex);
		}
	}
	if (category == "OTHERHOTELS") {			
		if($("#suggestedRatesOtherHotels").is(":visible")){
			//$('html, body').animate({ scrollTop: $('#suggestedRatesOtherHotels').offset().top }, 'slow');
			zindex ++;
			$("#suggestedRatesOtherHotels").css('z-index', zindex);
		}
	}
}

function createAmendTable(amendedBtn,category,currencyCode){
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
	amendedTable += "				<td class=\"table-tr\"><input type=\"text\" id=\"rateAdValue"+category+"\" class=\"form-control auth-contents-textbox\" maxlength=\"4\" style=\"width: 35px;\"></td >";
	amendedTable += "				<td class=\"table-tr\"><input type=\"text\" id=\"rateChValue"+category+"\" class=\"form-control auth-contents-textbox\" maxlength=\"4\" style=\"width: 35px;\"></td >";
	amendedTable += "			</tr>";
	amendedTable += "			<tr>";
	amendedTable += "				<td colSpan=\"3\" align=\"center\" class=\"table-th\">OR</td>";
	amendedTable += "			</tr>";		
	amendedTable += "			<tr>";
	amendedTable += "				<td class=\"table-th\">%</td>";
	amendedTable += "				<td class=\"table-tr\"><input type=\"text\" id=\"rateAdPercentage"+category+"\" class=\"form-control auth-contents-textbox\" maxlength=\"4\" style=\"width: 35px;\"></td >";
	amendedTable += "				<td class=\"table-tr\"><input type=\"text\" id=\"rateChPercentage"+category+"\" class=\"form-control auth-contents-textbox\" maxlength=\"4\" style=\"width: 35px;\"></td >";
	amendedTable += "			</tr>";
	amendedTable += "			<tr>";
	amendedTable += "				<td colSpan=\"3\" align=\"right\" class=\"table-th\">" + amendedBtn + "</td>";
	amendedTable += "			</tr>";	
	amendedTable += "		</tbody>";
	amendedTable += "	</table>"; 
	
	return amendedTable;
	
}

/** Create Rate Table*/
function createRateTable(contractDatesList,terminationDate,newSeasonCode,copyToDates) {
	var roomThStr="";
	var roomFirstTrStr="";
	var roomNextTrStr="";
	var tableStr = "";
	var roomThFirstTime = true;
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
	return tableStr;
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
function showTable(id,pageNo){
	var btnText = $('#btn' + id).text();
	$( '#div' + id ).draggable();
	if (btnText == "+"){
		$('#btn' + id).text("-");
		$('#div' + id).css('display','block');
		$('#pageNumber' + id).empty();
		$('#pageNumber' + id).append(gTab02PageNumber + "." + pageNo);
		gShowAllRatesIds.push("div" + id);
		$( '#div' + id + '-01').draggable();
		$('#showAllRatesBtn').css('display','block');
	}else{
		$('#btn' + id).text("+");
		$('#div' + id).css('display','none');
	}
	
}

function closeTab02SubRates(id){
	$('#btn' + id).text("+");
	$('#div' + id).css('display','none');
	var preDivId = "div" + id;
	for(var i=0; i <gShowAllRatesIds.length; i++){
		if (gShowAllRatesIds[i] == preDivId){
			gShowAllRatesIds.splice(i,1);
			break;
		}
	}
	if (gShowAllRatesIds.length > 0){
	}else {
		$('#showAllRatesBtn').css('display','none');	
	}
	
	
}



/** Increase the zindex and move the div into front */
function tabMoveToFront(divId) {
	zindex ++;
	$("#" + divId).css('z-index', zindex);
	
	
	/*var allDivesArr = ["tab01","tab02","tab03","tab04","suggestedRates","suggestedRatesOtherHotels","displayAllRates"];
	
	for(var i=0; i <allDivesArr.length; i++){
		if (allDivesArr[i] == divId){
			$("#" + divId).removeClass("remove-zindex");
			$("#" + divId).addClass("add-zindex");
		}else{
			$("#" + allDivesArr[i]).removeClass("add-zindex");
			$("#" + allDivesArr[i]).addClass("remove-zindex");
		}
	}*/
}


function tabMoveToFrontAllRates(divId) {
	zindex ++;
	$("#" + divId).css('z-index', (zindex + 5000));
}




/** Tab01 display */
function showSuggest(){
	$("#btnTab01").addClass("btn-active-status");
	$("#btnTab02").removeClass("btn-active-status");
	$("#btnTab03").removeClass("btn-active-status");
	$("#btnTab04").removeClass("btn-active-status");
	paginate("tab01PageNumber");
	$('#tab01').css('display','block');
	posTopTab01Original = $("#tab01").offset().top;
}
/** Tab02 display */
function showPrevious(){
	if (gNoContracts){
		$('#tab01').css('display','none');
	}
	
	paginate("tab02PageNumber");
	
	$("#btnTab02").addClass("btn-active-status");
	$("#btnTab01").removeClass("btn-active-status");
	$("#btnTab03").removeClass("btn-active-status");
	$("#btnTab04").removeClass("btn-active-status");
	
	var divCounts = noOfAddtionalDivesOpen;
	if($("#tab02").is(":visible")) {
	}else{
		noOfAddtionalDivesOpen ++;
	}
	
	$('#tab02').css('display','block');
	
	zindex ++;
	$('#tab02').css('z-index', zindex);
	
	
	$('html, body').animate({ scrollTop: $('#tab02').offset().top }, 'slow');
	
	var posTopTab01 = $("#tab01").offset().top;
	var posLeftTab01 = $("#tab01").position().left;
	var widthTab01 = $("#tab01").width();
	
	divPositining("tab02",divCounts);
	
	/*var divTopPos = 0;
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
	$('#tab02').css('left',posLeftTab01 + "px");*/
	
	posTopTab02Original = $("#tab02").offset().top;

}
/** Tab03 display */
function showOtherHotels(){
	if (gNoContracts){
		$('#tab01').css('display','none');
	}
	paginate("tab03PageNumber");
	
	$("#btnTab03").addClass("btn-active-status");
	$("#btnTab01").removeClass("btn-active-status");
	$("#btnTab02").removeClass("btn-active-status");
	$("#btnTab04").removeClass("btn-active-status");
	
	var divCounts = noOfAddtionalDivesOpen;
	if($("#tab03").is(":visible")) {
	}else{
		noOfAddtionalDivesOpen ++;
	}
		
	$('#tab03').css('display','block');
	zindex ++;
	$('#tab03').css('z-index', zindex);
	$('html, body').animate({ scrollTop: $('#tab03').offset().top }, 'slow');
	
	divPositining("tab03",divCounts);
	
	/*var posTopTab01 = $("#tab01").offset().top;
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
	$('#tab03').css('left',posLeftTab01 + "px");*/
	
	posTopTab03Original = $("#tab03").offset().top;	
	
}
/** Tab04 display */
function showTemplates() {
	if (gNoContracts){
		$('#tab01').css('display','none');
	}
	paginate("tab04PageNumber");
	
	$("#btnTab04").addClass("btn-active-status");
	$("#btnTab01").removeClass("btn-active-status");
	$("#btnTab02").removeClass("btn-active-status");
	$("#btnTab03").removeClass("btn-active-status");
	
	var divCounts = noOfAddtionalDivesOpen;
	if($("#tab04").is(":visible")) {
	}else{
		noOfAddtionalDivesOpen ++;
	}
		
	$('#tab04').css('display','block');
	
	zindex ++;
	$('#tab04').css('z-index', zindex);
	
	$('html, body').animate({ scrollTop: $('#tab04').offset().top }, 'slow');
	
	divPositining("tab04",divCounts);
	
	gShowAllRatesIds.push("tab04");
	
	$('#showAllRatesBtn').css('display','block');
	
	/*var posTopTab01 = $("#tab01").offset().top;
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
	$('#tab04').css('left',posLeftTab01 + "px");*/

	posTopTab04Original = $("#tab04").offset().top;	

}

function divPositining(divId,divCounts){
	var posTopTab01 = $("#tab01").offset().top;
	var posLeftTab01 = $("#tab01").position().left;
	var widthTab01 = $("#tab01").width();

	var divTopPos = 0;
	if(divCounts == 0){
		divTopPos = (posTopTab01 + 60);
	}
	if(divCounts == 1){
		divTopPos = (posTopTab01 + 120);
	}
	if(divCounts == 2){
		divTopPos = (posTopTab01 + 180);
	}
	if(divCounts == 3){
		divTopPos = (posTopTab01 + 240);
	}
	if(divCounts == 4){
		divTopPos = (posTopTab01 + 300);
	}
	$('#' + divId).css('width',widthTab01 + "px");
	$('#' + divId).css('top',divTopPos + "px");
	$('#' + divId).css('left',posLeftTab01 + "px");
}


function paginate(divId){
	if($("#"+divId).is(":visible")){
	}else{
		pageNumber ++;
		$('#' + divId).empty();
		$('#' + divId).append(pageNumber + "");
		if (divId == "tab01PageNumber"){
			gTab01PageNumber = pageNumber;
		}
		if (divId == "tab02PageNumber"){
			gTab02PageNumber = pageNumber;
		}
		if (divId == "tab03PageNumber"){
			gTab03PageNumber = pageNumber;
		}
		if (divId == "tab04PageNumber"){
			gTab04PageNumber = pageNumber;
		}
	}	
}
/** Display All Rates displayesd previously */
function showAllRates(){
	if (gShowAllRatesIds.length > 0){
		$('#displayAllRates').empty();
		zindex ++;
		$('#displayAllRates').css('z-index', (zindex + 5000));
		$('#displayAllRates').css('display','block');
		
		var divHtml = "";
		divHtml += "<div class=\"row\">";
		divHtml += "			<div class=\"col-lg-12\">";
	  	divHtml += "				<label for=\"hotelCode\" class=\"tab01-content-close\" onclick=\"closeDisplayAllRates()\">X</label>";
	  	divHtml += "			</div>";
		divHtml += "		</div>";
		divHtml += "		<div class=\"row\">";
		divHtml += "			<div class=\"col-lg-12\">";
		divHtml += "				<table class=\"table\" style=\"margin-top: -14px;\">";
 		divHtml += "					<tbody>";
   		divHtml += "						<tr>";
     	divHtml += "							<td class=\"suggested-rate-table-td\" width=\"10%\"><span class=\"previous\" title='Back' onclick=\"closeDisplayAllRates()\">&laquo;</span></td>";
     	divHtml += "							<td class=\"suggested-rate-table-td td-color td-font-1\" width=\"80%\" align=\"center\">Rates Displayed Previously</td>";
     	divHtml += "							<td class=\"suggested-rate-table-td\" width=\"10%\">&nbsp;</td>";
   		divHtml += "						</tr>";
 		divHtml += "					</tbody>";
		divHtml += "				</table>";
		divHtml += "			</div>";
		divHtml += "		</div>";
		$('#displayAllRates').append(divHtml);
		
		var previousDiv = 0;
		var marginTop=10;
		var tHeight=0;
		var tableCount = 0;
		var posLeftTab01 = $("#tab01").position().left;
		posLeftTab01 = (posLeftTab01 - 75); 
		
		var widthTab01 = $("#tab01").width();
		//widthTab01 = (widthTab01 + 200);
		
		for(var i=0; i <gShowAllRatesIds.length; i++){
			var id = gShowAllRatesIds[i];
			divHtml = "";
			if (id.substring(0, 3) == "div" ){
				tableCount ++;
				if (previousDiv == 0) {
					tHeight=290;
				}else{
					tHeight=tHeight + 215;
				}
				marginTop = getTopMarginForAllRates(tableCount, 1);
				/*if (tableCount == 1){
					marginTop = 50
				}
				if (tableCount == 2){
					marginTop = 130
				}
				if (tableCount == 3){
					marginTop = 210
				}
				if (tableCount == 4){
					marginTop = 290
				}
				if (tableCount == 5){
					marginTop = 370
				}
				if (tableCount == 6){
					marginTop = 440
				}*/
				divHtml = "<div class=\"tab-contents\" onclick=\"tabMoveToFrontAllRates('" + id + "-01')\" style=\"margin: "+marginTop+"px auto;background-color: #dda4a4;position: absolute;\" id='" + id + "-01'>";
				previousDiv = 1;
			}
			if (id == "tab04" ){
				tableCount ++;
				if (previousDiv == 0) {
					tHeight=340;
				}else{
					tHeight=tHeight + 275;
				}
				marginTop = getTopMarginForAllRates(tableCount, 1);
				/*if (tableCount == 1){
					marginTop = 50
				}
				if (tableCount == 2){
					marginTop = 130
				}
				if (tableCount == 3){
					marginTop = 210
				}
				if (tableCount == 4){
					marginTop = 290
				}
				if (tableCount == 5){
					marginTop = 370
				}
				if (tableCount == 6){
					marginTop = 440
				}*/
				
				divHtml = "<div id=\"tab04-01\" onclick=\"tabMoveToFrontAllRates('" + id + "-01')\" class=\"tab-contents\" style=\"margin: "+marginTop+"px auto;background-color: rgb(153,149,204);position: absolute;\">";
				previousDiv = 2;
			}
			if (id == "suggestedRates" ){	
				tableCount ++;
				if (previousDiv == 0) {
					tHeight=560;
				}else{
					tHeight=tHeight + 470;
				}
				marginTop = getTopMarginForAllRates(tableCount, 2);
				/*if (tableCount == 1){
					marginTop = 0
				}
				if (tableCount == 2){
					marginTop = 80
				}
				if (tableCount == 3){
					marginTop = 160
				}
				if (tableCount == 4){
					marginTop = 240
				}
				if (tableCount == 5){
					marginTop = 320
				}
				if (tableCount == 6){
					marginTop = 400
				}*/
				
				divHtml = "<div id=\"suggestedRates-01\" onclick=\"tabMoveToFrontAllRates('" + id + "-01')\" class=\"tabs suggested-rates-contents\" style=\"max-width: 750px !important;margin: "+marginTop+"px auto;background-color: #ffffff;position: absolute;\">";
				previousDiv = 3;
			}	
			if (id == "suggestedRatesOtherHotels" ){
				tableCount ++;
				if (previousDiv == 0) {
					tHeight=560;
				}else{
					tHeight=tHeight + 470;
				}
				marginTop = getTopMarginForAllRates(tableCount, 1);
				/*if (tableCount == 1){
					marginTop = 50
				}
				if (tableCount == 2){
					marginTop = 130
				}
				if (tableCount == 3){
					marginTop = 210
				}
				if (tableCount == 4){
					marginTop = 290
				}
				if (tableCount == 5){
					marginTop = 370
				}
				if (tableCount == 6){
					marginTop = 440
				}*/
				divHtml = "<div id=\"suggestedRatesOtherHotels-01\" onclick=\"tabMoveToFrontAllRates('" + id + "-01')\" class=\"tabs suggested-rates-contents\" style=\"max-width: 750px !important;margin: "+marginTop+"px auto;background-color: rgb(24, 123, 31);position: absolute;\">";
				previousDiv = 4;
			}
			divHtml += $('#' + id).prop('innerHTML');
			if (id == "suggestedRates" ){
				divHtml = divHtml.replace("rateAdValue", "rateAdValue1");
				divHtml = divHtml.replace("rateChValue", "rateChValue1");
				divHtml = divHtml.replace("rateAdPercentage", "rateAdPercentage1");
				divHtml = divHtml.replace("rateChPercentage", "rateChPercentage1");
				divHtml = divHtml.replace("suggestedRatesTable", "suggestedRatesTable1");
				divHtml = divHtml.replace("showAmendedRates", "showAmendedRates1");
				divHtml = divHtml.replace("closeSuggestedRates()", "closeOneWindow('"+id + "-01')");
			}
			if (id == "suggestedRatesOtherHotels" ){
				divHtml = divHtml.replace("rateAdValueOtherHotels", "rateAdValueOtherHotels1");
				divHtml = divHtml.replace("rateChValueOtherHotels", "rateChValueOtherHotels1");
				divHtml = divHtml.replace("rateAdPercentageOtherHotels", "rateAdPercentageOtherHotels1");
				divHtml = divHtml.replace("rateChPercentageOtherHotels", "rateChPercentageOtherHotels1");
				divHtml = divHtml.replace("suggestedRatesTableOtherHotels", "suggestedRatesTableOtherHotels1");
				divHtml = divHtml.replace("showAmendedRatesOtherHotels", "showAmendedRatesOtherHotels1");
				divHtml = divHtml.replace("closeSuggestedRatesOtherHotels()", "closeOneWindow('"+id + "-01')");
			}
			
			if (id.substring(0, 3) == "div" ){
				var tSeasonCode = id.substring(3, id.length);
				divHtml = divHtml.replace("closeTab02SubRates('"+tSeasonCode+"')", "closeOneWindow('"+id + "-01')");
			
			}
			if (id == "tab04" ){
				divHtml = divHtml.replace("closeTab04()", "closeOneWindow('"+id + "-01')");
			}	
			//closeTab02SubRates('S23')
			//closeTab04()
			//closeSuggestedRates()
			//closeSuggestedRatesOtherHotels()
			
			
					
			divHtml += "</div>";
			$('#displayAllRates').append(divHtml);
			
			var innerDiveWidth = widthTab01;
			
			var leftMargin = getLeftMarginForAllRates();
			if (id == "tab04" ){
				$( "#tab04-01" ).draggable();
				$("#tab04-01").css('width',innerDiveWidth + "px");
				$("#tab04-01").css('left',leftMargin + "px");
				
			}
			if (id == "suggestedRates" ){
				$( "#suggestedRates-01" ).draggable();
				$("#suggestedRates-01").css('width',innerDiveWidth + "px");
				$("#suggestedRates-01").css('left',leftMargin + "px");
			}	
			if (id == "suggestedRatesOtherHotels" ){
				$( "#suggestedRatesOtherHotels-01" ).draggable();
				$("#suggestedRatesOtherHotels-01").css('width',innerDiveWidth + "px");
				$("#suggestedRatesOtherHotels-01").css('left',leftMargin + "px");
			}	
			if (id.substring(0, 3) == "div" ){
				$( "#"+ id + "-01" ).draggable();
				$("#"+ id + "-01").css('width',innerDiveWidth + "px");
				$("#"+ id + "-01").css('left',leftMargin + "px");
			}	
			
		}	
		
		/*var posLeftTab01 = $("#tab01").position().left;
		posLeftTab01 = (posLeftTab01 - 75); 
		
		var widthTab01 = $("#tab01").width();
		widthTab01 = (widthTab01 + 200);*/
		
		var addWidth = getAddtionalWidthForAllRates();
		
		widthTab01 = (widthTab01 + addWidth);
		
		posLeftTab01 = (posLeftTab01 + 65); 
		
		$('#displayAllRates').css('width',widthTab01 + "px");
		$('#displayAllRates').css('top',"5px");
		$('#displayAllRates').css('left',posLeftTab01 + "px");
		$('#displayAllRates').css('height',tHeight + "px");
		
		
		
		
		
	}else{
		alert("No rates displayed previously");
	}
	
}

function getTopMarginForAllRates(tableCount, no){
	var marginTop = 0;
	if (window.innerWidth > 767) {
		if (no == 2){
			if (tableCount == 1){
				marginTop = 0
			}
			if (tableCount == 2){
				marginTop = 80
			}
			if (tableCount == 3){
				marginTop = 160
			}
			if (tableCount == 4){
				marginTop = 240
			}
			if (tableCount == 5){
				marginTop = 320
			}
			if (tableCount == 6){
				marginTop = 400
			}
		}else{
			if (tableCount == 1){
				marginTop = 50
			}
			if (tableCount == 2){
				marginTop = 130
			}
			if (tableCount == 3){
				marginTop = 210
			}
			if (tableCount == 4){
				marginTop = 290
			}
			if (tableCount == 5){
				marginTop = 370
			}
			if (tableCount == 6){
				marginTop = 440
			}
		}
	}else{
		if (window.innerWidth == 767 || window.innerWidth < 767) {
			if (tableCount == 1){
				marginTop = 0
			}
			if (tableCount == 2){
				marginTop = 80
			}
			if (tableCount == 3){
				marginTop = 160
			}
			if (tableCount == 4){
				marginTop = 240
			}
			if (tableCount == 5){
				marginTop = 320
			}
			if (tableCount == 6){
				marginTop = 400
			}
			
		}	
	}	
	
	
	return marginTop;
}

function getLeftMarginForAllRates(){
	var leftMargin = 0;
	if (window.innerWidth > 749) {
			leftMargin = 20;
	}else{
		if (window.innerWidth > 600 && window.innerWidth < 749) {
			leftMargin = 15;
		}else{
			if (window.innerWidth > 500 && window.innerWidth < 600) {
				leftMargin = 10;
			}else{
				if (window.innerWidth < 500 || window.innerWidth == 500 ) {
					leftMargin = 5;
				}	
			}	
		}
	}
	return leftMargin; 

}

function getAddtionalWidthForAllRates(){
	var widthAdditional = 0;
	if (window.innerWidth > 749) {
			widthAdditional = 200;
	}else{
		if (window.innerWidth > 600 && window.innerWidth < 749) {
			widthAdditional = 100;
		}else{
			if (window.innerWidth > 500 && window.innerWidth < 600) {
				widthAdditional = 30;
			}else{
				if (window.innerWidth < 500 || window.innerWidth == 500 ) {
					widthAdditional = 10;
				}	
			}	
		}
	}
	return widthAdditional; 
}


function closeOneWindow(divId){
	$('#' + divId).css('display','none');
	preDivId = divId.replace("-01", "");
	for(var i=0; i <gShowAllRatesIds.length; i++){
		if (gShowAllRatesIds[i] == preDivId){
			gShowAllRatesIds.splice(i,1);
			break;
		}
	}
	if (gShowAllRatesIds.length > 0){
	}else {
		$('#showAllRatesBtn').css('display','none');	
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
	$('#suggestedRatesOtherHotels').css('display','none');
	
	$('#amendedRates').css('display','none');
	
	$('#otherRatesModal').css('display','none');
	
	$('#tab01').css('display','none');
	$('#tab02').css('display','none');
	$('#tab03').css('display','none');
	$('#hotelDiv').css('display','none');
	
	location.reload();
}

function activeDiv() {
	$("#suggestedRates").addClass("zindex_reduce");
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
	noOfAddtionalDivesOpen --;
}
function closeTab03() {
	$('#tab03').css('display','none');
	$("#btnTab03").removeClass("btn-active-status");
	noOfAddtionalDivesOpen --;
}
function closeTab01() {
	$('#tab01').css('display','none');
}
function closeTab04() {
	$('#tab04').css('display','none');
	$("#btnTab04").removeClass("btn-active-status");
	noOfAddtionalDivesOpen --;
	
	var preDivId = "tab04";
	for(var i=0; i <gShowAllRatesIds.length; i++){
		if (gShowAllRatesIds[i] == preDivId){
			gShowAllRatesIds.splice(i,1);
			break;
		}
	}
	if (gShowAllRatesIds.length > 0){
	}else {
		$('#showAllRatesBtn').css('display','none');	
	}
	
	
	
}
function closeSuggestedRatesOtherHotels(){
	$('#suggestedRatesOtherHotels').css('display','none');
	noOfAddtionalDivesOpen --;
	
	var preDivId = "suggestedRatesOtherHotels";
	for(var i=0; i <gShowAllRatesIds.length; i++){
		if (gShowAllRatesIds[i] == preDivId){
			gShowAllRatesIds.splice(i,1);
			break;
		}
	}
	if (gShowAllRatesIds.length > 0){
	}else {
		$('#showAllRatesBtn').css('display','none');	
	}
	
}

function closeSuggestedRates(){
	$('#suggestedRates').css('display','none');
	noOfAddtionalDivesOpen --;
	
	var preDivId = "suggestedRates";
	for(var i=0; i <gShowAllRatesIds.length; i++){
		if (gShowAllRatesIds[i] == preDivId){
			gShowAllRatesIds.splice(i,1);
			break;
		}
	}
	if (gShowAllRatesIds.length > 0){
	}else {
		$('#showAllRatesBtn').css('display','none');	
	}
	
	
}

function closeAmendedRates(){
	$('#amendedRates').css('display','none');
}

function closeHotelDiv(){
	$('#hotelDiv').css('display','none');
}

function closeDisplayAllRates(){
	$('#displayAllRates').css('display','none');
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
							
							var amendedBtn = "";
							
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
* Update previous Contract to New Season For Other Hotels
*/
function hraaRequestFunOtherHotels(newSeasonCode,oldSeasonCode,copyFromActiveContract,hotelCode) {
	var rateAdValue = $('#rateAdValueOtherHotels').val();
	var rateChValue = $('#rateChValueOtherHotels').val();
	var rateAdPercentage = $('#rateAdPercentageOtherHotels').val();
	var rateChPercentage = $('#rateChPercentageOtherHotels').val();
	
	if (rateAdValue != "" && rateAdPercentage !=""){
		alert("You cannot enter both Value and Percentage");
		$('#rateValueOtherHotels').focus();
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
							$('#suggestedRatesTableOtherHotels').empty();
							$('#suggestedRatesTableOtherHotels').append(tableStr);
							
							var hraaRequestBtn = "";
							var hraaReverseBtn = "";
							//hotelCode,oldSeasonCode,newSeasonCode,updatedContract,hotelName,copyToDates,copyFromActiveContract
							hraaRequestBtn = "";
							hraaReverseBtn = "<button type=\"button\" class=\"btn btn-submit btn-contract\" onclick='hraaReverseFun(\""+newSeasonCode+"\",\""+oldSeasonCode+"\",\""+hotelCode+"\")'>Reverse HRAA Request</button>";
							
							$('#amendedRateMessageOtherHotels').empty(); 
							$('#amendedRateTableOtherHotels').empty();
							
							var amendedBtn = "";
							
							$('#amendedRatedBtnOtherHotels').empty();
							$('#amendedRatedBtnOtherHotels').append(amendedBtn);
							
							$('#hraaRequestOtherHotels').empty();
							$('#hraaRequestOtherHotels').append(hraaReverseBtn);
							
							$('#rateAdValueOtherHotels').val("");
							$('#rateChValueOtherHotels').val("");
							$('#rateAdPercentageOtherHotels').val("");
							$('#rateChPercentageOtherHotels').val("");
							
						}
					}
				}else{
					$('#hraaRequestOtherHotels').empty();
					$('#hraaReverseOtherHotels').empty();
					$('#suggestedRatesOtherHotels').css('display','none');
					alert("No Updated contracts to display");
					$('#wait').hide();
					return;
				}
				$('#otherRatesOtherHotels').empty();
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
				$('#otherRatesOtherHotels').append(otherRatesStr);
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

/**
* Reverse Updated Contract for OtherHotels
*/
function hraaReverseFunOtherHotels(newSeasonCode,oldSeasonCode,hotelCode) {
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
									var adRateChange = false;
									var chRateChange = false;
									if (adRate !=null && adRate != ""){
										if (rateValueFlag){
											adRate = parseFloat(adRate) + parseFloat(rateAdValue);
											adRateChange = true;
										}
										if (ratePercentageFlag){
											adRate = parseFloat(adRate) + (parseFloat(adRate) * parseFloat(rateAdPercentage)) / 100;
											adRateChange = true;
										}
										var adRateAr = adRate.toString().split(".");
										
										adRateStr = adRateAr[0];
									}
									var chRate = mapperRoomsList[n].childRate;
									var chRateStr ="--"
									if (chRate !=null && chRate != ""){
										if (rateValueFlag && rateChValue != ""){
											chRate = parseFloat(chRate) + parseFloat(rateChValue);
											chRateChange = true;
										}
										if (ratePercentageFlag && rateChPercentage != ""){
											chRate = parseFloat(chRate) + (parseFloat(chRate) * parseFloat(rateChPercentage)) / 100;
											chRateChange = true;
										}
										var chRateAr = chRate.toString().split(".");
										chRateStr = chRateAr[0];
									}
									if (adRateChange){
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"color:red;border-right: transparent !important;\">" +adRateStr+ "</td>";	
									}else{
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-right: transparent !important;\">" +adRateStr+ "</td>";
									}
									if (chRateChange){
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"color:red;border-left: transparent !important;\">" +chRateStr+ "</td>";
									}else{
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-left: transparent !important;\">" +chRateStr+ "</td>";
									}	
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


function showAmendedRates1(newSeasonCode,oldSeasonCode,hotelCode,hotelName){
	var rateAdValue = $('#rateAdValue1').val();
	var rateChValue = $('#rateChValue1').val();
	var rateAdPercentage = $('#rateAdPercentage1').val();
	var rateChPercentage = $('#rateChPercentage1').val();
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
									var adRateChange = false;
									var chRateChange = false;
									if (adRate !=null && adRate != ""){
										if (rateValueFlag){
											adRate = parseFloat(adRate) + parseFloat(rateAdValue);
											adRateChange = true;
										}
										if (ratePercentageFlag){
											adRate = parseFloat(adRate) + (parseFloat(adRate) * parseFloat(rateAdPercentage)) / 100;
											adRateChange = true;
										}
										var adRateAr = adRate.toString().split(".");
										
										adRateStr = adRateAr[0];
									}
									var chRate = mapperRoomsList[n].childRate;
									var chRateStr ="--"
									if (chRate !=null && chRate != ""){
										if (rateValueFlag && rateChValue != ""){
											chRate = parseFloat(chRate) + parseFloat(rateChValue);
											chRateChange = true;
										}
										if (ratePercentageFlag && rateChPercentage != ""){
											chRate = parseFloat(chRate) + (parseFloat(chRate) * parseFloat(rateChPercentage)) / 100;
											chRateChange = true;
										}
										var chRateAr = chRate.toString().split(".");
										chRateStr = chRateAr[0];
									}
									if (adRateChange){
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"color:red;border-right: transparent !important;\">" +adRateStr+ "</td>";	
									}else{
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-right: transparent !important;\">" +adRateStr+ "</td>";
									}
									if (chRateChange){
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"color:red;border-left: transparent !important;\">" +chRateStr+ "</td>";
									}else{
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-left: transparent !important;\">" +chRateStr+ "</td>";
									}	
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
							$('#suggestedRatesTable1').empty();
							$('#suggestedRatesTable1').append(tableStr);
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






function showAmendedRatesOtherHotels(newSeasonCode,oldSeasonCode,hotelCode,hotelName){
	var rateAdValue = $('#rateAdValueOtherHotels').val();
	var rateChValue = $('#rateChValueOtherHotels').val();
	var rateAdPercentage = $('#rateAdPercentageOtherHotels').val();
	var rateChPercentage = $('#rateChPercentageOtherHotels').val();
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
							
	
							$('#suggestedContractHeader3OtherHotels').empty();
							$('#suggestedContractHeader3OtherHotels').append("Contract Rates(" + currencyCode + ")");
							$('#suggestedContractHeader4OtherHotels').empty();
							$('#suggestedContractHeader4OtherHotels').append("Hotel " + mainHotelCode + ":" + hotelName);
							
							
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
									var adRateChange = false;
									var chRateChange = false;
									if (adRate !=null && adRate != ""){
										if (rateValueFlag){
											adRate = parseFloat(adRate) + parseFloat(rateAdValue);
											adRateChange = true;
										}
										if (ratePercentageFlag){
											adRate = parseFloat(adRate) + (parseFloat(adRate) * parseFloat(rateAdPercentage)) / 100;
											adRateChange = true;
										}
										var adRateAr = adRate.toString().split(".");
										
										adRateStr = adRateAr[0];
									}
									var chRate = mapperRoomsList[n].childRate;
									var chRateStr ="--"
									if (chRate !=null && chRate != ""){
										if (rateValueFlag && rateChValue != ""){
											chRate = parseFloat(chRate) + parseFloat(rateChValue);
											chRateChange = true;
										}
										if (ratePercentageFlag && rateChPercentage != ""){
											chRate = parseFloat(chRate) + (parseFloat(chRate) * parseFloat(rateChPercentage)) / 100;
											chRateChange = true;
										}
										var chRateAr = chRate.toString().split(".");
										chRateStr = chRateAr[0];
									}
									if (adRateChange){
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"color:red;border-right: transparent !important;\">" +adRateStr+ "</td>";	
									}else{
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-right: transparent !important;\">" +adRateStr+ "</td>";
									}
									if (chRateChange){
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"color:red;border-left: transparent !important;\">" +chRateStr+ "</td>";
									}else{
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-left: transparent !important;\">" +chRateStr+ "</td>";
									}	
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
							$('#suggestedRatesTableOtherHotels').empty();
							$('#suggestedRatesTableOtherHotels').append(tableStr);
							/* no amend screen and displays the rate display screen only */
							/*$('#amendedRatesTable').empty();
							$('#amendedRatesTable').append(tableStr);*/
						}
					}
				}else{
					$('#amendedRatesOtherHotels').css('display','none');
					alert("No contracts to display");
					$('#wait').hide();
					return;
				}
				$('#otherAmendedRatesOtherHotels').empty();
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
				$('#otherAmendedRatesOtherHotels').append(otherRatesStr);
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

function showAmendedRatesOtherHotels1(newSeasonCode,oldSeasonCode,hotelCode,hotelName){
	var rateAdValue = $('#rateAdValueOtherHotels1').val();
	var rateChValue = $('#rateChValueOtherHotels1').val();
	var rateAdPercentage = $('#rateAdPercentageOtherHotels1').val();
	var rateChPercentage = $('#rateChPercentageOtherHotels1').val();
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
							
	
							$('#suggestedContractHeader3OtherHotels').empty();
							$('#suggestedContractHeader3OtherHotels').append("Contract Rates(" + currencyCode + ")");
							$('#suggestedContractHeader4OtherHotels').empty();
							$('#suggestedContractHeader4OtherHotels').append("Hotel " + mainHotelCode + ":" + hotelName);
							
							
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
									var adRateChange = false;
									var chRateChange = false;
									if (adRate !=null && adRate != ""){
										if (rateValueFlag){
											adRate = parseFloat(adRate) + parseFloat(rateAdValue);
											adRateChange = true;
										}
										if (ratePercentageFlag){
											adRate = parseFloat(adRate) + (parseFloat(adRate) * parseFloat(rateAdPercentage)) / 100;
											adRateChange = true;
										}
										var adRateAr = adRate.toString().split(".");
										
										adRateStr = adRateAr[0];
									}
									var chRate = mapperRoomsList[n].childRate;
									var chRateStr ="--"
									if (chRate !=null && chRate != ""){
										if (rateValueFlag && rateChValue != ""){
											chRate = parseFloat(chRate) + parseFloat(rateChValue);
											chRateChange = true;
										}
										if (ratePercentageFlag && rateChPercentage != ""){
											chRate = parseFloat(chRate) + (parseFloat(chRate) * parseFloat(rateChPercentage)) / 100;
											chRateChange = true;
										}
										var chRateAr = chRate.toString().split(".");
										chRateStr = chRateAr[0];
									}
									if (adRateChange){
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"color:red;border-right: transparent !important;\">" +adRateStr+ "</td>";	
									}else{
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-right: transparent !important;\">" +adRateStr+ "</td>";
									}
									if (chRateChange){
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"color:red;border-left: transparent !important;\">" +chRateStr+ "</td>";
									}else{
										roomNextTrStr +="<td class=\"rates-row-second-tr table-border-top\" style=\"border-left: transparent !important;\">" +chRateStr+ "</td>";
									}	
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
							$('#suggestedRatesTableOtherHotels1').empty();
							$('#suggestedRatesTableOtherHotels1').append(tableStr);
							/* no amend screen and displays the rate display screen only */
							/*$('#amendedRatesTable').empty();
							$('#amendedRatesTable').append(tableStr);*/
						}
					}
				}else{
					$('#amendedRatesOtherHotels').css('display','none');
					alert("No contracts to display");
					$('#wait').hide();
					return;
				}
				$('#otherAmendedRatesOtherHotels').empty();
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
				$('#otherAmendedRatesOtherHotels').append(otherRatesStr);
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



