
"use client"; 

import dynamic from "next/dynamic";


const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function AnimationLottie({ animationPath, width = "95%" }) {
  if (!animationPath) return null; 

  return (
    <Lottie
      animationData={animationPath}
      loop={true}
      autoplay={true}
      style={{ width }}
    />
  );
}
