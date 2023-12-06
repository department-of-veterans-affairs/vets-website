# Caregivers 10-10CG

## Description

Mission: Make it easier for Veterans and Caregivers to apply for, track, and manage care-related benefits.

## Slack Channels

- [1010-health-apps](https://slack.com/app_redirect?channel=CMJ2V70UV)

## Approval Groups

- [1010 Health Apps](https://github.com/orgs/department-of-veterans-affairs/teams/1010-health-apps-frontend)

## Project Documentation

- [UX Pin](https://preview.uxpin.com/3bf6496017f55041a94c2cfc8009c35dad5a79f2#/pages/137666459/simulate/sitemap?mode=i)
- [Sketch](https://www.sketch.com/s/5a676881-7aa8-4054-9b6e-34d86ced43d8)
- [Content Source or Truth](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/caregivers/1010cg-mvp/10-10CG-application-copy.md)
- [Project Documents](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/caregivers)
- [Product Outline](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/teams/vsa/teams/caregiver/product-outline.md)
- [Product Guide](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/teams/vsa/teams/caregiver/Online-10-10CG-Product-Guide-Updated-05.26.2021.docx)
- [Submission Process](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/caregivers/ux-capture/future.md)

## Good to knows

### Project URLS

``` markdown
/family-member-benefits/apply-for-caregiver-assistance-form-10-10cg/introduction
```

### How to run locally

Follow the standard directions to run the app. The API needs to be running in order to run the app locally.

### Where is the data goin?

The data is going to a system called CARMA (Caregiver Record Management Application).

### VA Forms

We are using version 1 of the forms library, Formation. This is a straight forward standard form. We are using [the vets-json-scheam](https://github.com/department-of-veterans-affairs/vets-json-schema) to validate the shape of the data.  

### What API(s) does this use?

This uses the Caregivers API, the main controller is [here](https://github.com/department-of-veterans-affairs/vets-api/blob/master/app/controllers/v0/caregivers_assistance_claims_controller.rb).

### How to test new features?

Currently, there are no lower environments for CARMA. We are currently working through that problem.

Each feature should have unit tests and e2e tests. Since this is an unauthenticated form, we use teh Review Instances to review before merging a PR.

### Useful CARMA integrations Slack Channel

<https://github.com/department-of-veterans-affairs/devops/blob/master/docs/External%20Service%20Integrations/CARMA.md#logging-and-stats>

### Useful acronym and terms

- CARMA (Caregiver Record Management Application).

### Instructions to upload a document, running va.gov locally
* change the following rails file - app/uploaders/form1010cg/poa_uploader.rb
* restart vets-api
* file will be uploaded to public directory under vets-api source code

```
diff --git a/app/uploaders/form1010cg/poa_uploader.rb b/app/uploaders/form1010cg/poa_uploader.rb
index 28ce0a625..c3d81d8f4 100644
--- a/app/uploaders/form1010cg/poa_uploader.rb
+++ b/app/uploaders/form1010cg/poa_uploader.rb
@@ -2,23 +2,23 @@
 
 module Form1010cg
   class PoaUploader < CarrierWave::Uploader::Base
-    include SetAWSConfig
+    # include SetAWSConfig
     include LogMetrics
     include UploaderVirusScan
 
-    storage :aws
+    # storage :aws
 
     attr_reader :store_dir
 
     def initialize(form_attachment_guid)
       super
 
-      set_aws_config(
-        Settings.form_10_10cg.poa.s3.aws_access_key_id,
-        Settings.form_10_10cg.poa.s3.aws_secret_access_key,
-        Settings.form_10_10cg.poa.s3.region,
-        Settings.form_10_10cg.poa.s3.bucket
-      )
+      # set_aws_config(
+      #   Settings.form_10_10cg.poa.s3.aws_access_key_id,
+      #   Settings.form_10_10cg.poa.s3.aws_secret_access_key,
+      #   Settings.form_10_10cg.poa.s3.region,
+      #   Settings.form_10_10cg.poa.s3.bucket
+      # )
 
       @store_dir = form_attachment_guid
     end 
```

