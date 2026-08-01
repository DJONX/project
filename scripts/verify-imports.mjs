/* eslint-disable no-undef */
import fs from "fs";
import path from "path";

const rootDir = process.cwd();

// Helper to find files recursively
function findFiles(dir, extensions) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== "dist" && file !== "build") {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      if (extensions.some(ext => filePath.endsWith(ext))) {
        results.push(filePath);
      }
    }
  }
  return results;
}

// Find all workspaces
const workspaceDirs = [];
const appsPath = path.join(rootDir, "apps");
if (fs.existsSync(appsPath)) {
  fs.readdirSync(appsPath).forEach(dir => {
    const fullPath = path.join(appsPath, dir);
    if (fs.statSync(fullPath).isDirectory()) {
      workspaceDirs.push(fullPath);
    }
  });
}
const packagesPath = path.join(rootDir, "packages");
if (fs.existsSync(packagesPath)) {
  fs.readdirSync(packagesPath).forEach(dir => {
    const fullPath = path.join(packagesPath, dir);
    if (fs.statSync(fullPath).isDirectory()) {
      workspaceDirs.push(fullPath);
    }
  });
}

let hasError = false;

for (const workspaceDir of workspaceDirs) {
  const packageJsonPath = path.join(workspaceDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) continue;

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const deps = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
    ...(packageJson.peerDependencies || {}),
  };

  const srcPath = path.join(workspaceDir, "src");
  if (!fs.existsSync(srcPath)) continue;

  const tsFiles = findFiles(srcPath, [".ts", ".tsx", ".js", ".jsx"]);
  const workspaceName = packageJson.name || path.basename(workspaceDir);

  for (const file of tsFiles) {
    const content = fs.readFileSync(file, "utf-8");
    // Matches: import ... from "@cameroon-merchants/xyz"
    // or import("@cameroon-merchants/xyz")
    const importRegex = /(?:from\s+['"]|import\(['"])(@cameroon-merchants\/[^'"]+)/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importedPackage = match[1];
      if (!deps[importedPackage]) {
        console.error(`Error: In workspace '${workspaceName}', file '${path.relative(rootDir, file)}' imports '${importedPackage}' but it is not declared as a dependency in '${path.relative(rootDir, packageJsonPath)}'.`);
        hasError = true;
      }
    }
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log("Success: All internal imports match package.json dependencies!");
  process.exit(0);
}
