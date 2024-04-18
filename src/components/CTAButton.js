export default function CTAButton({ title, onClick, className }) {
    return (
        <button 
            className={`text-white my-8 w-[300px] rounded-xl flex items-center justify-center py-3 bg-[#000000] font-semibold ${className}`}
            onClick={onClick}
        >
            {title}
        </button>
    );
}