import React, { useEffect, useState, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import './App.css'
import { db } from './firebase'
import { ref, set, onValue, push, get } from "firebase/database"

const PROVIDERS = {
  todos: '',
  netflix: '8',
  disney: '337',
  hbo: '384|1899',
  prime: '119',
  crunchyroll: '283' 
}

const GENRES = {
  "Acción": 28, "Comedia": 35, "Terror": 27, "Drama": 18, "Sci-Fi": 878, "Romance": 10749
}

function App() {
  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [providerFilter, setProviderFilter] = useState(PROVIDERS.todos)
  const [showDetail, setShowDetail] = useState(false)
  const cardRef = useRef()
  const [roomId, setRoomId] = useState(null)
  const [userId] = useState(Math.random().toString(36).substring(7)) 
  const [matchMovie, setMatchMovie] = useState(null)
  const [roomInput, setRoomInput] = useState('')
  const [genreFilter, setGenreFilter] = useState('') 
  const [matchesHistory, setMatchesHistory] = useState([]) 
  const [showHistory, setShowHistory] = useState(false) 

  const API_KEY = '16c30f7ff13ba7ee695e9bf5da8748cc'

  const fetchMovies = (pFilter, gFilter) => {
    setLoading(true)
    let randomPage = Math.floor(Math.random() * (pFilter === '' ? 15 : 8)) + 1;
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&region=ES&sort_by=popularity.desc&page=${randomPage}&watch_region=ES`
    
    if (pFilter !== '') url += `&with_watch_providers=${pFilter}${pFilter === '283' ? '&with_genres=16' : ''}`
    if (gFilter !== '') url += `&with_genres=${gFilter}`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results || [])
        setCurrentIndex(0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { 
    fetchMovies(providerFilter, genreFilter) 
  }, [providerFilter, genreFilter])

  useEffect(() => {
    if (roomId) {
      const likesRef = ref(db, `rooms/${roomId}/likes`)
      onValue(likesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const movieIds = {}
          Object.values(data).forEach(like => {
            if (!movieIds[like.movieId]) movieIds[like.movieId] = new Set()
            movieIds[like.movieId].add(like.user)
            
            if (movieIds[like.movieId].size > 1) {
              const found = movies.find(m => m.id === like.movieId)
              if (found) {
                setMatchMovie(found)
                setMatchesHistory(prev => {
                  if (prev.find(m => m.id === found.id)) return prev
                  return [found, ...prev]
                })
              }
            }
          })
        }
      })
    }
  }, [roomId, movies])

  const swiped = (direction, movie) => {
    if (direction === 'right' && roomId) {
      push(ref(db, `rooms/${roomId}/likes`), {
        user: userId,
        movieId: movie.id,
        title: movie.title
      })
    }
    setShowDetail(false)
    setTimeout(() => setCurrentIndex(prev => prev + 1), 250)
  }

  const shareRoom = () => {
    const text = `¡Busca peli conmigo en MovieTinder! Código: ${roomId}`
    if (navigator.share) {
      navigator.share({ title: 'Movie Tinder', text: text, url: window.location.href })
    } else {
      navigator.clipboard.writeText(roomId);
      alert("¡Código copiado!");
    }
  }

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 7).toUpperCase()
    setRoomId(newRoomId)
    set(ref(db, 'rooms/' + newRoomId), { created: Date.now() })
  }

  const joinRoom = () => {
    if (!roomInput) return;
    const upperRoomId = roomInput.toUpperCase();
    const roomRef = ref(db, `rooms/${upperRoomId}`);
    get(roomRef).then((snapshot) => {
      if (snapshot.exists()) {
        setRoomId(upperRoomId);
      } else {
        alert("¡Vaya! Esa sala no existe. Revisa el código o crea una nueva.");
      }
    }).catch(() => alert("Error al conectar con la base de datos."));
  };

  const swipeAction = (dir) => { if (currentIndex < movies.length && cardRef.current) cardRef.current.swipe(dir) }
  const toggleDetail = () => setShowDetail(!showDetail)
  const currentMovie = movies[currentIndex]

  const touchStartTime = useRef(0);
  const touchStartX = useRef(0);
  const handlePointerDown = (e) => {
    touchStartTime.current = Date.now();
    touchStartX.current = e.clientX || (e.touches && e.touches[0].clientX);
  };
  const handlePointerUp = (e) => {
    const moveX = Math.abs((e.clientX || (e.changedTouches && e.changedTouches[0].clientX)) - touchStartX.current);
    if ((Date.now() - touchStartTime.current) < 200 && moveX < 10) toggleDetail();
  };

  return (
    <div className='app'>
      {!roomId ? (
        <div className="setup-screen">
          <h1 style={{opacity: 1, fontSize: '1.5rem', marginBottom: '10px'}}>MOVIE TINDER</h1>
          <p style={{color: '#9ca3af', marginBottom: '20px'}}>Crea una sala para elegir pelis con alguien</p>
          <button className="reload-btn" style={{width: '100%'}} onClick={createRoom}>CREAR SALA NUEVA</button>
          <div style={{margin: '20px 0', opacity: 0.3}}>O</div>
          <input placeholder="CÓDIGO DE SALA" value={roomInput} onChange={(e) => setRoomInput(e.target.value)} />
          <button className="filter-btn active" style={{width: '100%', marginTop: '10px'}} onClick={joinRoom}>UNIRSE</button>
        </div>
      ) : (
        <>
          <h1>Movie-Tinder</h1>
          <div className="room-indicator" onClick={shareRoom}>
            SALA: {roomId} <span style={{fontSize: '0.8rem'}}>🔗</span>
          </div>

          <div className="filter-bar">
            {Object.keys(PROVIDERS).map(key => (
              <button key={key} className={`filter-btn ${providerFilter === PROVIDERS[key] ? 'active' : ''}`} onClick={() => setProviderFilter(PROVIDERS[key])}>
                {key === 'todos' ? (
                  <span style={{fontSize:'0.65rem', fontWeight:'900'}}>ALL</span>
                ) : (
                  <img src={`${import.meta.env.BASE_URL}logos/${key}.png`} alt={key} className="provider-logo" />
                )}
              </button>
            ))}
          </div>
          
          <div className="genre-bar">
            <button 
              className={`genre-tag ${genreFilter === '' ? 'active' : ''}`} 
              onClick={() => setGenreFilter('')}
            >
              Todos
            </button>
            {Object.entries(GENRES).map(([name, id]) => (
              <button 
                key={id} 
                className={`genre-tag ${genreFilter === id ? 'active' : ''}`} 
                onClick={() => setGenreFilter(id)}
              >
                {name}
              </button>
            ))}
          </div>

          <button className="history-toggle" onClick={() => setShowHistory(true)}>📜</button>

          {showHistory && (
            <div className="history-panel" onClick={() => setShowHistory(false)}>
              <div className="history-content" onClick={e => e.stopPropagation()}>
                <h3>Vuestros Matches 🍿</h3>
                {matchesHistory.length === 0 ? <p>Aún no hay coincidencias...</p> : (
                  <ul>
                    {matchesHistory.map((m, i) => (
                      <li key={i}>
                        <img src={`https://image.tmdb.org/t/p/w92${m.poster_path}`} alt="poster" />
                        <div><strong>{m.title}</strong><p>{m.release_date?.split('-')[0]}</p></div>
                      </li>
                    ))}
                  </ul>
                )}
                <button className="reload-btn" onClick={() => setShowHistory(false)}>CERRAR</button>
              </div>
            </div>
          )}  

          <div className='cardContainer'>
            {loading ? <div className="loader">BUSCANDO...</div> : currentMovie ? (
              <TinderCard ref={cardRef} className='swipe' key={currentMovie.id} onSwipe={(dir) => swiped(dir, currentMovie)} preventSwipe={['up', 'down']}>
                <div style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${currentMovie.poster_path})` }} className='card' onMouseDown={handlePointerDown} onMouseUp={handlePointerUp} onTouchStart={handlePointerDown} onTouchEnd={handlePointerUp}>
                  <div className="info-hint">Toca para sinopsis ↓</div>
                </div>
              </TinderCard>
            ) : (
              <div className="no-more">
                <div className="no-more-content">
                  <span className="no-more-icon">🍿</span>
                  <p>No hay más pelis</p>
                  <button className="reload-btn" onClick={() => fetchMovies(providerFilter, genreFilter)}>REINTENTAR</button>
                </div>
              </div>
            )}
          </div>

          {!loading && currentMovie && (
            <div className="info-section">
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', width: '100%'}}>
                <h2 style={{margin: 0}}>{currentMovie.title}</h2>
                <span className="info-rating">★ {currentMovie.vote_average.toFixed(1)}</span>
              </div>
              <div className="info-meta">
                <span className="movie-year">{currentMovie.release_date?.split('-')[0]}</span>
                <span style={{color: '#444'}}>•</span>
                <div className="movie-genres">
                  {currentMovie.genre_ids && currentMovie.genre_ids.slice(0, 3).map(id => {
                    const genreName = Object.keys(GENRES).find(key => GENRES[key] === id);
                    return genreName ? <span key={id} className="genre-label">{genreName}</span> : null;
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button className="btn-circle btn-reject" onClick={() => swipeAction('left')}>✕</button>
            <button className="btn-circle btn-heart" onClick={() => swipeAction('right')}>❤</button>
          </div>

          {currentMovie && (
            <div className={`details-panel ${showDetail ? 'open' : ''}`} onClick={toggleDetail}>
              <div className="details-content" onClick={e => e.stopPropagation()}>
                <div className="drag-handle"></div>
                <h3>{currentMovie.title}</h3>
                <p className="overview">{currentMovie.overview || "Sinopsis no disponible."}</p>
              </div>
            </div>
          )}
        </>
      )}

      {matchMovie && (
        <div className="match-overlay" onClick={() => setMatchMovie(null)}>
          <div className="match-content">
            <span style={{fontSize: '3rem'}}>🍿</span>
            <h2 style={{color: 'var(--match-color)', margin: '10px 0'}}>¡IT'S A MATCH!</h2>
            <p>Habéis coincidido en:</p>
            <h3 style={{fontSize: '1.5rem', margin: '15px 0'}}>{matchMovie.title}</h3>
            <button className="reload-btn" onClick={() => setMatchMovie(null)}>¡A VERLA!</button>
          </div>
        </div>
      )}

      <footer className="watermark">
        <p>Created by <strong>Alejandro Tineo Morales</strong></p>
        <span>PollitoScripts © 2026</span>
      </footer>
    </div>
  )
}

export default App
