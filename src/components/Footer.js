import WhiteLogo from '../images/logoWhite.svg';
import { Link } from 'react-router-dom';

export default function Footer() {
    // Define inline styles for left text alignment
    const alignTextLeft = {
        textAlign: 'left',
    };

    return (
        <div style={{ backgroundColor: '#121212', display: 'flex', padding: '30px 48px', justifyContent: 'space-between', alignItems: 'end', marginTop: 'auto', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img style={{ height: '20px' }} src={WhiteLogo} alt="Logo" />
                    <h1 style={{ color: 'white', fontSize: '20px', marginLeft: '12px' }}>Superday</h1>
                </div>
                <Link to='/tos'><p style={alignTextLeft} className='text-gray-300 mt-5 text-sm'>Terms of Service</p></Link>
                <Link to='/privacy'><p style={alignTextLeft} className='text-gray-300 mt-2 text-sm'>Privacy Policy</p></Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'end' }}>
                <Link to='/contact'>
                    <h1 className='text-sm text-gray-300'>Contact us</h1>
                </Link>
            </div>


        </div>
    );
}