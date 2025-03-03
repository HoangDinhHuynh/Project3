import React,{memo,useEffect,useState} from 'react'
import icons from '../../ultils/icon'
import { colors } from '../../ultils/contants'
import { createSearchParams,useNavigate,useParams ,useSearchParams} from 'react-router-dom'
import { apiGetProducts } from '../../apis'
import useDebounce from '../../hooks/useDebounce'


const {FaChevronDown} =icons

const SearchItem = ({name ,activeClick, ChangeActiveFilter, type='checkbox'}) => {
    const navigate = useNavigate()
    const {category} = useParams()
    const [selected, setSelected] = useState([])
    const [params] = useSearchParams()
    const [price, setPrice] = useState({
        from: '',
        to: ''
    })
    const [bestPrice, setBestPrice] = useState(null)

    const hanldeSelect = (e) => {
        ChangeActiveFilter(null)
        const alreadyEl = selected.find(el => el === e.target.value)
        if (alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
        else setSelected(prev => [...prev, e.target.value])
    }

    const fetchBestPriceProduct = async() => { 
        const respone = await apiGetProducts({sort:'-price',limit:1})
        if(respone.success) setBestPrice(respone.products[0].price)
     }

    useEffect(()=>{
        let param = []
            for (let i of params.entries()) param.push(i)
            const queries = {}
            for(let i of param) queries[i[0]] = i[1]
        if(selected.length > 0){
            
            queries.color  = selected.join(',')
            queries.page = 1
        } else delete queries.color
        navigate({
            pathname : `/${category}`,
            search : createSearchParams(queries).toString()
        })
    },[selected])

    useEffect(() => { 
        if(type === 'input') fetchBestPriceProduct()
     },[type])

     useEffect(() => { 
        if(price.from  && price.to && price.from > price.to) alert('From price cannot greater than To price')
      },[price])

     const debouncePriceFrom = useDebounce(price.from,500)
     const debouncePriceTo = useDebounce(price.to,500)

     useEffect(() => { 

            let param = []
            for (let i of params.entries()) param.push(i)
            const queries = {}
            for(let i of param) queries[i[0]] = i[1]
            if(Number(price.from) > 0) queries.from = price.from
            else delete queries.from
            if(Number(price.to) > 0) queries.to = price.to
            else delete  queries.to
            queries.page = 1
            navigate({
                pathname : `/${category}`,
                search : createSearchParams(queries).toString()
            })
      
      },[debouncePriceFrom,debouncePriceTo])

    return (
        <div 
        onClick={()=> ChangeActiveFilter(name)}
        className='p-3 cursor-pointer text-gray-500 text-xs gap-6 relative border border-gray-200 flex items-center justify-between'>
            <span className='capitalize'>{name}</span>
            <FaChevronDown/>
            {activeClick === name && <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]'>
                {type === 'checkbox' && <div className=''>
                        <div className='p-4 items-center flex justify-between gap-8 border-b'>
                            <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                            <span onClick={e=> {
                                e.stopPropagation()
                                setSelected([])
                                ChangeActiveFilter(null)
                            }} className='underline cursor-pointer hover:text-main'>Reset</span>
                        </div>
                        <div onClick={e => e.stopPropagation()} className='flex flex-col gap-3 mt-4'>
                            {colors.map((el,index)=>(
                                <div key={index} className='flex items-center gap-4'>
                                    <input 
                                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded '
                                    type='checkbox'  
                                    onChange={hanldeSelect}
                                    value={el}
                                    id={el}
                                    checked={selected.some(selectedItem => selectedItem === el)}
                                    />
                                    <label className='capitalize text-gray-700' htmlFor={el}>{el}</label>
                                </div>
                            ))}
                        </div>
                    </div>}
                {type === 'input' && <div onClick={e => e.stopPropagation()}>
                        <div  className='p-4 items-center flex justify-between gap-8 border-b'>
                            <span className='whitespace-nowrap'>{`The highest price is ${Number(bestPrice).toLocaleString()} VND`}</span>
                            <span onClick={e=> {
                                e.stopPropagation()
                                setPrice({from :'',to:''})
                                ChangeActiveFilter(null)
                            }} className='underline cursor-pointer hover:text-main'>Reset</span>
                        </div>
                        <div className='flex items-center p-2 gap-2'>
                            <div className='flex items-center gap-2'>
                                <label  htmlFor='from'>From</label>
                                <input 
                                className='form-input' 
                                type='number' 
                                id='from'
                                value={price.from}
                                onChange={e=>setPrice(prev => ({...prev,from : e.target.value}))}
                                >
                                    
                                </input>
                            </div>
                            <div className='flex items-center gap-2'>
                                <label  htmlFor='to'>To</label>
                                <input 
                                className='form-input' 
                                type='number' 
                                id='to'
                                value={price.to}
                                onChange={e=>setPrice(prev => ({...prev,to : e.target.value}))}
                                >
                                    
                                </input>
                            </div>
                        </div>
                    </div>}
            </div>}
        </div>
  )
}

export default memo(SearchItem)