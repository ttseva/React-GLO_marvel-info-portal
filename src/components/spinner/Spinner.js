import img from "./spinner.gif";


const Spinner = () => {
  return (
    <img style={{display: "block", width: "64px", height: "64px", objectFit: "contain", margin: "0 auto"}} src={img}
         alt="spinner"/>
  )
}

export default Spinner;
