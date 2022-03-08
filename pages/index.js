import Head from 'next/head'
import debounce from 'lodash.debounce'
import { useQuery } from 'urql'
import React, { useState, useEffect} from 'react'
import { FilterIcon, RefreshIcon } from '@heroicons/react/solid'
import FilterData, {initialFilter, simpleFilter, spookyFilter} from "../helpers/filters.js"

import Filters from "../components/Filters"
import TokenImage from '../components/TokenImage.js'
import TokenDetail from '../components/TokenDetail.js'
import TokenCard from '../components/TokenCard.js'

const buildQuery = (filterState) => {
  let queryVariables = '';
  let queryWhere = '';

  FilterData.forEach(filter => {    
    if (filterState[filter.field]) {
      queryVariables += `, $${filter.field}: [String]`
      queryWhere += `${filter.field}${filter.suffixes[0]}: $${filter.field},`
    }
    else if (filter.suffixes.length > 1 ){ // numeric filters have two suffixes
      filter.suffixes.forEach(suffix => {
        queryVariables += `, $${filter.field + suffix}: Int`
        queryWhere += `${filter.field + suffix}: $${filter.field + suffix},`
      })
    }
  })

  const query = `
    query ($limit: Int, $skip: Int ${queryVariables} ){
      tokens (first: $limit, skip: $skip, orderBy: tokenID, orderDirection: asc, where: {
        ${queryWhere}
      }){
        id
        tokenID
        contentURI
        name
        imageURI
        background
      }
    }
  `

  return query
}

export default function Home() {

  const limit = 24;
  const [skip, setSkip] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [scrollY, setScrollY] = useState(0)   
  const [currFilters, setCurrFilters] = useState(initialFilter);
  const [toggleTokenDetail, setToggleTokenDetail] = useState(false);
  const [initialModalData, setInitialModalData] = useState({});
  const [pauseQuery, setPauseQuery] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [result, reexecuteQuery] = useQuery({
    query: buildQuery(currFilters),
    variables: {limit, skip, ...currFilters},
    pause: pauseQuery
  })

  const {data, fetching, error} = result

  useEffect(() => {
    if (data?.tokens.length) {
      setTokens(prevTokens =>  [...prevTokens, ...data.tokens]);
    }
  }, [data])

  useEffect(() => {
    window.onscroll = debounce(() => {
      if (window.scrollY > scrollY && window.innerHeight + window.scrollY >= (document.body.offsetHeight * .8) ) {
        setScrollY(window.scrollY);
        setSkip(skip + limit);
      }
    }, 100)
  })

  const handleFilterUpdate = (newFilters) => {
    setPauseQuery(true)
    setSkip(0)
    setTokens([])
    setScrollY(0)
    setCurrFilters(newFilters)
    reexecuteQuery({ requestPolicy: 'network-only' })
    setPauseQuery(false)
  }

  const handleTokenDetailOpen = (toggle, id, background, image) => {
    setToggleTokenDetail(toggle)
    setInitialModalData({id, background, image})
  }

  return (
    <div className="min-h-screen bg-champagne font-goth text-black">
      <Head>
        <title>CovenScryer</title>
        <meta name="title" content="CovenScryer" />
        <meta name="description" content="Search for Witches using advanced filtering and search tools" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://covenscryer.xyz" />
        <meta property="og:title" content="CovenScryer" />
        <meta property="og:description" content="Search for Witches using advanced filtering and search tools" />
        <meta property="og:image" itemProp="image" content="https://covenscryer.netlify.app/splash-3.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://covenscryer.xyz" />
        <meta property="twitter:title" content="CovenScryer" />
        <meta property="twitter:description" content="Search for Witches using advanced filtering and search tools" />
        <meta property="twitter:image" content="https://covenscryer.netlify.app/splash-3.png" />

        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Carrois+Gothic+SC&display=swap" rel="stylesheet"/>
      </Head>

      <main className="flex flex-col">
        <TokenDetail isOpen={toggleTokenDetail} setIsOpen={setToggleTokenDetail} initialData={initialModalData} />
        <div className="fixed w-full z-10 bg-champagne border-b border-brass/50 lg:border-none lg:bg-transparent">
          <h1 className="text-3xl font-bold pt-2 ml-2 lg:m-4 lg:pt-0">CovenScryer</h1>
        </div>
        <div className="flex px-4 lg:px-8 justify-center lg:content-between">

          <div className={ (showFilters ? "block" : "hidden") + " lg:block fixed lg:sticky  w-5/6 lg:w-96 right-0 bottom-0 lg:bottom-initial lg:right-initial top-0 max-h-screen pt-2 lg:pt-32 lg:px-8 w-1/4 min-w-max overflow-hidden bg-champagne z-10 lg:z-0 shadow-lg lg:shadow-none"}>
            <Filters 
              fetching={fetching}
              error={error}
              currFilters={currFilters}
              updateFilter={handleFilterUpdate}
            />
          </div>
          <div className="lg:w-full lg:pt-32 pt-20 lg:px-8 pb-16 ">
            <div className="fixed w-full z-10 top-0 left-0 p-2 lg:px-0 lg:pt-0 lg:relative flex justify-end lg:border-b lg:border-brass/50 mb-5 pb-2">
              <button className="btn mr-2" onClick={ () => handleFilterUpdate(simpleFilter)}><FilterIcon className="btn-icon pr-1 hidden lg:block"/> Simple</button>
              {/* <button className="btn mr-2 " onClick={ () => handleFilterUpdate(spookyFilter)}><FilterIcon className="btn-icon pr-1 hidden lg:block" /> Spooky</button> */ }
              <button className="btn mr-2 lg:mr-0" onClick={ () => handleFilterUpdate(initialFilter)}><RefreshIcon className="btn-icon lg:pr-1"/><span className="hidden lg:block">Reset</span></button>
              <button className="btn lg:hidden" onClick={ () => setShowFilters(state => !state)}><FilterIcon className="btn-icon" /></button>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 xl:gap-5 gap-3  ">
            {tokens.map(token => {
                let tokenImage = <TokenImage name={token.name} uri={token.imageURI} />
                return(
                  <TokenCard
                    key={token.tokenID}
                    tokenID={token.tokenID}
                    image={tokenImage}
                    name={token.name}
                    onClick={() => handleTokenDetailOpen(!toggleTokenDetail, token.id, (token.name == 'aletheia' ? token.name : token.background), tokenImage)}
                  />
                )
            })}
            </div>
          </div>
        </div>
        
      </main>

      <footer >
        
      </footer>
    </div>
  )
}
