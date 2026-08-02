import React, { useEffect, useState } from 'react'
import Banner from './Banner'
import { RecentBooks } from './RecentBooks/RecentBooks'

function Home() {
  // Recent books state
  const [recentBooks, setRecentBooks] = useState([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recent books from backend
  useEffect(() => {
    const loadRecentBooks = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/recent-books'
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load books: ${response.status}`
          );
        }

        const data = await response.json();

        console.log('Recent books:', data);

        setRecentBooks(data);
      } catch (error) {
        console.error(
          'Recent books fetch error:',
          error
        );

        // Empty array will show demoBooks
        setRecentBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentBooks();
  }, []);
  return (
    <div>
        <Banner></Banner>
        <RecentBooks books={recentBooks} isLoading={isLoading}/>
    </div>
  )
}

export default Home