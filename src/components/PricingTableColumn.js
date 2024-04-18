import CheckMark from '../images/checkmark.svg';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth0 } from '@auth0/auth0-react';
import SignInSignOutButton from '../components/signInSignOut/signInSignOutButton'

export default function PricingTableColumn(props) {
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();
    const stripePromise = loadStripe('pk_live_51P087RGgKK69nhANGsD0J1ZDRxTKrHpg9U4onINFfwADE0hhcpQO7DGA4eGYhyfcwQadoD7Lz2o1sd2yWrSDNXy5006u8vTy94');

    const doThing = async (priceID) => {
        // Wait for the promise to resolve to get the Stripe object
        const stripe = await stripePromise;
        // Now that you have the Stripe object, you can call redirectToCheckout
        const result = await stripe.redirectToCheckout({
            lineItems: [{ price: priceID, quantity: 1 }],
            mode: 'subscription',
            successUrl: 'https://superday.wtf/dashboard',
            cancelUrl: 'https://superday.wtf/upgrade',
        });

        if (result.error) {
            // If there's an error, log it to the console
            console.log(result.error.message);
        }
    };

    const handleLogin = () => {
        loginWithRedirect({
            // Specify the redirect URI after login
            redirectUri: `${window.location.origin}/dashboard`
        }).catch(error => {
            alert('Login failed');
            console.error('Login failed:', error);
        });
    };

    const includedFeatures = props.features.map((value, index) => (
        <li key={index} className="flex text-sm my-5 justify-start items-start">
            <img src={CheckMark} className="h-5 mr-2" alt="Check Mark" />{value}
        </li>
    ));

    return (
        <div className="border border-gray-300 rounded-lg mx-5 bg-white relative text-left w-full my-5 md:w-80 max-sm:min-h-[440px] min-h-[475px]">
            <div className="pt-6 flex items-center justify-start pl-5">
                <h1 className="font-medium text-3xl text-black">{props.title}</h1>
                {props.recommended ? <h1 className='bg-black text-white rounded-full px-8 py-2 ml-5 text-sm flex justify-center items-center'>Popular</h1> : <div></div>}
            </div>
            <div className="px-5 py-4">
                <div className="min-h-[70px] border-b border-t py-3">
                    <h3 className="opacity-70 text-sm">{props.subtitle}</h3>
                </div>
                <ul className="">{includedFeatures}</ul>
            </div>
            <div className="absolute bottom-0 w-full px-5 pb-6">
                <h1 className="text-xl font-semibold">
                    {props.title === 'Starter' ? '' : '$' + props.price + ' '}
                    {props.title !== 'Starter' && <span className="text-sm font-light">/ month</span>}
                </h1>
                {props.title !== 'Starter' && isAuthenticated ?
                    <button onClick={() => doThing(props.priceID)} className="w-full text-sm mt-5 py-3 px-6 rounded-full transition duration-500 ease-in-out border border-black bg-black text-white hover:bg-[transparent] hover:text-black">
                        Upgrade plan
                    </button>
                    :
                    (props.title !== 'Starter' && !isAuthenticated) &&
                    <button onClick={handleLogin} className="w-full text-sm mt-5 py-3 px-6 rounded-full transition duration-500 ease-in-out border border-black bg-black text-white">
                        Upgrade Plan
                    </button>
                }
            </div>
        </div>
    );
}
