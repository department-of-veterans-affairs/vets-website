# How to Start a New ReactJS Project

## Approach 1: Yeoman generator

Follow the [instructions for running the generators](https://github.com/department-of-veterans-affairs/vets-website/blob/master/docs/GeneratorOptions.md).

Generator code is located at https://github.com/department-of-veterans-affairs/generator-vets-website.

## Approach 2: Manually add files and folder

1. Create a directory for your project inside of `vets-website/src/js/`. 
2. Create an entry file for your project directory using the project name to prefix the filename: `vets-website/src/js/[project-name]/[project-name]-entry.jsx`. Example: `vets-website/src/js/edu-benefits/edu-benefits-entry.jsx`.
3. Create a manifest.json file with the information for your app. See the section below for details.
4. Create a directory and a `.md` file inside of `vets-website/content/pages/` for your project that corresponds to the url where your app will live. (example: The education benefits app will be in the `education/apply-for-education-benefits/application.md` file and the url will be `http://www.vets.gov/education/apply-for-education-benefits/application`)
5. In the frontmatter of that `.md`, make sure you are using the react layout (example: `layout: page-react.html`) and add the project entryname (example: `entryname: edu-benefits`).

## Application manifest

The build process looks for manifest.json files in order to determine what applications to build. You should create this file in the root directory of your application in `src/js`. There are several properties that you need to add to the file:

- `appName`: The name of the application. This is currently only used for display purposes locally.
- `entryFile`: The path to the entry file created in step 2, relative to the manifest file.
- `entryName`: The name of the entry file bundle that will be created. This should match the name used in step 5.
- `rootUrl`: The url of the application. This should resolve to the page you created in step 4. It should also start with a slash and have no trailing slashes.
- `noRouting`: If your app doesn't have multiple pages and doesn't need url rewriting, set this to true.
- `production`: If this is false, the content page for your app will be added to the ignore list and not generated in production.
