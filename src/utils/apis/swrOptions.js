import { instance } from './common';

export const swrOptions = {
  fetcher: async (url) => {
    const { data } = await instance.get(url);
    return data;
  },
};
