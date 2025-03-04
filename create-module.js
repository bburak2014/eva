#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// İlk harfi büyük yapma fonksiyonu
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

const moduleName = process.argv[2];
const isProtected = process.argv[3] === '--protected';

if (!moduleName) {
  console.error("Usage: npm run create:module -- <module-name> [--protected]");
  process.exit(1);
}

const capitalizedModuleName = capitalize(moduleName);
const moduleBasePath = path.join(process.cwd(), 'src', 'features', moduleName);

// Yardımcı fonksiyonlar
function createFolder(folderPath) {
  try {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created folder: ${folderPath}`);
  } catch (error) {
    console.error(`Error creating folder ${folderPath}:`, error);
  }
}

function createFile(folderPath, fileName, content) {
  const filePath = path.join(folderPath, fileName);
  try {
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  } catch (error) {
    console.error(`Error creating file ${filePath}:`, error);
  }
}

console.log(`Creating module '${moduleName}' in src/features/...`);
console.log(isProtected ? 'Protected route enabled.' : 'Normal route.');

// Her klasöre ait dosya bilgilerini içeren nesne
const folderFileGenerators = {
  api: () => {
    const fileName = `${moduleName}Api.ts`;
    const content = `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ${moduleName}Api = createApi({
  reducerPath: '${moduleName}Api',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    // Define endpoints here
  }),
});

export const { /* hooks */ } = ${moduleName}Api;
`;
    return { fileName, content };
  },
  routes: () => {
    const fileName = `Routes.tsx`;
    let content;
    if (isProtected) {
      content = `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../../shared/components/ProtectedRoute';
import ${capitalizedModuleName}Page from '../pages/${capitalizedModuleName}Page';

const ${capitalizedModuleName}Routes: React.FC = () => (
  <Routes>
    <Route element={<ProtectedRoute />}>
      <Route path="/${moduleName}" element={<${capitalizedModuleName}Page />} />
    </Route>
  </Routes>
);

export const basePath = "/${moduleName}";
export default ${capitalizedModuleName}Routes;
`;
    } else {
      content = `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ${capitalizedModuleName}Page from '../pages/${capitalizedModuleName}Page';

const ${capitalizedModuleName}Routes: React.FC = () => (
  <Routes>
    <Route path="/${moduleName}" element={<${capitalizedModuleName}Page />} />
  </Routes>
);

export const basePath = "/${moduleName}";
export default ${capitalizedModuleName}Routes;
`;
    }
    return { fileName, content };
  },
  pages: () => {
    const fileName = `${capitalizedModuleName}Page.tsx`;
    const content = `import React from 'react';

const ${capitalizedModuleName}Page: React.FC = () => (
  <div>
    <h1>${capitalizedModuleName} Page</h1>
  </div>
);

export default ${capitalizedModuleName}Page;
`;
    return { fileName, content };
  },
  components: () => {
    const fileName = `${capitalizedModuleName}Component.tsx`;
    const content = `import React from 'react';

const ${capitalizedModuleName}Component: React.FC = () => (
  <div>
    <p>Default component for ${moduleName} module.</p>
  </div>
);

export default ${capitalizedModuleName}Component;
`;
    return { fileName, content };
  },
  slice: () => {
    const fileName = `${moduleName}Slice.ts`;
    const content = `// Add state logic for ${moduleName} if needed.
`;
    return { fileName, content };
  },
  types: () => {
    const fileName = `${moduleName}Types.ts`;
    const content = `// Types for the ${capitalizedModuleName} module.
// Define module-specific types here.
`;
    return { fileName, content };
  },
};

const folders = Object.keys(folderFileGenerators);

folders.forEach(folder => {
  const folderPath = path.join(moduleBasePath, folder);
  createFolder(folderPath);
  const { fileName, content } = folderFileGenerators[folder]();
  createFile(folderPath, fileName, content);
});

console.log(`Module "${moduleName}" created successfully!`);
