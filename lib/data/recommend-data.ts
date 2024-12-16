export interface RecommendProps {
  imdb_id: string;
  tmdb_id?: number;
  media_type?: 'movie' | 'tv';
  note: string;
}

export const yikZeroRecommends: RecommendProps[] = [
  {
    imdb_id: 'tt31392609',
    tmdb_id: 1103621,
    note: '姥姥的外孙',
    media_type: 'movie',
  },
  {
    imdb_id: 'tt14688458',
    tmdb_id: 125988,
    note: '末日地堡',
    media_type: 'tv',
  },
  {
    imdb_id: 'tt1677720',
    tmdb_id: 333339,
    note: '头号玩家',
    media_type: 'movie',
  },
  {
    imdb_id: 'tt24640580',
    tmdb_id: 126485,
    note: '超异能族',
    media_type: 'tv',
  },
];

export const ccRecommends: RecommendProps[] = [
  {
    imdb_id: 'tt11769304',
    tmdb_id: 96102,
    note: '机智医生生活',
    media_type: 'tv',
  },
  {
    imdb_id: 'tt5182866',
    tmdb_id: 64010,
    note: '请回答1988',
    media_type: 'tv',
  },
  {
    imdb_id: 'tt29025660',
    tmdb_id: 234133,
    note: '我有一个朋友',
    media_type: 'tv',
  },
  {
    imdb_id: 'tt0221735',
    tmdb_id: 35790,
    note: '魔卡少女樱',
    media_type: 'tv',
  },
];
