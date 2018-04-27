|-- src
    |-- forms
    |   |-- address.js
    |   |-- fields.js
    |   |-- helpers.js
    |   |-- validations.js
    |   |-- components
    |   |   |-- PrivacyAgreement.jsx
    |   |   |-- SignInLink.jsx
    |   |-- sass
    |   |   |-- _m-applications.scss
    |   |   |-- _m-form-confirmation.scss
    |   |   |-- _m-schemaform.scss
    |   |-- tests
    |       |-- fields.unit.spec.js
    |       |-- helpers.unit.spec.js
    |       |-- migrations.unit.spec.js
    |       |-- validations.unit.spec.js
    |       |-- components
    |       |   |-- SignInLink.unit.spec.jsx
    |       |-- save-in-progress
    |           |-- 01-sip-autosave.e2e.spec.js
    |           |-- 01-sip-finish-later.e2e.spec.js
    |           |-- 01-sip-load-fail.e2e.spec.js
    |           |-- 01-sip-review.e2e.spec.js
    |-- monitoring
    |   |-- RateLimiter.jsx
    |   |-- record-event.js
    |   |-- sentry.js
    |   |-- DowntimeNotification
    |   |   |-- actions.js
    |   |   |-- index.jsx
    |   |   |-- reducer.js
    |   |   |-- sass
    |   |   |   |-- _m-downtime-notification.scss
    |   |   |-- tests
    |   |       |-- DowntimeNotification.e2e.spec.js
    |   |       |-- DowntimeNotification.unit.spec.jsx
    |   |       |-- actions.unit.spec.js
    |   |       |-- index.unit.spec.js
    |   |-- tests
    |       |-- RateLimiter.unit.spec.jsx
    |-- polyfills
    |   |-- canvas-toBlob.js
    |   |-- index.js
    |-- site-wide
    |   |-- accessible-VCL-modal.js
    |   |-- accessible-menus.js
    |   |-- index.js
    |   |-- usa-banner-toggle.js
    |   |-- feedback
    |   |   |-- index.js
    |   |   |-- actions
    |   |   |   |-- index.js
    |   |   |-- components
    |   |   |   |-- DefaultView.jsx
    |   |   |   |-- FeedbackForm.jsx
    |   |   |   |-- FeedbackSubmitted.jsx
    |   |   |-- containers
    |   |   |   |-- Main.jsx
    |   |   |-- reducers
    |   |   |   |-- index.js
    |   |   |-- tests
    |   |       |-- feedback.e2e.spec.js
    |   |       |-- actions
    |   |       |   |-- feedback.unit.spec.js
    |   |       |-- components
    |   |       |   |-- DefaultView.unit.spec.jsx
    |   |       |   |-- FeedbackForm.unit.spec.jsx
    |   |       |   |-- FeedbackSubmitted.unit.spec.jsx
    |   |       |-- containers
    |   |       |   |-- Main.unit.spec.jsx
    |   |       |-- reducers
    |   |           |-- feedback.unit.spec.js
    |   |-- legacy
    |   |   |-- mega-menu.js
    |   |   |-- menu.js
    |   |-- sass
    |   |   |-- style.scss
    |   |   |-- modules
    |   |       |-- _m-crisis-line.scss
    |   |       |-- _m-footer.scss
    |   |       |-- _m-search.scss
    |   |       |-- _m-vet-nav.scss
    |   |-- tests
    |   |   |-- accessible-menus.e2e.spec.js
    |   |   |-- accessible-modal.e2e.spec.js
    |   |   |-- sanity-check
    |   |   |   |-- smoke-test.e2e.spec.js
    |   |   |   |-- smoke-test.unit.spec.js
    |   |   |-- sitemap
    |   |       |-- sample.spec.js
    |   |       |-- sitemap-1.spec.js
    |   |       |-- sitemap-2.spec.js
    |   |       |-- sitemap-3.spec.js
    |   |       |-- sitemap-4.spec.js
    |   |       |-- sitemap-helpers.js
    |   |-- user-nav
    |       |-- index.js
    |       |-- components
    |       |   |-- BetaDropdown.jsx
    |       |   |-- HelpMenu.jsx
    |       |   |-- SearchHelpSignIn.jsx
    |       |   |-- SearchMenu.jsx
    |       |   |-- SignInModal.jsx
    |       |   |-- SignInProfileMenu.jsx
    |       |-- containers
    |       |   |-- Main.jsx
    |       |-- sass
    |       |   |-- login.scss
    |       |-- tests
    |           |-- user-nav.e2e.spec.js
    |           |-- components
    |           |   |-- HelpMenu.unit.spec.jsx
    |           |   |-- SearchHelpSignIn.unit.spec.jsx
    |           |   |-- SearchMenu.unit.spec.jsx
    |           |-- containers
    |               |-- Main.unit.spec.jsx
    |-- startup
    |   |-- index.js
    |   |-- moment-setup.js
    |   |-- react.js
    |   |-- store.js
    |-- static-data
    |   |-- error-messages.jsx
    |   |-- labels.jsx
    |   |-- options-for-select.js
    |-- testing
    |   |-- e2e
    |   |   |-- account-creation-helpers.js
    |   |   |-- auth.js
    |   |   |-- helpers.js
    |   |   |-- mock-helpers.js
    |   |   |-- mockapi.js
    |   |   |-- test-server.js
    |   |   |-- timeouts.js
    |   |   |-- nightwatch-assertions
    |   |   |   |-- isActiveElement.js
    |   |   |-- nightwatch-commands
    |   |       |-- axeCheck.js
    |   |       |-- checkActiveElement.js
    |   |       |-- clearElement.js
    |   |       |-- clickIf.js
    |   |       |-- fill.js
    |   |       |-- fillAddress.js
    |   |       |-- fillCheckbox.js
    |   |       |-- fillCheckboxIf.js
    |   |       |-- fillDate.js
    |   |       |-- fillMonthYear.js
    |   |       |-- fillName.js
    |   |       |-- focusOn.js
    |   |       |-- log.js
    |   |       |-- mockData.js
    |   |       |-- printLogs.js
    |   |       |-- removeText.js
    |   |       |-- selectDropdown.js
    |   |       |-- selectDropdown.js.orig
    |   |       |-- selectRadio.js
    |   |       |-- selectYesNo.js
    |   |       |-- selectYesNo.js.orig
    |   |-- unit
    |   |   |-- enzyme-setup.js
    |   |   |-- helper.js
    |   |   |-- helpers.js
    |   |   |-- mocha-setup.js
    |   |   |-- mocha.opts
    |   |   |-- schemaform-utils.jsx
    |   |-- visual-regression
    |       |-- index.js
    |       |-- util
    |           |-- calculate-diff.js
    |           |-- create-baseline-image.js
    |           |-- get-file-names.js
    |-- user
    |   |-- authorization
    |   |   |-- components
    |   |   |   |-- AcceptTermsPrompt.jsx
    |   |   |   |-- RequiredLoginView.jsx
    |   |   |-- containers
    |   |       |-- MHVApp.jsx
    |   |       |-- RequiredTermsAcceptanceView.jsx
    |   |-- login
    |   |   |-- utilities.js
    |   |   |-- actions
    |   |   |   |-- index.js
    |   |   |-- reducers
    |   |       |-- index.js
    |   |-- profile
    |   |   |-- actions
    |   |   |   |-- index.js
    |   |   |   |-- mhv.js
    |   |   |-- reducers
    |   |       |-- index.js
    |   |-- tests
    |       |-- unauthed-flows.e2e.spec.js
    |       |-- authorization
    |       |   |-- components
    |       |   |   |-- AcceptTermsPrompt.unit.spec.jsx
    |       |   |   |-- RequiredLoginView.unit.spec.jsx
    |       |   |-- containers
    |       |       |-- MHVApp.unit.spec.jsx
    |       |       |-- RequiredTermsAcceptance.unit.spec.jsx
    |       |-- profile
    |           |-- reducers
    |               |-- profile.unit.spec.js
    |-- utilities
        |-- fuzzy-matching.js
        |-- accessibility
        |   |-- index.js
        |-- api
        |   |-- index.js
        |-- data
        |   |-- checkValidPath.js
        |   |-- clone.js
        |   |-- cloneDeep.js
        |   |-- deconstructPath.js
        |   |-- get.js
        |   |-- index.js
        |   |-- omit.js
        |   |-- set.js
        |-- date
        |   |-- index.js
        |-- environment
        |   |-- index.js
        |-- tests
        |   |-- authentication.unit.spec.js
        |   |-- data.unit.spec.js
        |   |-- date.unit.spec.js
        |   |-- accessibility
        |   |-- ui
        |       |-- asyncLoader.unit.spec.jsx
        |-- ui
            |-- asyncLoader.jsx
            |-- index.js
