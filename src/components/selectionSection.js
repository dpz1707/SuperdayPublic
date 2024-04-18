import { Link } from 'react-router-dom';

export default function SelectionSection(props) {
    const containerClasses = `py-8 my-3 min-h-[375px] w-[300px] border-gray-500 rounded-md mx-8 flex flex-col items-center justify-center border px-[30px]`;
    const buttonClasses = `text-sm mt-3 py-3 px-16 rounded-full border border-gray-500 hover:bg-white hover:text-black transition-colors duration-500 ease-in-out`;
    const imgClasses = `h-16 mb-2`;

    return (
        <div className={containerClasses}>
            <img className={imgClasses} src={props.image} />
            <h1 className="leading-[130%] font-medium text-xl">{props.title}</h1>
            <p className="my-4 text-sm opacity-60">{props.content}</p>
            <Link to='/upgrade' onClick={() => {
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                });
            }}><button className={buttonClasses}>Get started</button></Link>
        </div>
    );
}
