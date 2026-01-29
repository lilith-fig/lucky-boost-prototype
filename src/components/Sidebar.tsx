import { useState } from 'react';
import './Sidebar.css';

// Icon components for menu items
function MarketplaceIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.90004 13.075C4.57502 13.075 3.49501 12 3.49501 10.67V9.57001C3.49501 9.235 3.82501 9.01 4.14002 9.12C4.27002 9.165 4.40002 9.195 4.53502 9.215C4.59502 9.225 4.65502 9.235 4.71502 9.235C4.79002 9.245 4.87003 9.25 4.94503 9.25C5.50003 9.25 6.05004 9.045 6.48504 8.69C6.90005 9.045 7.43505 9.25 8.00506 9.25C8.57507 9.25 9.10507 9.055 9.52008 8.695C9.95008 9.045 10.4901 9.25 11.0401 9.25C11.1251 9.25 11.2151 9.245 11.2951 9.235C11.3551 9.23 11.4051 9.225 11.4601 9.215C11.6101 9.195 11.7451 9.155 11.8801 9.11C12.1901 9.005 12.5151 9.235 12.5151 9.56001V10.67C12.5151 11.995 11.4401 13.075 10.1101 13.075H5.90004Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.5849 2.92482C11.9899 2.92482 12.6499 3.51517 12.8499 4.96518L12.9898 6.29526C13.0398 6.7952 12.91 7.2801 12.62 7.66505C12.26 8.16502 11.6851 8.45019 11.0452 8.45021C10.4502 8.45021 9.87481 8.15503 9.50481 7.68003C9.17479 8.15997 8.62998 8.45021 8.01001 8.45021C7.39003 8.4502 6.83501 8.14484 6.51001 7.65985C6.14007 8.14477 5.56022 8.45011 4.95533 8.45021C4.33032 8.45021 3.7702 8.17977 3.4052 7.70477C3.10024 7.31478 2.96002 6.81478 3.01001 6.29982L3.14022 4.98016C3.34521 3.51524 3.99993 2.9249 5.40975 2.92482H10.5849ZM8.00025 3.99969C7.8801 3.99941 7.78262 4.09695 7.78215 4.21714C7.7807 4.61761 7.6756 4.86954 7.51457 5.02508C7.35178 5.18229 7.09509 5.27615 6.71509 5.28159C6.59549 5.28329 6.49954 5.38141 6.50025 5.50099C6.5011 5.62063 6.59808 5.71769 6.7177 5.71779C7.13994 5.71779 7.39076 5.82925 7.54061 5.99123C7.69379 6.15687 7.77884 6.41464 7.78215 6.78354C7.78322 6.90125 7.87738 6.9965 7.99504 6.99904C8.11275 7.00146 8.21104 6.91022 8.21705 6.79266C8.2366 6.4028 8.34059 6.14101 8.50155 5.9769C8.65984 5.81554 8.9055 5.71637 9.28085 5.71779C9.40037 5.7182 9.49809 5.62182 9.4996 5.50229C9.50102 5.38282 9.40553 5.2848 9.28606 5.28224C8.87431 5.2734 8.61749 5.16396 8.46184 5.00229C8.30575 4.8401 8.21626 4.58818 8.2177 4.21844C8.21803 4.09823 8.12048 4.00014 8.00025 3.99969Z" fill="currentColor"/>
    </svg>
  );
}

function FAQsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <text x="8" y="11" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600">?</text>
    </svg>
  );
}

function XTwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.6 2H14.8L10 7.6L15.5 14H11.1L7.7 9.5L3.8 14H1.6L6.7 8L1.4 2H5.9L9 6.2L12.6 2ZM11.9 12.8H13L5.1 3.2H4L11.9 12.8Z" fill="currentColor"/>
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 3.5C12.5 3 11.4 2.6 10.3 2.4C10.2 2.6 10 2.9 9.9 3.1C8.7 2.9 7.5 2.9 6.3 3.1C6.2 2.9 6 2.6 5.9 2.4C4.8 2.6 3.7 3 2.7 3.5C0.8 6.5 0.3 9.4 0.6 12.3C1.9 13.3 3.2 13.9 4.4 14.3C4.7 13.9 5 13.4 5.2 12.9C4.7 12.7 4.3 12.5 3.9 12.2C4 12.1 4.1 12 4.2 11.9C6.7 13.1 9.5 13.1 12 11.9C12.1 12 12.2 12.1 12.3 12.2C11.9 12.5 11.5 12.7 11 12.9C11.2 13.4 11.5 13.9 11.8 14.3C13 13.9 14.3 13.3 15.6 12.3C15.9 8.9 15.1 6 13.5 3.5ZM5.5 10.5C4.8 10.5 4.2 9.8 4.2 9C4.2 8.2 4.8 7.5 5.5 7.5C6.2 7.5 6.8 8.2 6.8 9C6.8 9.8 6.2 10.5 5.5 10.5ZM10.7 10.5C10 10.5 9.4 9.8 9.4 9C9.4 8.2 10 7.5 10.7 7.5C11.4 7.5 12 8.2 12 9C12 9.8 11.4 10.5 10.7 10.5Z" fill="currentColor"/>
    </svg>
  );
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  isExternal?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
}

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem] = useState('marketplace');

  const primaryMenuItems: MenuItem[] = [
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: <MarketplaceIcon />,
      isActive: true,
    },
  ];

  const secondaryMenuItems: MenuItem[] = [
    {
      id: 'faqs',
      label: 'FAQs',
      icon: <FAQsIcon />,
      isDisabled: true,
    },
    {
      id: 'twitter',
      label: 'Visit us',
      icon: <XTwitterIcon />,
      isDisabled: true,
    },
    {
      id: 'discord',
      label: 'Community',
      icon: <DiscordIcon />,
      isDisabled: true,
    },
  ];

  const renderMenuItem = (item: MenuItem) => {
    const isActive = item.isActive || activeItem === item.id;
    const content = (
      <>
        <div className="menu-item-icon">{item.icon}</div>
        <span className={`menu-item-label ${isExpanded ? 'visible' : ''}`}>
          {item.label}
        </span>
      </>
    );

    const className = `sidebar-menu-item ${isActive ? 'active' : ''} ${item.isDisabled ? 'disabled' : ''}`;

    if (item.isDisabled) {
      return (
        <div key={item.id} className={className}>
          {content}
        </div>
      );
    }

    if (item.href) {
      return (
        <a
          key={item.id}
          href={item.href}
          target={item.isExternal ? '_blank' : undefined}
          rel={item.isExternal ? 'noopener noreferrer' : undefined}
          className={className}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        key={item.id}
        className={className}
        onClick={item.onClick}
      >
        {content}
      </button>
    );
  };

  return (
    <aside
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <img
          src={isExpanded ? '/2c99366f84d2d694fe289d29bf68b5e8dcc48a31.png' : '/39790c78c2825b92f23878feb92d4ad7e47e86a5.png'}
          alt="GACHA"
          className={`sidebar-logo-image ${isExpanded ? 'expanded' : 'collapsed'}`}
        />
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {/* Primary Menu */}
        <div className="sidebar-menu-group">
          {primaryMenuItems.map(renderMenuItem)}
        </div>

        {/* Divider */}
        <div className="sidebar-divider" />

        {/* Secondary Menu */}
        <div className="sidebar-menu-group">
          {secondaryMenuItems.map(renderMenuItem)}
        </div>
      </nav>
    </aside>
  );
}
