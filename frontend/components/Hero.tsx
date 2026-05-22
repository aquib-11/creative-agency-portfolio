
import Link from "next/link"

const Hero = () => {

  return (

  <section className="relative h-[80vh] md:h-[91vh]  w-full flex items-center justify-center overflow-hidden">

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none [background-image:radial-gradient(circle,rgba(128,128,128,0.08)_1px,transparent_1px)] [background-size:30px_30px]" />

          {/* Corner brackets */}
     <div className="absolute top-5 left-5 w-10 h-10 border-t-[1.5px] border-l-[1.5px] border-black/25 dark:border-white/25" />       <div className="absolute top-5 right-5 w-10 h-10 border-t-[1.5px] border-r-[1.5px] border-black/25 dark:border-white/25" />
  <div className="absolute bottom-5 left-5 w-10 h-10 border-b-[1.5px] border-l-[1.5px] border-black/25 dark:border-white/25" />
  <div className="absolute bottom-5 right-5 w-10 h-10 border-b-[1.5px] border-r-[1.5px] border-black/25 dark:border-white/25" />

     {/* Animated Camera Lens */}
     <div className="absolute right-[-100px]  md:md:top-1/2 top-1/3 -translate-y-1/2 md:w-[540px] md:h-[540px] w-[340px] h-[340px] pointer-events-none">
       <svg width="540" height="540" viewBox="0 0 540 540" xmlns="http://www.w3.org/2000/svg">

          {/* Outer housing — thick barrel rim, static */}
          <circle cx="270" cy="270" r="260" fill="none" stroke="currentColor" strokeWidth="18" opacity="0.15"/>
          <circle cx="270" cy="270" r="249" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35"/>

          {/* Knurling ticks — static, 24 evenly spaced */}
          <g opacity="0.25" stroke="currentColor" strokeWidth="1.5">
            {Array.from({length: 24}).map((_, i) => (
              <line key={i} x1="270" y1="8" x2="270" y2="20"
                transform={`rotate(${i * 15} 270 270)`}/>
            ))}
          </g>

          {/* Focus barrel ring — slow clockwise */}
          <g style={{ transformOrigin: "270px 270px", animation: "spin 30s linear infinite" }}>
            <circle cx="270" cy="270" r="232" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
            <circle cx="270" cy="270" r="222" fill="none" stroke="currentColor" strokeWidth="0.5"
              strokeDasharray="6 4" opacity="0.15"/>
            <g opacity="0.2" stroke="currentColor" strokeWidth="1">
              {Array.from({length: 16}).map((_, i) => (
                <line key={i} x1="270" y1="38" x2="270" y2={i % 2 === 0 ? "52" : "46"}
                  transform={`rotate(${i * 22.5} 270 270)`}/>
              ))}
            </g>
          </g>

          {/* Iris ring + 9 aperture blades — counter-clockwise */}
          <g style={{ transformOrigin: "270px 270px", animation: "spinReverse 20s linear infinite" }}>
            <circle cx="270" cy="270" r="200" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.22"/>
            <circle cx="270" cy="270" r="195" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
            {/* 9 blades */}
            {Array.from({length: 4}).map((_, i) => (
              <g key={i}>
                <path d="M270,270 L312,82 L290,72 L255,100 Z"
                  fill="currentColor" opacity="0.18"
                  transform={`rotate(${i * 90} 270 270)`}/>
                <path d="M270,270 L312,82 L290,72 L255,100 Z"
                  fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"
                  transform={`rotate(${i * 90} 270 270)`}/>
              </g>
            ))}
          </g>

          {/* Inner barrel — clockwise */}
          <g style={{ transformOrigin: "270px 270px", animation: "spin 12s linear infinite" }}>
            <circle cx="270" cy="270" r="158" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2"/>
            <circle cx="270" cy="270" r="150" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.18"/>
            <circle cx="270" cy="270" r="140" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
            {[0,60,120,180,240,300].map((deg, i) => (
              <line key={i} x1="270" y1="112" x2="270" y2="122"
                stroke="currentColor" strokeWidth="1.5" opacity="0.25"
                transform={`rotate(${deg} 270 270)`}/>
            ))}
          </g>

          {/* Static glass elements — innermost rings */}
          <g opacity="0.22" fill="none" stroke="currentColor">
            <circle cx="270" cy="270" r="115" strokeWidth="2"/>
            <circle cx="270" cy="270" r="104" strokeWidth="1"/>
            <circle cx="270" cy="270" r="90" strokeWidth="1.5"/>
            <circle cx="270" cy="270" r="76" strokeWidth="0.8"/>
            <circle cx="270" cy="270" r="60" strokeWidth="1.5"/>
            <circle cx="270" cy="270" r="44" strokeWidth="0.8"/>
            <circle cx="270" cy="270" r="28" strokeWidth="1.5"/>
            <circle cx="270" cy="270" r="14" strokeWidth="0.8"/>
          </g>

          {/* Center dots */}
          <circle cx="270" cy="270" r="6" fill="currentColor" opacity="0.35"/>
          <circle cx="270" cy="270" r="3" fill="currentColor" opacity="0.55"/>

          {/* Lens reflection arcs */}
          <path d="M 195,215 A 88,88 0 0,1 230,178" fill="none" stroke="currentColor"
            strokeWidth="1.5" opacity="0.12" strokeLinecap="round"/>
          <path d="M 210,235 A 65,65 0 0,1 235,205" fill="none" stroke="currentColor"
            strokeWidth="1" opacity="0.1" strokeLinecap="round"/>
        </svg>
      </div>

        {/* Content */}

        <div className="relative z-10 px-6 md:px-0 text-left space-y-8 max-w-7xl mx-auto w-full select-none">

          <div className="space-y-6">

            <div className="space-y-3">

              <p className="text-black/60 dark:text-white/60 text-xs sm:text-sm tracking-widest uppercase">Welcome to our portfolio</p>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider   text-yellow-dark leading-tight">

                Creative<br />

                <span className="text-black/70 dark:text-white/80">Excellence</span>

              </h1>

            </div>


            

            <p className="text-base font- sm:text-lg md:text-xl text-black/70 dark:text-gray-300 max-w-2xl leading-relaxed">

              We partner with ambitious brands to create exceptional digital marketing campaigns that captivate audiences and drive measurable results.

            </p>

            <div className="flex flex-row flex-wrap gap-4 sm:gap-6 pt-6 md:pt-8">

              <Link href="/clients" className=" px-6 sm:px-8 py-3 bg-black dark:bg-white tracking-wider text-white dark:text-black  hover:opacity-80 transition-opacity">

                View Our Work

              </Link>

              <Link href="/contact" className="px-6 sm:px-8 tracking-widest py-3 border border-black dark:border-white text-black dark:text-white font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors">

                Get In Touch

              </Link>

            </div>

          </div>

        </div>

        {/* Scroll Indicator */}


      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinReverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      </section>  )

}

export default Hero





