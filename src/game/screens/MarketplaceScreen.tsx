import { useState } from 'react';
import { Button } from '../../design-system/Button';
import './MarketplaceScreen.css';

// Types
type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical' | 'Eternal';
type CardType = 'pokemon' | 'onepiece';

interface CardListing {
  id: string;
  name: string;
  price: number;
  rarity: Rarity;
  type: CardType;
  image: string;
}

// Mock data for card listings
const MOCK_LISTINGS: CardListing[] = [
  { id: '1', name: 'KLEAVOR VSTAR #249', price: 15.00, rarity: 'Rare', type: 'pokemon', image: '/cards/pokemon/pkm-1.jpeg' },
  { id: '2', name: 'SQUIRTLE #170', price: 85.00, rarity: 'Rare', type: 'pokemon', image: '/cards/pokemon/pkm-2.jpeg' },
  { id: '3', name: "FA/GARDENIA'S VIGOR #GG61", price: 86.00, rarity: 'Rare', type: 'pokemon', image: '/cards/pokemon/pkm-3.jpeg' },
  { id: '4', name: 'KLEAVOR VSTAR #249', price: 86.00, rarity: 'Rare', type: 'pokemon', image: '/cards/pokemon/pkm-4.jpeg' },
  { id: '5', name: 'JOLTEON-HOLO #14', price: 87.00, rarity: 'Rare', type: 'pokemon', image: '/cards/pokemon/pkm-5.jpeg' },
  { id: '6', name: 'FLAREON EX #RC6', price: 88.00, rarity: 'Rare', type: 'pokemon', image: '/cards/pokemon/pkm-6.jpeg' },
  { id: '7', name: 'FA/CYNTHIA #SV82', price: 156.40, rarity: 'Epic', type: 'pokemon', image: '/cards/pokemon/pkm-7.jpeg' },
  { id: '8', name: 'FA/CYNTHIA #SV82', price: 156.40, rarity: 'Epic', type: 'pokemon', image: '/cards/pokemon/pkm-8.jpeg' },
  { id: '9', name: 'PONCHO-WEARING EEVEE #138', price: 821.21, rarity: 'Legendary', type: 'pokemon', image: '/cards/pokemon/pkm-9.jpeg' },
  { id: '10', name: 'MEW ex #232', price: 1440.00, rarity: 'Mythical', type: 'pokemon', image: '/cards/pokemon/pkm-10.jpeg' },
  { id: '11', name: 'PONCHO-WEAR.PIKACHU #230', price: 5592.00, rarity: 'Eternal', type: 'pokemon', image: '/cards/pokemon/pkm-11.jpeg' },
  { id: '12', name: 'LUFFY #001', price: 125.00, rarity: 'Rare', type: 'onepiece', image: '/cards/op/op-1.jpeg' },
  { id: '13', name: 'ZORO #002', price: 145.00, rarity: 'Epic', type: 'onepiece', image: '/cards/op/op-2.jpeg' },
  { id: '14', name: 'NAMI #003', price: 95.00, rarity: 'Rare', type: 'onepiece', image: '/cards/op/op-3.jpeg' },
  { id: '15', name: 'SANJI #004', price: 185.00, rarity: 'Epic', type: 'onepiece', image: '/cards/op/op-4.jpeg' },
  { id: '16', name: 'CHOPPER #005', price: 75.00, rarity: 'Common', type: 'onepiece', image: '/cards/op/op-5.jpeg' },
];

// Rarity badge gradient styles
const RARITY_GRADIENTS: Record<Rarity, string> = {
  Common: 'linear-gradient(147deg, rgb(48, 48, 48) 34%, rgb(47, 47, 47) 24%, rgb(146, 146, 146) 55%, rgb(47, 47, 47) 76%, rgb(113, 113, 113) 118%)',
  Rare: 'linear-gradient(134deg, rgb(20, 83, 122) 34%, rgb(20, 50, 99) 24%, rgb(19, 123, 193) 55%, rgb(20, 50, 99) 76%, rgb(22, 93, 137) 118%)',
  Epic: 'linear-gradient(133deg, rgb(49, 20, 122) 34%, rgb(48, 23, 113) 24%, rgb(123, 55, 249) 55%, rgb(48, 23, 113) 76%, rgb(49, 20, 122) 118%)',
  Legendary: 'linear-gradient(152deg, rgb(242, 125, 5) 34%, rgb(209, 136, 0) 24%, rgb(255, 212, 103) 55%, rgb(209, 136, 0) 76%, rgb(242, 125, 5) 118%)',
  Mythical: 'linear-gradient(147deg, rgb(242, 120, 5) 34%, rgb(223, 89, 0) 24%, rgb(255, 155, 121) 55%, rgb(223, 89, 0) 76%, rgb(242, 120, 5) 118%)',
  Eternal: 'linear-gradient(143deg, rgb(242, 5, 5) 34%, rgb(209, 7, 0) 24%, rgb(255, 93, 93) 55%, rgb(209, 7, 0) 76%, rgb(242, 5, 5) 118%)',
};

// Rarity background glow colors
const RARITY_GLOW: Record<Rarity, string> = {
  Common: 'rgba(124, 124, 124, 0.2)',
  Rare: 'rgba(0, 79, 189, 0.2)',
  Epic: 'rgba(108, 0, 231, 0.2)',
  Legendary: 'rgba(254, 194, 43, 0.2)',
  Mythical: 'rgba(255, 119, 0, 0.2)',
  Eternal: 'rgba(255, 0, 0, 0.2)',
};

// Icons
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ChevronIcon({ direction = 'down' }: { direction?: 'down' | 'left' | 'right' }) {
  const rotation = direction === 'left' ? 90 : direction === 'right' ? -90 : 0;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H20M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function PokemonIcon() {
  return (
    <img src="/pokemon-icon.png" alt="" width="16" height="16" style={{ objectFit: 'contain' }} />
  );
}

function OnePieceIcon() {
  return (
    <img src="/onepiece-icon.png" alt="" width="16" height="16" style={{ objectFit: 'contain' }} />
  );
}

// Toggle component
function Toggle({ isActive, onChange }: { isActive: boolean; onChange: (active: boolean) => void }) {
  return (
    <button 
      className={`marketplace-toggle ${isActive ? 'active' : ''}`}
      onClick={() => onChange(!isActive)}
    >
      <div className="toggle-track" />
      <div className="toggle-thumb" />
    </button>
  );
}

// Card listing component
function CardListingItem({ card }: { card: CardListing }) {
  return (
    <div className="card-listing">
      <div 
        className="card-listing-image-container"
        style={{ 
          background: `linear-gradient(rgba(0,0,0,0) 65%, ${RARITY_GLOW[card.rarity]} 100%), #101010`
        }}
      >
        <img 
          src={card.image} 
          alt={card.name}
          className="card-listing-image"
        />
        <img 
          src={card.image} 
          alt=""
          className="card-listing-image-reflection"
          aria-hidden="true"
        />
      </div>
      {/* Default state: show info */}
      <div className="card-listing-info">
        <p className="card-listing-name">{card.name}</p>
        <div className="card-listing-price-row">
          <div className="card-listing-price-info">
            <span className="card-listing-price-label">Lowest listing</span>
            <span className="card-listing-price">${card.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div 
            className="card-listing-rarity-badge"
            style={{ background: RARITY_GRADIENTS[card.rarity] }}
          >
            {card.rarity}
          </div>
        </div>
      </div>
      {/* Hover state: show actions */}
      <div className="card-listing-actions">
        <Button variant="secondary" size="small" className="card-listing-offer-btn">Offer</Button>
        <Button variant="primary" size="small" className="card-listing-buy-btn">Buy now</Button>
      </div>
    </div>
  );
}

export function MarketplaceScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pokemon' | 'onepiece'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [listedOnly, setListedOnly] = useState(true);
  const [sortBy, setSortBy] = useState('price-low');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort listings
  const filteredListings = MOCK_LISTINGS
    .filter(card => {
      if (activeFilter !== 'all' && card.type !== activeFilter) return false;
      if (searchQuery && !card.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  const itemsPerPage = 24;
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="marketplace-screen">
      <div className="marketplace-container">
        {/* Type Filter Chips */}
        <div className="marketplace-type-filters">
          <button 
            className={`type-chip ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`type-chip ${activeFilter === 'pokemon' ? 'active' : ''}`}
            onClick={() => setActiveFilter('pokemon')}
          >
            <PokemonIcon />
            Pokémon
          </button>
          <button 
            className={`type-chip ${activeFilter === 'onepiece' ? 'active' : ''}`}
            onClick={() => setActiveFilter('onepiece')}
          >
            <OnePieceIcon />
            One Piece
          </button>
        </div>

        {/* Sort & Filter Bar */}
        <div className="marketplace-sort-filter">
          <div className="marketplace-search">
            <SearchIcon />
            <input 
              type="text"
              placeholder="Search card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="marketplace-controls">
            <div className="marketplace-listed-toggle">
              <span>Listed</span>
              <Toggle isActive={listedOnly} onChange={setListedOnly} />
            </div>
            <div className="marketplace-sort">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronIcon />
            </div>
            <button className="marketplace-filter-btn">
              <FilterIcon />
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="marketplace-cards-grid">
          {paginatedListings.map((card) => (
            <CardListingItem key={card.id} card={card} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="marketplace-pagination">
            <button 
              className="pagination-btn prev"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronIcon direction="left" />
              Previous
            </button>
            
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            
            {totalPages > 3 && (
              <>
                <span className="pagination-ellipsis">...</span>
                <button
                  className="pagination-btn next"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                  <ChevronIcon direction="right" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
