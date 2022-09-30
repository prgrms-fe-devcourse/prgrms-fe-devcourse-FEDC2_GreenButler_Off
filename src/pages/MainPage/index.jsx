import styled from '@emotion/styled';
import { PageWrapper, Spinner } from 'components';
import { getPostsPart } from 'utils/apis/postApi';
import PostItem from './PostItem';
import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';

const LIMIT = 5;

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [max, setMax] = useState(0);
  const targetRef = useRef(null);

  const { data: initialPosts } = useSWR(
    `/posts/channel/${process.env.REACT_APP_CHANNEL_ID_TOTAL}?offset=0&limit=5`,
  );

  useEffect(() => {
    if (initialPosts) {
      setPosts([...initialPosts]);
      setMax(initialPosts[0].channel.posts.length);
      setOffset(offset + LIMIT);
    }
  }, [initialPosts]);

  const onIntersect = async ([entry], observer) => {
    if (entry.isIntersecting && !isLoading && offset < max) {
      observer.disconnect();
      setIsLoading(true);
      setOffset(offset + 5);
      const { data: nextPosts } = await getPostsPart({
        offset,
        limit: LIMIT,
      });
      setPosts([...posts, ...nextPosts]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let observer;
    if (targetRef.current) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.5,
      });
      observer.observe(targetRef.current);
    }
    return () => observer && observer.disconnect();
  }, [posts.length]);

  return (
    <PageWrapper header nav info>
      <PostList>
        {posts?.map((post, i) => {
          return (
            <li key={i} ref={posts.length - 1 === i ? targetRef : null}>
              <PostItem key={i} index={i} post={post} />
            </li>
          );
        })}
      </PostList>
      <Spinner loading={isLoading} />
    </PageWrapper>
  );
};

const PostList = styled.ul``;

export default MainPage;
