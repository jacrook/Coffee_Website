export function ContentPanel() {
  return (
    <div className="relative z-30 max-w-4xl mx-auto px-6 py-20">
      {/* About Section */}
      <section
        id="about"
        data-section
        className="mb-32 bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 shadow-xl"
      >
        <h2 className="text-3xl font-serif text-white mb-6">About Me</h2>
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>
            I'm a developer with a passion for creating unique, interactive web experiences.
            This letterboard portfolio showcases my love for combining retro aesthetics with
            modern web technologies.
          </p>
          <p>
            Each letter tile on this page is individually draggable and snaps to the board's
            grooves, just like a real letterboard. The entire experience is built with React,
            TypeScript, and @dnd-kit for drag-and-drop functionality.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        data-section
        className="mb-32 bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 shadow-xl"
      >
        <h2 className="text-3xl font-serif text-white mb-6">Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-black/20 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-medium text-white mb-2">Letterboard Portfolio</h3>
            <p className="text-gray-400 text-sm mb-4">
              This very website! A drag-and-drop letterboard experience.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                React
              </span>
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                TypeScript
              </span>
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                @dnd-kit
              </span>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-medium text-white mb-2">More Coming Soon</h3>
            <p className="text-gray-400 text-sm mb-4">
              Stay tuned for more projects!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        data-section
        className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 shadow-xl"
      >
        <h2 className="text-3xl font-serif text-white mb-6">Get In Touch</h2>
        <div className="text-gray-300">
          <p className="mb-4">
            Want to collaborate or just chat? Feel free to reach out!
          </p>
          <a
            href="mailto:hello@example.com"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            hello@example.com
          </a>
        </div>
      </section>
    </div>
  );
}
