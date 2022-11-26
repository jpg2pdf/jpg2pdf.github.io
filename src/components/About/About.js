import { about } from '../../config'
import './About.css'

const About = () => {
  const { heading } = about

  return (
    <div className='about center'>
      {heading && (
        <h1>
          {heading}
        </h1>
      )}
    </div>
  )
}

export default About
