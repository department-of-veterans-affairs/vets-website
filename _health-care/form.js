var HealthApp = (function() {
  var xmlFieldMap = [
    { "input" : "veteran[field_name]", "node" : "StationSelectList" },
    { "input" : "veteran[field_name]", "node" : "formSessionID" },
    { "input" : "veteran[field_name]", "node" : "EDIPI" },
    { "input" : "veteran[field_name]", "node" : "VetSocialSecurityNumber" },
    { "input" : "veteran[field_name]", "node" : "DateOfBirth" },
    { "input" : "veteran[field_name]", "node" : "Gender" },
    { "input" : "veteran[field_name]", "node" : "VetNameLast" },
    { "input" : "veteran[field_name]", "node" : "VetNameFirst" },
    { "input" : "veteran[field_name]", "node" : "VetNamePrefix" },
    { "input" : "veteran[field_name]", "node" : "VetNameSuffix" },
    { "input" : "veteran[field_name]", "node" : "VetNameMiddle" },
    { "input" : "veteran[field_name]", "node" : "Level" },
    { "input" : "veteran[field_name]", "node" : "VetIDType" },
    { "input" : "veteran[field_name]", "node" : "REVIEWINGFORM" },
    { "input" : "veteran[field_name]", "node" : "LASTPAGE" },
    { "input" : "veteran[field_name]", "node" : "APPTYPE" },
    { "input" : "veteran[field_name]", "node" : "Anonymous" },
    { "input" : "veteran[field_name]", "node" : "USStates" },
    { "input" : "veteran[field_name]", "node" : "CANStates" },
    { "input" : "veteran[field_name]", "node" : "MEXStates" },
    { "input" : "veteran[field_name]", "node" : "Countries" },
    { "input" : "veteran[field_name]", "node" : "pgIntro2Visited" },
    { "input" : "veteran[field_name]", "node" : "DateOfBirthMonth" },
    { "input" : "veteran[field_name]", "node" : "DateOfBirthDay" },
    { "input" : "veteran[field_name]", "node" : "DateOfBirthYear" },
    { "input" : "veteran[field_name]", "node" : "PlaceOfBirthCity" },
    { "input" : "veteran[field_name]", "node" : "PlaceOfBirthState" },
    { "input" : "veteran[field_name]", "node" : "State" },
    { "input" : "veteran[field_name]", "node" : "MedCenterID" },
    { "input" : "veteran[field_name]", "node" : "StationStateList" },
    { "input" : "veteran[field_name]", "node" : "MedCenter" },
    { "input" : "veteran[field_name]", "node" : "pgDemoVisited" },
    { "input" : "veteran[field_name]", "node" : "Email2" },
    { "input" : "veteran[field_name]", "node" : "HIContrecordno" },
    { "input" : "veteran[field_name]", "node" : "VetHealthInsureCompany" },
    { "input" : "veteran[field_name]", "node" : "VetHealthInsureAddress" },
    { "input" : "veteran[field_name]", "node" : "VetHealthInsureCity" },
    { "input" : "veteran[field_name]", "node" : "VetHealthInsureCountry" },
    { "input" : "veteran[field_name]", "node" : "VetHealthInsureState" },
    { "input" : "veteran[field_name]", "node" : "VetHealthInsureZip" },
    { "input" : "veteran[field_name]", "node" : "VetHealthInsurePostalCode" },
    { "input" : "veteran[field_name]", "node" : "VetHealthInsurePhone" },
    { "input" : "veteran[field_name]", "node" : "VetHealthPolicyHolder" },
    { "input" : "veteran[field_name]", "node" : "VetHealthPolicyNumber" },
    { "input" : "veteran[field_name]", "node" : "VetHealthGroupCode" },
    { "input" : "veteran[field_name]", "node" : "DateMedicarePartAMonth" },
    { "input" : "veteran[field_name]", "node" : "DateMedicarePartADay" },
    { "input" : "veteran[field_name]", "node" : "DateMedicarePartAYear" },
    { "input" : "veteran[field_name]", "node" : "LastEntryDateMonth" },
    { "input" : "veteran[field_name]", "node" : "LastEntryDateDay" },
    { "input" : "veteran[field_name]", "node" : "LastEntryDateYear" },
    { "input" : "veteran[field_name]", "node" : "LastDischargeDateMonth" },
    { "input" : "veteran[field_name]", "node" : "LastDischargeDateDay" },
    { "input" : "veteran[field_name]", "node" : "LastDischargeDateYear" },
    { "input" : "veteran[field_name]", "node" : "pgAdditionalServiceVisited" },
    { "input" : "veteran[field_name]", "node" : "pgAdditionalServiceVisited" },
    { "input" : "veteran[field_name]", "node" : "SpouseNameLast" },
    { "input" : "veteran[field_name]", "node" : "SpouseNameFirst" },
    { "input" : "veteran[field_name]", "node" : "SpouseNameMiddle" },
    { "input" : "veteran[field_name]", "node" : "SpouseNameSuffix" },
    { "input" : "veteran[field_name]", "node" : "SpouseDateOfBirthMonth" },
    { "input" : "veteran[field_name]", "node" : "SpouseDateOfBirthDay" },
    { "input" : "veteran[field_name]", "node" : "SpouseDateOfBirthYear" },
    { "input" : "veteran[field_name]", "node" : "MarraigeDateMonth" },
    { "input" : "veteran[field_name]", "node" : "MarraigeDateDay" },
    { "input" : "veteran[field_name]", "node" : "MarraigeDateYear" },
    { "input" : "veteran[field_name]", "node" : "SpouseAddress" },
    { "input" : "veteran[field_name]", "node" : "SpouseCity" },
    { "input" : "veteran[field_name]", "node" : "SpouseCountry" },
    { "input" : "veteran[field_name]", "node" : "SpouseState" },
    { "input" : "veteran[field_name]", "node" : "SpouseZip" },
    { "input" : "veteran[field_name]", "node" : "SpousePostalCode" },
    { "input" : "veteran[field_name]", "node" : "SpousePhone" },
    { "input" : "veteran[field_name]", "node" : "CHContrecordno" },
    { "input" : "veteran[field_name]", "node" : "ChildNameLast" },
    { "input" : "veteran[field_name]", "node" : "ChildNameFirst" },
    { "input" : "veteran[field_name]", "node" : "ChildNameMiddle" },
    { "input" : "veteran[field_name]", "node" : "ChildNameSuffix" },
    { "input" : "veteran[field_name]", "node" : "ChildRelationshipSon" },
    { "input" : "veteran[field_name]", "node" : "ChildRelationshipDaughter" },
    { "input" : "veteran[field_name]", "node" : "ChildRelationshipStepson" },
    { "input" : "veteran[field_name]", "node" : "ChildRelationshipStepdaughter" },
    { "input" : "veteran[field_name]", "node" : "ChildSocialSecurityNumber" },
    { "input" : "veteran[field_name]", "node" : "ChildDependentDateMonth" },
    { "input" : "veteran[field_name]", "node" : "ChildDependentDateDay" },
    { "input" : "veteran[field_name]", "node" : "ChildDependentDateYear" },
    { "input" : "veteran[field_name]", "node" : "ChildDependentDate" },
    { "input" : "veteran[field_name]", "node" : "ChildDateOfBirthMonth" },
    { "input" : "veteran[field_name]", "node" : "ChildDateOfBirthDay" },
    { "input" : "veteran[field_name]", "node" : "ChildDateOfBirthYear" },
    { "input" : "veteran[field_name]", "node" : "ChildDateOfBirth" },
    { "input" : "veteran[field_name]", "node" : "ChildTotalDisabledYes" },
    { "input" : "veteran[field_name]", "node" : "ChildTotalDisabledNo" },
    { "input" : "veteran[field_name]", "node" : "ChildAttendSchoolYes" },
    { "input" : "veteran[field_name]", "node" : "ChildAttendSchoolNo" },
    { "input" : "veteran[field_name]", "node" : "ChildSelfSchool" },
    { "input" : "veteran[field_name]", "node" : "ChildSupportAmount" },
    { "input" : "veteran[field_name]", "node" : "ChildLive" },
    { "input" : "veteran[field_name]", "node" : "ChildLiveNo" },
    { "input" : "veteran[field_name]", "node" : "ChildProvideSupportYes" },
    { "input" : "veteran[field_name]", "node" : "ChildProvideSupportNo" },
    { "input" : "veteran[field_name]", "node" : "Child1GrossIncome" },
    { "input" : "veteran[field_name]", "node" : "Child1PropertyIncome" },
    { "input" : "veteran[field_name]", "node" : "Child1OtherIncome" },
    { "input" : "veteran[field_name]", "node" : "Child1BankCashAmount" },
    { "input" : "veteran[field_name]", "node" : "Child1LandMarketValue" },
    { "input" : "veteran[field_name]", "node" : "Child1OtherAssetNet" },
    { "input" : "veteran[field_name]", "node" : "tWelcome" },
    { "input" : "veteran[field_name]", "node" : "tPersonal" },
    { "input" : "veteran[field_name]", "node" : "tInsurance" },
    { "input" : "veteran[field_name]", "node" : "tService" },
    { "input" : "veteran[field_name]", "node" : "tFinancial" },
    { "input" : "veteran[field_name]", "node" : "pgFinalVisited" },
    { "input" : "veteran[field_name]", "node" : "Comments" },
    { "input" : "veteran[field_name]", "node" : "AttType0" },
    { "input" : "veteran[field_name]", "node" : "Single_Attach0" },
    { "input" : "veteran[field_name]", "node" : "AttType1" },
    { "input" : "veteran[field_name]", "node" : "Single_Attach1" },
    { "input" : "veteran[field_name]", "node" : "AttType2" },
    { "input" : "veteran[field_name]", "node" : "Single_Attach2" },
    { "input" : "veteran[field_name]", "node" : "AttType3" },
    { "input" : "veteran[field_name]", "node" : "Single_Attach3" },
    { "input" : "veteran[field_name]", "node" : "viewerType" },
    { "input" : "veteran[field_name]", "node" : "viewerVersion" },
    { "input" : "veteran[field_name]", "node" : "formVersion" },
    { "input" : "veteran[field_name]", "node" : "place_birth" },
    { "input" : "veteran[field_name]", "node" : "MedCenterText" },
    { "input" : "veteran[field_name]", "node" : "Path" },
    { "input" : "veteran[field_name]", "node" : "MotherMaidenName" },
    { "input" : "veteran[field_name]", "node" : "CurrentMaritalStatus" },
    { "input" : "veteran[field_name]", "node" : "TargetURL" },
    { "input" : "veteran[field_name]", "node" : "Q1" },
    { "input" : "veteran[field_name]", "node" : "Q2" },
    { "input" : "veteran[field_name]", "node" : "Q3" },
    { "input" : "veteran[field_name]", "node" : "ACA" },
    { "input" : "veteran[field_name]", "node" : "Appointment" },
    { "input" : "veteran[field_name]", "node" : "Spanish" },
    { "input" : "veteran[field_name]", "node" : "Race1" },
    { "input" : "veteran[field_name]", "node" : "Race2" },
    { "input" : "veteran[field_name]", "node" : "Race5" },
    { "input" : "veteran[field_name]", "node" : "Race3" },
    { "input" : "veteran[field_name]", "node" : "Race4" },
    { "input" : "veteran[field_name]", "node" : "ReligionList" },
    { "input" : "veteran[field_name]", "node" : "CurrentAddress" },
    { "input" : "veteran[field_name]", "node" : "CurrentCity" },
    { "input" : "veteran[field_name]", "node" : "CurrentCountry" },
    { "input" : "veteran[field_name]", "node" : "CurrentState" },
    { "input" : "veteran[field_name]", "node" : "CurrentZip" },
    { "input" : "veteran[field_name]", "node" : "CurrentPostalCode" },
    { "input" : "veteran[field_name]", "node" : "CurrentCounty" },
    { "input" : "veteran[field_name]", "node" : "Email" },
    { "input" : "veteran[field_name]", "node" : "CurrentHomePhone" },
    { "input" : "veteran[field_name]", "node" : "CellPhone" },
    { "input" : "veteran[field_name]", "node" : "VetHealthInsurance" },
    { "input" : "veteran[field_name]", "node" : "MedicaidEligible" },
    { "input" : "veteran[field_name]", "node" : "MedicareEnrolledA" },
    { "input" : "veteran[field_name]", "node" : "DateMedicarePartA" },
    { "input" : "veteran[field_name]", "node" : "LastServiceBranch" },
    { "input" : "veteran[field_name]", "node" : "LastEntryDate" },
    { "input" : "veteran[field_name]", "node" : "LastDischargeDate" },
    { "input" : "veteran[field_name]", "node" : "DischargeType" },
    { "input" : "veteran[field_name]", "node" : "MilitaryServiceNumber" },
    { "input" : "veteran[field_name]", "node" : "PurpleHeart" },
    { "input" : "veteran[field_name]", "node" : "FormerPOW" },
    { "input" : "veteran[field_name]", "node" : "TheaterOperation" },
    { "input" : "veteran[field_name]", "node" : "RetiredMilitaryDisability" },
    { "input" : "veteran[field_name]", "node" : "GulfWarToxinExposure" },
    { "input" : "veteran[field_name]", "node" : "AgentOrangeExposure" },
    { "input" : "veteran[field_name]", "node" : "RadiationExposure" },
    { "input" : "veteran[field_name]", "node" : "MilitaryRadiumTreatments" },
    { "input" : "veteran[field_name]", "node" : "CampLejeune" },
    { "input" : "veteran[field_name]", "node" : "ProvideDetails" },
    { "input" : "veteran[field_name]", "node" : "ConfirmProvideDetails" },
    { "input" : "veteran[field_name]", "node" : "SpouseSocialSecurityNumber" },
    { "input" : "veteran[field_name]", "node" : "SpouseDateOfBirth" },
    { "input" : "veteran[field_name]", "node" : "MarraigeDate" },
    { "input" : "veteran[field_name]", "node" : "SpouseSame" },
    { "input" : "veteran[field_name]", "node" : "SpouseSupportAmount" },
    { "input" : "veteran[field_name]", "node" : "SpouseLive" },
    { "input" : "veteran[field_name]", "node" : "SpouseProvideSupport" },
    { "input" : "veteran[field_name]", "node" : "ReportChildren" },
    { "input" : "veteran[field_name]", "node" : "ProvideSupport" },
    { "input" : "veteran[field_name]", "node" : "VetGrossIncome" },
    { "input" : "veteran[field_name]", "node" : "VetPropertyIncome" },
    { "input" : "veteran[field_name]", "node" : "VetOtherIncome" },
    { "input" : "veteran[field_name]", "node" : "SpouseGrossIncome" },
    { "input" : "veteran[field_name]", "node" : "SpousePropertyIncome" },
    { "input" : "veteran[field_name]", "node" : "SpouseOtherIncome" },
    { "input" : "veteran[field_name]", "node" : "MedicalExpenses" },
    { "input" : "veteran[field_name]", "node" : "FuneralExpenses" },
    { "input" : "veteran[field_name]", "node" : "VetSelfSchool" },
    { "input" : "veteran[field_name]", "node" : "VetBankCashAmount" },
    { "input" : "veteran[field_name]", "node" : "VetLandMarketValue" },
    { "input" : "veteran[field_name]", "node" : "VetOtherAssetNet" },
    { "input" : "veteran[field_name]", "node" : "SpouseBankCashAmount" },
    { "input" : "veteran[field_name]", "node" : "SpouseLandMarketValue" },
    { "input" : "veteran[field_name]", "node" : "SpouseOtherAssetNet" },
    { "input" : "veteran[field_name]", "node" : "Confirm" },
    { "input" : "veteran[field_name]", "node" : "pg1VetName" },
    { "input" : "veteran[field_name]", "node" : "OtherName1" },
    { "input" : "veteran[field_name]", "node" : "ClaimNumber" },
    { "input" : "veteran[field_name]", "node" : "HEALTH_SERVICES" },
    { "input" : "veteran[field_name]", "node" : "DENTAL" },
    { "input" : "veteran[field_name]", "node" : "health_insurance" },
    { "input" : "veteran[field_name]", "node" : "FVetHealthPolicyHolder" },
    { "input" : "veteran[field_name]", "node" : "FVetHealthPolicyNumber" },
    { "input" : "veteran[field_name]", "node" : "FVetHealthGroupCode" },
    { "input" : "veteran[field_name]", "node" : "ReceiveDisabilityRetirement" },
    { "input" : "veteran[field_name]", "node" : "Fchild_name1" },
    { "input" : "veteran[field_name]", "node" : "FChild1RelationshipSon" },
    { "input" : "veteran[field_name]", "node" : "FChild1RelationshipDaughter" },
    { "input" : "veteran[field_name]", "node" : "FChild1RelationshipStepson" },
    { "input" : "veteran[field_name]", "node" : "FChild1RelationshipStepdaughter" },
    { "input" : "veteran[field_name]", "node" : "FChild1DependentDate" },
    { "input" : "veteran[field_name]", "node" : "FChild1DateOfBirth" },
    { "input" : "veteran[field_name]", "node" : "FChild1TotalDisabledYes" },
    { "input" : "veteran[field_name]", "node" : "FChild1TotalDisabledNo" },
    { "input" : "veteran[field_name]", "node" : "FChild1AttendSchoolYes" },
    { "input" : "veteran[field_name]", "node" : "FChild1AttendSchoolNo" },
    { "input" : "veteran[field_name]", "node" : "FChild1SelfSchool" },
    { "input" : "veteran[field_name]", "node" : "spouse_name" },
    { "input" : "veteran[field_name]", "node" : "spouse_address" },
    { "input" : "veteran[field_name]", "node" : "FChild1SocialSecurityNumber" },
    { "input" : "veteran[field_name]", "node" : "FChild1GrossIncome" },
    { "input" : "veteran[field_name]", "node" : "FChild1PropertyIncome" },
    { "input" : "veteran[field_name]", "node" : "FChild1OtherIncome" },
    { "input" : "veteran[field_name]", "node" : "FChild1BankCashAmount" },
    { "input" : "veteran[field_name]", "node" : "FChild1LandMarketValue" },
    { "input" : "veteran[field_name]", "node" : "FChild1OtherAssetNet" },
    { "input" : "veteran[field_name]", "node" : "TextField" }
  ];

  var getFormRoot = function() {
    return document.querySelector(".main-form");
  };

  var saveForm = function(formRoot, e) {
    window.localStorage["voa_form"] = JSON.stringify($(formRoot).serializeArray());
  };

  var initForm = function() {
    var formRoot = getFormRoot();
    var savedValues = JSON.parse(window.localStorage["voa_form"]);
    var numValues = savedValues.length;
    for (var i = 0; i < numValues; i++) {
      var saved = savedValues[i];
      var allInput = $('[name="' + saved.name + '"]').not(":hidden");
      // TODO(awong): Continue if none found.
      switch (allInput[0].type) {
        case "checkbox":
          allInput[0].checked = parseInt(saved.value);
          break;

        case "radio": // TODO(awong): Test this one.
          break;

        case "select-one":
        case "select-multiple":
          break;

        default:
          allInput.val(saved.value);
      }
    }
    formRoot.addEventListener("submit",
        function (e) {
          e.preventDefault();
          console.log(build1010ezXml(formRoot));
        });
    getFormRoot().addEventListener("change",
        function (e) {
          saveForm(formRoot, e);
        });
  };

  var builtXmlDoc; // DELETE ME
  var builtXmlDocStr; // DELETE ME
  var build1010ezXml = function(theForm) {
    var formData = $(theForm).serializeObject();
    var xmlDoc = document.implementation.createDocument(null, "form1");

    for (var i = 0; i < xmlFieldMap.length; i++) {
      var entry = xmlFieldMap[i];
      var element = xmlDoc.createElement(entry["node"]);
      if (entry["input"] != null) {
        element.appendChild(xmlDoc.createTextNode(formData[entry["input"]]));
      }
      xmlDoc.firstChild.appendChild(element);
    }

    //////// DELETE THIS vvvvv
    builtXmlDoc = xmlDoc;
    var serializer = new XMLSerializer();
    builtXmlDocStr = serializer.serializeToString(xmlDoc);
    //////// DELETE THIS ^^^^


    return builtXmlDocStr;
  }

  return {
    xmlFieldMap: xmlFieldMap,
    getFormRoot: getFormRoot,
    saveForm: saveForm,
    build1010ezXml: build1010ezXml,
    initForm: initForm,

    // TO REMOVE.
    builtXmlDoc: builtXmlDoc,
    builtXmlDocStr: builtXmlDocStr,
  };
}());
$(document).ready(HealthApp.initForm);
