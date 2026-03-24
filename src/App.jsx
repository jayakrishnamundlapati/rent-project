import { useState, useEffect } from 'react';
import Header from './components/Header';
import PropertyCard from './components/PropertyCard';
import Filters from './components/Filters';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    sortBy: '',
    sharingType: '',
    gender: '',
    price: 60000,
    amenities: [],
    localitySearch: ''
  });

  const fetchProperties = (query = '') => {
    setLoading(true);
    const isDev = window.location.hostname === 'localhost';
    const API_BASE_URL = isDev ? 'http://localhost:3001' : '';
    const url = query ? `${API_BASE_URL}/api/properties?search=${query}` : `${API_BASE_URL}/api/properties`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch properties:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = () => {
    fetchProperties(searchQuery);
    setSelectedArea(''); // Show search results across all areas
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const areas = ['Bellandur', 'Electronic City', 'K.R Puram', 'Varthur', 'Yelahanka', 'Kaggadasapura', 'Brookefield', 'Whitefield'];

  const filteredProperties = (() => {
    let result = properties.filter(p => {
      // Area filter
      if (selectedArea && p.area_name !== selectedArea) return false;
      
      const details = p.details ? JSON.parse(p.details) : {};
      const typeStr = details.type || 'BHK2';
      const rent = details.rent ? parseFloat(details.rent) : 20000;
      
      // Price Filter
      if (rent > filters.price) return false;
      
      // Gender Filter (approximation based on lease_type)
      if (filters.gender === 'Men' || filters.gender === 'Women') {
        if (details.lease_type === 'FAMILY') return false; 
      }
      
      // Sharing Type
      if (filters.sharingType) {
        if (filters.sharingType === 'Private' && typeStr !== 'BHK1' && typeStr !== 'RK1') return false;
        if (filters.sharingType === '2 Sharing' && typeStr !== 'BHK2') return false;
        if (filters.sharingType === '3 Sharing' && typeStr !== 'BHK3') return false;
        if (filters.sharingType === 'More than 3 Sharing' && typeStr !== 'BHK4' && typeStr !== 'BHK4PLUS') return false;
      }
      
      // Amenities
      if (filters.amenities.length > 0) {
        if (filters.amenities.includes('Gym') && details.gym != 1) return false;
        if (filters.amenities.includes('Parking') && details.parking === 'NONE') return false;
      }

      return true;
    });

    // Locality Search Filter
    if (filters.localitySearch) {
      const qs = filters.localitySearch.toLowerCase();
      result = result.filter(p => p.location.toLowerCase().includes(qs) || p.area_name.toLowerCase().includes(qs));
    }

    // Sort By
    if (filters.sortBy === 'lowToHigh') {
      result.sort((a,b) => {
        const aRent = a.details ? JSON.parse(a.details).rent || 20000 : 20000;
        const bRent = b.details ? JSON.parse(b.details).rent || 20000 : 20000;
        return aRent - bRent;
      });
    } else if (filters.sortBy === 'highToLow') {
      result.sort((a,b) => {
        const aRent = a.details ? JSON.parse(a.details).rent || 20000 : 20000;
        const bRent = b.details ? JSON.parse(b.details).rent || 20000 : 20000;
        return bRent - aRent;
      });
    }

    return result;
  })();

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-wrapper">
      <Header onLogout={() => setIsAuthenticated(false)} />
      
      <main className="main-content">
        {!selectedArea && !searchQuery && (
          <section className="hero-section">
            <div className="container">
              <div className="hero-content">
                <span className="badge-new">PG Management Systems</span>
                <h2 className="hero-title">
                  Discover Top PGs in <span className="highlight-text">Bangalore</span>
                </h2>
                <p className="hero-subtitle">
                  Select a location below to view all available PG accommodations loaded directly from the datasets.
                </p>
                
                <div className="search-bar glass-panel">
                  <div className="search-input">
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input 
                      type="text" 
                      placeholder="Search by location (e.g., Bellandur)..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <button className="btn-primary search-btn" onClick={handleSearch}>Search</button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="properties-section container">
          {!selectedArea && !searchQuery ? (
            // FIRST VIEW: ONLY THE NAMES
            <div>
              <div className="section-header">
                <div>
                  <h2 className="section-title">Select Your Location</h2>
                </div>
              </div>
              
              <div className="locations-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                marginTop: '2rem'
              }}>
                {areas.map((area) => (
                  <div 
                    key={area} 
                    className="location-card glass-panel"
                    onClick={() => setSelectedArea(area)}
                    style={{
                      padding: '2rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: '12px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{area}</h3>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>View Database</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // SECOND VIEW: PROPERTIES IN THAT LOCATION
            <div>
              <div className="results-header-container">
                  
                  {/* Left Area: Filter Toggle */}
                  <div className="results-header-left">
                    <button 
                      onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                      className="btn-secondary filter-toggle-btn"
                      title="Toggle Filters"
                    >
                      <span style={{
                        display: 'inline-block',
                        transition: 'transform 0.4s ease',
                        transform: isFiltersOpen ? 'rotate(90deg)' : 'rotate(0deg)'
                      }}>
                        {isFiltersOpen ? '✕' : '☰'}
                      </span>
                      <span>{isFiltersOpen ? 'Close Filters' : 'Show Filters'}</span>
                    </button>
                  </div>
                  
                  {/* Center Area: Title and Subtitle */}
                  <div className="results-header-center">
                    <h2 className="section-title" style={{ marginBottom: '5px' }}>
                      {searchQuery ? 'Search Results' : `${selectedArea} Properties`}
                    </h2>
                    <p className="section-desc" style={{ margin: 0 }}>Showing {filteredProperties.length} stunning PGs.</p>
                  </div>
                  
                  {/* Right Area: Back Button */}
                  <div className="results-header-right">
                    <button 
                       className="btn-secondary" 
                       onClick={() => { setSelectedArea(''); setSearchQuery(''); }}
                    >
                      ← Back
                    </button>
                  </div>
                  
              </div>

              <div className="layout-with-sidebar">
                {isFiltersOpen && (
                  <aside className="filters-sidebar">
                    <Filters filters={filters} setFilters={setFilters} />
                  </aside>
                )}
                
                <div className="properties-grid" style={{ flexGrow: 1 }}>
                  {loading ? (
                    <p>Loading PGs from database...</p>
                  ) : filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))
                  ) : (
                    <p>No PGs found matching your criteria.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="footer border-top">
        <div className="container">
          <div className="footer-content">
            <div className="brand-info">
              <h2>PG Management<span className="accent">Systems</span></h2>
              <p>Your premium partner for finding the perfect PG accommodation in Bangalore.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 PG Management Systems. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
