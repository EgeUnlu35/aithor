'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/auth';
import { 
  fetchBookDetails, 
  fetchBookStatus, 
  fetchBookStats, 
  fetchPageContent,
  APIBook,
  BookStats,
  PageResponse 
} from '@/lib/api';
import Link from 'next/link';

interface ReaderSettings {
  fontSize: number;
  theme: 'light' | 'dark';
  lineHeight: number;
}

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = parseInt(params.bookId as string);
  
  const [book, setBook] = useState<APIBook | null>(null);
  const [bookStats, setBookStats] = useState<BookStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 16,
    theme: 'light',
    lineHeight: 1.6
  });

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadBookData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  useEffect(() => {
    if (book && bookStats) {
      loadPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadBookData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch book details and status
      const [bookDetails, bookStatus] = await Promise.all([
        fetchBookDetails(bookId),
        fetchBookStatus(bookId)
      ]);

      setBook(bookDetails);

      // Check if book is ready
      if (bookStatus.status === 'pending' || bookStatus.status === 'processing') {
        setError(`Book is ${bookStatus.status}. ${bookStatus.progress_message || 'Please wait...'}`);
        setLoading(false);
        return;
      }

      if (bookStatus.status === 'failed') {
        setError(bookStatus.error_message || 'Failed to process book');
        setLoading(false);
        return;
      }

      // Fetch book stats
      const stats = await fetchBookStats(bookId);
      setBookStats(stats);

      // Load first page
      await loadPage(1);
    } catch (error) {
      console.error('Error loading book:', error);
      setError(error instanceof Error ? error.message : 'Failed to load book');
      setLoading(false);
    }
  };

  const loadPage = async (pageNumber: number) => {
    try {
      setPageLoading(true);
      const pageContent = await fetchPageContent(bookId, pageNumber);
      setPageData(pageContent);
      setCurrentPage(pageNumber);
    } catch (error) {
      console.error('Error loading page:', error);
      setError(error instanceof Error ? error.message : 'Failed to load page');
    } finally {
      setPageLoading(false);
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (pageData?.has_previous && pageData.previous_page) {
      loadPage(pageData.previous_page);
    }
  };

  const handleNextPage = () => {
    if (pageData?.has_next && pageData.next_page) {
      loadPage(pageData.next_page);
    }
  };

  const handleFontSizeChange = (delta: number) => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(12, Math.min(24, prev.fontSize + delta))
    }));
  };

  const handleThemeToggle = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const handleLineHeightChange = (delta: number) => {
    setSettings(prev => ({
      ...prev,
      lineHeight: Math.max(1.2, Math.min(2.4, prev.lineHeight + delta))
    }));
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Book</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  if (!book || !pageData) {
    return null;
  }

  const isDark = settings.theme === 'dark';

  return (
    <>
      {/* Header */}
      <header className={`sticky top-0 z-10 border-b ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className={`p-2 hover:bg-gray-100 ${isDark ? 'hover:bg-gray-800' : ''} rounded-full transition-colors`}>
              <svg className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{book.title}</h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Page {currentPage} of {bookStats?.total_pages || 0}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 hover:bg-gray-100 ${isDark ? 'hover:bg-gray-800' : ''} rounded-full transition-colors`}
          >
            <svg className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} px-4 py-4`}>
          <div className="space-y-4">
            {/* Font Size */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Font Size</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFontSizeChange(-2)}
                  className={`px-3 py-1 border rounded-lg text-sm ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  A-
                </button>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{settings.fontSize}px</span>
                <button
                  onClick={() => handleFontSizeChange(2)}
                  className={`px-3 py-1 border rounded-lg text-sm ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  A+
                </button>
              </div>
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Theme</span>
              <button
                onClick={handleThemeToggle}
                className={`px-4 py-1 border rounded-lg text-sm ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>

            {/* Line Height */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Line Height</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLineHeightChange(-0.2)}
                  className={`px-3 py-1 border rounded-lg text-sm ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  -
                </button>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{settings.lineHeight.toFixed(1)}</span>
                <button
                  onClick={() => handleLineHeightChange(0.2)}
                  className={`px-3 py-1 border rounded-lg text-sm ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Statistics Bar */}
      {bookStats && (
        <div className={`border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} px-4 py-2`}>
          <div className="flex items-center justify-around text-xs">
            <div className="text-center">
              <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{bookStats.total_pages}</div>
              <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>Pages</div>
            </div>
            <div className="text-center">
              <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{bookStats.total_words.toLocaleString()}</div>
              <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>Words</div>
            </div>
            <div className="text-center">
              <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{bookStats.estimated_reading_time}</div>
              <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>Read Time</div>
            </div>
          </div>
        </div>
      )}

      {/* Reading Content */}
      <main className={`flex-1 overflow-y-auto pb-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        {pageLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div
              className={`prose max-w-none ${isDark ? 'prose-invert' : 'prose-slate'}`}
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
                color: isDark ? undefined : '#1f2937',
              }}
              dangerouslySetInnerHTML={{ __html: pageData.page.content }}
            />
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <nav className={`fixed bottom-0 left-0 right-0 border-t ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} px-4 py-4 max-w-md mx-auto`}>
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousPage}
            disabled={!pageData?.has_previous}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              pageData?.has_previous
                ? isDark 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentPage} / {pageData?.total_pages || 0}
          </div>

          <button
            onClick={handleNextPage}
            disabled={!pageData?.has_next}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              pageData?.has_next
                ? isDark 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className={`mt-3 h-1 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{
              width: `${pageData?.total_pages ? (currentPage / pageData.total_pages) * 100 : 0}%`
            }}
          />
        </div>
      </nav>
    </>
  );
}
