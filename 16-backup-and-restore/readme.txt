Don't upload the source code zip file directly to Lambda. You need to zip the contents of the folder containing the handler function and upload that zip file.

MAC_OS Steps: 
  1. mkdir lambda
  2. cp -pR index.js node_modules package-lock.json package.json lambda
  3. cd lambda
  4. rm -fR node_modules/aws-sdk
  5. zip -R ../lambda * (IMPORTANT: Does not include js files, so compress using GUI)
