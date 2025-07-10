## User Stories

As a user,

- [X] 1. I see a label with a hint with the allowed file types and size
    - Label: "Upload additional evidence"
    - Hint: "You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."
- [X] 2. I see the file input with instructions on how to add a file
    - Instructions: "Drag a file here or choose from folder"
- [X] 3. I can add multiple files to the file input by clicking the link
    - Link label: "Choose from folder"
    - Note: Cannot add multiple files at once
- [X] 4. I can add multiple files to the file input by dragging the files into the file input
- [X] 5. If I don't add any files and click submit, I will see an error
    - Error: "Please select a file first"
- [X] 6. If I add an encrypted file, the component will show a password input
    - NOT FEASIBLE - Instructions: "This is an encrypted PDF document. In order for us to be able to view the document, we will need the password to decrypt it." - **Cannot pass instructions above the password input since it is generated through a simple encryption prop which is an array of booleans**
    - SAME WORDING NOT FEASIBLE - Label: PDF password (*Required) **Hardcoded in web component to be "File password (*Required)**
- [X] 7. If I add an encrypted file without inputting a password, I will see an error
    - Error: "Please provide a password to decrypt this file"
- [X] 8. If I add another file while I have an existing validation error, the validation error will persist
- [X] 9. If I add a password after getting a no password error, that error will disappear
- [X] 10. If I add a file, a select field will be shown requesting the type of document
    - Label: "What type of document is this? (*Required)"
    - Example types: Birth Certificate, Death Certificate
- [X] 11. If I try to submit a file without selecting a type of document, I will see an error
    - Error: "Please provide a response"
- [X] 12. If I select a type of document after getting the validation error, that error will disappear
Data Tracking Check: If I upload multiple files with passwords and document types, all data should be tracked correctly
- [X] 13. If I add a file in which the file extension does not match the file format, I will see an error
    - Error: "The file extension doesn’t match the file format. Please choose a different file."
- [X] 14. If I try to add a file that is not one of the valid file types (.pdf, .gif, etc), I will see an error
    - Error: "Please choose a file from one of the accepted types."
    - Accepted types: [.pdf, .gif, .jpg, .jpeg, .bmp, .txt]
- [ ] NEED TO MANUAL TEST 15. If I try to add a pdf that is above 99MB or a non-pdf that is above 50MB, I will see an error
    - Note: Code says 99MB max for PDF while the hint says 150MB
    - Error: "The file you selected is larger than the [99 or 150]MB maximum file size and could not be added."
- [X] 16. If I try to add a file that is 0MB, I will see an error
    - Error: "The file you selected is empty. Files uploaded must be larger than 0B."
- [X] 17. If I click Remove, I will be shown a confirm remove modal with confirm or cancel buttons
    - Heading: "Delete this file?"
    - Description: "We'll remove the uploaded document
[file name]"
    - Confirm Button Text: "Yes, remove this"
    - Cancel Button Text: "No, keep this"
- [X] 18. If I delete a file, the other files will retain their correct data
- [X] 19. If I add files that pass all validation errors, I am able to click the submit button
    - Button Text: "Submit documents for review"
- [X] 20. If I submit files, I will be shown an uploading modal with a submission progress bar
    - Heading: "Uploading files"
    - Count: "Uploading 1 file..."
    - Text: "Your files are uploading. Please do not close this window."
    - Cancel Button Text: "Cancel"
- [ ] 21. If I submit a PDF without a valid password I get an error alert
    - Heading: "Error uploading [file name]"
    - Text: "We couldn’t unlock your PDF. Save the PDF without a password and try again."
- [ ] 22. If I successfully submit files a success va-alert will be shown
    - Heading: "We received your file upload on [date]"
    - Text: "If your uploaded file doesn’t appear in the Documents Filed section on this page, please try refreshing the page."