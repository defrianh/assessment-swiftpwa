import { useMutation, useQuery } from '@apollo/react-hooks';
import * as Schema from '../schema/customer';

export const addWishlist = () => useMutation(Schema.addWishlist, {
    context: {
        request: 'internal',
    },
});

export const removeWishlist = () => useMutation(Schema.removeWishlist, {
    context: {
        request: 'internal',
    },
});

export const getRewardPoint = (variables) => useQuery(Schema.getRewardPoint, {
    context: {
        request: 'internal',
    },
    skip: typeof window === 'undefined',
    fetchPolicy: 'no-cache',
    variables,
});

export const getCustomer = () => useQuery(Schema.getCustomer, {
    variables: {},
    context: {
        request: 'internal',
    },
    skip: typeof window === 'undefined',
    fetchPolicy: 'cache-and-network',
});

export default {
    addWishlist,
    removeWishlist,
    getCustomer,
    getRewardPoint,
};
