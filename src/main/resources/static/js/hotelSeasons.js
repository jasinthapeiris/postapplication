var cancellationDataList = [];
var earlyBirdDataList = [];
var freeNightDataList = [];
var minimumDurationDataList = [];
gNoContracts=false;
$(function() {
	
	$('#wait').hide();
	$( "#suggestedRates" ).draggable();
	$( "#amendedRates" ).draggable();
	$( "#tab02" ).draggable();
	$( "#otherRatesModal" ).draggable();
	
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
	/* Hide the other dives */
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
            var hotelList = data.mapperHotelList;
            if (data != null && hotelList.length > 0){
				for(var i=0; i <hotelList.length; i++){  
					var forYear = hotelList[i].forYear;
					var hotelCode = hotelList[i].hotelCode;
					var hotelName = hotelList[i].hotelName;
					var seasonsList = hotelList[i].mapperSeasonsList;
					$('#validHotelName').empty();
					$('#validHotelName').append(hotelName);
					$('#tab01').empty();
					
					var divStr="";
					for(var j=0; j <seasonsList.length; j++){
						var copyFromActiveContract = seasonsList[j].copyFromActiveContract;
						var copyFromCoreContract = seasonsList[j].copyFromCoreContract;
						var copyFromDates = seasonsList[j].copyFromDates;
						var copyFromSeasonCode = seasonsList[j].copyFromSeasonCode;
						var copyToActiveContract = seasonsList[j].copyToActiveContract;
						var copyToCoreContract = seasonsList[j].copyToCoreContract;
						var copyToDates = seasonsList[j].copyToDates;
						var copyToSeasonCode = seasonsList[j].copyToSeasonCode;
						
						divStr += "<div class='row tab-contents-row season-row'>";
  						divStr += "<div class='col-lg-5 tab-contens-col season-col-5' style=\"padding-right: 0px !important;padding-left: 0px !important;\">";
  						divStr += "<input type='text' disabled id='sesonCode' class='form-control contract-set-text' value='" + copyFromSeasonCode + ":" + copyFromDates + " : " + copyFromActiveContract + " (Active)' style=\"background-color: #da0620 !important;color: #ffffff !important;\">";
  						divStr += "</div>";
  						var updatedContract = false;
  						if (copyToActiveContract == "OK To Copy"){
  							divStr += "<div class='col-lg-5 tab-contents-col season-col-5' style=\"padding-right: 0px !important;padding-left: 0px !important;\">";
  							divStr += "<input type='text' disabled id='sesonCode' class='form-control contract-set-text' value='" + copyToSeasonCode + ":" + copyToDates + " (Awaiting)' style=\"background-color: #70b603 !important;color: #ffffff !important;\">";
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
						$('#tab01').append("<h2 class='h2-no-contract-text'> No Contracts Setup For Previous Season / Seasons Not Setup </h2>");
					}else{
						gNoContracts=false;
						$('#tab01').append(divStr);
					}
					
				}
				$('.validate-hotel').css('display','block');
				enabledDisabledElements(1);
			}else{
				gNoContracts=true;
				$('#tab01').empty();
				$('#tab01').append("<h2 class='h2-no-contract-text'> No Contracts Setup For Previous Season / Seasons Not Setup </h2>");
				$('.validate-hotel').css('display','block');
				enabledDisabledElements(1);
			}
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
						subDivContents += "<div class=\"row pre-rates-row\" style=\"margin-top: 10px;\">";
  						subDivContents += "	<div class=\"col-lg-1 pre-rates-col-1\">";
  						subDivContents += "		<button type=\"button\" id='btn" + contractDataList[j].seasonCode + "' onclick=\"showTable('" + contractDataList[j].seasonCode + "')\" class='btn btn-submit btn-contracts'>+</button>";
  						subDivContents += "	</div>";
  						subDivContents += "	<div class=\"col-lg-9 pre-rates-col-9\">";
  						subDivContents += "		<lable class=\"pre-contracts-header-text\">Contracts For Season Code: " + contractDataList[j].seasonCode +"(in "+currencyCode+")</lable>";
  						subDivContents += "	</div>";
  						if (firstTime){
							subDivContents += "	<div class=\"col-lg-2 pre-rates-col-2\" style=\"padding-right: 1px !important;\">";
  							subDivContents += "		<label for=\"hotelCode\" class=\"auth-contents-lable auth-contents-close\" onclick=\"closePreviousRates()\" style=\"margin-top: -10px;\">X</label>";
  							subDivContents += "	</div>";
  							firstTime = false;
						}
  						
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
					$('#suggestedRates').css('display','block');
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
							$('#suggestedContractHeader2').append("Hotel " + mainHotelCode + ":" + mainHotelName);
							
							
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
							hotelCode,oldSeasonCode,newSeasonCode,updatedContract,hotelName,copyToDates,copyFromActiveContract
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
function getMonthStr(monthNo) {
	var monthArr = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
	for(var j=0; j <12; j++){
		if (monthNo == j){
			return monthArr[j];
		}
	}	

}
function getMonthNo(monthStr) {
	var monthArr = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
	var monthNoArr = ["00","01","02","03","04","05","06","07","08","09","10","11"];
	for(var j=0; j <monthArr.length; j++){
		if (monthStr == monthArr[j]){
			return monthNoArr[j];
		}
	}
}


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

function showSuggest(){
	$('#tab01').css('display','block');
}
function showPrevious(){
	if (gNoContracts){
		$('#tab01').css('display','none');
	}
	$('#tab02').css('display','block');
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
	$('#tab01').empty();
	$('#tab02').empty();
	$('.validate-hotel').css('display','none');
	$('#suggestedRates').css('display','none');
	
	$('#amendedRates').css('display','none');
	
	$('#otherRatesModal').css('display','none');
	
	$('#tab01').css('display','none');
	$('#tab02').css('display','none');
	
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
}
function closeOtherRates() {
	$('#otherRatesModal').css('display','none');
}
function closePreviousRates() {
	$('#tab02').css('display','none');
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






