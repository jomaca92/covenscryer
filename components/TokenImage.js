import Image from 'next/image'

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#efefef55" offset="20%" />
      <stop stop-color="#eaeaea55" offset="50%" />
      <stop stop-color="#efefef55" offset="70%" />
    </linearGradient>
    <linearGradient id="h">
      <stop stop-color="#eaeaea55" offset="20%" />
      <stop stop-color="#cdcdcd55" offset="50%" />
      <stop stop-color="#eaeaea55" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)" />
  <rect id="r" width="${w}" height="${h}" fill="url(#h)"  opacity="0.7" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="3s" repeatCount="indefinite" calcMode="paced" />
</svg>`

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

const TokenImage = ({name, uri}) => (
    <Image
      layout="responsive"
      src={uri}
      alt={name} 
      width={384}
      height={384}
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(500, 500))}`}
      placeholder="blur"
    />
)

export default TokenImage