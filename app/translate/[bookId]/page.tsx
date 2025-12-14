'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Book } from '@/lib/mockBooks';
import { storage } from '@/lib/storage';
import { isAuthenticated } from '@/lib/auth';
import Link from 'next/link';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
];

export default function TranslatePage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [toneInput, setToneInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);

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
      await storage.init();
      const loadedBook = await storage.getBook(bookId);
      
      if (!loadedBook) {
        router.push('/');
        return;
      }
      
      setBook(loadedBook);
    } catch (error) {
      console.error('Error loading book:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!book || !targetLanguage) {
      return;
    }

    setIsProcessing(true);
    setTranslationProgress(0);
    
    // Simulate translation progress
    const progressInterval = setInterval(() => {
      setTranslationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    // After 5 seconds, create the translated book
    setTimeout(async () => {
      clearInterval(progressInterval);
      setTranslationProgress(100);
      
      await storage.init();
      
      // Get the language name
      const selectedLang = LANGUAGES.find(lang => lang.code === targetLanguage);
      const languageName = selectedLang ? selectedLang.name : targetLanguage;
      
      // Create the new translated book
      const translatedBook: Book = {
        id: `${book.id}-${targetLanguage}-${Date.now()}`,
        title: `${book.title} (${languageName})`,
        author: book.author,
        cover: book.cover,
        progress: 0,
        chapters: book.chapters?.map(chapter => ({
          ...chapter,
          id: `${chapter.id}-translated`,
          content: `<p>Translated content in ${languageName}...</p>${chapter.content}`
        })),
        metadata: {
          ...book.metadata,
          description: `${languageName} translation${toneInput ? ` with ${toneInput} tone` : ''}`
        }
      };
      
      // Add to library
      await storage.addBook(translatedBook);
      
      // Navigate to the new book's details page
      setTimeout(() => {
        router.push(`/book/${translatedBook.id}`);
      }, 500);
    }, 5000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  const isValid = targetLanguage !== '';

  // Show translation status screen when processing
  if (isProcessing) {
    const selectedLang = LANGUAGES.find(lang => lang.code === targetLanguage);
    const languageName = selectedLang ? selectedLang.name : targetLanguage;
    
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Translating Your Book</h2>
            <p className="text-gray-600 mb-1">
              Translating &quot;{book.title}&quot; to {languageName}
            </p>
            {toneInput && (
              <p className="text-sm text-gray-500">
                with {toneInput} tone
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-semibold text-blue-600">{translationProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${translationProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${translationProgress >= 20 ? 'bg-green-50' : 'bg-gray-50'}`}>
              {translationProgress >= 20 ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-spin border-t-blue-600"></div>
              )}
              <span className={`text-sm ${translationProgress >= 20 ? 'text-green-800' : 'text-gray-600'}`}>
                Analyzing content structure
              </span>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${translationProgress >= 50 ? 'bg-green-50' : 'bg-gray-50'}`}>
              {translationProgress >= 50 ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : translationProgress >= 20 ? (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-spin border-t-blue-600"></div>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-200 rounded-full"></div>
              )}
              <span className={`text-sm ${translationProgress >= 50 ? 'text-green-800' : translationProgress >= 20 ? 'text-gray-600' : 'text-gray-400'}`}>
                Translating chapters
              </span>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${translationProgress >= 90 ? 'bg-green-50' : 'bg-gray-50'}`}>
              {translationProgress >= 90 ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : translationProgress >= 50 ? (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-spin border-t-blue-600"></div>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-200 rounded-full"></div>
              )}
              <span className={`text-sm ${translationProgress >= 90 ? 'text-green-800' : translationProgress >= 50 ? 'text-gray-600' : 'text-gray-400'}`}>
                Finalizing translation
              </span>
            </div>

            {translationProgress === 100 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-800">
                  Translation complete! Redirecting...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={`/book/${bookId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Translate with Aithor</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20 px-4">
        <div className="py-6 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-md flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 truncate">{book.title}</h2>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Select Target Language</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Translate to
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full px-4 py-3 text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Tone & Style <span className="text-sm font-normal text-gray-500">(Optional)</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Describe how you want the translation to sound
            </p>

            <input
              type="text"
              value={toneInput}
              onChange={(e) => setToneInput(e.target.value)}
              placeholder="e.g., neutral, simpler, formal, casual, poetic..."
              className="w-full px-4 py-3 text-base text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  AI-Powered Translation
                </h4>
                <p className="text-sm text-blue-800">
                  Aithor will translate your book while preserving context, style, and meaning. 
                  The process may take a few minutes depending on the book length.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleTranslate}
            disabled={!isValid || isProcessing}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
              !isValid || isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Translating...
              </span>
            ) : (
              'Start Translation'
            )}
          </button>
        </div>
      </main>

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
          
          <button className="flex flex-col items-center gap-1 text-blue-600">
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
