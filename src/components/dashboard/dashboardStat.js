import React, { useState } from 'react';

const DashboardStat = ({ title, value }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
        },
        listContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            rowGap: "15px",
            columnGap: '15px',
            marginTop: '0px',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width: '100%',
        },
        listItem: {
            marginRight: '5px',
        },
        lastListItem: {
            marginRight: '0',
        },
    };

    const renderValue = () => {
        if (Array.isArray(value)) {
            return (
                <div className='flex flex-col w-full flex-wrap'>
                    <div style={styles.listContainer}>
                        {value.map((item, index) => (
                            <span key={index} className="text-xs font-medium text-black px-6 rounded-md py-2.5 border border-gray-400" style={index < value.length - 1 ? styles.listItem : styles.lastListItem}>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            );
        } else {
            return (
                <>
                    <p className="text-sm text-gray-500 font-sm mb-1">{title}:</p>
                    <span className="text-gray-800 text-sm font-medium">{value}</span>
                </>
            );
        }
    };

    return (
        <div style={styles.container}>
            {renderValue()}
        </div>
    );
};

export default DashboardStat;
