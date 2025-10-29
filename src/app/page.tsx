'use client';

import Link from 'next/link'

export default function Home() {
  return(
  <div style={{textAlign: 'center', marginTop: '50px'}}>
    <h1>Now TopPage!</h1>
    <button onClick={() => {}}>
      <Link href="/home">Go to HomePage </Link>
    </button>
  </div>
  );
}