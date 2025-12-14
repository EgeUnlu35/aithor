import { authenticatedFetch } from './auth';

const API_BASE_URL = 'https://ebookapi-1xjq.onrender.com/api/v1';

// API Book interface from server
export interface APIBook {
  id: number;
  title: string;
  author: string;
  file_name: string;
  file_size: number;
  file_type: string;
  user_id: number;
  uploaded_at: string;
}

export interface BooksListResponse {
  books: APIBook[];
  total: number;
  page: number;
  page_size: number;
}

// User interface from API
export interface UserInfo {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

/**
 * Fetch current user information
 */
export async function fetchCurrentUser(): Promise<UserInfo> {
  const response = await authenticatedFetch(`${API_BASE_URL}/auth/me`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }
    throw new Error('Failed to fetch user info');
  }

  return response.json();
}

/**
 * Fetch user's books from API
 */
export async function fetchBooks(page: number = 1, pageSize: number = 20): Promise<BooksListResponse> {
  const response = await authenticatedFetch(
    `${API_BASE_URL}/books?page=${page}&page_size=${pageSize}`
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }
    throw new Error('Failed to fetch books');
  }

  return response.json();
}

// Book status interface
export interface BookStatus {
  book_id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_pages: number;
  error_message: string | null;
  progress_message: string;
}

// Book stats interface
export interface BookStats {
  book_id: number;
  total_pages: number;
  total_words: number;
  total_chars: number;
  estimated_reading_time: string;
}

// Page metadata interface
export interface PageMetadata {
  page_number: number;
  word_count: number;
  char_count: number;
}

// Pages list response
export interface PagesListResponse {
  pages: PageMetadata[];
  total_pages: number;
  current_page: number;
  page_size: number;
  book_id: number;
}

// Page content interface
export interface PageContent {
  page_number: number;
  content: string;
  word_count: number;
  char_count: number;
  book_id: number;
}

// Page response with navigation
export interface PageResponse {
  page: PageContent;
  has_previous: boolean;
  has_next: boolean;
  previous_page: number | null;
  next_page: number | null;
  total_pages: number;
}

/**
 * Get single book details
 */
export async function fetchBookDetails(bookId: number): Promise<APIBook> {
  const response = await authenticatedFetch(`${API_BASE_URL}/books/${bookId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Book not found');
    }
    if (response.status === 403) {
      throw new Error('Not authorized to access this book');
    }
    throw new Error('Failed to fetch book details');
  }

  return response.json();
}

/**
 * Get book processing status
 */
export async function fetchBookStatus(bookId: number): Promise<BookStatus> {
  const response = await authenticatedFetch(`${API_BASE_URL}/books/${bookId}/status`);

  if (!response.ok) {
    throw new Error('Failed to fetch book status');
  }

  return response.json();
}

/**
 * Get book statistics
 */
export async function fetchBookStats(bookId: number): Promise<BookStats> {
  const response = await authenticatedFetch(`${API_BASE_URL}/books/${bookId}/stats`);

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Book is not ready yet');
    }
    throw new Error('Failed to fetch book stats');
  }

  return response.json();
}

/**
 * List book pages (metadata only)
 */
export async function fetchBookPages(
  bookId: number,
  page: number = 1,
  pageSize: number = 20
): Promise<PagesListResponse> {
  const response = await authenticatedFetch(
    `${API_BASE_URL}/books/${bookId}/pages?page=${page}&page_size=${pageSize}`
  );

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Book is not ready yet');
    }
    throw new Error('Failed to fetch book pages');
  }

  return response.json();
}

/**
 * Get single page content
 */
export async function fetchPageContent(
  bookId: number,
  pageNumber: number
): Promise<PageResponse> {
  const response = await authenticatedFetch(
    `${API_BASE_URL}/books/${bookId}/pages/${pageNumber}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Page not found');
    }
    if (response.status === 400) {
      throw new Error('Book is not ready yet');
    }
    throw new Error('Failed to fetch page content');
  }

  return response.json();
}

/**
 * Convert API book to app Book format
 */
export function convertAPIBookToBook(apiBook: APIBook) {
  return {
    id: apiBook.id.toString(),
    title: apiBook.title,
    author: apiBook.author,
    cover: '', // API doesn't provide cover, can use placeholder
    progress: 0, // Default progress
    metadata: {
      description: `${apiBook.file_type} - ${(apiBook.file_size / 1024 / 1024).toFixed(2)} MB`,
      publisher: '',
      publishedDate: new Date(apiBook.uploaded_at).toLocaleDateString(),
    },
  };
}
