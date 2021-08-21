function apOnIt(){
	$("#backtext").html("Merchandising");
	var func = eval(SPA.state.featureConfig.templateId+"_onLoad");
	try {
        func(function(){});
    }catch (e){
		console.error(e.message);
	}
}

function merchandising_onLoad(callback){ 
	   queryData("getMerchandisingData",{},[],function(data){
	    var dataArr=[];
        data && data.length > 0 ? data.forEach(function(elem){ dataArr.push(JSON.parse(elem.domainValues)) }) : null;
		SPA.state.merchandisingList = _.uniqBy(dataArr, 'competitorBrand');
		var displayOptionObj=_.find(SPA.state.merchandisingList, ["creteria", $(".display-option.active-btn").html().toLowerCase()]),templateName=null;
		displayOptionObj && displayOptionObj.blobKey ? SPA.state.displayImage=displayOptionObj.blobKey : null;
		templateName = displayOptionObj && displayOptionObj.blobKey ? "merchandiseDisplayImage" : "carousel_Loading";
		SPA.ui.drawHtml(templateName,"diaplayBanner_comp_row",SPA,function(){ callback();});
	   });
	}

function displayMerchandisingOption(elem,option){
	$(".display-option").removeClass("active-btn");
	$(elem).addClass("active-btn");
	var displayOptionObj=_.find(SPA.state.merchandisingList, ["creteria", $(elem).html().toLowerCase()]);
	if(displayOptionObj && displayOptionObj.blobKey){
		SPA.state.displayImage=displayOptionObj.blobKey;
		SPA.ui.drawHtml("merchandiseDisplayImage","diaplayBanner_comp_row",SPA,function(callback){});
	}else{
		SPA.ui.drawHtml("carousel_Loading","diaplayBanner_comp_row",SPA,function(callback){});
	}
	SPA.ui.drawHtml("merchandisingForm","merchandising_comp_row",SPA,function(callback){});
}


function sendMerchandisingInfo(elem){
	popup.confirm("Are you sure want to submit data ?", function(result) {
		if(result){
			      var header={};
			      header.componentLabel="Merchandising";
			      header.outletCode=appContext.outletCode;
			      header.extendedAttributes={"remarks":$("#remarks").val()};
			      header.extendedAttributes.type=$(".display-option.active-btn").html();
			      header.gpsLatitude=$("#gpsLatitude").val();
                  header.gpsLongitude=$("#gpsLangitude").val();
			      var form = $("#cameraForm");
			      var elem=[$("#uploadImg"),$("#uploadImg1"),$("#uploadImg2"),$("#uploadImg3")];
			      var validImageCount=0;
			      for (var i=0,k=0; i < elem.length; i++) {
			    		if( elem[i].attr('src') && elem[i].attr('src').indexOf("uploadPhoto.png") == -1  ){
			    		validImageCount++;
			    		}
			      }		
			      if(validImageCount==0){
						popup.alert("Please capture atleast one photo.");
						return;
			      }
                  createBlobKey(elem, function(blobKey){
                  if(blobKey != null && blobKey.length>0){
                  header.extendedAttributes.blobKey=blobKey[0];
                  header.extendedAttributes.blobKey1=blobKey[1];
                  header.extendedAttributes.blobKey2=blobKey[2];
                  header.extendedAttributes.blobKey3=blobKey[3];
                  }
                  header.extendedAttributes.imageSrc=$("#uploadImg").attr("src");
                  header.extendedAttributes.imageSrc1=$("#uploadImg1").attr("src");
                  header.extendedAttributes.imageSrc2=$("#uploadImg2").attr("src");
                  header.extendedAttributes.imageSrc3=$("#uploadImg3").attr("src");
                  header.activity="merchandising";
                  header.referenceNumber=getReferenceNumber();
                  commonPost("/outletActivity",header,"VM",{"imageAttribute":"true"}).then(function(data) {
                	   SPA.ui.drawHtml("merchandisingForm","merchandising_comp_row",SPA,function(callback){});
                  },function(jqXHR, textStatus, errorThrown) {

                  });
                  });
		}
	});
}


function merchandising1_onLoad(callback){
queryData("getLogsData",{"feature":"Merchandising","date":SPA.meta.calendar.date,"outletCode":appContext.outletInfo.outletCode},[],function(merchandisingData){
_.forEach(merchandisingData, function(obj,k){
$("#merchOption_elem_row input[type='checkbox']").each(function(){$(this).prop("checked",false);});
var ext = JSON.parse(obj.data).extendedAttributes;
$("#merchOption_elem_row input[type='checkbox']").each(function(){ext && ext.merchOption && ext.merchOption.includes($(this).data('value')) ? $(this).prop("checked",true):null;});
$("#remarks").val(ext.remarks);
$("#uploadImg").attr('src',ext.imageSrc);
});
callback();
});
}

function sendMerchandisingInfo1(elem){
	popup.confirm("Are you sure want to submit data ?", function(result) {
		if(result){ 
			     fetchGPSCoordinate(function(){
                 var header={};
                 header.outletCode= appContext.outletInfo.outletCode;
                 header.extendedAttributes={};
                 header.gpsLatitude=$("#gpsLatitude").val();
                 header.gpsLongitude=$("#gpsLangitude").val();
                 header.outletName=appContext.outletInfo.outletName;
                 header.extendedAttributes.beat=appContext.outletInfo.beat;
                 header.extendedAttributes.beatName=appContext.outletInfo.beatName;
                 header.extendedAttributes.outletType=appContext.outletInfo.outletType;
                 header.outletName=appContext.outletInfo.outletName;
                 header.outletCategory=appContext.outletInfo.outletType;
                 header.name=appContext.name;
			     header.extendedAttributes.remarks=$("#remarks").val();
			      var merchOption=[];
			      $("#merchOption_elem_row input[type='checkbox']:checked").each(function(){
			    	  merchOption.push($(this).data('value'));
			      });
			      header.extendedAttributes.merchOption=merchOption;
			      var elem=[$("#uploadImg")];
			      var validImageCount=0;
			      for (var i=0,k=0; i < elem.length; i++) {
			    		if(elem[i].attr('src') && elem[i].attr('src').indexOf("uploadPhoto.png") == -1  ){
			    		validImageCount++;
			    		}
			      }		
			      if(validImageCount==0){
						popup.alert("Please capture a photo.");
						return;
			      }
                  createBlobKey(elem, function(blobKey){
                  if(blobKey != null && blobKey.length>0){
                  header.extendedAttributes.blobKey=blobKey[0];
                  }
                  header.extendedAttributes.imageSrc=$("#uploadImg").attr("src");
                  header.activity="merchandising";
                  header.referenceNumber=getReferenceNumber();
                  commonPost("/outletActivity",header,"Merchandising",{"imageAttribute":"true"}).then(function(data) {
                  onBackKeyDown();
                  },function(jqXHR, textStatus, errorThrown) {
                  });
                  });
                  });
		}
	});
}
function sendMerchandisingInfo2(elem){
	popup.confirm("Are you sure want to submit data ?", function(result) {
		if(result){
			     fetchGPSCoordinate(function(){
                 var header={};
                 header.outletCode= appContext.outletInfo.outletCode;
                 header.extendedAttributes={};
                 header.gpsLatitude=$("#gpsLatitude").val();
                 header.gpsLongitude=$("#gpsLangitude").val();
                 header.outletName=appContext.outletInfo.outletName;
                 header.extendedAttributes.beat=appContext.outletInfo.beat;
                 header.extendedAttributes.beatName=appContext.outletInfo.beatName;
                 header.extendedAttributes.outletType=appContext.outletInfo.outletType;
                 header.outletName=appContext.outletInfo.outletName;
                 header.outletCategory=appContext.outletInfo.outletType;
                 header.name=appContext.name;
			     header.extendedAttributes.remarks=$("#remarks").val();
			      var merchOption=[];
			      $("#merchOption_elem_row input[type='checkbox']:checked").each(function(){
			    	  merchOption.push($(this).data('value'));
			      });
			      header.extendedAttributes.merchOption=merchOption;
			      var elem=[$("#uploadImg_pre"),$("#uploadImg_after")];

			      var validImageCount=0;
			      for (var i=0,k=0; i < elem.length; i++) {
			    		if(elem[i].attr('src') && elem[i].attr('src').indexOf("uploadPhoto.png") == -1  ){
			    		validImageCount++;
			    		}
			      }

			      if(validImageCount<2){
						popup.alert("Please capture two photos.");
						return;
			      }

                  createBlobKey(elem, function(blobKey){
                  if(blobKey != null && blobKey.length>0){
                  header.extendedAttributes.blobKey_pre=blobKey[0];
                  header.extendedAttributes.blobKey_after=blobKey[1];
                  }

                  header.extendedAttributes.imageSrc_pre=$("#uploadImg_pre").attr("src");
                  header.extendedAttributes.imageSrc_after=$("#uploadImg_after").attr("src");
                  header.activity="merchandising";
                  header.referenceNumber=getReferenceNumber();
                  commonPost("/outletActivity",header,"Merchandising",{"imageAttribute":"true"}).then(function(data) {
                  onBackKeyDown();
                  },function(jqXHR, textStatus, errorThrown) {
                  });
                  });
                  });
		}
	});
}
function merchandising2_onLoad(callback){
	queryData("getLogsData",{"feature":"Merchandising","date":SPA.meta.calendar.date,"outletCode":appContext.outletInfo.outletCode},[],function(merchandisingData){
	_.forEach(merchandisingData, function(obj,k){
	console.log(obj);
	$("#merchOption_elem_row2 input[type='checkbox']").each(function(){$(this).prop("checked",false);});
	var ext = JSON.parse(obj.data).extendedAttributes;
	$("#merchOption_elem_row2 input[type='checkbox']").each(function(){ext && ext.merchOption && ext.merchOption.includes($(this).data('value')) ? $(this).prop("checked",true):null;});
	$("#remarks2").val(ext.remarks);

	});
	callback();
	});
	}

