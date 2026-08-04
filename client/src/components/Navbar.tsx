type NavbarProps = {
  onReset: () => void
  resetting: boolean
}

export function Navbar({ onReset, resetting }: NavbarProps) {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 mb-5">
      <nav className="w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl">Kafka Lab</span>
          <button
            type="button"
            onClick={onReset}
            disabled={resetting}
            className="cursor-pointer enabled:hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetting ? '초기화 중…' : '초기화'}
          </button>
        </div>
      </nav>
    </header>
  )
}
