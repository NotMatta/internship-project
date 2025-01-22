"use client"
import MyLogo from '@/public/logo.svg';
import { useTheme } from 'next-themes';

const Logo = ({width,height,color}) => {
  const { theme } = useTheme();
  return (
    <MyLogo width={width || 50} height={height || 50} fill={color || (theme == "dark" ? "#22c55e" : "#16a34a")}/> 
  );
}

export default Logo;
