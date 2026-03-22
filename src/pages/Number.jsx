import { useState } from 'react';

function Number() {
  const [number, setNumer] = useState(0);

  return (
    <>
      <h1>My favorite number is {number}!</h1>
      <button
        type="button"
        onClick={() => setNumer(0)}
      >0</button>
      <button
        type="button"
        onClick={() => setNumer(1)}
      >1</button>
      <button
        type="button"
        onClick={() => setNumer(2)}
      >2</button>
      <button
        type="button"
        onClick={() => setNumer(3)}
      >3</button>
    </>
  );
}

export default Number;