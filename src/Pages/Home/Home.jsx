import React, { useState, useEffect } from 'react';
import { RecentBooks } from './RecentBooks/RecentBooks';
import { BookSection } from './BookSection';
import Banner from './Banner';
import api from '../../api/axios';

const Home = () => {
  // ─── State for all sections ────────────────────────────────
  const [recentBooks, setRecentBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [muslimLifeBooks, setMuslimLifeBooks] = useState([]);
  const [womenBooks, setWomenBooks] = useState([]);
  const [selfPurificationBooks, setSelfPurificationBooks] = useState([]);
  const [talimBooks, setTalimBooks] = useState([]);
  const [childrenBooks, setChildrenBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Fetch all data ──────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          recent,
          popular,
          muslim,
          women,
          self,
          talim,
          children,
        ] = await Promise.all([
          api.get("/home/recent-books"),
          api.get("/home/popular"),
          api.get("/home/muslim-life"),
          api.get("/home/women"),
          api.get("/home/self-purification"),
          api.get("/home/talim"),
          api.get("/home/children"),
        ]);

        setRecentBooks(recent.data);
        setPopularBooks(popular.data);
        setMuslimLifeBooks(muslim.data);
        setWomenBooks(women.data);
        setSelfPurificationBooks(self.data);
        setTalimBooks(talim.data);
        setChildrenBooks(children.data);
      } catch (error) {
        console.error("❌ Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div>

      <Banner></Banner>
      {/* ─── Recent Books (existing) ──────────────────────────── */}
      <RecentBooks books={recentBooks} isLoading={loading} />

      {/* ─── পাঠকপ্রিয় বই ────────────────────────────────────── */}
      <BookSection
        title="পাঠকপ্রিয় বই"
        books={popularBooks}
        isLoading={loading}
        seeAllLink="/category/popular"
        seeAllLabel="সব দেখুন"
      />

      {/* ─── মুসলিম জীবন রচিত ──────────────────────────────── */}
      <BookSection
        title="মুসলিম জীবন রচিত"
        books={muslimLifeBooks}
        isLoading={loading}
        seeAllLink="/category/muslim-life"
        seeAllLabel="সব দেখুন"
      />

      {/* ─── নারীদের নির্বাচিত বই ──────────────────────────── */}
      <BookSection
        title="নারীদের নির্বাচিত বই"
        books={womenBooks}
        isLoading={loading}
        seeAllLink="/category/women"
        seeAllLabel="সব দেখুন"
      />

      {/* ─── আমল ও আত্মশুদ্ধির বই ──────────────────────────── */}
      <BookSection
        title="আমল ও আত্মশুদ্ধির বই"
        books={selfPurificationBooks}
        isLoading={loading}
        seeAllLink="/category/self-purification"
        seeAllLabel="সব দেখুন"
      />

      {/* ─── তালীমের বই ────────────────────────────────────── */}
      <BookSection
        title="তালীমের বই"
        books={talimBooks}
        isLoading={loading}
        seeAllLink="/category/talim"
        seeAllLabel="সব দেখুন"
      />

      {/* ─── ছোটদের প্রিয় বই ────────────────────────────────── */}
      <BookSection
        title="ছোটদের প্রিয় বই"
        books={childrenBooks}
        isLoading={loading}
        seeAllLink="/category/children"
        seeAllLabel="সব দেখুন"
      />
    </div>
  );
};

export default Home;