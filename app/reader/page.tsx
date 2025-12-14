'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';

export default function ReaderRedirectPage() {
  const router = useRouter();

  const findLastReadBook = async () => {
    try {
      await storage.init();
      const books = await storage.getBooks();
      
      if (books.length === 0) {
        router.push('/');
        return;
      }

      // Get reading progress for all books
      const booksWithProgress = await Promise.all(
        books.map(async (book) => {
          const progress = await storage.getProgress(book.id);
          return {
            book,
            lastRead: progress?.lastReadAt || 0
          };
        })
      );

      // Sort by last read time and get the most recent
      const sortedBooks = booksWithProgress.sort((a, b) => b.lastRead - a.lastRead);
      const lastReadBook = sortedBooks[0];

      if (lastReadBook && lastReadBook.lastRead > 0) {
        // Redirect to the last read book
        router.push(`/reader/${lastReadBook.book.id}`);
      } else {
        // If no book has been read, redirect to the first book
        router.push(`/reader/${books[0].id}`);
      }
    } catch (error) {
      console.error('Error finding last read book:', error);
      router.push('/');
    }
  };

  useEffect(() => {
    findLastReadBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex-1 flex items-center justify-center pb-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your book...</p>
      </div>
    </main>
  );
}
