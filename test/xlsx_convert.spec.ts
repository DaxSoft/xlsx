import { xlsxConverter } from '../src'
import { TestRoute } from './path'

const FILEPATH = '../file_example_XLS_1000.xls'

describe('convert xlsx into json', () => {
    test('xlsxConverter', () => {
        xlsxConverter({
            filename: 'file_example_XLS_1000.json',
            filepath: FILEPATH,
            pathRoute: TestRoute,
        }).then((resolve) => {
            expect(resolve).toBe(true)
        })
    })
})
