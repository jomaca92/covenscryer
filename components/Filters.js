import { animated } from 'react-spring'
import FilterData from "../helpers/filters.js"
import FilterCheck from "./FilterCheck";
import FilterNumRange from "./FilterNumRange";

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


export default Filters;