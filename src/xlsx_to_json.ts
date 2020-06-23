/*
:--------------------------------------------------------------------------
: Requirements
:--------------------------------------------------------------------------
*/

import mongoXlsx from 'mongo-xlsx'
import { PathRoute } from '@vorlefan/path'
import { XLSXPath } from './path'

/*
:--------------------------------------------------------------------------
: Instance
:--------------------------------------------------------------------------
*/

export interface XLSX_CONVETOR {
    filepath: string | Function
    pathRoute?: PathRoute | null
    routeName?: string
    filename: string
}

/*
:--------------------------------------------------------------------------
: Handler
:--------------------------------------------------------------------------
*/

/**
 * @description converts a .xlsx file into a .json one
 * @param {String} filename : the filename of the output
 * @param {String} filepath : the full filepath of the input file (.xls)
 * @param {PathRoute} pathRoute : If it is null, it will use the default,
 * you can define one by using @vorlefan/path
 * @param {String} routeName : the route in which will save the output,
 * by default is main
 */

async function xlsxConvertor({
    filename,
    filepath,
    pathRoute = null,
    routeName = 'main',
}: XLSX_CONVETOR): Promise<Boolean> {
    const promisify_xlsx2MongoData = (...args) =>
        new Promise(() => mongoXlsx.xlsx2MongoData(...args))

    const path_route: PathRoute = pathRoute || XLSXPath
    const final_filepath: string =
        typeof filepath === 'function' ? filepath({ path_route }) : filepath

    try {
        let saved = false
        await promisify_xlsx2MongoData(final_filepath, {}, async function (
            err,
            data
        ) {
            if (!!err) {
                return
            }
            await path_route
                .json()
                .set(routeName)
                .store({ filename, data, force: true })
            saved = true
        })
        return !!saved
    } catch (error) {
        return false
    }
}

/*
:--------------------------------------------------------------------------
: Export
:--------------------------------------------------------------------------
*/

export default xlsxConvertor
