import MODEL_TEST from './file_example_XLS_1000.json'
import { XLSX_GroupByValue } from '../src/transformer'

const group_by_key = XLSX_GroupByValue({
    search: 'Gender',
    node: 'key',
    model: MODEL_TEST,
})
const group_by_value = XLSX_GroupByValue({
    search: 'Hkasjmoto',
    node: 'value',
    model: MODEL_TEST,
})

describe('XLSX_GroupByValue', () => {
    test('group_by_key', () => {
        expect(group_by_key.data[0][group_by_key.original_key]).toBe('Female')
        expect(group_by_key.original_key).toBe('Gender')
    })
    test('group_by_key', () => {
        expect(group_by_value.original_key).toBe('Hashimoto')
    })
})
