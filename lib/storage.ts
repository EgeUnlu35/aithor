import { Book, Note } from './mockBooks';

const DB_NAME = 'AithorDB';
const DB_VERSION = 1;
const BOOKS_STORE = 'books';
const NOTES_STORE = 'notes';
const PROGRESS_STORE = 'progress';

interface ReadingProgress {
  bookId: string;
  chapterId: string;
  position: number;
  timestamp: number;
  lastReadAt: number;
}

class AithorStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Books store
        if (!db.objectStoreNames.contains(BOOKS_STORE)) {
          const booksStore = db.createObjectStore(BOOKS_STORE, { keyPath: 'id' });
          booksStore.createIndex('title', 'title', { unique: false });
          booksStore.createIndex('author', 'author', { unique: false });
        }

        // Notes store
        if (!db.objectStoreNames.contains(NOTES_STORE)) {
          const notesStore = db.createObjectStore(NOTES_STORE, { keyPath: 'id' });
          notesStore.createIndex('bookId', 'bookId', { unique: false });
          notesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Reading progress store
        if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
          db.createObjectStore(PROGRESS_STORE, { keyPath: 'bookId' });
        }
      };
    });
  }

  // Books operations
  async addBook(book: Book): Promise<void> {
    const transaction = this.db!.transaction([BOOKS_STORE], 'readwrite');
    const store = transaction.objectStore(BOOKS_STORE);
    await store.add(book);
  }

  async getBooks(): Promise<Book[]> {
    const transaction = this.db!.transaction([BOOKS_STORE], 'readonly');
    const store = transaction.objectStore(BOOKS_STORE);
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getBook(id: string): Promise<Book | null> {
    const transaction = this.db!.transaction([BOOKS_STORE], 'readonly');
    const store = transaction.objectStore(BOOKS_STORE);
    const request = store.get(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async updateBook(book: Book): Promise<void> {
    const transaction = this.db!.transaction([BOOKS_STORE], 'readwrite');
    const store = transaction.objectStore(BOOKS_STORE);
    await store.put(book);
  }

  async deleteBook(id: string): Promise<void> {
    const transaction = this.db!.transaction([BOOKS_STORE], 'readwrite');
    const store = transaction.objectStore(BOOKS_STORE);
    await store.delete(id);
  }

  // Notes operations
  async addNote(note: Note): Promise<void> {
    const transaction = this.db!.transaction([NOTES_STORE], 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    await store.add(note);
  }

  async getNotes(bookId: string): Promise<Note[]> {
    const transaction = this.db!.transaction([NOTES_STORE], 'readonly');
    const store = transaction.objectStore(NOTES_STORE);
    const index = store.index('bookId');
    const request = index.getAll(bookId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteNote(id: string): Promise<void> {
    const transaction = this.db!.transaction([NOTES_STORE], 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    await store.delete(id);
  }

  async updateNote(note: Note): Promise<void> {
    const transaction = this.db!.transaction([NOTES_STORE], 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    await store.put(note);
  }

  // Reading progress operations
  async saveProgress(progress: ReadingProgress): Promise<void> {
    const transaction = this.db!.transaction([PROGRESS_STORE], 'readwrite');
    const store = transaction.objectStore(PROGRESS_STORE);
    await store.put(progress);
  }

  async getProgress(bookId: string): Promise<ReadingProgress | null> {
    const transaction = this.db!.transaction([PROGRESS_STORE], 'readonly');
    const store = transaction.objectStore(PROGRESS_STORE);
    const request = store.get(bookId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }
}

export const storage = new AithorStorage();
export type { ReadingProgress };