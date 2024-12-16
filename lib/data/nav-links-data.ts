export interface LinkProps {
  id: string;
  label: string;
  link: string;
}

export const allLinks: LinkProps[] = [
  {
    id: 'tv',
    label: '电视剧',
    link: '/tv',
  },
  { id: 'movie', label: '电影', link: '/movie' },
  {
    id: 'recommend',
    label: '片单推荐',
    link: '/recommend',
  },
];
