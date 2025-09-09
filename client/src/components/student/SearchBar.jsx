import React,{useState} from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({data}) => {

  const navigate=useNavigate()
  const [input,setInput]=useState(data ? data :'')

  const onSearchHandler=(e)=>{
    e.preventDefault();
    navigate('/course-list/'+input)

  }

  return (
    <form  onSubmit={onSearchHandler} className='flex items-center bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden'>
      <div className='flex-shrink-0 pl-4 pr-2'>
        <img src={assets.search_icon} alt="search_icon" className='w-4 h-4 opacity-50'/>
      </div>
      
      <input onChange={e=>setInput(e.target.value)} value={input}
        type="text" 
        placeholder='Search for courses' 
        className='px-2 py-3 w-80 text-gray-700 placeholder-gray-400 bg-white border-none outline-none focus:ring-0'
      />
      
      <button 
        type='submit' 
        className='px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium whitespace-nowrap'
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar
 