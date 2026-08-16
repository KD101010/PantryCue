export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'brand brand-compact' : 'brand'}>
      <img src={`${import.meta.env.BASE_URL}pantrycue-logo.png`} alt="" className="brand-mark" />
      <div className="brand-copy">
        <strong>PantryCue</strong>
        {!compact && <span>Cook what you have.</span>}
      </div>
    </div>
  );
}
