# Markup Copied from Developer Tools Element's Tab

## Before
```html
<div class="additional-evidence-container">
  <div class="add-files-form">
    <va-file-input
      id="file-upload"
      label="Upload additional evidence"
      hint="You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."
      accept=".pdf,.gif,.jpeg,.jpg,.bmp,.txt"
      name="fileUpload"
      additional-error-class="claims-upload-input-error-message"
      aria-describedby="file-requirements"
      class="vads-u-margin-bottom--3 hydrated">
    </va-file-input>
  </div>
  <va-button id="submit" text="Submit documents for review" uswds="" class="hydrated"></va-button>
  <va-modal id="remove-file" modal-title="Remove this file?" primary-button-text="Yes, remove this"
    secondary-button-text="No, keep this" visible="false" status="warning" class="hydrated">
    <p>We’ll remove <strong data-dd-privacy="mask" data-dd-action-name="file to be removed"></strong></p>
  </va-modal>
  <va-modal id="upload-status" visible="false" class="hydrated">
    <div>
      <div class="claims-status-upload-header" id="upload-status-title">Uploading files</div>
      <div>
        <h4>Uploading 0 files...</h4><va-progress-bar percent="0" class="hydrated"></va-progress-bar>
        <p>Your files are uploading. Please do not close this window.</p><va-button secondary="" text="Cancel" uswds=""
          class="hydrated"></va-button>
      </div>
    </div>
  </va-modal>
</div>
```

## After
```html
<va-file-input-multiple
  accept=".pdf,.gif,.jpeg,.jpg,.bmp,.txt"
  error=""
  hint="You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."
  label="Upload additional evidence"
  class="hydrated"
>
  <va-select
    label="What type of document is this?"
    required="true"
    class="hydrated"
  >
    <option value="L014">Birth Certificate</option>
    <option value="L029">Copy of a DD214</option>
    <option value="L418">Court papers / documents</option>
  </va-select>
</va-file-input-multiple>
```