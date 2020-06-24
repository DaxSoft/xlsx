/*
:--------------------------------------------------------------------------
: Requirements
:--------------------------------------------------------------------------
*/

import mongoXlsx from 'mongo-xlsx'
import { PathRoute } from '@vorlefan/path'
import { XLSXPath } from './path'
import { promisify } from 'util'

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
    save?: boolean
    callback?: Function | null
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
 * @param {Boolean} save : by default is true, then it will save the file
 * @param {Function} callback : returns a function where the first paramater
 * is the data generated
 * @example
 * await xlsxConverter({
 *       filename: 'example.json',
 *       filepath: xls_file[0].filepath,
 *       routeName: 'output',
 * })
 */

async function xlsxConvertor({
    filename,
    filepath,
    pathRoute = null,
    routeName = 'main',
    save = true,
    callback = null,
}: XLSX_CONVETOR): Promise<Boolean> {
    const xlsx2MongoData = promisify(mongoXlsx.xlsx2MongoData)

    const path_route: PathRoute = pathRoute || XLSXPath
    const final_filepath: string =
        typeof filepath === 'function' ? filepath({ path_route }) : filepath

    try {
        let saved: boolean = false
        let data: any = null
        await xlsx2MongoData(final_filepath, {}, async function (
            err,
            data_generated
        ) {
            if (!!err) {
                return
            }
            data = data_generated
            if (!!callback && typeof callback === 'function') callback(data)
            saved = true
        })
        if (!!data && !!save) {
            await path_route
                .json()
                .set(routeName)
                .store({ filename, data, force: true })
        }
        return saved
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
