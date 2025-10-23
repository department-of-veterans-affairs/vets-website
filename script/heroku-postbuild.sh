# define absolute paths to each repo
vagov_apps_dir=${PWD}
vagov_content_dir=${vagov_apps_dir}/../vagov_content

echo Installing vagov_content into ${vagov_content_dir}

# clone the content into the sibling directory
git clone --depth=1 https://github.com/department-of-veterans-affairs/vagov-content ${vagov_content_dir}

# cd back to the apps
cd ${vagov_apps_dir}

# build the site as usual
npm run build --  --entry=static-pages --content-directory=${vagov_content_dir}/pages
