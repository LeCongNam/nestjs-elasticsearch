import { ResponseError } from '@elastic/elasticsearch/lib/errors.js'
import { HomeDocument } from 'test/module'
import { TEST_ELASTICSEARCH_NODE } from 'test/constants'
import { setupNestApplication } from 'test/toolkit'
import { ElasticsearchModule } from 'module/elasticsearch.module'
import { ElasticsearchService } from 'module/elasticsearch.service'
import { getHistogramAggregation } from './get-histogram'

describe('getHistogramAggregation', () => {
    const { app } = setupNestApplication({
        imports: [
            ElasticsearchModule.register({
                node: TEST_ELASTICSEARCH_NODE
            })
        ]
    })

    it('accepts only schema numeric field', () => {
        const query = getHistogramAggregation<HomeDocument>('propertyAreaSquared', 5)

        expect(query).toEqual({
            histogram: {
                field: 'propertyAreaSquared',
                interval: 5
            }
        })
    })

    it('should queries elasticsearch for histogram aggregation', async () => {
        const service = app.get(ElasticsearchService)

        const result = await service.search(HomeDocument, {
            size: 0,
            aggregations: {
                testAggregation: getHistogramAggregation('builtInYear', 5)
            }
        })

        const responseBuckets = result.aggregations.testAggregation.buckets

        responseBuckets.forEach(bucket =>
            expect(bucket).toEqual(
                expect.objectContaining({
                    key: expect.any(Number),
                    doc_count: expect.any(Number) // eslint-disable-line camelcase
                })
            )
        )
    })

    it('should queries elasticsearch for histogram aggregation with min doc count', async () => {
        const service = app.get(ElasticsearchService)
        const minDocCount = 10

        const result = await service.search(HomeDocument, {
            size: 0,
            aggregations: {
                testAggregation: getHistogramAggregation('builtInYear', 5, {
                    min_doc_count: minDocCount // eslint-disable-line camelcase
                })
            }
        })

        const responseBuckets = result.aggregations.testAggregation.buckets
        responseBuckets.forEach(bucket => expect(bucket.doc_count).toBeGreaterThanOrEqual(minDocCount))
    })

    it('should return an error after passing string field', async () => {
        const service = app.get(ElasticsearchService)

        await service
            .search(HomeDocument, {
                size: 0,
                aggregations: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    histogram: getHistogramAggregation('propertyAreaSquaredAsString' as any, 5)
                }
            })
            .catch(error => {
                expect(error).toBeInstanceOf(ResponseError)
                expect(error.message).toContain('search_phase_execution_exception: [illegal_argument_exception]')
                expect(error.message).toContain(
                    'Text fields are not optimised for operations that require per-document field data like aggregations and sorting, so these operations are disabled by default.'
                )
            })
    })

    it(`should return an error after passing string field with 'keyword'`, async () => {
        const service = app.get(ElasticsearchService)

        await service
            .search(HomeDocument, {
                size: 0,
                aggregations: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    testAggregation: getHistogramAggregation('address.keyword' as any, 5)
                }
            })
            .catch(error => {
                expect(error).toBeInstanceOf(ResponseError)
                expect(error.message).toContain('search_phase_execution_exception: [illegal_argument_exception]')
                expect(error.message).toContain('Field [address.keyword] of type [keyword] is not supported for aggregation [histogram]')
            })
    })
})
