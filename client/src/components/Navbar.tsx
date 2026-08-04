export function Navbar() {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 mb-5">
      <nav className="w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="text-2xl cursor-pointer hover:underline">
            KafkaLab
          </a>
        </div>
      </nav>
    </header>
  )
}
