import icons from './icon'

const { BsStarFill, BsStar } = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')

export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString()

export const renderStarFromNumber = (number ,size) => {
    if (!Number(number)) return
    const stars = []
    for (let i = 0 ; i < +number;i++) stars.push(<BsStarFill color='orange' size={size || 16}/>)
    for (let i = 5 ; i > +number;i--) stars.push(<BsStar color='orange' size={size || 16}/>)
    return stars
}