import { useUserContext } from 'contexts/UserContext';
import useSWR from 'swr';

export const postListKey = `/posts/channel/${process.env.REACT_APP_CHANNEL_ID}?offset=0&limit=5`;

const useSWRPostList = () => {
  const { data, error, isValidating, mutate } = useSWR(postListKey);
  const { currentUser } = useUserContext();

  const mutateLike = (type, index, like) => {
    if (!data) {
      return;
    }

    const initialPostList = [...data];
    const currentPost = initialPostList[index];
    let updatedPost;

    switch (type) {
      case 'LIKE': {
        updatedPost = {
          ...currentPost,
          likes: [...currentPost.likes, like],
        };
        break;
      }
      case 'DISLIKE': {
        updatedPost = {
          ...currentPost,
          likes: currentPost.likes.filter(({ user }) => user !== currentUser.id),
        };
        break;
      }
    }

    const updatedPostList = [
      ...initialPostList.slice(0, index),
      updatedPost,
      ...initialPostList.slice(index + 1),
    ];
    mutate(updatedPostList, {
      revalidate: false,
    });
  };

  const mutateDeletion = (postId) => {
    const updatedPostList = data.filter(({ _id }) => _id !== postId);
    mutate(updatedPostList, {
      revalidate: true,
    });
  };

  return {
    data,
    error,
    isValidating,
    mutate,
    mutateLike,
    mutateDeletion,
  };
};

export default useSWRPostList;
