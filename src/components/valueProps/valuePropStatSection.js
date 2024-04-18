import { HiArrowLongRight } from "react-icons/hi2"; // Ensure the correct import path

const ValuePropStatSection = ({ statType }) => {
    return (
        <div className="w-full flex flex-col items-start">
            <div className="mt-8 w-full flex items-center justify-between">
                <div className="w-[40%]">
                    <div className="mb-2 text-start">
                        <h1 className="font-semibold text-lg text-red-500">Average rejection</h1>
                        <h1 className="my-3 font-medium text-black opacity-100 text-2xl">The average student submits 45 applications.</h1>
                    </div>
                </div>
                <div className="flex justify-center items-center flex-grow">
                    <HiArrowLongRight className="text-[40px] mx-auto" />
                </div>
                <div className="w-[40%]">
                    <div className="mb-2 text-start">
                        <h1 className="font-semibold text-lg text-green-700">What it takes</h1>
                        <h1 className="my-3 font-medium text-black opacity-100 text-2xl">Target companies on average only take 1 out of 100 apps.</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ValuePropStatSection;
