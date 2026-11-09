// ========================================
// PROJECT DATA - Actual ISF Projects
// ========================================

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'compiler' | 'os' | 'tools' | 'experiments';
  tags: string[];
  image?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  date: string;
  status: 'active' | 'learning' | 'target' | 'completed';
}

export const projects: Project[] = [
  {
    id: 'cplus-compiler',
    title: 'C+ Compiler (Cplus)',
    description: 'Cplus Compiler — Father C and Mother C++, created C+. A custom language compiler bridging C and C++ with unique syntax and toolchain.',
    category: 'compiler',
    tags: ['C++', 'Compiler', 'Lexer', 'Parser', 'LLVM'],
    image: '/assets/projects/cplus.png',
    demoUrl: '#',
    repoUrl: '#',
    featured: true,
    date: '2026-06-26',
    status: 'active',
  },
  {
    id: 'inpianda-os',
    title: 'Inpianda OS',
    description: 'Inpianda OS — 32-bit Protected Mode Operating System with VGA Color graphics. Built from scratch with custom kernel, memory management, and display drivers.',
    category: 'os',
    tags: ['C', 'Assembly', 'Kernel', 'OSDev', 'Protected Mode'],
    image: '/assets/projects/os.png',
    demoUrl: '#',
    repoUrl: '#',
    featured: true,
    date: '2026-06-29',
    status: 'active',
  },
  {
    id: 'cplus-language',
    title: 'C+ Language Specification',
    description: 'Language design for C+ — a hybrid systems programming language combining C simplicity with C++ abstractions. Includes spec, standard library design, and tooling.',
    category: 'compiler',
    tags: ['Language Design', 'C++', 'Systems Programming', 'Standard Library'],
    image: '/assets/projects/cp.png',
    demoUrl: '#',
    repoUrl: '#',
    featured: false,
    date: '2026-06-20',
    status: 'learning',
  },
];

export const categories = [
  { id: 'all', label: 'All', count: projects.length },
  { id: 'compiler', label: 'Compilers', count: projects.filter(p => p.category === 'compiler').length },
  { id: 'os', label: 'Operating Systems', count: projects.filter(p => p.category === 'os').length },
  { id: 'tools', label: 'Tools', count: projects.filter(p => p.category === 'tools').length },
  { id: 'experiments', label: 'Experiments', count: projects.filter(p => p.category === 'experiments').length },
] as const;

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.featured).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === 'all') return projects;
  return projects.filter(p => p.category === category).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function searchProjects(query: string): Project[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return projects;
  return projects.filter(p =>
    p.title.toLowerCase().includes(lower) ||
    p.description.toLowerCase().includes(lower) ||
    p.tags.some(t => t.toLowerCase().includes(lower))
  );
}