import MediaPage from '@/components/media/media-page';

type PageParams = Promise<{ slug: string }>;

export default function MoviePage(props: { params: PageParams }) {
  return <MediaPage params={props.params} type="movie" />;
}
