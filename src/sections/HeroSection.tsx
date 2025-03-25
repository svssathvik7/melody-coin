export default function HeroSection() {
  return (
    <section className="glass-effect w-[95%] md:w-5/6 mx-auto my-[10dvh] md:my-[20dvh] flex items-center justify-center flex-col h-[30dvh] md:h-[40dvh] gap-6 md:gap-10 p-8 md:p-10 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2a2a72] to-[#009ffd] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
      <h1 className="text-4xl md:text-6xl lg:text-7xl w-full md:w-4/5 text-center font-bold px-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300 animate-gradient">
        The Everlasting Rhythm of Value
      </h1>
      <p className="w-full md:w-4/5 text-center text-gray-300 text-base md:text-lg px-2 md:px-0 leading-relaxed">
        Just as a melody endures through time, Melody Coin remains a constant in
        the world of digital assets—forever fresh, forever good
      </p>
      <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
    </section>
  );
}
