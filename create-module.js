#!/bin/bash
import fs from 'fs';
import path from 'path';

// Capitalize the first letter of a string.
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

const moduleName = process.argv[2];
if (!moduleName) {
  console.error("Usage: npm run create:module -- <module-name>");
  process.exit(1);
}

const capitalizedModuleName = capitalize(moduleName);
const moduleBasePath = path.join(process.cwd(), 'src', 'features', moduleName);
const folders = ['api', 'components', 'slice', 'pages', 'routes'];

console.log(`Creating module '${moduleName}' under src/features/...`);

folders.forEach(folder => {
  const folderPath = path.join(moduleBasePath, folder);
  fs.mkdirSync(folderPath, { recursive: true });
  console.log(`Created folder: ${folderPath}`);

  if (folder === 'api') {
    // File name in camelCase: e.g. authApi.ts
    const fileName = `${moduleName}Api.ts`;
    const filePath = path.join(folderPath, fileName);
    const content = `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ${moduleName}Api = createApi({
  reducerPath: '${moduleName}Api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://your-api-base-url.com' }),
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
    // The route path is set as "/<moduleName>" (e.g. "/auth")
    const fileName = `Routes.tsx`;
    const filePath = path.join(folderPath, fileName);
    const content = `import React from 'react';
  import { Routes, Route } from 'react-router-dom';
  import ${capitalizedModuleName}Page from '../pages/${capitalizedModuleName}Page';
  
  const ${capitalizedModuleName}Routes: React.FC = () => (
    <Routes>
      <Route path="/${moduleName}" element={<${capitalizedModuleName}Page />} />
      {/* You can add nested routes here, e.g.: */}
      {/* <Route path="login" element={<LoginPage />} /> */}
    </Routes>
  );
  
  export default ${capitalizedModuleName}Routes;
  `;
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  }
  
  else if (folder === 'pages') {
    // File name in PascalCase: e.g. AuthPage.tsx
    const fileName = `${capitalizedModuleName}Page.tsx`;
    const filePath = path.join(folderPath, fileName);
    const content = `import React from 'react';
import LoginForm from '../components/LoginForm';

const ${capitalizedModuleName}Page: React.FC = () => (
  <div>
    <h1>${capitalizedModuleName} Page</h1>
    <LoginForm />
  </div>
);

export default ${capitalizedModuleName}Page;
`;
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  } else if (folder === 'components') {
    // File name in PascalCase: e.g. AuthComponent.tsx
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
    // File name in camelCase: e.g. authSlice.ts
    const fileName = `${moduleName}Slice.ts`;
    const filePath = path.join(folderPath, fileName);
    const content = `// Optional: Add state management logic here for ${moduleName}.
`;
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  }
});

console.log(`Module "${moduleName}" created successfully!`);
