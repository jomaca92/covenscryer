import React, { useState} from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/solid'
import { formatAttr } from '../helpers/format';

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

export default FilterCheck