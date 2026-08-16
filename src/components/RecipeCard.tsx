import type { RecipeMatch } from '../types';
import { matchLabel } from '../lib/matching';
import { Icon } from './Icon';

export function RecipeCard({
  match,
  saved,
  onOpen,
  onToggleSaved,
  compact = false,
}: {
  match: RecipeMatch;
  saved: boolean;
  onOpen: () => void;
  onToggleSaved: () => void;
  compact?: boolean;
}) {
  const status = matchLabel(match);
  const ready = match.missing.length === 0;

  return (
    <article className={`recipe-card ${compact ? 'recipe-card-compact' : ''}`}>
      <button className="recipe-card-main" onClick={onOpen} aria-label={`Open ${match.recipe.title}`}>
        <div className="recipe-art" aria-hidden="true">
          <span>{foodEmoji(match.recipe.tags, match.recipe.title)}</span>
        </div>
        <div className="recipe-card-copy">
          <div className="recipe-status-row">
            <span className={ready ? 'status-pill ready' : 'status-pill almost'}>
              {ready && <Icon name="check" size={13} />}
              {status}
            </span>
            {match.usesSoon > 0 && <span className="use-soon-pill">Uses {match.usesSoon} soon</span>}
          </div>
          <h3>{match.recipe.title}</h3>
          <p>{match.recipe.summary}</p>
          <div className="recipe-meta">
            <span><Icon name="clock" size={14} /> {match.recipe.minutes} min</span>
            <span><Icon name="people" size={14} /> {match.recipe.servings}</span>
            <span>{match.recipe.difficulty}</span>
          </div>
        </div>
      </button>
      <button className={`save-button ${saved ? 'saved' : ''}`} onClick={onToggleSaved} aria-label={saved ? 'Remove from saved recipes' : 'Save recipe'}>
        <Icon name="heart" size={20} fill={saved ? 'currentColor' : 'none'} />
      </button>
    </article>
  );
}

function foodEmoji(tags: string[], title: string): string {
  const haystack = `${tags.join(' ')} ${title}`.toLowerCase();
  if (haystack.includes('breakfast') || haystack.includes('egg')) return '🍳';
  if (haystack.includes('taco') || haystack.includes('tex-mex') || haystack.includes('burrito')) return '🌮';
  if (haystack.includes('soup') || haystack.includes('chili')) return '🥣';
  if (haystack.includes('pasta') || haystack.includes('spaghetti') || haystack.includes('ziti')) return '🍝';
  if (haystack.includes('pizza')) return '🍕';
  if (haystack.includes('salmon') || haystack.includes('fish') || haystack.includes('shrimp')) return '🍤';
  if (haystack.includes('rice') || haystack.includes('bowl')) return '🍚';
  if (haystack.includes('sandwich') || haystack.includes('melt') || haystack.includes('toast')) return '🥪';
  if (haystack.includes('vegetarian') || haystack.includes('veggie')) return '🥦';
  return '🍽️';
}
