import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/ShowCarousel.css';
import { genreMapping } from './GenreMapping/genreMapping';
import icons from '../Icons/icons/0microphone .png';

// Define the Show interface for type safety
interface Show {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: number;
  updated?: string;
  genres?: number[];
}

const ShowCarousel: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch shows from the API when the component mounts
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get('https://podcast-api.netlify.app/shows');
        setShows(response.data);
      } catch (err) {
        setError('Failed to load shows.');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  // Display loading or error message if needed
  if (loading) return <div style={{ color: 'white' }}>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
     
    ],
  };

  return (
    <div className="show-carousel">
      <div className='Podcast-icon'>
      <h1 style={{ color: '#4584d7', fontWeight: 'bolder', fontSize:'19px', fontFamily:'fantasy'}}>
        <img src={icons} alt="Podcast Icon" style={{maxWidth:'30px'}}/>Podcast</h1>
      </div>
      
      <h2 style={{ color: 'white', fontWeight: 'bolder', fontSize:'19px'}}>Trending Shows</h2>
      
      <Slider {...settings}>
        {shows.map((show) => (
          <div key={show.id} className="carousel-item">
            <Link to={`/show/${show.id}`}>
              <img src={show.image} alt={show.title} className="carousel-image" />
              <div className="carousel-info">
                <h3 style={{ color: '#787bd3', fontSize:'13px' }}>{show.title}</h3>
                {show.genres && (
                  <p style={{fontSize:'10px'}}>Genres: {show.genres.map(id => genreMapping[id]).join(', ')}</p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ShowCarousel;
