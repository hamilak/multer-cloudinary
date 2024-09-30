import axios from 'axios'
import { FC, useEffect, useState } from 'react'

const Home: FC = () => {
  const [res, setRes] = useState<string>('')

  const getRes = async() => {
    const response = await axios.get('/api/')
    setRes(response.data)
  }

  useEffect(() => {
    getRes()
  }, [])
  return (
    <div>{res}</div>
  )
}

export default Home