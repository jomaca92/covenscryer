import React, { useState} from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/solid'

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

export default FilterNumRange