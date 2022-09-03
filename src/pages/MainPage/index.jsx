import styled from '@emotion/styled';
import { PageWrapper, Spinner } from 'components';
import { getPostsPart } from 'utils/apis/postApi';
import PostItem from './PostItem';
import { useState, useEffect, useCallback, useRef } from 'react';
import useScrollPosition from 'hooks/useScrollPosition';

const LIMIT = 5;

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [max, setMax] = useState(0);
  const targetRef = useRef(null);
  const [prevPostIndex, setPrevPostIndex] = useScrollPosition();

  useEffect(() => {
    const limit = prevPostIndex ? prevPostIndex : LIMIT;
    (async () => {
      const { data: nextPosts } = await getPostsPart({
        offset,
        limit,
      });
      setPosts(nextPosts);
      setMax(nextPosts[0].channel.posts.length);
      setOffset(prevPostIndex ? prevPostIndex : LIMIT);
    })();
  }, []);

  useEffect(() => {
    if (targetRef.current && prevPostIndex) {
      window.scrollTo(0, document.body.scrollHeight);
      setPrevPostIndex(0);
    }
  }, [targetRef, prevPostIndex, setPrevPostIndex]);

  const onIntersect = useCallback(
    async ([entry], observer) => {
      if (entry.isIntersecting && !isLoading && offset < max) {
        observer.disconnect();
        setIsLoading(true);
        setOffset(offset + 5);
        const nextPosts = await getPostsPart({
          offset,
          limit: LIMIT,
        }).then((res) => res.data);
        setPosts([...posts, ...nextPosts]);
        setIsLoading(false);
      }
    },
    [isLoading, offset, max, posts],
  );

  useEffect(() => {
    let observer;
    if (targetRef.current) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.5,
      });
      observer.observe(targetRef.current);
    }
    return () => observer && observer.disconnect();
  }, [onIntersect]);

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
