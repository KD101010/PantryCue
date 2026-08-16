import type { Tab } from '../types';
import { Icon } from './Icon';

const items: Array<{ tab: Tab; label: string; icon: 'home' | 'kitchen' | 'cart' | 'heart' }> = [
  { tab: 'home', label: 'Home', icon: 'home' },
  { tab: 'kitchen', label: 'Kitchen', icon: 'kitchen' },
  { tab: 'grocery', label: 'Grocery', icon: 'cart' },
  { tab: 'saved', label: 'Saved', icon: 'heart' },
];

export function BottomNav({ tab, onTab, groceryCount }: { tab: Tab; onTab: (tab: Tab) => void; groceryCount: number }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => (
        <button key={item.tab} className={tab === item.tab ? 'nav-item active' : 'nav-item'} onClick={() => onTab(item.tab)}>
          <span className="nav-icon-wrap">
            <Icon name={item.icon} size={22} />
            {item.tab === 'grocery' && groceryCount > 0 && <span className="nav-badge">{groceryCount > 9 ? '9+' : groceryCount}</span>}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
