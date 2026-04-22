import ErrorMessage from "../errorMessage/ErrorMessage";
import {NavLink} from "react-router-dom";

const Page404 = () => {
  return (
    <div style={{'margin': '160px 0'}}>
      <ErrorMessage/>

      <p style={{
        'textAlign': 'center',
        'fontWeight': 'bold',
        'fontSize': '36px',
        'margin': '30px 0'
      }}>
        This page doesn't exist</p>

      <NavLink style={{
        'display': 'block',
        'textAlign': 'center',
        'fontWeight': 'bold',
        'fontSize': '24px',
        'color': '#9f0013'
      }} to='/'>
        Back to the main page &rArr;</NavLink>
    </div>
  )
}

export default Page404;