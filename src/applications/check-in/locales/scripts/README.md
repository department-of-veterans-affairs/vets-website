# **Updating Translation Files with `update-translation.js`**

The `update-translation.js` script updates translation files using new translations provided by **DSVA**. Follow the steps below to update translations efficiently.

---

## **Steps to Update Translations**

### **1. Add New Translation Files**  
Place the new translation JSON files inside the `input-files` folder.

### **2. Rename Files to Match the Language Code**  
Ensure each file is named according to the corresponding language code. Supported language codes:  
- `en` (English)  
- `es` (Spanish)  
- `tl` (Tagalog)  

If you need to add a new language, make sure to update the script to include the new language in the list of supported languages.

#### **Example:**
```
input-files/
  ├── en.json
  ├── es.json
  ├── tl.json
```

### **3. Run the Update Command**  
Execute the following command to update the translations:

```sh
yarn workspace @department-of-veterans-affairs/applications-check-in update:translations
```

### **4. Script Behavior**  
- The script will **merge** the new translations with the existing ones.  
- It will **overwrite** existing keys with updated values from the new files.  
- The final translation files will be **sorted alphabetically** for consistency.  
- After the update, **delete the files** you added to the `input-files` folder to keep it clean.  

---

## **Example Workflow**
1. You receive updated translations from DSVA.
2. You save them in `input-files/` with the correct language file names.
3. You run the script.
4. The existing translation files are updated and sorted.
5. You **delete the new translation files** from the `input-files` folder.

---
