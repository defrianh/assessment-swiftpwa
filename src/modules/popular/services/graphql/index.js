import { useQuery } from '@apollo/client';
import { getProductRelevance } from '@core_modules/popular/services/graphql/schema';

export const getPopularProduct = () => useQuery(getProductRelevance);