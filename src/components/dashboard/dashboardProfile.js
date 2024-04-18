import React, {useEffect} from 'react';
import DashboardStat from './dashboardStat';
import { useAuth0 } from '@auth0/auth0-react';

const DashboardProfile = (props) => {
    const { user, isAuthenticated } = useAuth0();

    const getSubscriptionName = (tier) => {
        switch (tier) {
            case "0": return 'Starter';
            case "1": return 'Essentials';
            case "2": return 'Premium';
            default: return 'Unknown';
        }
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            justifyContent: 'center',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '10px',
            position: 'relative',
            color: 'white',
            padding: '15px 5px',
            marginBottom: '3px',
            minWidth: '1000px',
            width: '300px'
        },
      
        headerAndStats: {
            display: 'flex',
            flexDirection: 'row', // To align items horizontally
            alignItems: 'center', // Align items vertically
            gap: '65px', // Adjust gap as necessary
            zIndex: 2, // Ensure this section is above the overlay
        },
        selectedPositionSection: {
            zIndex: 2, // Ensure this section is above the overlay
            marginTop: '25px', // Spacing from the above row
            marginLeft: '00px',
        },
        textContent: {
            position: 'relative', // Ensure text content is above the overlay
            width: '250px',
            borderRight: '1px solid black',
        }
    };

    const subscriptionTier = getSubscriptionName(props.userData?.subscription);
    const emailAddress = props.userData?.client_email || 'No email provided';
    const industry = props.userData?.industry || 'No industry provided';

    return (
        <div className='border-gray-300 border-b pb-1 px-12 py-3 bg-white'>
            <div style={styles.container} className='rounded-lg'>
                <div style={styles.overlay}></div>
                <div style={styles.headerAndStats}>
                    <div style={styles.textContent}>
                        <h1 className="text-3xl font-medium mb-1 text-black">Your Account</h1>
                    </div>
                    <DashboardStat title="Full Name" value={props.userData.first_name + ' ' + props.userData.last_name} />
                    <DashboardStat title="Subscription tier" value={subscriptionTier} />
                    <DashboardStat title="Email address" value={emailAddress} />
                </div>
                <div style={styles.selectedPositionSection}>
                    <DashboardStat title="Your Selected Positions" value={industry} />
                </div>
            </div>
        </div>
    );
};

export default DashboardProfile;
