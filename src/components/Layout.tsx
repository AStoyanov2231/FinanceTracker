import React, { ReactNode, useState } from 'react';
import { storage } from '../utils/storage';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const success = await storage.importData(e.target.result as string);
          if (success) {
            setImportStatus('Data imported successfully! Please refresh the page.');
            setTimeout(() => window.location.reload(), 2000);
          } else {
            setImportStatus('Error importing data. Please check the file format.');
          }
        }
      };
      reader.readAsText(importFile);
    } catch (error) {
      setImportStatus('Error reading file');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* GitHub banner */}
      <div className="bg-indigo-900 text-white p-2 text-center text-sm">
        <p>
          This is a web version of Finance Tracker. Your data is stored locally in your browser.
          <a href="https://github.com/YOUR_USERNAME/finance-tracker" 
            className="ml-2 underline" 
            target="_blank" 
            rel="noopener noreferrer">
            GitHub Repository
          </a>
        </p>
      </div>
      
      {/* Main content */}
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
          
          {/* Import/Export controls */}
          <div className="mt-10 bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Data Management</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => storage.exportData()}
                className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Export Data
              </button>
              
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-indigo-700 file:text-white hover:file:bg-indigo-600"
                />
                {importFile && (
                  <button
                    onClick={handleImport}
                    className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Import Selected File
                  </button>
                )}
              </div>
            </div>
            
            {importStatus && (
              <p className={`mt-2 text-sm ${importStatus.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {importStatus}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout; 