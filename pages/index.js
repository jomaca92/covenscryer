import Head from 'next/head'
import Image from 'next/image'
import debounce from 'lodash.debounce'
import { useQuery } from 'urql'
import React, { useState, useEffect, useRef} from 'react'
import { useSpring, useTransition, animated, config } from 'react-spring'
import { Dialog } from '@headlessui/react'
import { FilterIcon, PlusIcon, MinusIcon, RefreshIcon } from '@heroicons/react/solid'
import FilterData, {initialFilter, simpleFilter, spookyFilter} from "../helpers/filters.js"

const OPENSEA_BASE_URL = "https://opensea.io/assets/0x5180db8f5c931aae63c74266b211f580155ecac8/"

const OpenseaLogo = ({fillColor}) => ( 
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 90 90" fill="none">
  <path d="M45 0C20.151 0 0 20.151 0 45C0 69.849 20.151 90 45 90C69.849 90 90 69.849 90 45C90 20.151 69.858 0 45 0ZM22.203 46.512L22.392 46.206L34.101 27.891C34.272 27.63 34.677 27.657 34.803 27.945C36.756 32.328 38.448 37.782 37.656 41.175C37.323 42.57 36.396 44.46 35.352 46.206C35.217 46.458 35.073 46.71 34.911 46.953C34.839 47.061 34.713 47.124 34.578 47.124H22.545C22.221 47.124 22.032 46.773 22.203 46.512ZM74.376 52.812C74.376 52.983 74.277 53.127 74.133 53.19C73.224 53.577 70.119 55.008 68.832 56.799C65.538 61.38 63.027 67.932 57.402 67.932H33.948C25.632 67.932 18.9 61.173 18.9 52.83V52.56C18.9 52.344 19.08 52.164 19.305 52.164H32.373C32.634 52.164 32.823 52.398 32.805 52.659C32.706 53.505 32.868 54.378 33.273 55.17C34.047 56.745 35.658 57.726 37.395 57.726H43.866V52.677H37.467C37.143 52.677 36.945 52.299 37.134 52.029C37.206 51.921 37.278 51.813 37.368 51.687C37.971 50.823 38.835 49.491 39.699 47.97C40.284 46.944 40.851 45.846 41.31 44.748C41.4 44.55 41.472 44.343 41.553 44.145C41.679 43.794 41.805 43.461 41.895 43.137C41.985 42.858 42.066 42.57 42.138 42.3C42.354 41.364 42.444 40.374 42.444 39.348C42.444 38.943 42.426 38.52 42.39 38.124C42.372 37.683 42.318 37.242 42.264 36.801C42.228 36.414 42.156 36.027 42.084 35.631C41.985 35.046 41.859 34.461 41.715 33.876L41.661 33.651C41.553 33.246 41.454 32.868 41.328 32.463C40.959 31.203 40.545 29.97 40.095 28.818C39.933 28.359 39.753 27.918 39.564 27.486C39.294 26.82 39.015 26.217 38.763 25.65C38.628 25.389 38.52 25.155 38.412 24.912C38.286 24.642 38.16 24.372 38.025 24.111C37.935 23.913 37.827 23.724 37.755 23.544L36.963 22.086C36.855 21.888 37.035 21.645 37.251 21.708L42.201 23.049H42.219C42.228 23.049 42.228 23.049 42.237 23.049L42.885 23.238L43.605 23.436L43.866 23.508V20.574C43.866 19.152 45 18 46.413 18C47.115 18 47.754 18.288 48.204 18.756C48.663 19.224 48.951 19.863 48.951 20.574V24.939L49.482 25.083C49.518 25.101 49.563 25.119 49.599 25.146C49.725 25.236 49.914 25.38 50.148 25.56C50.337 25.704 50.535 25.884 50.769 26.073C51.246 26.46 51.822 26.955 52.443 27.522C52.605 27.666 52.767 27.81 52.92 27.963C53.721 28.71 54.621 29.583 55.485 30.555C55.728 30.834 55.962 31.104 56.205 31.401C56.439 31.698 56.7 31.986 56.916 32.274C57.213 32.661 57.519 33.066 57.798 33.489C57.924 33.687 58.077 33.894 58.194 34.092C58.554 34.623 58.86 35.172 59.157 35.721C59.283 35.973 59.409 36.252 59.517 36.522C59.85 37.26 60.111 38.007 60.273 38.763C60.327 38.925 60.363 39.096 60.381 39.258V39.294C60.435 39.51 60.453 39.744 60.471 39.987C60.543 40.752 60.507 41.526 60.345 42.3C60.273 42.624 60.183 42.93 60.075 43.263C59.958 43.578 59.85 43.902 59.706 44.217C59.427 44.856 59.103 45.504 58.716 46.098C58.59 46.323 58.437 46.557 58.293 46.782C58.131 47.016 57.96 47.241 57.816 47.457C57.609 47.736 57.393 48.024 57.168 48.285C56.97 48.555 56.772 48.825 56.547 49.068C56.241 49.437 55.944 49.779 55.629 50.112C55.449 50.328 55.251 50.553 55.044 50.751C54.846 50.976 54.639 51.174 54.459 51.354C54.144 51.669 53.892 51.903 53.676 52.11L53.163 52.569C53.091 52.641 52.992 52.677 52.893 52.677H48.951V57.726H53.91C55.017 57.726 56.07 57.339 56.925 56.61C57.213 56.358 58.482 55.26 59.985 53.604C60.039 53.541 60.102 53.505 60.174 53.487L73.863 49.527C74.124 49.455 74.376 49.644 74.376 49.914V52.812V52.812Z" fill={fillColor}/>
</svg>
)

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#efefef55" offset="20%" />
      <stop stop-color="#eaeaea55" offset="50%" />
      <stop stop-color="#efefef55" offset="70%" />
    </linearGradient>
    <linearGradient id="h">
      <stop stop-color="#eaeaea55" offset="20%" />
      <stop stop-color="#cdcdcd55" offset="50%" />
      <stop stop-color="#eaeaea55" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)" />
  <rect id="r" width="${w}" height="${h}" fill="url(#h)"  opacity="0.7" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="3s" repeatCount="indefinite" calcMode="paced" />
</svg>`

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

const formatAttr = (str) => {
  return str.split(" ").map((word, i) => {
    if (["of", "the", "and"].includes(word) && i) // never capitalize these words unless its the first word (ex: 'The')
      return word
    else if (word.substring(0,1) == '(')
      return `(${word.substring(1,2).toUpperCase()}${word.substring(2)}`
    else
      return `${word.substring(0,1).toUpperCase()}${word.substring(1)}`
  }).join(" ")
}

const FilterCheck = ({field, label, options, selected, onSelect, onDeselect}) => {
  const [searchValue, setSearchValue] = useState("");
  const [toggle, setToggle] = useState(false)

  const handleSelectedChange = (field, option) => {
    if (!selected.includes(option))
      onSelect(field, option)
    else
      onDeselect(field, option)
  }

  return (
    <div className="border-b border-brass/25 py-2 px-2 lg:px-0">
      <div className="flex justify-between items-center cursor-pointer select-none hover:text-black/75" onClick={() => setToggle(state => !state)}>
        <h4 className="text-lg" >{label}</h4>
        {toggle ? <MinusIcon className="btn-icon" /> : <PlusIcon className="btn-icon" />}
      </div>
      <div className={toggle ? "" :"h-0 overflow-hidden"}>
        <input placeholder="Search" className="py-0.5 px-1 rounded w-full border border-transparent focus:outline-none focus:border-black active:border-black" value={searchValue} onChange={ event => setSearchValue(event.target.value)}/>
        <div className="overflow-auto minimal-scroll max-h-48 m-1">
          {Object.keys(options).map( (key, i) => {
            key = formatAttr(key)
            let re = new RegExp(searchValue, 'gi')
            if (!searchValue || key.match(re))
              return (
                <div key={key} className="flex items-center group cursor-pointer py-0.5" onClick={() => handleSelectedChange(field, key)}>
                  <div className={"h-3 w-3 border rounded-sm mr-2  " + (selected.includes(key) ? "bg-purple border-purple" : "group-hover:border-black/75")}></div>
                  <label className="group-hover:cursor-pointer group-hover:text-black/75">{key}</label>
                </div>
              )
          })}
        </div>
      </div>
    </div>
  )
}

const FilterNumRange = ({field, label, min, max, options, onChange}) => {
  const [toggle, setToggle] = useState(false)

  return (
    <div className="border-b border-brass/25 py-2 px-2 lg:px-0">
      <div className="flex justify-between items-center cursor-pointer select-none hover:text-black/75" onClick={() => setToggle(state => !state)}>
        <h4 className="text-lg" >{label}</h4>
        {toggle ? <MinusIcon className="btn-icon" /> : <PlusIcon className="btn-icon" />}
      </div>
      <div className={toggle ? "" :"h-0 overflow-hidden"}>
        <div className="overflow-auto minimal-scroll max-h-48 m-1 flex">
          <div className="flex my-2 mr-3 py-0.5 px-1 border rounded items-center">
            <label className="mr-2">min</label>
            <input className="rounded text-center" type="number" min={options[0]} max={options[1]} value={min} onChange={e => onChange( field, e.target.value, 'greater', max)} />
          </div>
          <div className="flex m-2 py-0.5 px-1 border rounded items-center">
            <label className="mr-2">max</label>
            <input className="rounded text-center" type="number" min={options[0]} max={options[1]} value={max} onChange={e => onChange( field, e.target.value, 'less', min)} />
          </div>
        </div>
      </div>
    </div>
  )
}

const Filters = ({fetching, error, currFilters, updateFilter}) => {

  const handleNumericChange = (field, value, range, comparisonValue) => {
    let newValue = parseInt(value);
    let newFilters = currFilters;    
    if (newValue == NaN)
      return

    if (range == 'greater') {
      newFilters[field + '_gte'] = newValue;
      if (value > comparisonValue)
        newFilters[field + '_lte'] = newValue;
    }
    else {
      newFilters[field + '_lte'] = newValue;
      if (value < comparisonValue)
        newFilters[field + '_gte'] = newValue;
    }
    
    updateFilter(newFilters);
  }

  const handleAttSelect = (field, option) => {
    let newFilters = currFilters
    if (newFilters[field])
      newFilters[field].push(option)
    else
      newFilters[field] = [option]
    updateFilter(newFilters);
  }

  const handleAttDeselect = (field, option) => {
    let newFilters = currFilters
    if (newFilters[field].length > 1)
      newFilters[field] = newFilters[field].filter( e => e !== option)
    else
      delete newFilters[field]
    updateFilter(newFilters)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-brass/50 mb-5 pb-2">
        <h2 className="text-2xl font-bold px-2 lg:px-0">Filter</h2>
        {fetching && <animated.div className="animate-spin w-4 h-4 rounded-full border-2 border-black border-t-transparent"></animated.div>}
      </div>
      {error && <p className="text-red">Uh oh, something broke...</p>}
      <div className="hidden-scroll grow overflow-scroll">
        {FilterData.map(filter => {
          if (filter.suffixes.length > 1 ) { // numeric filters
            return (
              <FilterNumRange key={filter.field}
                field={filter.field}
                label={filter.label}
                min={currFilters[filter.field + '_gte'] ?? filter.options[0]} // for numeric filters, the first option is min
                max={currFilters[filter.field + '_lte'] ?? filter.options[1]} // second option will be max
                options={filter.options}
                onChange={handleNumericChange}
              />
            )
          }
          else { // standard trait checkbox filters
            return (
              <FilterCheck key={filter.field}
                field={filter.field}
                label={filter.label}
                options={filter.options}
                selected={currFilters[filter.field] ? currFilters[filter.field] : []}
                onSelect={handleAttSelect}
                onDeselect={handleAttDeselect}
              />
            )
          }
        })}
      </div>
      <div className="text-center my-4">
          <p className="text-black/50">built by <a className="text-black/70 hover:text-black" href="https://twitter.com/jonah_sc">jonah</a></p>
      </div>

    </div>
  )
}

const TokenCard =  ({image, name, tokenID, onClick} ) => {
  const fadeIn = useSpring({to: {opacity: 1}, from: {opacity: 0}, config: config.slow});
  return (
      <div className="group cursor-pointer" key={tokenID} onClick={onClick}>
        <animated.div style={fadeIn} className="drop-shadow-sm overflow-hidden lg:hover:scale-105 hover:drop-shadow-lg duration-500 text-0 rounded-md">
          {image}
        </animated.div>
        <p className="m-2 text-sm">{name}</p>
        <p className="m-2">NO. {tokenID}</p>
      </div>
  )
}

const TokenDetail = ({isOpen, setIsOpen, initialData}) => {

  const {id, background, image} = initialData;

  const colorMap = {
    'dustyrose': ['#bb7c76', '#fff'],
    'lavender': ['#b6adb9', '#151515'],
    'moss': ['#312d1e', '#fff'],
    'peach': ['#edb296', '#151515'],
    'pink': ['#c24340', '#fff'],
    'plum': ['#393446', '#fff'],
    'rust': ['#7a371e', '#fff'],
    'sage': ['#b6ab7c', '#151515'],
    'sea': ['#27343b', '#fff'],
    'sepia': ['#795850', '#fff'],
    'taupe': ['#dfb380', '#151515'],
    'aletheia': ['#a78e72', '#151515'],
  }

  const [result, reexecuteQuery] = useQuery({
    query: queryToken,
    variables: {id},
  })
  const [token, setToken] = useState({})

  const scrollRef = useRef(null)

  const {data, fetching, error} = result

  useEffect(() => {
    if (data?.token) {
      setToken(data.token);
    }
  }, [data])

  const modalTransition = useTransition(isOpen, {
    config: {duration: 200},
    from: { opacity: 0, transform: `translate3d(0px, 25px, 0px)`},
    enter: { opacity: 1, transform: `translate3d(0px, 0px, 0px)` },
    leave: { opacity: 0, transform: `translate3d(0px, -25px, 0px)` }
  })

  const onWheel = e => {
    const container = scrollRef.current;
    const containerScrollPosition = scrollRef.current.scrollLeft;

    container.scrollTo({
      top: 0,
      left: containerScrollPosition + e.deltaY,
    });
  };

  return modalTransition(
    (styles, isOpen) =>
      isOpen && id && 
      <Dialog static open={isOpen} onClose={ () => setIsOpen(!isOpen)} className="fixed z-20 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black/50" as={animated.div} style={{opacity: styles.opacity}} />

            <animated.div className="relative rounded-2xl mx-4 mb-20 mt-4 lg:max-w-5xl lg:m-auto flex flex-col md:flex-row" style={{backgroundColor: colorMap[background.replace(' ', '').toLowerCase()][0] , ...styles}}>
              <div className="w-full rounded-t-2xl md:rounded-l-2xl overflow-hidden">
                {image}
              </div>
              <div className="md:w-5/6 p-3 font-goth flex flex-col items-center justify-between" style={{color: colorMap[background.replace(' ', '').toLowerCase()][1]}}>

                <Dialog.Title className="py-3">[{token.tokenID}]</Dialog.Title>
                <a className="focus:outline-0 absolute right-3 top-3" target="_blank" rel="noreferrer" href={OPENSEA_BASE_URL + token.tokenID}>
                    <OpenseaLogo fillColor={colorMap[background.replace(' ', '').toLowerCase()][1]} />
                </a>
                <Dialog.Description className="font-goth text-3xl pb-5">
                  {token.name}
                </Dialog.Description>
                <p className="mb-3">{token.description}</p>
                <div ref={scrollRef} onWheel={onWheel} className="mb-3 flex flex-col flex-wrap w-full overflow-x-scroll minimal-scroll overflow-y-hidden overflow-x-scroll min-h-16 h-16 md:h-initial md:basis-0 md:grow">
                  {FilterData.map(filter => 
                    !["None", null].includes(token[filter.field]) && !["wit", "will","wiles", "woe", "wisdom","wonder"].includes(filter.field) &&
                    <div key={filter.field + token.name} className="flex flex-col items-center py-1 px-2 bg-black/10 rounded m-1 ">
                      <p className="text-xs">{filter.label}</p>
                      <p>{token[filter.field]}</p>
                    </div>
                  )}
                </div>
                <div className="flex w-full justify-between">
                  {["wit", "will","wiles", "woe", "wisdom","wonder"].map(field =>
                      <div key={field+token.name} className="rounded border border-dashed text-center basis-0 grow mx-1" styles={{borderColor: colorMap[background.replace(' ', '').toLowerCase()][1]}}>
                          <p className="text-sm">{field}</p>
                          <p>{token[field]}</p>
                      </div>  
                    )}
                </div>
              </div>
            </animated.div>
        </div>
      </Dialog>
  )
}

const TokenImage = ({name, uri}) => (
  <Image
    layout="responsive"
    src={uri}
    alt={name} 
    width={384}
    height={384}
    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(500, 500))}`}
    placeholder="blur"
  />
)


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

const queryToken = `
  query ($id: String) {
    token (id: $id) {
      id
      tokenID
      name
      description
      imageURI
      ${FilterData.map(filter => filter.field).join(" ")}
    }
  }
`

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
        <meta property="og:image" itemProp="image" content="https://covenscryer.netlify.app/splash-2.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://covenscryer.xyz" />
        <meta property="twitter:title" content="CovenScryer" />
        <meta property="twitter:description" content="Search for Witches using advanced filtering and search tools" />
        <meta property="twitter:image" content="https://covenscryer.netlify.app/splash-2.png" />

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
