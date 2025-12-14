'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [fontSize, setFontSize] = useState(16);
  const [lineSpacing, setLineSpacing] = useState(1.6);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all reading progress? This action cannot be undone.')) {
      // Here you would clear IndexedDB progress
      alert('Progress reset successfully!');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20 px-4">
        <div className="py-6 space-y-6">
          
          {/* Reading Settings */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reading Settings</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg divide-y">
              {/* Theme */}
              <div className="p-4">
                <label className="block text-sm font-medium text-gray-900 mb-3">Theme</label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      theme === 'light'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <svg className="w-6 h-6 mx-auto mb-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <svg className="w-6 h-6 mx-auto mb-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Dark</span>
                  </button>
                </div>
              </div>

              {/* Font Size */}
              <div className="p-4">
                <label className="block text-sm font-medium text-gray-900 mb-3">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Small</span>
                  <span className="text-sm font-medium text-gray-900">{fontSize}px</span>
                  <span className="text-xs text-gray-500">Large</span>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded" style={{ fontSize: `${fontSize}px` }}>
                  Sample text preview
                </div>
              </div>

              {/* Line Spacing */}
              <div className="p-4">
                <label className="block text-sm font-medium text-gray-900 mb-3">Line Spacing</label>
                <input
                  type="range"
                  min="1.2"
                  max="2.0"
                  step="0.1"
                  value={lineSpacing}
                  onChange={(e) => setLineSpacing(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Compact</span>
                  <span className="text-sm font-medium text-gray-900">{lineSpacing.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">Relaxed</span>
                </div>
              </div>
            </div>
          </section>

          {/* App Info */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg divide-y">
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-medium text-gray-900">1.0.0</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">App Name</span>
                <span className="text-sm font-medium text-gray-900">Aithor</span>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section>
            <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
            
            <div className="bg-white border border-red-200 rounded-lg">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Reset All Progress</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This will clear all reading progress for all books. This action cannot be undone.
                </p>
                <button
                  onClick={resetProgress}
                  className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  Reset Progress
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link href="/reader" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs font-medium">Reader</span>
          </Link>
          
          <Link href="/upload" className="flex flex-col items-center gap-1 -mt-8">
            <div className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </Link>
          
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-xs font-medium">AIthor</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
}
