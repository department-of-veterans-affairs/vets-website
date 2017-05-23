# How to Start a New ReactJS Project


1. Create a directory for your project inside of `vets-website/src/js/`. 
2. Create an entry file for your project directory using the project name to prefix the filename: `vets-website/src/js/[project-name]/[project-name]-entry.jsx`. Example: `vets-website/src/js/edu-benefits/edu-benefits-entry.jsx`.
3. Add the entry to `vets-website/config/webpack.config.js`.
4. Create a directory and a `.md` file inside of `vets-website/content/pages/` for your project that corresponds to the url where your app will live. (example: The education benefits app will be in the `education/apply-for-education-benefits/application.md` file and the url will be `http://www.vets.gov/education/apply-for-education-benefits/application`)
5. In the frontmatter of that `.md`, make sure you are using the react layout (example: `layout: page-react.html`) and add the project entryname (example: `entryname: edu-benefits`).
6. If you are not ready to push the app to production, add your `.md` file to `ignoreList` in `build.js`. (example: `ignoreList.push('education/apply-for-education-benefits/application.md');`)
