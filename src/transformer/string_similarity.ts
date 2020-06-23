/*
:--------------------------------------------------------------------------
: Requirements
:--------------------------------------------------------------------------
*/

import string_similarity from 'string-similarity'

export interface BEST_MATCHES {
    search: string
    compare: Array<string>
}

//type BestMatch_Return = Record<string, any>

export interface BestMatch_Return {
    ratings: object
    bestMatch: object
    bestMatchIndex: number
}

/*
:--------------------------------------------------------------------------
: Handler
:--------------------------------------------------------------------------
*/

function bestMatches({ search, compare }: BEST_MATCHES): BestMatch_Return {
    return string_similarity.findBestMatch(String(search), [...compare])
}

/*
:--------------------------------------------------------------------------
: Export
:--------------------------------------------------------------------------
*/

export { bestMatches }
