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
    filename: string
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
    filepath,
    pathRoute = null,
    callback = null,
}: XLSX_CONVETOR): Promise<Boolean> {
    const path_route: PathRoute = pathRoute || XLSXPath
    const final_filepath: string =
        typeof filepath === 'function' ? filepath({ path_route }) : filepath

    try {
        let saved: boolean = false
        let data: any = null
        mongoXlsx.xlsx2MongoData(final_filepath, {}, function (
            err,
            data_generated
        ) {
            if (!!err) {
                if (!!callback && typeof callback === 'function')
                    callback(data, err)
                return
            }
            data = data_generated
            if (!!callback && typeof callback === 'function')
                callback(data, err)
            saved = true
        })
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
