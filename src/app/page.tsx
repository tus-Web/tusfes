'use client';

import Link from 'next/link'
import HomePage from './home/page'

export default function Home() {
  return(
  <div style={{textAlign: 'center', marginTop: '50px'}}>
    <h1>Now TopPage!</h1>
    <Link href="/home">Go to HomePage </Link>
  </div>
  );
}