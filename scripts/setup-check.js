#!/usr/bin/env node

/**
 * Setup Check Script
 * 
 * This script helps verify that the environment is correctly set up
 * for the ShopEase e-commerce application.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`\n${colors.bright}${colors.blue}===== ShopEase Setup Check =====${colors.reset}\n`);

// Check if MongoDB is installed
function checkMongoDB() {
  console.log(`${colors.cyan}Checking MongoDB installation...${colors.reset}`);
  
  try {
    // Try to connect to MongoDB
    const mongoCmd = process.platform === 'win32' 
      ? 'mongod --version' 
      : 'mongod --version 2>/dev/null';
    
    try {
      execSync(mongoCmd);
      console.log(`${colors.green}✓ MongoDB is installed!${colors.reset}`);
    } catch (error) {
      console.log(`${colors.yellow}⚠ MongoDB command not found.${colors.reset}`);
      console.log(`${colors.yellow}  This is okay if you're using MongoDB Atlas or Docker.${colors.reset}`);
    }
    
    // Check if MongoDB is running
    console.log(`${colors.cyan}Checking if MongoDB is running...${colors.reset}`);
    
    // Different commands based on OS
    let isRunning = false;
    try {
      if (process.platform === 'win32') {
        // Windows
        const output = execSync('tasklist /FI "IMAGENAME eq mongod.exe" /FO CSV').toString();
        isRunning = output.includes('mongod.exe');
      } else {
        // macOS/Linux
        const output = execSync('ps aux | grep -v grep | grep mongod').toString();
        isRunning = output.includes('mongod');
      }
      
      if (isRunning) {
        console.log(`${colors.green}✓ MongoDB is running!${colors.reset}`);
      } else {
        console.log(`${colors.red}✗ MongoDB is not running.${colors.reset}`);
        console.log(`${colors.yellow}  Please start MongoDB:${colors.reset}`);
        console.log(`${colors.yellow}  - Windows: Start MongoDB service${colors.reset}`);
        console.log(`${colors.yellow}  - macOS: brew services start mongodb-community${colors.reset}`);
        console.log(`${colors.yellow}  - Linux: sudo systemctl start mongod${colors.reset}`);
        console.log(`${colors.yellow}  - Docker: docker run --name mongo -p 27017:27017 -d mongo${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.yellow}⚠ Could not determine if MongoDB is running.${colors.reset}`);
    }
    
  } catch (error) {
    console.log(`${colors.red}✗ Error checking MongoDB: ${error.message}${colors.reset}`);
  }
}

// Check if .env.local exists and has required variables
function checkEnvFile() {
  console.log(`\n${colors.cyan}Checking environment configuration...${colors.reset}`);
  
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log(`${colors.red}✗ .env.local file not found!${colors.reset}`);
    console.log(`${colors.yellow}  Please create a .env.local file with the following variables:${colors.reset}`);
    console.log(`${colors.yellow}  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${colors.reset}`);
    console.log(`${colors.yellow}  - CLERK_SECRET_KEY=${colors.reset}`);
    console.log(`${colors.yellow}  - CLERK_WEBHOOK_SECRET=${colors.reset}`);
    console.log(`${colors.yellow}  - NEXT_PUBLIC_WEBHOOK_URL=${colors.reset}`);
    console.log(`${colors.yellow}  - MONGODB_URI=${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.green}✓ .env.local file exists${colors.reset}`);
  
  // Read and check env file contents
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  const requiredVars = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'CLERK_WEBHOOK_SECRET',
    'NEXT_PUBLIC_WEBHOOK_URL',
    'MONGODB_URI'
  ];
  
  const missingVars = [];
  const placeholderVars = [];
  
  for (const varName of requiredVars) {
    const line = envLines.find(l => l.startsWith(`${varName}=`));
    
    if (!line) {
      missingVars.push(varName);
    } else {
      const value = line.split('=')[1].trim();
      if (
        value.includes('your_') || 
        value.includes('placeholder') || 
        value === '' ||
        value.includes('pk_test_') && value.length < 20 ||
        value.includes('sk_test_') && value.length < 20
      ) {
        placeholderVars.push(varName);
      }
    }
  }
  
  if (missingVars.length > 0) {
    console.log(`${colors.red}✗ Missing environment variables:${colors.reset}`);
    missingVars.forEach(v => {
      console.log(`${colors.yellow}  - ${v}${colors.reset}`);
    });
  }
  
  if (placeholderVars.length > 0) {
    console.log(`${colors.yellow}⚠ The following variables appear to have placeholder values:${colors.reset}`);
    placeholderVars.forEach(v => {
      console.log(`${colors.yellow}  - ${v}${colors.reset}`);
    });
  }
  
  // Check MongoDB URI
  const mongoLine = envLines.find(l => l.startsWith('MONGODB_URI='));
  if (mongoLine) {
    const mongoUri = mongoLine.split('=')[1].trim();
    
    if (mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
      console.log(`${colors.green}✓ Using local MongoDB instance${colors.reset}`);
    } else if (mongoUri.includes('mongodb+srv')) {
      console.log(`${colors.green}✓ Using MongoDB Atlas${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠ Unusual MongoDB URI pattern${colors.reset}`);
    }
  }
  
  return missingVars.length === 0;
}

// Check Next.js app
function checkNextApp() {
  console.log(`\n${colors.cyan}Checking Next.js application...${colors.reset}`);
  
  // Check if package.json exists
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    console.log(`${colors.red}✗ package.json not found!${colors.reset}`);
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Check dependencies
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const requiredDeps = ['next', '@clerk/nextjs', 'mongoose'];
    
    const missingDeps = [];
    for (const dep of requiredDeps) {
      if (!deps[dep]) {
        missingDeps.push(dep);
      }
    }
    
    if (missingDeps.length > 0) {
      console.log(`${colors.red}✗ Missing dependencies:${colors.reset}`);
      missingDeps.forEach(d => {
        console.log(`${colors.yellow}  - ${d}${colors.reset}`);
      });
    } else {
      console.log(`${colors.green}✓ All required dependencies present${colors.reset}`);
    }
    
    // Check if node_modules exists
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log(`${colors.red}✗ node_modules not found! Run npm install${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ node_modules exists${colors.reset}`);
    }
    
    return missingDeps.length === 0;
  } catch (error) {
    console.log(`${colors.red}✗ Error parsing package.json: ${error.message}${colors.reset}`);
    return false;
  }
}

// Offer to create a test user
function offerToCreateTestUser() {
  rl.question(`\n${colors.cyan}Would you like to create a test user in MongoDB? (y/n) ${colors.reset}`, (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log(`${colors.cyan}Opening test-db endpoint to create a test user...${colors.reset}`);
      
      try {
        const command = process.platform === 'win32' 
          ? 'start http://localhost:3000/api/test-db' 
          : (process.platform === 'darwin' 
              ? 'open http://localhost:3000/api/test-db' 
              : 'xdg-open http://localhost:3000/api/test-db');
              
        execSync(command);
        console.log(`${colors.green}✓ Browser opened with test-db endpoint${colors.reset}`);
      } catch (error) {
        console.log(`${colors.red}✗ Could not open browser. Please manually visit:${colors.reset}`);
        console.log(`${colors.yellow}  http://localhost:3000/api/test-db${colors.reset}`);
      }
    }
    
    offerToRunApp();
  });
}

// Offer to run the app
function offerToRunApp() {
  rl.question(`\n${colors.cyan}Would you like to start the Next.js app? (y/n) ${colors.reset}`, (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log(`${colors.green}Starting Next.js app...${colors.reset}`);
      console.log(`${colors.dim}Press Ctrl+C to stop the app${colors.reset}\n`);
      
      try {
        // Use spawn to keep the process running
        const { spawn } = require('child_process');
        const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        
        const child = spawn(npmCmd, ['run', 'dev'], { 
          stdio: 'inherit',
          shell: true
        });
        
        child.on('close', (code) => {
          if (code !== 0) {
            console.log(`${colors.red}Next.js app exited with code ${code}${colors.reset}`);
          }
          rl.close();
        });
      } catch (error) {
        console.log(`${colors.red}✗ Error starting Next.js app: ${error.message}${colors.reset}`);
        rl.close();
      }
    } else {
      console.log(`\n${colors.bright}${colors.green}Setup check complete!${colors.reset}`);
      console.log(`${colors.green}Run the app with: ${colors.cyan}npm run dev${colors.reset}\n`);
      rl.close();
    }
  });
}

// Main function
function main() {
  checkMongoDB();
  const envOk = checkEnvFile();
  const appOk = checkNextApp();
  
  if (envOk && appOk) {
    console.log(`\n${colors.green}✓ Environment setup looks good!${colors.reset}`);
    offerToCreateTestUser();
  } else {
    console.log(`\n${colors.yellow}⚠ Please fix the issues above and run this script again.${colors.reset}`);
    rl.close();
  }
}

main(); 