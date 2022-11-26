import uniqid from 'uniqid'
import { tags } from '../../config'
import './Tags.css'

const Tags = () => {
  if (!tags.length) return null

  return (
    <section className='section tags' id='tags'>
      <ul className='tags__list'>
        {tags.map((tag) => (
          <li key={uniqid()} className='tags__list-item btn btn--plain'>
            {tag}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Tags
