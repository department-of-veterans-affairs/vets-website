## Updated the ZenHub/GitHub Issue

This content is captured in the ticket that's tracking this work. **This file is no longer needed.**

- [https://github.com/department-of-veterans-affairs/ask-va/issues/1325](https://github.com/department-of-veterans-affairs/ask-va/issues/1325)

## Raw Notes from Dev Meeting

Testing the objects. (The question popsup, radio buttons are there. ...)

Was doing it by chapters, but may want to reorg now.

Killed SelectCat/Top/Sub old jsx

Missing Pages (tests/config/personalInformation):
  * aboutYourselfGeneral
  * aboutYourselfRelationshipFamilyMember
  * isQuestionAboutVeteranOrSomeoneElse
  * relationshipToFamilyMember
  * searchSchools (may end up being a unit (vs config) test??--page is collection of components - renderrs educationFacilitySearch component as a widget [use of widget is deprecated, should be a custom page thing])
  * yourVAHealthFacility (renders the yourVAHealthFacility component)
  * theirRelationshipToTheVeteran
  * yourPersonalInformation
  * yourRole
  * yourRoleEducation

Missing Pages (tests/config/yourQuestion):
  * RENAME questionAbout to whoIsYourQuestionAbout
  * DELETE whoHasAQuestion
  * 

Missing Pages (tests/config/schema-helpers):
  * addressHelper
  * personalInformationHelper
  * 

Missing Pages (tests/config):
  * helpers.jsx

Missing Components (tests/unit/components):
  * CatAndTopicSummary
  * CustomPageReviewField
  * CustomPersonalInformationReviewField
  * CustomYourQuestionReviewField
  * EducationFacilitySearch
  * FormElementTitle
  * DO NOT TEST MapBoxClient ??
  * MedicalFacilitySearch
  * PrefillAlertAndTitle
  * ProfileLink
  * RequireSignInModal
  * ReviewCollapsableChapter
  * SigninMayBeRequiredCategoryPage
  * SigninMayBeRequired
  * YourPersonalInformationAuthenticated

Missing Components (tests/unit/components/formFields):
  * addressValidationRadio
  * countrySelect
  * stateSelect
  * yourSchool

Missing Components (tests/unit/components/search):
  * educationSearchItem
  * searchControls
  * searchItem

Missing Components (tests/unit/containers):
  * ReviewPage
  * YourVAHealthFacility
  * 

Missing Components (tests/actions):
  * index
  * geoLocateUser
  * 

