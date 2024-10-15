import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProjectCard from "./components/ProjectCard/ProjectCard.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

        <ProjectCard
            thumbnail="src/assets/dekler-ph-OSk8nBHR21Q-unsplash.jpg"
            title="Arduino Bluetooth Car Speaker"
            description="A project demontrating how to step by step crate Bluetooth Car Speaker with Arduino Uno Chip Finally you can listen to your favorite music in every car enjoy."
            trends={1000}
        />
    </>
  )
}

export default App
