import { header } from '../../config'
import Navbar from '../Navbar/Navbar'
import './Header.css'

const Header = () => {
  const { homepage, title } = header

  return (
    <header className='header center'>
      <h1>
        {homepage ? (
          <a href={homepage} className='link'>
            {title}
          </a>
        ) : (
          title
        )}
      </h1>
      <Navbar />
    </header>
  )
}

export default Header
