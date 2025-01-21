"use client"
import MyLogo from '@/public/logo.svg';
import { useTheme } from 'next-themes';

const Logo = ({width,height}) => {
  const { theme } = useTheme();
  return (
    <MyLogo width={width || 40} height={height || 40} fill={theme == "dark" ? "white" : "black"}/> 
  );
}

export default Logo;
