'use strict'

/*
:--------------------------------------------------------------------------
: Requirements
:--------------------------------------------------------------------------
*/

const { XLSX_GroupByValue } = require('@vorlefan/xlsx')

/*
:--------------------------------------------------------------------------
: Handler
:--------------------------------------------------------------------------
*/

// the key that we want to
const SEARCH_KEY = 'CONDENSED CONSOLIDATED BALANCE SHEETS (Unaudited)'

/**
 * Set the output for it
 */
function set_output({ XLSXPath }) {
    XLSXPath.io().setFolder('output', 'condensed_consolidated_balance_sheet')
    XLSXPath.join('@example', 'output', 'condensed_consolidated_balance_sheet')
}

/**
 * We gonna split it by each values
 */
async function get_by_values({ rawData, XLSXPath }) {
    const VALUES = rawData.data
        .filter((vln) => Object.keys(vln).length > 1)
        .map((vln) => vln[rawData.original_key])

    await Promise.all(
        VALUES.map(async (search) => {
            const data = XLSX_GroupByValue({
                search,
                node: 'value',
                model: rawData.data,
            })

            await XLSXPath.json()
                .set('@example')
                .store({
                    filename: `${data.key.replace(
                        /(?:\.(?![^.]+$)|[^\w.])+/g,
                        '-'
                    )}.json`,
                    data,
                    force: true,
                })
        })
    )
}

/*
:--------------------------------------------------------------------------
: Bootstrap
:--------------------------------------------------------------------------
*/

exports.condensed_consolidated_balance_sheet = async function ({
    output_data,
    XLSXPath,
}) {
    // output for it
    set_output({ XLSXPath })

    // trated output_data | the data orginated from the excel it's inside of multiple array.. the main
    // array the we want (from Search Key), is at: 3
    const model = output_data[3]

    // get the elements by the key
    const rawData = XLSX_GroupByValue({
        search: SEARCH_KEY,
        node: 'key',
        model,
    })

    // save raw

    await XLSXPath.json().set('@example').store({
        filename: 'raw.json',
        data: rawData,
        force: true,
    })

    // save by each value
    await get_by_values({ rawData, XLSXPath })
}
