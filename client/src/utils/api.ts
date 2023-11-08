import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IOrder } from '../../../shared';

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5174/api' }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    getOrdersStats: builder.query<IOrder[], string>({
      query: (sorter) => `orders/stats` + (sorter ? `?sortBy=${sorter}` : ''),
      transformResponse: (response: {body: {data: IOrder[]}}) => response.body.data,
    }),
    getOrders: builder.query<{rows: IOrder[], total: number}, Record<string, string>>({
      query: ({sorter, limit, offset}) => {
        const params = new URLSearchParams({sortBy: sorter, limit, offset}).toString();
        return 'orders' + (params ? `?${params}` : '');
      },
      transformResponse: (response: {body: {data: {rows: IOrder[], total: number}}}) => response.body.data,
      providesTags: () => ['Orders']
    }),
    getOrderById: builder.query<IOrder, number>({
      query: (orderId: number) => `orders/${orderId}`,
      transformResponse: (response: {body: {data: IOrder}}) => response.body.data,
      providesTags: () => ['Orders']
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders']
    }),
    updateOrder: builder.mutation({
      query: (body) => ({
        url: `/orders/${body.id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Orders']
    }),
  })
});

export default api;
export const { 
  useGetOrderByIdQuery, 
  useGetOrdersQuery, 
  useCreateOrderMutation, 
  useUpdateOrderMutation, 
  useGetOrdersStatsQuery 
} = api;