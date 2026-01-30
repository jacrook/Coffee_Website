interface TopBarProps {
  onContactClick?: () => void;
}

export function TopBar({ onContactClick }: TopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-center items-center text-sm text-gray-300">
        <button
          onClick={onContactClick}
          className="font-light cursor-pointer hover:text-white transition-colors duration-200"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          Let's grab a coffee
          <span className="mx-2 text-gray-500">•</span>
          Oak Park
          <span className="mx-2 text-gray-500">•</span>
          Forest Park
        </button>
      </div>
    </div>
  );
}
