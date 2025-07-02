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

## After (NOTE: This is incomplete and should just be looked at for reference not as a source of truth)
```html
<va-file-input-multiple
  accept=".pdf,.gif,.jpeg,.jpg,.bmp,.txt"
  error=""
  hint="You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."
  label="Upload additional evidence"
  class="hydrated"
>
#shadow-root
<div class="label-header"><span part="label" class="usa-label">Upload additional evidence</span></div>
<div class="usa-hint" id="input-hint-message">You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only).</div>
<div class="outer-wrap"><div class="usa-sr-only" aria-live="polite" id="statusMessage"></div><div class="selected-files-label">Selected files</div><va-file-input class="hydrated has-file"></va-file-input><va-file-input class="no-file hydrated">
#shadow-root
<span class="usa-sr-only"><div class="label-header"><label for="fileInputField" part="label" class="usa-label">Upload additional evidence</label></div></span>
<div class="usa-hint usa-sr-only" id="input-hint-message">You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only).</div>
  <div class="file-input-wrapper"><input id="fileInputField" class="file-input" aria-label="Upload additional evidence. Drag a file here or choose from folder" type="file" name="undefined-0" aria-describedby="input-hint-message" style="visibility: hidden;"><div class="headless-selected-files-wrapper"><div class="usa-sr-only" aria-live="polite" id="statusMessage">You have selected the file: 12-2024 Benefits Portfolio Product All Hands.pdf</div><va-card class="va-card hydrated"><div class="file-info-section"><div class="thumbnail-container" aria-hidden="true"><object class="thumbnail-preview" data="data:application/pdf;base64,[really long string]" type="application/pdf"></object></div><div class="file-info-group vads-u-line-height--2"><span class="file-label">12-2024 Benefits Portfolio Product All Hands.pdf</span><span id="input-error-message" role="alert"><span class="usa-sr-only">Error</span><span aria-live="polite" class="usa-error-message">Please provide a password to decrypt this file</span></span><span class="file-size-label">982&nbsp;KB</span><span class="file-status-label" aria-live="polite"></span></div></div><div><hr class="separator"><va-text-input show-input-error="" class="hydrated"></va-text-input><div class="additional-info-slot"><slot></slot></div><div class="file-button-section"><va-button-icon aria-label="change file 12-2024 Benefits Portfolio Product All Hands.pdf" class="hydrated"></va-button-icon><va-button-icon aria-label="delete file 12-2024 Benefits Portfolio Product All Hands.pdf" class="hydrated"></va-button-icon></div><va-modal class="hydrated">We'll remove the uploaded document <span class="file-label">12-2024 Benefits Portfolio Product All Hands.pdf</span></va-modal></div></va-card></div></div>
  </va-file-input></div>
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