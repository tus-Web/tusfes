'use client';

import Link from 'next/link'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


const supabase = createClient(supabaseUrl!, supabaseAnonKey!);




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