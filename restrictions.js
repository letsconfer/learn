const restrictionMessage = "This action is restricted, please contact admin for more details.";
let isInternalAction = false;

// Helper to get master config from window.CV_MASTER_CONFIG
function getConfig() {
    return window.CV_MASTER_CONFIG || window.MASTER_CONFIG || {};
}

// Inject Indentation and Layout Styles
const style = document.createElement('style');
style.innerHTML = `
    /* Two-column layout for IELTS GT Resources */
    .resources-grid {
        display: flex;
        gap: 20px;
        margin-top: 8pt;
        margin-bottom: 8pt;
    }
    .resources-column {
        flex: 1;
    }
    @media (max-width: 600px) {
        .resources-grid {
            flex-direction: column;
            gap: 10px;
        }
    }
    /* Indentation styling for vocabulary content blocks */
    .vocab-content {
        margin-left: 30px;
        margin-bottom: 15px;
    }
    .cv-container ul {
        padding-left: 20px;
    }
    .cv-container li {
        margin-bottom: 3pt;
    }
    /* Home Icon Link Styling */
    .home-icon-link {
        text-decoration: none;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        line-height: 24px;
        font-size: 18px;
        transition: transform 0.2s ease;
    }
    .home-icon-link:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);

function applyMasterConfig() {
    const config = getConfig();
    
    if (config.profileImage) {
        const profileImgs = document.querySelectorAll('.profile-img');
        profileImgs.forEach(img => {
            img.src = config.profileImage;
        });
    }

    if (config.allowLeftClick === false) {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
    } else {
        document.body.style.userSelect = 'auto';
        document.body.style.webkitUserSelect = 'auto';
    }
}

function updateThemeButton() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        const currentTheme = document.body.getAttribute("data-theme") || "light";
        if (currentTheme === "dark") {
            themeBtn.style.backgroundImage = "url('LightBulb.jpeg?v=2026')";
        } else {
            themeBtn.style.backgroundImage = "url('DarkBulb.jpeg?v=2026')";
        }
    }
}

function toggleTheme() {
    const body = document.body;
    const html = document.documentElement;
    const currentTheme = body.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    body.setAttribute("data-theme", newTheme);
    html.setAttribute("data-theme", newTheme);
    
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.style.backgroundImage = 'none';
    }
    
    void body.offsetHeight;
    setTimeout(() => {
        updateThemeButton();
    }, 50);
}

function downloadPDF() {
    isInternalAction = true;
    window.print();
    setTimeout(() => {
        isInternalAction = false;
    }, 1000);
}

document.addEventListener("DOMContentLoaded", function() {
    applyMasterConfig();
    
    const config = getConfig();
    const switcher = document.querySelector('.cv-container .theme-switcher') || document.querySelector('.theme-switcher');
    
    if (switcher) {
        switcher.style.position = 'absolute';
        switcher.style.top = '15px';
        switcher.style.right = '15px';
        switcher.style.margin = '0';
        switcher.style.textAlign = 'right';
        switcher.style.zIndex = '10';
        switcher.innerHTML = '';
        
        const baseButtonStyle = (btn) => {
            btn.type = 'button';
            btn.style.backgroundSize = '20px 20px';
            btn.style.backgroundRepeat = 'no-repeat';
            btn.style.backgroundPosition = 'center';
            btn.style.backgroundColor = 'transparent';
            btn.style.border = 'none';
            btn.style.outline = 'none';
            btn.style.boxShadow = 'none';
            btn.style.cursor = 'pointer';
            btn.style.width = '24px';
            btn.style.height = '24px';
            btn.style.padding = '0';
            btn.style.margin = '0 4px';
            btn.style.display = 'inline-block';
            btn.style.verticalAlign = 'middle';
        };

        if (!document.body.hasAttribute("data-theme")) {
            document.body.setAttribute("data-theme", "light");
            document.documentElement.setAttribute("data-theme", "light");
        }

        // 0. Home Icon Button (Loads full URL from config.homePage)
        const homeUrl = config.homePage || 'language.html';
        const homeLink = document.createElement('a');
        homeLink.href = homeUrl;
        homeLink.className = 'home-icon-link';
        homeLink.title = 'Return to Language Hub';
        homeLink.innerHTML = '🏠';
        baseButtonStyle(homeLink);
        switcher.appendChild(homeLink);

        // 1. Theme Toggle Button
        if (config.showThemeIcon !== false) {
            const themeBtn = document.createElement('button');
            themeBtn.id = 'theme-toggle-btn';
            baseButtonStyle(themeBtn);
            themeBtn.onclick = toggleTheme;
            themeBtn.title = "Toggle Theme";
            switcher.appendChild(themeBtn);
            updateThemeButton();
        }
        
        // 2. Download PDF Button (Strictly hidden when showDownloadIcon is false)
        if (config.showDownloadIcon === true) {
            const downloadBtn = document.createElement('button');
            downloadBtn.id = 'download-pdf-btn';
            baseButtonStyle(downloadBtn);
            downloadBtn.onclick = downloadPDF;
            downloadBtn.title = "Download PDF";
            downloadBtn.style.backgroundImage = "url('Download.jpeg?v=2026')";
            switcher.appendChild(downloadBtn);
        }
    }
});

// ========== SECURITY & RESTRICTIONS ==========
document.addEventListener('contextmenu', function(e) {
    const config = getConfig();
    if (!config.allowRightClick) {
        e.preventDefault();
        alert(restrictionMessage);
    }
});

document.addEventListener('copy', function(e) {
    const config = getConfig();
    if (!config.allowRightClick) {
        e.preventDefault();
        alert(restrictionMessage);
    }
});

document.addEventListener('cut', function(e) {
    const config = getConfig();
    if (!config.allowRightClick) {
        e.preventDefault();
        alert(restrictionMessage);
    }
});

document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    const config = getConfig();
    if (isInternalAction) return;
    if (config.allowScreenshot) return;

    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'u' || e.key === 'P' || e.key === 'S' || e.key === 'U')) {
        e.preventDefault();
        alert(restrictionMessage);
    }
    
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        navigator.clipboard.writeText('');
        alert(restrictionMessage);
    }

    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
        e.preventDefault();
        alert(restrictionMessage);
    }
    
});
