import { useSpring, animated, config } from 'react-spring'

const TokenCard =  ({image, name, tokenID, onClick} ) => {
    const fadeIn = useSpring({to: {opacity: 1}, from: {opacity: 0}, config: config.slow});
    return (
        <div className="group cursor-pointer" key={tokenID} onClick={onClick}>
          <animated.div style={fadeIn} className="drop-shadow-sm overflow-hidden lg:hover:scale-105 hover:drop-shadow-lg duration-500 text-0 rounded-md">
            {image}
          </animated.div>
          <p className="m-2 text-sm">{name}</p>
          <p className="m-2">NO. {tokenID}</p>
        </div>
    )
  }
export default TokenCard