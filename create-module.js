#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __filename ve __dirname tanımları (ESM'de otomatik gelmediğinden)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Yardımcı: String'in ilk harfini büyük yapar
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Komut satırından modül adını alıyoruz.
// Örnek kullanım: npm run create:module -- sales
const moduleName = process.argv[2];

if (!moduleName) {
  console.error("Usage: npm run create:module -- <module-name>");
  process.exit(1);
}

const capitalizedModuleName = capitalize(moduleName);

// Modülün temel yolu: src/features/<moduleName>
const moduleBasePath = path.join(process.cwd(), 'src', 'features', moduleName);

// Oluşturulacak klasörler
const folders = ['api', 'components', 'model', 'pages', 'routes'];

// Her bir klasörü oluştur ve ilgili klasörlere default dosya ekle
folders.forEach(folder => {
  const folderPath = path.join(moduleBasePath, folder);
  fs.mkdirSync(folderPath, { recursive: true });
  console.log(`Folder created: ${folderPath}`);

  // "api" klasörü: default API dosyası
  if (folder === 'api') {
    const fileName = `${capitalizedModuleName}Api.ts`;
    const filePath = path.join(folderPath, fileName);
    const content = `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ${capitalizedModuleName}Api = createApi({
  reducerPath: '${moduleName}Api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://your-api-base-url.com' }),
  endpoints: (builder) => ({
    // Define endpoints here
  }),
});

export const { /* hooks */ } = ${capitalizedModuleName}Api;
`;
    fs.writeFileSync(filePath, content);
    console.log(`Default API file created: ${filePath}`);
  }

  // "routes" klasörü: default Routes dosyası
  else if (folder === 'routes') {
    const fileName = `${capitalizedModuleName}Routes.tsx`;
    const filePath = path.join(folderPath, fileName);
    const content = `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ${capitalizedModuleName}Page from '../pages/${capitalizedModuleName}Page';

const ${capitalizedModuleName}Routes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<${capitalizedModuleName}Page />} />
    </Routes>
  );
};

export default ${capitalizedModuleName}Routes;
`;
    fs.writeFileSync(filePath, content);
    console.log(`Default Routes file created: ${filePath}`);
  }

  // "pages" klasörü: default Page dosyası
  else if (folder === 'pages') {
    const fileName = `${capitalizedModuleName}Page.tsx`;
    const filePath = path.join(folderPath, fileName);
    const content = `import React from 'react';

const ${capitalizedModuleName}Page: React.FC = () => {
  return (
    <div>
      <h1>${capitalizedModuleName} Page</h1>
      <p>This is the ${moduleName} page.</p>
    </div>
  );
};

export default ${capitalizedModuleName}Page;
`;
    fs.writeFileSync(filePath, content);
    console.log(`Default Page file created: ${filePath}`);
  }
});

console.log(`Module "${moduleName}" created successfully with default files!`);
