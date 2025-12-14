'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/auth';
import { fetchBookDetails, fetchBookStatus, fetchBookStats, APIBook, BookStats } from '@/lib/api';
import Link from 'next/link';

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = parseInt(params.bookId as string);
  
  const [book, setBook] = useState<APIBook | null>(null);
  const [bookStats, setBookStats] = useState<BookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const [bookDetails, bookStatus] = await Promise.all([
        fetchBookDetails(bookId),
        fetchBookStatus(bookId)
      ]);
      
      setBook(bookDetails);
      setStatus(bookStatus.status);

      // Fetch stats only if book is completed
      if (bookStatus.status === 'completed') {
        const stats = await fetchBookStats(bookId);
        setBookStats(stats);
      }
    } catch (error) {
      console.error('Error loading book:', error);
      setError(error instanceof Error ? error.message : 'Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Book</h3>
          <p className="text-gray-600 mb-6">{error || 'Book not found'}</p>
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

  const isReady = status === 'completed';

  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Book Details</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20 px-4">
        <div className="py-6 max-w-2xl mx-auto">
          {/* Book Cover */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-48 h-64 relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-lg mb-4 overflow-hidden flex items-center justify-center">
              <div className="text-center p-6">
                <svg className="w-20 h-20 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h4 className="text-sm font-semibold text-blue-800 leading-tight">{book.title}</h4>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">{book.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{book.author}</p>

            {/* Status Badge */}
            {!isReady && (
              <div className={`px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                status === 'pending' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {status === 'processing' ? '⏳ Processing...' :
                 status === 'pending' ? '⏸️ Pending' :
                 '❌ Failed'}
              </div>
            )}
          </div>

          {/* Book Stats */}
          {bookStats && (
            <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Book Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{bookStats.total_pages}</div>
                  <div className="text-sm text-gray-600">Pages</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{bookStats.total_words.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Words</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center col-span-2">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{bookStats.estimated_reading_time}</div>
                  <div className="text-sm text-gray-600">Estimated Reading Time</div>
                </div>
              </div>
            </section>
          )}

          {/* Book Info */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">File Name</span>
                <span className="text-sm font-medium text-gray-900 text-right max-w-[60%] truncate">{book.file_name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">File Size</span>
                <span className="text-sm font-medium text-gray-900">{(book.file_size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Format</span>
                <span className="text-sm font-medium text-gray-900">{book.file_type}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Uploaded</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(book.uploaded_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isReady ? (
              <>
                <Link
                  href={`/reader/${bookId}`}
                  className="block w-full bg-blue-600 text-white text-center py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  📖 Start Reading
                </Link>
                <Link
                  href={`/translate/${bookId}`}
                  className="block w-full bg-purple-600 text-white text-center py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  🌐 Translate with Aithor
                </Link>
              </>
            ) : (
              <button
                disabled
                className="block w-full bg-gray-300 text-gray-500 text-center py-4 rounded-xl font-semibold cursor-not-allowed"
              >
                {status === 'processing' ? '⏳ Processing... Please wait' :
                 status === 'pending' ? '⏸️ Pending Processing' :
                 '❌ Processing Failed'}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
          
          <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
