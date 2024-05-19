import "./spinner.css"

export default () => (
    <svg viewBox="0 0 100 100" className="loader">
        <g className="points">
            <circle fill="#fff" r="50" cy="50" cx="50" className="ciw"></circle>
            <circle r="4" cy="50" cx="5" className="ci2"></circle>
            <circle r="4" cy="50" cx="95" className="ci1"></circle>
        </g>
    </svg>
)