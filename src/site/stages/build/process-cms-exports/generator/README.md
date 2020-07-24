# Generate a transfomer for a bundle

- Run node autoGenerate.js -b bundle-name
- Creates 4 files
  - schemas/input/${bundle-name}.js
  - transfomers/${bundle-name}.js
  - schemas/output/${bundle-name}.js
- Creates a file in the current directory ${bundle-name}-schema.js. This file has the schema from the openAPI description of the node.
- If transfomers/${bundle-name}.js exists it refuses to generate the files. You can add the -f flag to force it to overwite the files. Careful with this option since you can lose you work. Alternatively, remove the existing files.
