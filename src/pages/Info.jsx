import { useParams } from 'react-router-dom';

function Info() {
  const { firstname } = useParams();
  const capitalizedFirstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
  return <h1>Hello, {capitalizedFirstname}!</h1>;
}

export default Info;