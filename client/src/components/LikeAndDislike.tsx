import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

const LikeAndDislike = () => {
    const content = (
        <div className="w-full flex items-center justify-between bg-gray-50 p-2">
            <button>
                <FontAwesomeIcon id="Hello" className="w-8 h-8 text-gray-300" icon={faThumbsUp as IconProp} />
            </button>
            <button>
                <FontAwesomeIcon className="w-8 h-8 text-gray-300" icon={faThumbsDown as IconProp}/>
            </button>
        </div>
    )

    return content
}

export default LikeAndDislike