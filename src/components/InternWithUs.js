import { Link } from 'react-router-dom';

const InternWithUs = () => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg h-[220px] min-w-[450px] w-[50%] p-8 shadow-[0px_0px_15px_0px_rgb(0,0,0,0.1)]">
      <h1 className="font-medium text-2xl">
        Feedback or suggestions?
      </h1>
      <p className={`text-sm leading-6 text-gray-500 mt-3 mb-0`}>We're constantly trying to improve Superday. Tell us about any features you'd like to see, bugs, or suggestions you have! </p>

      <Link to="/contact" target="_blank" rel="noopener noreferrer" className="inline-block text-sm border px-10 py-3 border-black rounded-full bg-black text-white font-medium mt-5 hover:bg-transparent hover:text-black transition-colors duration-500 ease-in-out">
        Contact Us
      </Link>
    </div>
  )
}

export default InternWithUs;