// Simple script to check if files exist and have content
const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    const stats = fs.statSync(fullPath);
    console.log(`✅ ${filePath} exists (${stats.size} bytes)`);
    return true;
  } catch (error) {
    console.error(`❌ ${filePath} does not exist or cannot be accessed`);
    return false;
  }
}

function checkDirectory(dirPath) {
  try {
    const fullPath = path.resolve(__dirname, dirPath);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      console.log(`✅ ${dirPath} exists and is a directory`);
      return true;
    } else {
      console.error(`❌ ${dirPath} exists but is not a directory`);
      return false;
    }
  } catch (error) {
    console.error(`❌ ${dirPath} does not exist or cannot be accessed`);
    return false;
  }
}

function checkFileContent(filePath, searchString) {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(searchString)) {
      console.log(`✅ ${filePath} contains "${searchString}"`);
      return true;
    } else {
      console.error(`❌ ${filePath} does not contain "${searchString}"`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Could not check content of ${filePath}: ${error.message}`);
    return false;
  }
}

// Check main files
console.log('Checking main files...');
checkFile('package.json');
checkFile('src/index.ts');
checkFile('src/elysium.ts');

// Check plugin files
console.log('\nChecking plugin files...');
checkDirectory('src/plugins');
checkFile('src/plugins/env.ts');
checkFile('src/plugins/http.ts');
checkFile('src/plugins/logger.ts');
checkFile('src/plugins/cron.ts');
checkFile('src/plugins/auth.ts');
checkFile('src/plugins/cors.ts');
checkFile('src/plugins/swagger.ts');
checkFile('src/plugins/orm.ts');

// Check content of modified files
console.log('\nChecking content of modified files...');
checkFileContent('src/plugins/env.ts', 'loadEnv');
checkFileContent('src/plugins/http.ts', 'ElysiumHttpClient');
checkFileContent('src/plugins/logger.ts', 'writeToFile');
checkFileContent('src/plugins/cron.ts', 'SimpleCron');
checkFileContent('src/plugins/auth.ts', 'SimpleJwt');
checkFileContent('src/plugins/cors.ts', 'setupCors');
checkFileContent('src/plugins/swagger.ts', 'setupSwagger');

console.log('\nFile check completed!');
