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

// Find all source directories to check
const checkDirs = [
  path.join(rootDir, "apps"),
  path.join(rootDir, "packages")
];

// List of invalid Tailwind patterns to check (regex matches)
const invalidPatterns = [
  { regex: /\btext-xxs\b/g, label: "text-xxs (not a valid Tailwind class)" },
  { regex: /\bbackdrop-blur-xxs\b/g, label: "backdrop-blur-xxs (not a valid Tailwind blur value)" },
  { regex: /\bscale-102\b/g, label: "scale-102 (not a valid Tailwind scale value)" },
  { regex: /\bh-15\b/g, label: "h-15 (not a valid Tailwind height value)" },
];

let hasError = false;

for (const dir of checkDirs) {
  if (!fs.existsSync(dir)) continue;

  const files = findFiles(dir, [".ts", ".tsx", ".js", ".jsx", ".css"]);

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");

    for (const pattern of invalidPatterns) {
      pattern.regex.lastIndex = 0; // reset regex state
      let match;
      while ((match = pattern.regex.exec(content)) !== null) {
        // Calculate line number
        const lines = content.slice(0, match.index).split("\n");
        const lineNum = lines.length;

        console.error(`Error: Found invalid Tailwind pattern '${pattern.label}' in file '${path.relative(rootDir, file)}' on line ${lineNum}.`);
        hasError = true;
      }
    }
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log("Success: All scanned files contain only valid Tailwind classes!");
  process.exit(0);
}
