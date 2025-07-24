import React, { useState } from 'react';

// Self-contained SVG Icon Components. No changes needed here.
const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '3rem', width: '3rem', color: '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917l8.972-8.972.001-.001z" />
    </svg>
);

const CpuChipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '3rem', width: '3rem', color: '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M10 3.586a1 1 0 011 0V5h2V3.586a1 1 0 011 0V5h2V3.586a1 1 0 011 0V5h2V3.586a1 1 0 011 0V5h1.945M5.055 21H3.055m1.945-1.945H5.055m13.89 0h1.945m-1.945 1.945h1.945M10 20.414a1 1 0 01-1 0V19h-2v1.414a1 1 0 01-1 0V19h-2v1.414a1 1 0 01-1 0V19h-2v1.414a1 1 0 01-1 0v-2.009h.055a2 2 0 002-2v-1a2 2 0 012-2h1a2 2 0 012 2v1a2 2 0 002 2h.055v2.009z" />
    </svg>
);

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '3rem', width: '3rem', color: '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);


const Home = () => {
    // State to manage hover effects for buttons and cards
    const [isButtonHovered, setButtonHovered] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null); // null, 0, 1, or 2

    // --- Style Objects ---
    // This is the CSS-in-JS equivalent of the Tailwind classes.
    
    const styles = {
        page: {
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #F9FAFB, #DBEAFE)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        },
        main: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '4rem 1.5rem',
            textAlign: 'center',
        },
        heroContainer: {
            maxWidth: '896px',
            margin: '0 auto',
        },
        mainHeading: {
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', // Responsive font size
            fontWeight: '800',
            color: '#1F2937',
            lineHeight: '1.2',
            marginBottom: '1rem',
        },
        subHeading: {
            fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)', // Responsive font size
            color: '#4B5563',
            marginBottom: '2rem',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
        },
        button: {
            backgroundColor: '#2563EB',
            color: 'white',
            fontWeight: '600',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            textDecoration: 'none',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
            transform: isButtonHovered ? 'scale(1.05)' : 'scale(1)',
        },
        featuresSection: {
            marginTop: '6rem',
        },
        featuresHeading: {
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '1rem',
        },
        featuresSubHeading: {
            color: '#6B7280',
            maxWidth: '672px',
            margin: '0 auto 1.5rem auto',
        },
        featuresGrid: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2.5rem',
            marginTop: '3rem',
        },
        card: {
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            width: '320px',
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            textAlign: 'center',
        },
        cardIconContainer: {
            height: '4rem',
            width: '4rem',
            backgroundColor: '#DBEAFE',
            borderRadius: '50%',
            margin: '0 auto 1.5rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardTitle: {
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '0.5rem',
        },
        cardText: {
            color: '#4B5563',
        }
    };

    return (
        <div style={styles.page}>
            <main style={styles.main}>
                {/* Hero Section */}
                <div style={styles.heroContainer}>
                    <h1 style={styles.mainHeading}>
                        Secure Your Transactions with AI
                    </h1>
                    <p style={styles.subHeading}>
                        Leverage our cutting-edge machine learning model to detect fraudulent credit card transactions in real-time and safeguard your business.
                    </p>
                    <div style={styles.buttonContainer}>
                        <a
                            href="#features"
                            style={styles.button}
                            onMouseEnter={() => setButtonHovered(true)}
                            onMouseLeave={() => setButtonHovered(false)}
                        >
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" style={styles.featuresSection}>
                    <h2 style={styles.featuresHeading}>Why Choose Our Platform?</h2>
                    <p style={styles.featuresSubHeading}>
                        Our platform provides a comprehensive suite of tools to not only detect but also understand and prevent fraud effectively.
                    </p>

                    <div style={styles.featuresGrid}>
                        {[
                            { icon: <ShieldCheckIcon />, title: 'Real-Time Detection', text: 'Instantly analyze and flag suspicious transactions the moment they occur, minimizing potential losses.' },
                            { icon: <CpuChipIcon />, title: 'Advanced AI Models', text: 'Powered by state-of-the-art algorithms that learn and adapt to new fraud patterns continuously.' },
                            { icon: <ChartBarIcon />, title: 'Detailed Analytics', text: 'Access an intuitive dashboard with in-depth reports and visualizations of fraud trends.' },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.card,
                                    boxShadow: hoveredCard === index ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : styles.card.boxShadow,
                                    transform: hoveredCard === index ? 'translateY(-5px)' : 'translateY(0)',
                                }}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div style={styles.cardIconContainer}>{feature.icon}</div>
                                <h3 style={styles.cardTitle}>{feature.title}</h3>
                                <p style={styles.cardText}>{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;