import { useState, useEffect } from 'react';

const sections = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export function LeftNav() {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const top = (section as HTMLElement).offsetTop;
        const bottom = top + (section as HTMLElement).offsetHeight;

        if (scrollPosition >= top && scrollPosition < bottom) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
      <div className="ml-6 flex flex-col gap-4">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => handleClick(e, section.id)}
            className={`text-sm transition-colors duration-200 ${
              activeSection === section.id
                ? 'text-white font-medium'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
