import { Search } from '@elastic/elasticsearch/api/requestParams'
import { Document } from 'lib/types'
import { BoolQuery, AggregationsBody } from '..'

export type SearchRequest<TDocument extends Document, TAggregations extends AggregationsBody<TDocument>> = {
    size?: number
    from?: number
    query?: BoolQuery<TDocument>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    aggregations?: TAggregations
}

export const getSearchRequest = <TDocument extends Document, TAggregations extends AggregationsBody<TDocument>>(
    index: string,
    options?: SearchRequest<TDocument, TAggregations>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Search<Record<string, any>> => {
    const { size, from, query, aggregations } = options || {}

    return {
        index,
        size,
        from,
        body: {
            query,
            aggregations
        }
    }
}
