import { Injectable } from '@nestjs/common'
import { ElasticsearchService as ElasticsearchBaseService } from '@nestjs/elasticsearch'
import { ClassConstructor, Document } from 'lib/types'
import { ELASTICSEARCH_INDEX_NAME_METADATA } from 'lib/constants'
import { ElasticsearchResult, getSearchRequest, getSearchResponse, SearchRequest } from 'lib/elasticsearch'
import { AggregationList } from 'lib/aggregations'
import { Index } from './injectables'

@Injectable()
export class ElasticsearchService {
    constructor(private readonly elasticsearchBaseService: ElasticsearchBaseService) {}

    search<TDocument extends Document, TAggregationsBody extends Record<string, AggregationList<TDocument>>>(
        document: ClassConstructor<TDocument>,
        options?: SearchRequest<TDocument, TAggregationsBody>
    ) {
        const index = Reflect.getMetadata(ELASTICSEARCH_INDEX_NAME_METADATA, document)

        if (!index) {
            throw new Error('Failed to find Index Name')
        }

        const request = getSearchRequest<TDocument, TAggregationsBody>(index, options)

        return this.elasticsearchBaseService
            .search<ElasticsearchResult<TDocument, TAggregationsBody>>(request)
            .then(response => getSearchResponse(document, response))
    }

    getIndex<TDocument extends Document>(document: ClassConstructor<TDocument>) {
        return new Index(this, document)
    }
}
