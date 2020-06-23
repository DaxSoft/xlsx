'use strict'

/*
:--------------------------------------------------------------------------
: Requirements
:--------------------------------------------------------------------------
*/

const { XLSX_GroupByValue, XLSXPath, xlsxConverter } = require('@vorlefan/xlsx')

/*
:--------------------------------------------------------------------------
: Handler
:--------------------------------------------------------------------------
*/

function set_output() {
    const output_dir = Date.now().toString(16)
    XLSXPath.io().setFolder('main', output_dir)
    XLSXPath.join('output', 'main', output_dir)
}

function get_xlsx_file() {
    const xls_file = XLSXPath.io().files({
        routeName: 'main',
        extension: 'xls|xlsx',
    })

    // check if there are xls file
    if (!Array.isArray(xls_file) || xls_file.length <= 0) {
        return undefined
    }

    return xls_file
}

async function get_dulce({ output }) {
    console.log('Get Dulce')

    const response = XLSX_GroupByValue({
        search: 'Dulce',
        node: 'value',
        model: output,
    })

    console.log(response)

    await XLSXPath.json()
        .set('output')
        .store({
            filename: `${response.key}.json`,
            data: response,
            force: true,
        })
}

async function get_hashimoto({ output }) {
    const response = XLSX_GroupByValue({
        search: 'hausmoto',
        node: 'value',
        model: output,
    })

    await XLSXPath.json()
        .set('output')
        .store({
            filename: `${response.key}.json`,
            data: response,
            force: true,
        })
}

async function get_britain({ output }) {
    const response = XLSX_GroupByValue({
        search: 'The Great Britain',
        node: 'value',
        model: output,
    })

    await XLSXPath.json()
        .set('output')
        .store({
            filename: `${response.key}.json`,
            data: response,
            force: true,
        })
}

async function extract_by_group() {
    // read output
    const output = await XLSXPath.json().set('output').read({
        filename: 'example.json',
    })

    // extract
    await get_dulce({ output })
    await get_hashimoto({ output })
    await get_britain({ output })

    return true
}

/*
:--------------------------------------------------------------------------
: Bootstrap
:--------------------------------------------------------------------------
*/

void (async function () {
    // create output folder
    set_output()

    // get the first-in-ordem .xls file, so you can rename the .xls for whatever
    const xls_file = get_xlsx_file()
    if (!xls_file) {
        console.error('Not found any xls file on the root directory')
    }

    setTimeout(
        () => extract_by_group().then(console.log).catch(console.error),
        2000
    )

    // convert the .xls file 'file_example_XLS_1000.xls' into .json
    await xlsxConverter({
        filename: 'example.json',
        filepath: xls_file[0].filepath,
        routeName: 'output',
    })
})()
