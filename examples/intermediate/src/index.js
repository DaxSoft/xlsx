'use strict'

/*
:--------------------------------------------------------------------------
: Requirements
:--------------------------------------------------------------------------
*/

const { XLSXPath } = require('@vorlefan/xlsx')
const { generate_json } = require('./generate_json')
const {
    condensed_consolidated_balance_sheet,
} = require('./condensed_consolidated_balance_sheet')

/*
:--------------------------------------------------------------------------
: Handler
:--------------------------------------------------------------------------
*/

/**
 * @description We gonna define the rules of the XLSXPath outside, to
 * serve up all methods with the same routes
 */

function set_output() {
    XLSXPath.remove('main')
    XLSXPath.set('main', XLSXPath.resolve(__dirname, '..'))
    XLSXPath.io().setFolder('main', 'output')
    XLSXPath.join('output', 'main')
}

/*
:--------------------------------------------------------------------------
: Bootstrap
:--------------------------------------------------------------------------
*/

void (async function () {
    try {
        // create output folder
        set_output()
        // get the output data
        const output_data = await generate_json({ XLSXPath })
        // get the data we want
        await condensed_consolidated_balance_sheet({ output_data, XLSXPath })
        // end up
        console.log('Done :)')
    } catch (error) {
        console.error(error)
    }
})()
