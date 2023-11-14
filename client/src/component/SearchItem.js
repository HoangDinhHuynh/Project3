import React,{memo} from 'react'
import icons from '../ultils/icon'

const {FaChevronDown} =icons

const SearchItem = ({name ,activeClick, ChangeActiveFilter}) => {
  return (
        <div 
        onClick={()=> ChangeActiveFilter(name)}
        className='p-3 text-gray-500 text-xs gap-6 relative border border-gray-200 flex items-center justify-between'>
            <span className='capitalize'>{name}</span>
            <FaChevronDown/>
            {activeClick === name && <div className='absolute top-full left-0 w-fit p-4 bg-red-500'>
                content
            </div>}
        </div>
  )
}

export default memo(SearchItem)