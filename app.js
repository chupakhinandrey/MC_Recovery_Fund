// Trading data
const tradingData = {
    coins: [
        {
            name: "BTC",
            pnl: 55706.51,
            winRate: 95.0,
            trades: 20,
            color: "#f7931a"
        },
        {
            name: "HYPE", 
            pnl: 40242.57,
            winRate: 100.0,
            trades: 106,
            color: "#00ff88"
        },
        {
            name: "SOL",
            pnl: 19479.10,
            winRate: 100.0,
            trades: 30,
            color: "#9945ff"
        },
        {
            name: "ETH",
            pnl: 9599.69,
            winRate: 81.8,
            trades: 11,
            color: "#627eea"
        }
    ]
};

// Chart.js default configuration
Chart.defaults.color = '#cccccc';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 20;

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePnLChart();
    initializeWinRateChart();
    addInteractiveEffects();
});

// PnL Distribution Pie Chart
function initializePnLChart() {
    const ctx = document.getElementById('pnlChart').getContext('2d');
    
    const data = {
        labels: tradingData.coins.map(coin => coin.name),
        datasets: [{
            data: tradingData.coins.map(coin => coin.pnl),
            backgroundColor: [
                '#1FB8CD',
                '#FFC185', 
                '#B4413C',
                '#5D878F'
            ],
            borderColor: '#0a0a0a',
            borderWidth: 3,
            hoverBorderWidth: 5,
            hoverBorderColor: '#00ff88'
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#cccccc',
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 500
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const percentage = ((value / data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                    return {
                                        text: `${label}: $${value.toLocaleString()} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].backgroundColor[i],
                                        lineWidth: 0,
                                        pointStyle: 'circle'
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#cccccc',
                    borderColor: '#00ff88',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `PnL: $${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    };

    new Chart(ctx, config);
}

// Win Rate Bar Chart
function initializeWinRateChart() {
    const ctx = document.getElementById('winrateChart').getContext('2d');
    
    const data = {
        labels: tradingData.coins.map(coin => coin.name),
        datasets: [{
            label: 'Win Rate (%)',
            data: tradingData.coins.map(coin => coin.winRate),
            backgroundColor: [
                '#1FB8CD',
                '#FFC185',
                '#B4413C', 
                '#5D878F'
            ],
            borderColor: [
                '#1FB8CD',
                '#FFC185',
                '#B4413C',
                '#5D878F'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#cccccc',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#cccccc',
                        font: {
                            size: 14,
                            weight: 600
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#cccccc',
                    borderColor: '#00ff88',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const coinData = tradingData.coins[context.dataIndex];
                            return [
                                `Win Rate: ${context.parsed.y}%`,
                                `Trades: ${coinData.trades}`,
                                `PnL: $${coinData.pnl.toLocaleString()}`
                            ];
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    };

    new Chart(ctx, config);
}

// Add interactive effects
function addInteractiveEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.stat-card, .coin-card, .chart-container');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add a pulse effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
            }, 100);
        });
    });

    // Counter animation for numbers
    animateNumbers();
    
    // Add loading animation
    addLoadingAnimations();
}

// Animate numbers on load
function animateNumbers() {
    const numberElements = document.querySelectorAll('.stat-value, .coin-pnl');
    
    numberElements.forEach(element => {
        const text = element.textContent;
        const number = parseFloat(text.replace(/[^0-9.-]/g, ''));
        
        if (!isNaN(number)) {
            let start = 0;
            const duration = 2000;
            const startTime = performance.now();
            
            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = start + (number * easeOut);
                
                if (text.includes('$')) {
                    if (text.includes('+')) {
                        element.textContent = '+$' + Math.floor(current).toLocaleString();
                    } else {
                        element.textContent = '$' + Math.floor(current).toLocaleString();
                    }
                } else if (text.includes('%')) {
                    element.textContent = current.toFixed(text.includes('.') ? 1 : 0) + '%';
                } else {
                    element.textContent = Math.floor(current).toLocaleString();
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                }
            }
            
            requestAnimationFrame(updateNumber);
        }
    });
}

// Add loading animations
function addLoadingAnimations() {
    const sections = document.querySelectorAll('.main-stats, .coins-section, .charts-section, .summary-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(section);
    });
}

// Add dynamic background effects
function addBackgroundEffects() {
    const dashboard = document.querySelector('.dashboard');
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(0, 255, 136, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
        `;
        document.body.appendChild(particle);
    }
    
    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize background effects
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addBackgroundEffects();
    }, 1000);
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll performance
let ticking = false;
function updateOnScroll() {
    // Placeholder for scroll-based animations
    ticking = false;
}

document.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});