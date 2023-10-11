import { HomeDocument } from 'test/module'
import { CalendarIntervalName, CalendarIntervalQuantity } from 'lib/enums'
import { getDateHistogramAggregation } from './get-date-histogram'

describe('getDateHistogramAggregation', () => {
    it('accepts only schema field with calendar interval name', () => {
        const query = getDateHistogramAggregation<HomeDocument>('address', CalendarIntervalName.DAY)

        expect(query).toEqual({
            date_histogram: {
                field: 'address',
                calendar_interval: 'day'
            }
        })
    })

    it('accepts only schema field with calendar interval quantity', () => {
        const query = getDateHistogramAggregation<HomeDocument>('address', CalendarIntervalQuantity.DAY)

        expect(query).toEqual({
            date_histogram: {
                field: 'address',
                calendar_interval: '1d'
            }
        })
    })

    test.todo('accepts only schema field with keyword')
})
