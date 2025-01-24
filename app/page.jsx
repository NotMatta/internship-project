"use client"
import { Button } from '@/components/ui/button';
import { Github, MoveRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/components/providers/session-provider';
import Logo from '@/components/logo';
import { usePath } from '@/components/providers/path-provider';

const HomePage = () => {
  const { session } = useSession();
  const { updatePath } = usePath()
  const href = session.status == "loading" ? "#" : session.status == "authenticated"? "/profile" : "/auth/login"
  return (
    <div className='flex flex-col items-center justify-center h-full w-full relative'>
      <img src="https://i.redditmedia.com/AUXwGcVgSh0v6POuTDYvWH1kEzBQvK1EWb777KbSp4w.jpg?s=7417d7fcca26778f6d2b0f43196cc18e"
        className='absolute w-full h-full object-cover -z-20'/>
      <div className='absolute w-full h-full bg-black opacity-40 -z-10'/>
      <div className='flex items-center justify-center gap-4 text-white'>
        <Logo width={100} height={100} color="white"/>
        <h1>OTC Password Manager</h1>
      </div>
      <div className='flex items-center gap-2'>
        <Link href="https://github.com/NotMatta/password-manager" target="_blank"><Button className="bg-background text-foreground hover:bg-accent">Source <Github/></Button></Link>
        <Link onClick={() => updatePath(href)} href={href}><Button>Start <MoveRight/></Button></Link>
      </div>
      <p className='text-white'>(Experimental ☕)</p>
    </div>
  );
}

export default HomePage;
