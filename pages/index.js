import Head from 'next/head'
import Image from 'next/image'
import debounce from 'lodash.debounce'
import { useQuery } from 'urql'
import React, { useState, useEffect, useRef} from 'react'
import { useSpring, useTransition, animated, config } from 'react-spring'
import { Dialog } from '@headlessui/react'
import { FilterIcon, PlusIcon, MinusIcon } from '@heroicons/react/solid'
import FilterData from "../helpers/filters.js"

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

const Filter = ({field, label, options, selected, onSelect, onDeselect}) => {
  const [searchValue, setSearchValue] = useState("");
  const [toggle, setToggle] = useState(false)

  const handleSelectedChange = (field, option) => {
    if (!selected.includes(option))
      onSelect(field, option)
    else
      onDeselect(field, option)
  }

  return (
    <div className="border-b border-brass/25 py-2">
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

const Filters = ({fetching, error, currFilters, updateFilter}) => {

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
        <h2 className="text-2xl font-bold">Filter</h2>
        {fetching && <animated.div className="animate-spin w-4 h-4 rounded-full border-2 border-black border-t-transparent"></animated.div>}
      </div>
      {error && <p className="text-red">Uh oh, something broke...</p>}
      <div className="hidden-scroll grow overflow-scroll">
        {FilterData.map(filter => 
          <Filter key={filter.field}
            field={filter.field}
            label={filter.label}
            options={filter.options}
            selected={currFilters[filter.field] ? currFilters[filter.field] : []}
            onSelect={handleAttSelect}
            onDeselect={handleAttDeselect}
          />
        )}
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

            <animated.div className="relative rounded-2xl m-12 lg:max-w-5xl lg:m-auto flex flex-col md:flex-row" style={{backgroundColor: colorMap[background.replace(' ', '').toLowerCase()][0] , ...styles}}>
              <div className="w-full rounded-t-2xl md:rounded-l-2xl overflow-hidden">
                {image}
              </div>
              <div className="md:w-5/6 p-3 font-goth flex flex-col items-center justify-between" style={{color: colorMap[background.replace(' ', '').toLowerCase()][1]}}>
                <Dialog.Title className="py-3">[{token.tokenID}]</Dialog.Title>
                <Dialog.Description className="font-goth text-3xl pb-5">
                  {token.name}
                </Dialog.Description>
                <p className="mb-3">{token.description}</p>
                <div ref={scrollRef} onWheel={onWheel} className="mb-3 flex flex-col flex-wrap w-full overflow-x-scroll minimal-scroll overflow-y-hidden overflow-x-scroll min-h-16 h-16 md:h-initial md:basis-0 md:grow">
                  {FilterData.map(filter => 
                    token[filter.field] != 'None' && !["wit", "will","wiles", "woe", "wisdom","wonder"].includes(filter.field) &&
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

    if (!filterState[filter.field])
      return

    if (filter.suffixes.length > 1){ // numeric filters have two suffixes
      filter.suffixes.forEach((suffix, i) => {
        queryVariables += `, $${filter.field}${suffix}: Int`
        queryWhere += `${filter.field}${suffix}: $${filter.field}${suffix},`
      })
    }
    else {
      queryVariables += `, $${filter.field}: [String]`
      queryWhere += `${filter.field}${filter.suffixes[0]}: $${filter.field},`
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

  const limit = 50;
  const [skip, setSkip] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [scrollY, setScrollY] = useState(0)   
  const [currFilters, setCurrFilters] = useState({});
  const [toggleTokenDetail, setToggleTokenDetail] = useState(false);
  const [initialModalData, setInitialModalData] = useState({});

  const [result, reexecuteQuery] = useQuery({
    query: buildQuery(currFilters),
    variables: {limit, skip, ...currFilters}
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
    setSkip(0)
    setTokens([])
    setCurrFilters(newFilters)
  }

  const handleTokenDetailOpen = (toggle, id, background, image) => {
    setToggleTokenDetail(toggle)
    setInitialModalData({id, background, image})
  }

  return (
    <div className="min-h-screen bg-champagne font-goth text-black">
      <Head>
        <title>WitchScry</title>
        <meta name="description" content="Find a Witch using advanced filtering and search tools" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Carrois+Gothic+SC&display=swap" rel="stylesheet"/>
      </Head>

      <main className="flex flex-col">
        <TokenDetail isOpen={toggleTokenDetail} setIsOpen={setToggleTokenDetail} initialData={initialModalData} />
        <div className="fixed w-full z-20">
          <h1 className="text-3xl font-bold pt-2 ml-2 lg:m-4 lg:pt-0">WitchScry</h1>
        </div>
        <div className="flex px-4 lg:px-8 justify-center lg:content-between">

          <div className="hidden lg:block w-96 sticky top-0 max-h-screen pt-32 px-8 w-1/4 min-w-max overflow-hidden">
            <Filters 
              fetching={fetching}
              error={error}
              currFilters={currFilters}
              updateFilter={handleFilterUpdate}
            />
          </div>
          <div className="lg:w-full lg:pt-32 pt-20 lg:px-8 pb-16 ">
            <div className="fixed w-full z-10 top-0 left-0 p-2 lg:px-0 lg:pt-0 lg:relative flex justify-end border-b border-brass/50 mb-5 pb-2 bg-champagne lg:bg-transparent">
              <button className="btn mr-2"><FilterIcon className="btn-icon pr-1 hidden lg:block"/> Simple</button>
              <button className="btn mr-2 lg:mr-0"><FilterIcon className="btn-icon pr-1 hidden lg:block" /> Spooky</button>
              <button className="btn lg:hidden"><FilterIcon className="btn-icon" /></button>
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
