import { useState, useEffect, useRef } from 'react';
import { gameStore } from '../game/store';
import { CurrencyIcon } from './CurrencyIcon';
import { CreditIcon } from './CreditIcon';
import { Button } from '../design-system/Button';
import { CountUpNumber } from './CountUpNumber';
import './Header.css';

export function Header() {
  const [state, setState] = useState(gameStore.getState());
  const [showBalanceDropdown, setShowBalanceDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'explore' | 'listings'>('explore');
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const balanceDropdownRef = useRef<HTMLDivElement>(null);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      setState(gameStore.getState());
    });
    return unsubscribe;
  }, []);

  // USDC and Credits are separate
  const usdcBalance = state.usdcBalance;
  const creditsBalance = state.credits;

  return (
    <header className="global-header">
      <div className="header-container">
        {/* Category Tabs */}
        <div className="header-tabs">
          <button 
            className={`header-tab ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            Explore
          </button>
          <button 
            className="header-tab disabled"
            disabled
            title="Coming soon"
          >
            Your listings
          </button>
        </div>

        <div className="header-right">
          {/* USDC Balance and Profile - share same dropdown */}
          <div 
            className="balance-profile-group"
            onMouseEnter={() => setShowBalanceDropdown(true)}
            onMouseLeave={() => setShowBalanceDropdown(false)}
          >
            {/* USDC Balance - default state only */}
            <div 
              className="balance-container"
              ref={balanceDropdownRef}
            >
              <div className="balance-display">
                <CurrencyIcon size={16} />
                <span className="balance-amount">
                  <CountUpNumber value={usdcBalance} duration={800} />
                </span>
              </div>
            </div>

            {/* Profile Avatar */}
            <div 
              className="profile-container" 
              ref={profileDropdownRef}
            >
              <button
                className="profile-avatar"
                aria-label="Profile"
              >
                <img 
                  src="/pfp.png" 
                  alt="Profile" 
                  className="avatar-image"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
                <div className="avatar-placeholder" style={{ display: 'none' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="9" r="3" fill="currentColor"/>
                    <path d="M6 20C6 16 8.5 14 12 14C15.5 14 18 16 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </button>
            </div>

            {/* Balance Dropdown - shared by both balance and profile */}
            <div 
              className={`balance-dropdown ${showBalanceDropdown ? 'visible' : 'hidden'}`}
              onMouseEnter={() => setShowBalanceDropdown(true)}
              onMouseLeave={() => setShowBalanceDropdown(false)}
            >
                <div className="dropdown-item">
                  <div className="dropdown-item-left">
                    <CurrencyIcon size={14} className="dropdown-item-icon" />
                    <div className="dropdown-label">USDC</div>
                  </div>
                  <div className="dropdown-value">
                    <CountUpNumber value={usdcBalance} duration={800} />
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item">
                  <div className="dropdown-item-left">
                    <CreditIcon size={14} className="dropdown-item-icon" />
                    <div className="dropdown-label">Credits</div>
                  </div>
                  <div className="dropdown-value">
                    <CountUpNumber value={creditsBalance} duration={800} />
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-action">
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => {
                      gameStore.topUp();
                      // Don't close dropdown on click - only close on mouse leave
                    }}
                    className="dropdown-top-up-button"
                  >
                    Top up 1K
                  </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
