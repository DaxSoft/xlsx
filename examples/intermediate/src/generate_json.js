'use strict'

/*
:--------------------------------------------------------------------------
: Requirements
:--------------------------------------------------------------------------
*/

const { xlsxConverter } = require('@vorlefan/xlsx')

/*
:--------------------------------------------------------------------------
: Exports
:--------------------------------------------------------------------------
*/

exports.generate_json = async function ({ XLSXPath }) {
    // check if file already exists
    const output_file_exists = await XLSXPath.io().accessFile(
        XLSXPath.plug('output', 'aapl.json')
    )

    // json data
    let output_data

    //convert the .xls file into .json file
    if (!output_file_exists) {
        await xlsxConverter({
            filepath: './aapl_sec_gov_10q.xlsx',
            routeName: 'output',
            callback: async function (data, err) {
                if (!!data) {
                    output_data = data
                    await XLSXPath.json().set('output').store({
                        filename: 'aapl.json',
                        data,
                        force: true,
                    })
                    console.log('File created', 'output/aapl.json')
                }
            },
        })
    } else {
        console.log('File alrady exists', 'output/aapl.json')
        output_data = await XLSXPath.json()
            .set('output')
            .read({ filename: 'aapl.json' })
    }

    return output_data
}
