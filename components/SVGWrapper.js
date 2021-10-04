const SVGWrapper = ({ SVGComponent, width }) => {
  return <SVGComponent width={width ? width : '50'} className="fill-current stroke-current" />
}

export default SVGWrapper
