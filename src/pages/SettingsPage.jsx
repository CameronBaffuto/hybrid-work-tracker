import React from 'react'
import { useTheme } from '../ThemeContext';

function SettingsPage() {
    const themes = [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ];

    const { setTheme } = useTheme();

  
    const handleThemeChange = (theme) => {
        setTheme(theme);
    };

    return (
        <div className="flex flex-col justify-start pt-8 mt-8 space-y-4 w-full">
            <h1 className='text-2xl text-center'>Settings</h1>
            <h2 className="text-center">Choose a theme:</h2>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 md:px-8">
                {themes.map((theme) => (
                    <div key={theme} className="card bg-primary text-primary-content" data-theme={theme}>
                        <div className="card-body">
                            <h2 className="card-title">{theme}</h2>
                            <div className="flex flex-wrap gap-1">
                                <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                                    <div className="text-primary-content text-sm font-bold">A</div>
                                </div>
                                <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                                    <div className="text-secondary-content text-sm font-bold">A</div>
                                </div>
                                <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                                    <div className="text-accent-content text-sm font-bold">A</div>
                                </div>
                                <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                                    <div className="text-neutral-content text-sm font-bold">A</div>
                                </div>
                            </div>
                            <div className="card-actions justify-end">
                            <button onClick={() => handleThemeChange(theme)} className="btn p-4">
                                {theme}
                            </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SettingsPage