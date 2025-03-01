#!/bin/bash
import fs from 'fs';
import path from 'path';

// Capitalize first letter
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
const folders = ['api', 'components', 'slice', 'pages', 'routes'];

console.log(`Creating module '${moduleName}' in src/features/...`);
console.log(isProtected ? 'Protected route enabled.' : 'Normal route.');

folders.forEach(folder => {
  const folderPath = path.join(moduleBasePath, folder);
  fs.mkdirSync(folderPath, { recursive: true });
  console.log(`Created folder: ${folderPath}`);

  if (folder === 'api') {
    const fileName = `${moduleName}Api.ts`;
    const filePath = path.join(folderPath, fileName);
    const content = `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ${moduleName}Api = createApi({
  reducerPath: '${moduleName}Api',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL}),
  endpoints: (builder) => ({
    // Define endpoints here
  }),
});

export const { /* hooks */ } = ${moduleName}Api;
`;
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  }
  else if (folder === 'routes') {
    const fileName = `Routes.tsx`;
    const filePath = path.join(folderPath, fileName);

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

export default ${capitalizedModuleName}Routes;
`;
    }

    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  }
  else if (folder === 'pages') {
    const fileName = `${capitalizedModuleName}Page.tsx`;
    const filePath = path.join(folderPath, fileName);
    const content = `import React from 'react';

const ${capitalizedModuleName}Page: React.FC = () => (
  <div>
    <h1>${capitalizedModuleName} Page</h1>
  </div>
);

export default ${capitalizedModuleName}Page;
`;
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  } 
  else if (folder === 'components') {
    const fileName = `${capitalizedModuleName}Component.tsx`;
    const filePath = path.join(folderPath, fileName);
    const content = `import React from 'react';

const ${capitalizedModuleName}Component: React.FC = () => (
  <div>
    <p>Default component for ${moduleName} module.</p>
  </div>
);

export default ${capitalizedModuleName}Component;
`;
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  } else if (folder === 'slice') {
    const fileName = `${moduleName}Slice.ts`;
    const filePath = path.join(folderPath, fileName);
    const content = `// Add state logic for ${moduleName} if needed.
`;
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  }
});

console.log(`Module "${moduleName}" created successfully!`);
