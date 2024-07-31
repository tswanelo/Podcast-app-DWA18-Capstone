import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO, isValid } from 'date-fns';
import Fuse from 'fuse.js';
import { genreMapping } from './GenreMapping/genreMapping';
import ShowCarousel from './ShowCarousel';
import '../styles/ShowList.css';

// Define the Show interface
interface Show {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: number;
  updated?: string;
  genres?: number[];
}

const ShowList: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [sortType, setSortType] = useState<string>('title-asc');
  const [genreFilter, setGenreFilter] = useState<number | null>(null);

  // Fetch shows data when component mounts
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get('https://podcast-api.netlify.app/shows');
        setShows(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load shows.');
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  // Initialize Fuse.js instance
  const fuse = new Fuse(shows, {
    keys: ['title'],
    includeScore: true
  });

  // Handle search filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  // Handle genre filter change
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenreFilter(parseInt(e.target.value) || null);
  };

  // Sort shows based on selected sort type
  const sortedShows = [...shows].sort((a, b) => {
    if (sortType === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (sortType === 'title-desc') {
      return b.title.localeCompare(a.title);
    } else if (sortType === 'date-asc') {
      return new Date(a.updated || 0).getTime() - new Date(b.updated || 0).getTime();
    } else {
      return new Date(b.updated || 0).getTime() - new Date(a.updated || 0).getTime();
    }
  });

  // Filter shows based on search and genre
  const filteredShows = sortedShows.filter((show) => {
    const matchesFilter = filter
      ? fuse.search(filter).some(result => result.item.id === show.id)
      : true;
    const matchesGenre = genreFilter
      ? show.genres?.includes(genreFilter)
      : true;
    return matchesFilter && matchesGenre;
  });

  if (loading) return <div style={{ color: 'white' }}>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="show-list">
      {/* Carousel for trending shows */}
      <ShowCarousel />
      <div>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={handleFilterChange}
          style={{ margin: '5px' }}
        />
        {/* Genre filter dropdown */}
        <select onChange={handleGenreChange} style={{ margin: '5px' }}>
          <option value="">All Genres</option>
          {Object.entries(genreMapping).map(([id, title]) => (
            <option key={id} value={id}>{title}</option>
          ))}
        </select>
        {/* Sorting buttons */}
        <button onClick={() => setSortType('title-asc')} style={{ margin: '5px' }}>A-Z</button>
        <button onClick={() => setSortType('title-desc')} style={{ margin: '5px' }}>Z-A</button>
        <button onClick={() => setSortType('date-asc')} style={{ margin: '5px' }}>Date Asc</button>
        <button onClick={() => setSortType('date-desc')} style={{ margin: '5px' }}>Date Desc</button>
      </div>
      {/* List of shows */}
      <ul className="shows">
        {filteredShows.map((show) => (
          <li key={show.id} className="show-item">
            <Link to={`/show/${show.id}`}>
              <img src={show.image} alt={show.title} className="show-image" />
              <div className="show-info">
                <h2 style={{ color: '#787bd3', fontSize: '14px' }}>{show.title}</h2>
                <p style={{ fontSize: '14px', margin: '1px' }}>Seasons: {show.seasons}</p>
                {show.updated && (
                  <p style={{ fontSize: '14px', margin: '2px' }}>
                    Last updated: {isValid(parseISO(show.updated))
                      ? format(parseISO(show.updated), 'MMMM d, yyyy')
                      : 'N/A'}
                  </p>
                )}
                {show.genres && (
                  <p style={{ fontSize: '14px', margin: '0' }}>Genres: {show.genres.map(id => genreMapping[id]).join(', ')}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowList;
