/*
:--------------------------------------------------------------------------
: Requirements
:--------------------------------------------------------------------------
*/

import camelcase_transformer from 'camelcase'
import { bestMatches } from './string_similarity'

export interface GROUP_BY_VALUES {
    search: string
    node?: 'key' | 'value'
    model: Array<object>
}

export interface GET_BY_KEY_OR_VALUE {
    data: Array<any> | Record<any, any>
    original_key: string
    key: string
}

/*
:--------------------------------------------------------------------------
: Handler
:--------------------------------------------------------------------------
*/

function get_by_key({ search, model }: GROUP_BY_VALUES): GET_BY_KEY_OR_VALUE {
    const keys = []

    model.map((row, index) => {
        Object.keys(row).map((rkey, n) => {
            keys.push(String(rkey))
        })
    })

    const { bestMatchIndex } = bestMatches({ search, compare: [...keys] })

    let searched_key = keys[bestMatchIndex]

    const data = model.filter(
        (row) =>
            !!Object.keys(row).find((rkey) => rkey === keys[bestMatchIndex])
    )

    return {
        data,
        original_key: searched_key,
        key: camelcase_transformer(searched_key),
    }
}

function get_by_value({ search, model }: GROUP_BY_VALUES): GET_BY_KEY_OR_VALUE {
    const values = []

    model.map((row, index) => {
        Object.values(row).map((vln, n) => {
            values.push(String(vln))
        })
    })

    const { bestMatchIndex } = bestMatches({ search, compare: [...values] })
    let searched_values = values[bestMatchIndex]

    const data = model.filter(
        (row) =>
            !!Object.values(row).find(
                (value) => value === values[bestMatchIndex]
            )
    )

    return {
        data,
        original_key: searched_values,
        key: camelcase_transformer(searched_values),
    }
}

/**
 * @description group a value from the .json generated from the xlsxConverter
 * @param {String} search search the key-value word by using similarity algorithim
 * @param {String} node it will search on 'keys' or 'values'?
 * @param {Array} model the model array that will be used (generad from xlsxConverter)
 */

function XLSX_GroupByValue({
    search,
    node = 'key',
    model,
}: GROUP_BY_VALUES): GET_BY_KEY_OR_VALUE {
    const model_by_node = {
        key: get_by_key,
        value: get_by_value,
    }

    const response = model_by_node[node || 'key']({ search, model })

    return response
}

/*
:--------------------------------------------------------------------------
: Export
:--------------------------------------------------------------------------
*/

export default XLSX_GroupByValue
