import { Document } from 'lib/types'
import { ShouldQuery } from './get-should'
import { MustQuery } from './get-must'
import { MustNotQuery } from './get-must-not'

export type BoolQueryBody<TDocument extends Document> = MustQuery<TDocument> & ShouldQuery<TDocument> & MustNotQuery<TDocument>

export type BoolQuery<TDocument extends Document> = {
    bool: BoolQueryBody<TDocument> | Array<BoolQueryBody<TDocument>>
}

export const getBoolQuery = <TDocument extends Document>(bool: BoolQueryBody<TDocument> | Array<BoolQueryBody<TDocument>>): BoolQuery<TDocument> => ({
    bool
})
