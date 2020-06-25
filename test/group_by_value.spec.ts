import MODEL_TEST from './aapl.json'
import { XLSX_GroupByValue } from '../src/transformer'

const group_by_key = XLSX_GroupByValue({
    search: '6 Months Ended',
    node: 'key',
    model: MODEL_TEST,
})

describe('XLSX_GroupByValue', () => {
    test('group_by_key', () => {
        expect(group_by_key.data[0][group_by_key.original_key]).toBe(
            'Mar. 28, 2020'
        )
        expect(group_by_key.original_key).toBe('6 Months Ended')
    })
    // test('group_by_key', () => {
    //     expect(group_by_value.original_key).toBe('Hashimoto')
    // })
})
