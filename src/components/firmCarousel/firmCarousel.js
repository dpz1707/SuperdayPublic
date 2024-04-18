import React from 'react';
import './firmCarousel.css';
import Amazon from './companies/Amazon.png';
import Chase from './companies/Chase.png';
import Netflix from './companies/Netflix.png';
import BoFA from './companies/BoFA.png';
import Citi from './companies/Citi.png';
import Deloitte from './companies/Deloitte.png';
import JPM from './companies/JPM.png';
import Meta from './companies/Meta.png';
import Microsoft from './companies/Microsoft.png';

const images = [Amazon, Chase, Netflix, BoFA, Citi, Deloitte, JPM, Meta, Microsoft];

const FirmCarousel = () => {
    const doubledImages = [...images, ...images];

    return (
        <div className="flex-col items-center justify-center my-10 xs:my-0">
            <div className="carousel-wrapper">
                <div className="carousel">
                    {doubledImages.map((image, index) => (
                        <img key={index} src={image} alt={`Slide ${index}`} className="slide" />
                    ))}
                </div>
            </div>
            <p class = 'my-6'>Get <b>more offers</b> from the top companies</p>
        </div>
    );
};

export default FirmCarousel;
