'use client';

import Link from 'next/link'
import { supabase } from '@/src/lib/supabase/client';

export default function Home() {

  
    const action = async () => {
      console.log("login success");
      const { error } = await supabase.auth.signInAnonymously();
      if(error) console.error(error);
    };  

  return(
  <div style={{textAlign: 'center', marginTop: '50px'}}>
    <h1>Now TopPage!</h1>
    <button onClick={action}>
      <Link href="/home">Go to HomePage </Link>
    </button>
  </div>
  );
}