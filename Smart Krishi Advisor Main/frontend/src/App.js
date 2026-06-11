import React, { useState, useEffect } from 'react';
import './App.css';
import maizeImg from './assests/seeds/maize_seeds.jpg';
import soyabeanImg from './assests/seeds/soyabean_seeds.jpg';
import paddyImg from './assests/seeds/paddy_seeds.jpg';
import cottonImg from './assests/seeds/cotton_seeds.jpg';
import mustardImg from './assests/seeds/mustard_seeds.jpg';

import glyphosateImg from './assests/pesticides/glyphosate.jpg';
import mancozebImg from './assests/pesticides/mancozeb.jpg';
import imidaclopridImg from './assests/pesticides/imidacloprid.jpg';
import acephateImg from './assests/pesticides/acephate.jpg';
import atrazineImg from './assests/pesticides/atrazine.jpg';

import ureaImg from './assests/fertilizers/urea.jpg';
import dapImg from './assests/fertilizers/dap.jpg';
import mopImg from './assests/fertilizers/mop.jpg';
import npkImg from './assests/fertilizers/npk.jpg';
import sspImg from './assests/fertilizers/ssp.jpg';

// --- IMAGES END HERE ---

const cropData = [
  // --- Alluvial Soil ---
  { soil: 'Alluvial', season: 'Kharif', crop: 'Rice (Paddy)', tips: 'Requires standing water and high humidity.' },
  { soil: 'Alluvial', season: 'Rabi', crop: 'Wheat', tips: 'Needs cool winters and moderate water.' },
  { soil: 'Alluvial', season: 'Zaid', crop: 'Moong Dal', tips: 'Short duration summer crop.' },

  // --- Black Soil ---
  { soil: 'Black', season: 'Kharif', crop: 'Cotton', tips: 'Excellent for moisture retention.' },
  { soil: 'Black', season: 'Rabi', crop: 'Gram (Chana)', tips: 'Grows on residual moisture after monsoon.' },
  { soil: 'Black', season: 'Kharif', crop: 'Soybean', tips: 'Major protein source, needs rainy season.' },

  // --- Red Soil ---
  { soil: 'Red', season: 'Kharif', crop: 'Groundnut', tips: 'Requires well-drained soil and light rain.' },
  { soil: 'Red', season: 'Kharif', crop: 'Ragi', tips: 'Highly drought resistant.' },
  { soil: 'Red', season: 'Rabi', crop: 'Tobacco', tips: 'Needs careful management of nutrients.' },

  // --- Sandy Soil ---
  { soil: 'Sandy', season: 'Zaid', crop: 'Watermelon', tips: 'Needs high heat and very little water.' },
  { soil: 'Sandy', season: 'Kharif', crop: 'Bajra', tips: 'Grows in extreme heat.' },

  // --- Loamy Soil ---
  { soil: 'Loamy', season: 'Rabi', crop: 'Mustard', tips: 'Requires cool climate and bright sunshine.' },
  { soil: 'Loamy', season: 'Rabi', crop: 'Potato', tips: 'Needs loose soil for tuber development.' }
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('activeUser'));
  const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('activeUser')) || null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [page, setPage] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [marketTab, setMarketTab] = useState('seeds');

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedSoil, setSelectedSoil] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState('all');

  // FIX: Wrapped logic inside an executable function action click to prevent infinite state updates
  const handleFindCrop = () => {
    const result = cropData.find(item => 
      item.soil === selectedSoil && item.season === selectedSeason
    );
    setRecommendation(result || { 
      crop: "No specific crop found", 
      tips: "We don't have data for this combination yet. Try another!" 
    });
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem('activeUser'); 
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleProtectedAction = (targetPage) => {
    if (!isLoggedIn) {
      alert("⚠️ Please Login first to access this section.");
      setShowAuthModal(true);
      return false; 
    } else {
      if (targetPage !== 'disease' && targetPage !== 'guide') {
        setPage(targetPage);
        window.scrollTo(0,0);
      }
      return true; 
    }
  };

  const handleAuth = async () => {
    const url = authMode === 'signup' 
      ? 'http://localhost:5000/api/register' 
      : 'http://localhost:5000/api/login';

    const bodyData = authMode === 'signup' 
      ? { fullName, id, password } 
      : { id, password };

    if (authMode === 'signup') {
        const isPhone = /^\d{10}$/.test(id);
        const isGmail = id.toLowerCase().endsWith('@gmail.com');

        if (!isPhone && !isGmail) {
            alert("❌ Please enter a 10-digit phone number or a @gmail.com address.");
            return; 
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("❌ Password must be 8+ characters and include a letter, number, and special character (like @, #, $).");
            return; 
        }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (response.ok) {
        if (authMode === 'signup') {
          alert("Registration Successful! Now please login.");
          setAuthMode('login');
        } else {
          sessionStorage.setItem('activeUser', JSON.stringify(data));
          setCurrentUser(data);
          setIsLoggedIn(true);
          setShowAuthModal(false);
        }
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Server is not running. Please start the backend!");
    }
  };

  return (
    <div className={`App ${darkMode ? 'dark-theme' : ''}`}>
      {/* AUTH POPUP */}
      {showAuthModal && (
        <div className="auth-modal-overlay">
          <div className="auth-card">
            <button className="close-btn" style={{position:'absolute', top:'15px', right:'20px', background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer'}} onClick={() => setShowAuthModal(false)}>✕</button>
            <h2 style={{color: '#065f46'}}>Smart Krishi</h2>
            <div className="auth-form" style={{marginTop:'20px'}}>
              {authMode === 'signup' && <input type="text" placeholder="Full Name" className="auth-input" onChange={(e) => setFullName(e.target.value)} />}
              <input type="text" placeholder="Mobile/Email" className="auth-input" onChange={(e) => setId(e.target.value)} />
              <input type="password" placeholder="Password" className="auth-input" onChange={(e) => setPassword(e.target.value)} />
              <button className="btn-main" style={{width: '100%', marginTop: '15px'}} onClick={handleAuth}>
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </div>
            <p style={{marginTop:'20px', fontSize:'0.9rem'}}>
              {authMode === 'login' ? "New here?" : "Already a user?"} 
              <span style={{color:'#065f46', fontWeight:'800', cursor:'pointer自由'}} onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}> Click here</span>
            </p>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button style={{background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer', fontWeight:'bold'}} onClick={() => setIsSidebarOpen(false)}>✕ Close Menu</button>
        <div style={{marginTop:'30px'}}>
          <div className="profile-card" style={{padding:'20px', borderRadius:'15px', display:'flex', gap:'15px', alignItems:'center'}}>
            <div style={{fontSize:'2rem'}}>{isLoggedIn ? '👨‍🌾' : '👤'}</div>
            <div>
              <h4 style={{margin:0}}>{isLoggedIn ? currentUser?.fullName : 'Guest User'}</h4>
              <p style={{margin:0, fontSize:'0.8rem'}}>{isLoggedIn ? currentUser?.id : 'Please login'}</p>
            </div>
          </div>
          <ul style={{listStyle:'none', padding:'20px 0'}}>
            <li onClick={() => setIsSettingsOpen(!isSettingsOpen)} style={{padding:'15px 0', borderBottom:'1px solid #eee', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
              <span>⚙️ {language === 'Hindi' ? 'सेटिंग्स' : 'Settings'}</span>
              <span style={{fontSize: '0.8rem'}}>{isSettingsOpen ? '▲' : '▼'}</span>
            </li>

            {isSettingsOpen && (
              <div className="settings-menu-box" style={{ padding: '10px 15px', borderRadius: '12px', marginTop: '5px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <span style={{ fontSize: '0.9rem', color: '#444' }}>🌙 {language === 'Hindi' ? 'डार्क मोड' : 'Dark Mode'}</span>
                  <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #eee' }}>
                  <span style={{ fontSize: '0.9rem', color: '#444' }}>🌐 {language === 'Hindi' ? 'भाषा' : 'Language'}</span>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '2px 5px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '0.8rem' }}>
                    <option value="English">English</option>
                    <option value="Hindi">हिन्दी</option>
                  </select>
                </div>
              </div>
            )}

            <li style={{padding:'15px 0', borderBottom:'1px solid #eee'}}>☁️ {language === 'Hindi' ? 'मौसम अलर्ट' : 'Weather Alerts'}</li>
            <li style={{padding:'15px 0', borderBottom:'1px solid #eee'}}>🎧 {language === 'Hindi' ? 'सहायता और समर्थन' : 'Help & Support'}</li>
            
            {isLoggedIn && (
              <li onClick={() => {sessionStorage.removeItem('activeUser'); window.location.reload();}} style={{color:'red', marginTop:'20px', cursor:'pointer', fontWeight:'bold'}}>
                🚪 {language === 'Hindi' ? 'लॉगआउट' : 'Logout'}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="hamburger" onClick={() => setIsSidebarOpen(true)}>☰</div>
          <div className="logo" onClick={() => setPage('home')}>Smart Krishi Advisor</div>
        </div>
        <div className="nav-right">
          <div className="ai-bot"><span>🤖</span> AI Chatbot</div>
          {!isLoggedIn ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="nav-btn-login" onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}>🔑 Login</button>
              <button className="nav-btn-signup" onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}>📝 Register</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="user-icon-btn">
                <span>
                  {currentUser?.fullName?.charAt(0).toUpperCase()}
                  {currentUser?.role === 'admin' && <span style={{fontSize: '12px', marginLeft: '4px'}}>⭐</span>}
                </span>
              </button>
              {currentUser?.role === 'admin' && (
                <span style={{color: '#d97706', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid #f59e0b'}}>Admin ⭐</span>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* HOME PAGE */}
      {page === 'home' && (
        <>
          <header className="hero">
            <div className="hero-content">
              <h1>
                {language === 'Hindi' ? 'स्मार्ट खेत,' : 'Smart Fields,'}<br/>
                <span>{language === 'Hindi' ? 'बेहतर उपज।' : 'Better Yields.'}</span>
              </h1>
              <div style={{fontSize: '1.2rem', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                <p>{language === 'Hindi' ? 'स्वागत है,' : 'Welcome,'} {isLoggedIn ? currentUser?.fullName : (language === 'Hindi' ? 'किसान' : 'Farmer')}!</p>
              </div>
              <button className="btn-main" style={{marginTop:'30px', padding:'18px 45px'}} onClick={() => handleProtectedAction('market')}>Get Started</button>
            </div>
          </header>
          
          <section className="services-container">
            {/* 1. Marketplace Card */}
            <div className="glass-card" onClick={() => handleProtectedAction('market')}>
              <div style={{fontSize:'2.5rem', marginBottom:'15px'}}>🛒</div>
              <h3>{language === 'Hindi' ? 'किसान बाजार' : 'Farmer Marketplace'}</h3>
              <p>{language === 'Hindi' ? 'बीज, कीटनाशक और खाद सबसे कम दाम पर।' : 'Seeds, Pesticides & Fertilizers at best prices.'}</p>
              <button className="btn-modern">{language === 'Hindi' ? 'बाजार देखें →' : 'Enter Marketplace →'}</button>
            </div>

            {/* 2. Crop Disease Scanner Card */}
            <div className="glass-card" onClick={() => handleProtectedAction('disease')}>
              <div style={{fontSize:'2.5rem', marginBottom:'15px'}}>🔍</div>
              <h3>{language === 'Hindi' ? 'फसल रोग स्कैनर' : 'Crop Disease Scanner'}</h3>
              <p>{language === 'Hindi' ? 'AI द्वारा पौधों के स्वास्थ्य की जांच।' : 'AI plant health detection.'}</p>
              <a href="http://localhost:5001" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                <button className="btn-modern" disabled={!isLoggedIn}>
                  {language === 'Hindi' ? 'जांच शुरू करें →' : 'Analyze Crop Health →'}
                </button>
              </a>
            </div>

            {/* 3. Rental Card */}
            <div className="glass-card" onClick={() => handleProtectedAction('rental')}>
              <div style={{fontSize:'2.5rem', marginBottom:'15px'}}>🚜</div>
              <h3>{language === 'Hindi' ? 'किराए के उपकरण' : 'Rental Equipment'}</h3>
              <p>{language === 'Hindi' ? 'ट्रैक्टर और ड्रोन बुक करें।' : 'Book tractors and drones.'}</p>
              <button className="btn-modern">{language === 'Hindi' ? 'सेवा बुक करें →' : 'Book a Service →'}</button>
            </div>

            {/* 4. Agriculture Guide Card */}
            <div className="glass-card" onClick={() => handleProtectedAction('guide')}>
              <div style={{fontSize:'2.5rem', marginBottom:'15px'}}>📖</div>
              <h3>{language === 'Hindi' ? 'कृषि गाइड' : 'Agriculture Guide'}</h3>
              <p>{language === 'Hindi' ? 'बेहतर फसल के लिए विशेषज्ञ सुझाव।' : 'Expert tips for better crop harvest.'}</p>
              <a href="http://localhost:8501" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                <button className="btn-modern">
                  {language === 'Hindi' ? 'गाइड पढ़ें →' : 'Read Guide →'}
                </button>
              </a>
            </div>
          </section>
        </>
      )}

      {/* RENTAL EQUIPMENT MARKETPLACE */}
      {page === 'rental' && (
        <div style={{ padding: '60px 8%', backgroundColor: '#fcfdfc', minHeight: '80vh' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '40px' }}>
            <button onClick={() => setPage('home')} className="btn-main" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>← Back to Dashboard</button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: '#064e3b', fontWeight: '800', fontSize: '2.5rem' }}>{language === 'Hindi' ? 'गेनर कृषि उपकरण बाज़ार' : 'Rental Equipment Marketplace'}</h2>
            <p style={{ color: '#4b5563', fontSize: '1.1rem', marginTop: '10px' }}>
              {language === 'Hindi' ? 'श्रेणी के अनुसार फिल्टर करें और भोपाल के स्थानीय डीलरों से सीधे Gainr के माध्यम से किराए पर लें।' : 'Filter by product type and lease verified machinery near Bhopal directly via the Gainr catalog network.'}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '50px', maxWidth: '1100px', margin: '0 auto 50px' }}>
            {[
              { id: 'all', en: 'All Products (33)', hi: 'सभी उत्पाद (33)' },
              { id: 'machinery', en: 'Tractors & Heavy Machinery', hi: 'ट्रैक्टर और भारी मशीनरी' },
              { id: 'soil', en: 'Soil Cultivation & Tillage', hi: 'मिट्टी की जुताई और कल्टीवेशन' },
              { id: 'planting', en: 'Seeding & Planting', hi: 'बुआई और रोपण' },
              { id: 'harvest', en: 'Harvesting & Processing', hi: 'कटाई और थ्रेसिंग' },
              { id: 'maintenance', en: 'Maintenance & Sprayers', hi: 'रखरखाव और स्प्रेयर' },
              { id: 'tools', en: 'Hand Tools & Infrastructure', hi: 'हाथ के औजार और पाइप' }
            ].map((cat) => {
              const isActive = (selectedProductType || 'all') === cat.id;
              return (
                <button key={cat.id} onClick={() => setSelectedProductType(cat.id)} style={{ padding: '10px 20px', borderRadius: '50px', fontWeight: '700', fontSize: '0.9rem', border: isActive ? 'none' : '1px solid rgba(6, 95, 70, 0.15)', backgroundColor: isActive ? '#065f46' : '#ffffff', color: isActive ? '#ffffff' : '#065f46', cursor: 'pointer', boxShadow: isActive ? '0 4px 12px rgba(6, 95, 70, 0.1)' : 'none', transition: 'all 0.2s ease', marginBottom: '8px' }}>
                  {language === 'Hindi' ? cat.hi : cat.en}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '30px', maxWidth: '1240px', margin: '0 auto' }}>
            {[
              { id: 'tractor', type: 'machinery', icon: '🚜', name: 'Tractor', hiName: 'ट्रैक्टर', rate: '₹1,500 / Day', desc: 'Heavy-duty performance tractor ideal for field preparation and towing.', hiDesc: 'खेत की तैयारी और ढुलाई के कार्यों के लिए उपयुक्त भारी और शक्तिशाली ट्रैक्टर।' },
              { id: 'power-tiller', type: 'machinery', icon: '⚙️', name: 'Power Tiller', hiName: 'पावर टिलर', rate: '₹1,000 / Hour', desc: 'Compact walking machine optimized for wet-land puddling and orchards.', hiDesc: 'गीली मिट्टी की जुताई (puddling) और छोटे खेतों के लिए चलने वाली मशीन।' },
              { id: 'milking-machine', type: 'machinery', icon: '🐄', name: 'Milking Machine', hiName: 'मिल्किंग मशीन', rate: '₹400 / Day', desc: 'Automated dairy machine for safe, efficient, and hygienic cattle milking.', hiDesc: 'पशुओं का सुरक्षित, कुशल और स्वच्छ दूध निकालने के लिए स्वचालित मशीन।' },
              { id: 'oil-machine', type: 'machinery', icon: '🛢️', name: 'Oil Machine', hiName: 'तेल निकालने की मशीन', rate: '₹600 / Hour', desc: 'Cold press seed processing unit to extract pure oil locally.', hiDesc: 'स्थानीय स्तर पर शुद्ध तेल निकालने के लिए कोल्ड प्रेस सीड प्रोसेसिंग यूनिट।' },
              { id: 'pump', type: 'machinery', icon: '💧', name: 'Water Pump', hiName: 'पानी का पंप', rate: '₹150 / Hour', desc: 'High-displacement water pump loop for reliable crop irrigation.', hiDesc: 'फसलों की सिंचाई के लिए उच्च क्षमता वाला पानी खींचने का पंप।' },
              { id: 'rotavator', type: 'soil', icon: '🔄', name: 'Rotavator', hiName: 'रोटावेटर', rate: '₹800 / Hour', desc: 'Rotary tillage system that pulverizes soil and mixes organic matter layers.', hiDesc: 'मिट्टी को बारीक करने और फसल अवशेषों को मिलाने के लिए रोटरी टिलर।' },
              { id: 'cultivator', type: 'soil', icon: '🔱', name: 'Cultivator', hiName: 'कल्टीवेटर', rate: '₹500 / Hour', desc: 'Sturdy secondary tillage equipment used to stir and loosen seedbeds.', hiDesc: 'मिट्टी को ढीला करने और खरपतवार नष्ट करने का मजबूत कल्टीवेटर।' },
              { id: 'tiller', type: 'soil', icon: '🚜', name: 'Field Tiller', hiName: 'टिलर', rate: '₹450 / Hour', desc: 'Standard soil preparation tractor attachment for loosening terrain row profiles.', hiDesc: 'मिट्टी की कठोर परत को तोड़ने के लिए मानक ट्रैक्टर अटैचमेंट।' },
              { id: 'cage-wheel', type: 'soil', icon: '🛞', name: 'Cage Wheel Rotator', hiName: 'केज व्हील रोटेटर', rate: '₹300 / Day', desc: 'Provides optimal traction and puddling operations in muddy paddy fields.', hiDesc: 'धान के कीचड़ भरे खेतों में ट्रैक्टर को बेहतर ग्रिप yards और जुताई देने वाला पहिया।' },
              { id: 'land-leveler', type: 'soil', icon: '📐', name: 'Land Leveler', hiName: 'लैंड लेवलer', rate: '₹400 / Hour', desc: 'Ensures even water distribution by smoothing and leveling field surfaces.', hiDesc: 'खेत की सतह को समतल करके समान जल वितरण सुनिश्चित करने वाला लेवलर।' },
              { id: 'ridge-plaster', type: 'soil', icon: '🧱', name: 'Ridge Plaster', hiName: 'रिज प्लास्टर (मेड़ बनाने की मशीन)', rate: '₹350 / Hour', desc: 'Shapes pristine channels and secure boundary rows in single passes.', hiDesc: 'खेतों में पानी के चैनल और मजबूत मेड़ बनाने के लिए आधुनिक मशीन।' },
              { id: 'seed-sowing', type: 'planting', icon: '🌾', name: 'Seed Sowing Machine', hiName: 'सीड सोइंग मशीन', rate: '₹700 / Hour', desc: 'Automates crop seed metering and layout placement coordinates.', hiDesc: 'सटीक दूरी और गहराई पर बीजों की स्वचालित बुआई करने वाली मशीन।' },
              { id: 'seeder', type: 'planting', icon: '🌱', name: 'Advanced Seeder', hiName: 'सीडर', rate: '₹600 / Hour', desc: 'Precision planting attachment to drill seeds smoothly into rows.', hiDesc: 'कतारों में बीजों को सुचारू रूप से ड्रिल करने के लिए सटीक बुआई उपकरण।' },
              { id: 'rice-transplanter', type: 'planting', icon: '🌾', name: 'Rice Transplanter', hiName: 'राइस ट्रांसप्लांटर', rate: '₹3,000 / Day', desc: 'Mechanized paddy transplanting unit designed to speed up seasonal cycles.', hiDesc: 'धान के पौधों के स्वचालित और समान रोपण के लिए आधुनिक मशीन।' },
              { id: 'harvester', type: 'harvest', icon: '🌾', name: 'Combine Harvester', hiName: 'कंबाइन हार्वेस्टर', rate: '₹1,800 / Hour', desc: 'All-in-one grain crop cutting, threshing, and cleaning system.', hiDesc: 'अनाज फसलों की कटाई, थ्रेसिंग और सफाई करने वाली कंबाइन मशीन।' },
              { id: 'thresher', type: 'harvest', icon: '🌪️', name: 'Thresher', hiName: 'थ्रेसर', rate: '₹900 / Hour', desc: 'Efficiently separates grains from husks and stalks post-harvest.', hiDesc: 'कटी हुई फसल से अनाज को भूसे से अलग करने वाली कुशल थ्रेसर मशीन।' },
              { id: 'baler', type: 'harvest', icon: '📦', name: 'Baler', hiName: 'बैलर (पुआल बांधने की मशीन)', rate: '₹800 / Hour', desc: 'Compresses loose crop residue into dense blocks for safe transport.', hiDesc: 'पराली और पुआल को परिवहन के लिए ठोस बंडलों में संपीड़ित करने वाली मशीन।' },
              { id: 'chaff-cutter', type: 'harvest', icon: '✂️', name: 'Chaff Cutter', hiName: 'चाफ कटर (कुट्टी मशीन)', rate: '₹250 / Hour', desc: 'Cuts straw or hay into small pieces for blended livestock feed.', hiDesc: 'पशुओं के चारे के लिए पुआल या भूसे को छोटे टुकड़ों में काटने की कुट्टी मशीन।' },
              { id: 'shredder', type: 'harvest', icon: '🪵', name: 'Shredder Machine', hiName: 'श्रेडर मशीन', rate: '₹500 / Hour', desc: 'Heavy organic waste reduction system for mulching tree branches.', hiDesc: 'पेड़ों की टहनियों और पत्तों को जैविक खाद (मल्च) में बदलने वालीश्रेडर मशीन।' },
              { id: 'coconut-dehusker', type: 'harvest', icon: '🥥', name: 'Coconut Dehusker', hiName: 'नारियल छीलने की मशीन', rate: '₹300 / Day', desc: 'Easily strips outer husks from coconut specimens efficiently.', hiDesc: 'नारियल के बाहरी सख्त छिलके को आसानी से और तेजी से उतारने वाला उपकरण।' },
              { id: 'brush-cutter', type: 'maintenance', icon: '🌿', name: 'Brush Cutter', hiName: 'ब्रश कटर', rate: '₹200 / Hour', desc: 'High-RPM tool designed to clear tough undergrowth and dense brush.', hiDesc: 'घने खरपतवार, झाड़ियों और अवांछित पौधों को साफ करने वाला हाई-स्पीड कटर।' },
              { id: 'grass-trimmer', type: 'maintenance', icon: '✂️', name: 'Grass Trimmer', hiName: 'घास ट्रिमर', rate: '₹150 / Hour', desc: 'Handheld weed management layout asset for perimeter maintenance.', hiDesc: 'खेतों के किनारों और बगीचों की घास को तराशने की हल्की ट्रिमर मशीन।' },
              { id: 'mower', type: 'maintenance', icon: '🚜', name: 'Lawn Mower', hiName: 'मोवर (घास काटने की मशीन)', rate: '₹300 / Hour', desc: 'Wheel-driven mechanical grass leveling system for tidy field profiles.', hiDesc: 'खेत की घास को एक समान स्तर पर काटने की पहियों वाली यांत्रिक मशीन।' },
              { id: 'sprayer', type: 'maintenance', icon: '🎒', name: 'Knapsack Sprayer', hiName: 'स्प्रेयर', rate: '₹100 / Day', desc: 'Manual backpack chemical container fluid discharge pump framework.', hiDesc: 'पीठ पर टांगने वाला फसलों पर कीटनाशक छिड़काव का हस्तचालित पंप।' },
              { id: 'sprayer-machine', type: 'maintenance', icon: '💨', name: 'Power Sprayer Machine', hiName: 'पावर स्प्रेयर मशीन', rate: '₹400 / Day', desc: 'Motorized pressurized sprayer assembly for high-altitude orchard misting.', hiDesc: 'बागानों और ऊंचे पौधों पर तेजी से तरल रसायनों के छिड़काव की मोटरयुक्त मशीन।' },
              { id: 'earth-auger', type: 'maintenance', icon: '🌀', name: 'Earth Auger Drill Tiller', hiName: 'अर्थ ऑगर ड्रिलर', rate: '₹300 / Hour', desc: 'Motorized planetary screw posthole drill for fence posts and plantation layouts.', hiDesc: 'बाड़ लगाने के खंभे और पौधे रोपने के लिए जमीन में गहरा गड्घा करने वाला ड्रिलर।' },
              { id: 'pipes', type: 'tools', icon: '🚰', name: 'Irrigation Pipes Combo', hiName: 'सिंचाई पाइप सेट', rate: '₹100 / Day', desc: 'Heavy-duty flexible delivery hoses matching standardized couplers.', hiDesc: 'खेतों तक पानी पहुंचाने के लिए मजबूत और टिकाऊ डिलीवरी पाइप सेट।' },
              { id: 'crowbar', type: 'tools', icon: '⛏️', name: 'Crowbar', hiName: 'साबरी / साबल', rate: '₹30 / Day', desc: 'Heavy forged steel digging tool for leverage and breaking rocky soil.', hiDesc: 'कठोर और पथरीली मिट्टी को तोड़ने तथा खुदाई के लिए स्टील का भारी साबल।' },
              { id: 'hoe-spade', type: 'tools', icon: '⛏️', name: 'Digging Hoe Spade', hiName: 'कुदाल', rate: '₹40 / Day', desc: 'Angled blade perfect for manual loosening, digging, and weeding.', hiDesc: 'मिट्टी को खोदने, ढीला करने और खरपतवार हटाने के लिए कोणीय ब्लेड वाली कुदाल।' },
              { id: 'pick-axe', type: 'tools', icon: '⛏️', name: 'Pick Axe', hiName: 'गैंती', rate: '₹40 / Day', desc: 'Dual-headed forged steel pick tip tailored to split dense stony soil structures.', hiDesc: 'बेहद सख्त, पथरीली मिट्टी और जड़ों को खोदने के लिए दोहरे मुख वाली लोहे की गैंती।' },
              { id: 'shovel', type: 'tools', icon: '🥄', name: 'Shovel', hiName: 'बेलचा', rate: '₹30 / Day', desc: 'Broad concave scoop tool for moving loose dirt, grain, or compost layers.', hiDesc: 'मिट्टी, अनाज या खाद को एक जगह से दूसरी जगह उठाने के लिए चौड़ा बेलचा।' },
              { id: 'spade', type: 'tools', icon: '🪓', name: 'Spade', hiName: 'फावड़ा', rate: '₹30 / Day', desc: 'Flat-edged digging instrument essential for clean boundary cuts.', hiDesc: 'खेतों में क्यारियां बनाने और मिट्टी को काटने-साफ करने का चपटा फावड़ा।' }
            ].map((item) => {
              const isMatch = (selectedProductType || 'all') === 'all' || selectedProductType === item.type;
              if (!isMatch) return null;

              return (
                <div key={item.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '25px', background: '#fff', borderRadius: '20px', boxShadow: '0 8px 25px rgba(6, 95, 70, 0.02)', border: '1px solid rgba(6, 95, 70, 0.05)' }}>
                  <div>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.icon}</div>
                    <h3 style={{ color: '#065f46', fontWeight: '700', fontSize: '1.25rem', marginBottom: '8px' }}>{item.name}</h3>
                    <h4 style={{ color: '#0f766e', fontWeight: '500', fontSize: '0.95rem', marginBottom: '12px', marginTop: '-4px' }}>{item.hiName}</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>{language === 'Hindi' ? item.hiDesc : item.desc}</p>
                  </div>
                  
                  <div style={{ borderTop: '2px solid #f0fdf4', paddingTop: '15px', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '600' }}>⏱️ {language === 'Hindi' ? 'किराया दर' : 'Lease Rate'}:</span>
                      <span style={{ fontSize: '1.15rem', color: '#065f46', fontWeight: '800' }}>{item.rate}</span>
                    </div>
                    <a href="https://gainr.in/farm-agri-products/Bhopal" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <button className="btn-modern" style={{ width: '100%', background: '#f97316', border: 'none', borderRadius: '50px', padding: '10px', fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>
                        {language === 'Hindi' ? 'Gainr पर देखें →' : 'View on Gainr Marketplace →'}
                      </button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AGRICULTURE GUIDE PAGE */}
      {page === 'guide' && (
        <div className="agriculture-guide-page">
          <button onClick={() => setPage('home')} style={{background:'none', border:'none', color:'#065f46', fontWeight:'bold', cursor:'pointer', padding:'20px'}}>← {language === 'Hindi' ? 'होम पर वापस जाएं' : 'Back to Home'}</button>
          <div className="agriculture-guide-section">
            <h2>🌱 {language === 'Hindi' ? 'स्मार्ट फसल सलाहकार' : 'Smart Crop Recommender'}</h2>
            <p>{language === 'Hindi' ? 'अपनी मिट्टी और महीने का चयन करें।' : 'Select your soil and month to find the best crop for your field.'}</p>

            <div className="recommender-controls" style={{marginTop: '20px'}}>
              <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginBottom:'5px'}}>{language === 'Hindi' ? 'मिट्टी का प्रकार चुनें:' : 'Select Soil Type:'}</label>
              <select onChange={(e) => setSelectedSoil(e.target.value)} value={selectedSoil} style={{width:'100%', padding:'10px', borderRadius:'8px', marginBottom:'15px'}}>
                <option value="">-- {language === 'Hindi' ? 'मिट्टी चुनें' : 'Select Soil Type'} --</option>
                <option value="Alluvial">{language === 'Hindi' ? 'जलोढ़ मिट्टी' : 'Alluvial Soil'}</option>
                <option value="Black">{language === 'Hindi' ? 'काली मिट्टी' : 'Black Soil'}</option>
                <option value="Red">{language === 'Hindi' ? 'लाल मिट्टी' : 'Red Soil'}</option>
                <option value="Sandy">{language === 'Hindi' ? 'रेतीली मिट्टी' : 'Sandy Soil'}</option>
                <option value="Loamy">{language === 'Hindi' ? 'दुमट मिट्टी' : 'Loamy Soil'}</option>
              </select>

              <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginBottom:'5px'}}>{language === 'Hindi' ? 'सीजन चुनें:' : 'Select Season:'}</label>
              <select onChange={(e) => setSelectedSeason(e.target.value)} value={selectedSeason} style={{width:'100%', padding:'10px', borderRadius:'8px', marginBottom:'20px'}}>
                <option value="">-- {language === 'Hindi' ? 'सीजन चुनें' : 'Select Season'} --</option>
                <option value="Kharif">{language === 'Hindi' ? 'खरीफ (जून-अक्टूबर)' : 'Kharif (June-Oct)'}</option>
                <option value="Rabi">{language === 'Hindi' ? 'रबी (नवंबर-अप्रैल)' : 'Rabi (Nov-April)'}</option>
                <option value="Zaid">{language === 'Hindi' ? 'जायद (मार्च-जून)' : 'Zaid (March-June)'}</option>
              </select>

              {/* FIX: Trigger custom handler function rather than raw raw setter mapping loops */}
              <button className="recommend-btn" onClick={handleFindCrop} style={{width:'100%', padding:'15px', background:'#10b981', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>
                {language === 'Hindi' ? 'सबसे अच्छी फसल खोजें' : 'Find Best Crop'}
              </button>
            </div>

            {recommendation && (
              <div className="recommendation-result-card" style={{marginTop:'30px', padding:'20px', background:'white', border:'2px solid #10b981', borderRadius:'15px', textAlign:'center'}}>
                <h3 style={{margin:'0 0 10px'}}>
                  {language === 'Hindi' ? 'सुझाई गई फसल:' : 'Recommended Crop:'} 
                  <span style={{color: '#059669', marginLeft:'10px'}}>{recommendation.crop}</span>
                </h3>
                <p style={{fontSize:'0.9rem', color:'#444'}}>💡 {recommendation.tips}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MARKETPLACE PAGE */}
{page === 'market' && (
  <div className="marketplace-page">
    <div className="market-header">
      <button onClick={() => setPage('home')} style={{background:'none', border:'none', color:'#065f46', fontWeight:'bold', cursor:'pointer'}}>← {language === 'Hindi' ? 'होम पर वापस जाएं' : 'Back to Home'}</button>
      <h2 style={{fontSize:'2.5rem', color:'#064e3b', marginTop:'10px'}}>{language === 'Hindi' ? 'किसान बाजार' : 'Farmer Marketplace'}</h2>
      <div className="tabs">
        <button className={marketTab === 'seeds' ? 'tab active' : 'tab'} onClick={() => setMarketTab('seeds')}>🌱 {language === 'Hindi' ? 'बीज' : 'Seeds'}</button>
        <button className={marketTab === 'pesticides' ? 'tab active' : 'tab'} onClick={() => setMarketTab('pesticides')}>🧪 {language === 'Hindi' ? 'कीटनाशक' : 'Pesticides'}</button>
        <button className={marketTab === 'fertilizers' ? 'tab active' : 'tab'} onClick={() => setMarketTab('fertilizers')}>📦 {language === 'Hindi' ? 'खाद' : 'Fertilizers'}</button>
      </div>
    </div>

   <div className="product-grid">
            {/* --- SEEDS SECTION --- */}
            {marketTab === 'seeds' && (
              <>
                <ProductCard 
                  name={language === 'Hindi' ? "मक्का के बीज (मक्का)" : "Maize Seeds (Makka)"} 
                  price={language === 'Hindi' ? "₹150 - ₹250 प्रति किलो" : "₹150 - ₹250 per kg"} 
                  img={maizeImg} 
                  onView={() => setSelectedProduct({ name: "Maize Seeds (Makka)", priceRange: "₹150 - ₹250 per kg", image: maizeImg })}
                  onBuy={() => window.open('https://www.amazon.in/AllThatGrows-Seeds-Premium-Non-Treaded-Gardeners/dp/B0C2C7P47W', '_blank')}
                />
                <ProductCard 
                  name={language === 'Hindi' ? "सोयाबीन के बीज (सोया)" : "Soyabean Seeds (Soya)"} 
                  price={language === 'Hindi' ? "₹70 - ₹100 प्रति किलो" : "₹70 - ₹100 per kg"} 
                  img={soyabeanImg} 
                  onView={() => setSelectedProduct({ name: "Soyabean Seeds (Soya)", priceRange: "₹70 - ₹100 per kg", image: soyabeanImg })}
                  onBuy={() => window.open('https://www.amazon.in/Kartik-Export-Whole-Soybeans-Proteins/dp/B0CCK6DGRX?th=1', '_blank')}
                />
                <ProductCard 
                  name={language === 'Hindi' ? "धान के बीज (चावल)" : "Paddy Seeds (Rice)"} 
                  price={language === 'Hindi' ? "₹50 - ₹120 प्रति किलो" : "₹50 - ₹120 per kg"} 
                  img={paddyImg} 
                  onView={() => setSelectedProduct({ name: "Paddy Seeds (Rice)", priceRange: "₹50 - ₹120 per kg", image: paddyImg })}
                  onBuy={() => window.open('https://www.amazon.in/Green-World-Brown-Farming-Agriculture/dp/B0CBZMT13X?th=1', '_blank')}
                />
                <ProductCard 
                  name={language === 'Hindi' ? "कपास के बीज" : "Cotton Seeds"} 
                  price={language === 'Hindi' ? "₹700 - ₹900 (450 ग्राम)" : "₹700 - ₹900 (450g)"} 
                  img={cottonImg} 
                  onView={() => setSelectedProduct({ name: "Cotton Seeds", priceRange: "₹700 - ₹900 (450g)", image: cottonImg })}
                  onBuy={() => window.open('https://www.amazon.in/Saara-HERBAL-FRESH-Cotton-Seed/dp/B0DGQDNTBJ', '_blank')}
                />
                <ProductCard 
                  name={language === 'Hindi' ? "सरसों के बीज (सरसों)" : "Mustard Seeds (Sarso)"} 
                  price={language === 'Hindi' ? "₹100 - ₹150 प्रति किलो" : "₹100 - ₹150 per kg"} 
                  img={mustardImg} 
                  onView={() => setSelectedProduct({ name: "Mustard Seeds (Sarso)", priceRange: "₹100 - ₹150 per kg", image: mustardImg })}
                  onBuy={() => window.open('https://www.amazon.in/Yellow-Musturd-seeds-Peeli-sarson/dp/B0F66DLC4J', '_blank')}
                />
              </>
            )}

            {/* --- PESTICIDES SECTION --- */}
            {marketTab === 'pesticides' && (
              <>
                <ProductCard 
                  name="Glyphosate 41% SL" 
                  price={language === 'Hindi' ? "₹350 - ₹500 /लीटर" : "₹350 - ₹500 /L"} 
                  img={glyphosateImg} 
                  onView={() => setSelectedProduct({ name: "Glyphosate 41% SL", priceRange: "₹350 - ₹500 /L", image: glyphosateImg })}
                  onBuy={() => window.open('https://agribegri.com/products/buy-ju-glypho-glyphosate-41-sl-online.php', '_blank')}
                />
                <ProductCard 
                  name="Mancozeb 75% WP" 
                  price={language === 'Hindi' ? "₹300 - ₹450 /किलो" : "₹300 - ₹450 /kg"} 
                  img={mancozebImg} 
                  onView={() => setSelectedProduct({ name: "Mancozeb 75% WP", priceRange: "₹300 - ₹450 /kg", image: mancozebImg })}
                  onBuy={() => window.open('https://agrivruddhi.com/products/dhanuka-m-45-fungicide?variant=55208556626289&country=IN&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic', '_blank')}
                />
                <ProductCard 
                  name="Imidacloprid 17.8% SL" 
                  price={language === 'Hindi' ? "₹700 - ₹1,100 /लीटर" : "₹700 - ₹1,100 /L"} 
                  img={imidaclopridImg} 
                  onView={() => setSelectedProduct({ name: "Imidacloprid 17.8% SL", priceRange: "₹700 - ₹1,100 /L", image: imidaclopridImg })}
                  onBuy={() => window.open('https://www.bighaat.com/products/confidor?variant=40614557089815', '_blank')}
                />
                <ProductCard 
                  name="Acephate 75% SP" 
                  price={language === 'Hindi' ? "₹450 - ₹650 /किलो" : "₹450 - ₹650 /kg"} 
                  img={acephateImg} 
                  onView={() => setSelectedProduct({ name: "Acephate 75% SP", priceRange: "₹450 - ₹650 /kg", image: acephateImg })}
                  onBuy={() => window.open('https://linuxcrop.com/shop/acephate-75-sp', '_blank')}
                />
                <ProductCard 
                  name="Atrazine 50% WP" 
                  price={language === 'Hindi' ? "₹300 - ₹500 /किलो" : "₹300 - ₹500 /kg"} 
                  img={atrazineImg} 
                  onView={() => setSelectedProduct({ name: "Atrazine 50% WP", priceRange: "₹300 - ₹500 /kg", image: atrazineImg })}
                  onBuy={() => window.open('https://agribegri.com/products/buy-ju-atrazine-herbicide-online.php', '_blank')}
                />
              </>
            )}

            {/* --- FERTILIZERS SECTION --- */}
            {marketTab === 'fertilizers' && (
              <>
                <ProductCard 
                  name={language === 'Hindi' ? "यूरिया (नाइट्रोजन)" : "Urea (Nitrogen)"} 
                  price={language === 'Hindi' ? "₹6 प्रति किलो" : "₹6 per kg"} 
                  img={ureaImg} 
                  onView={() => setSelectedProduct({ name: "Urea (Nitrogen)", priceRange: "₹6 per kg", image: ureaImg })}
                  onBuy={() => window.open('https://www.amazon.in/Urea-Fertilizer-Plants-Home-Garden/dp/B0DS5ZFF6D', '_blank')}
                />
                <ProductCard 
                  name={language === 'Hindi' ? "डीएपी (डी-अमोनियम)" : "DAP (Di-Ammonium)"} 
                  price={language === 'Hindi' ? "₹27 प्रति किलो" : "₹27 per kg"} 
                  img={dapImg} 
                  onView={() => setSelectedProduct({ name: "DAP (Di-Ammonium)", priceRange: "₹27 per kg", image: dapImg })}
                  onBuy={() => window.open('https://www.amazon.in/Fertilizer-Plants-Ammonium-Phosphate-Gardening/dp/B0DS7Z4G2M', '_blank')}
                />
                <ProductCard 
                  name={language === 'Hindi' ? "एमओपी (म्यूरेट ऑफ पोटाश)" : "MOP (Muriate of Potash)"} 
                  price={language === 'Hindi' ? "₹34 प्रति किलो" : "₹34 per kg"} 
                  img={mopImg} 
                  onView={() => setSelectedProduct({ name: "MOP (Muriate of Potash)", priceRange: "₹34 per kg", image: mopImg })}
                  onBuy={() => window.open('https://gogarden.co.in/products/muriate-of-potash-fertilizer-mop-fertilizer-all-purpose-for-plant-health-flower-fruit-plant-growth-npk-0-0-60-450-gram', '_blank')}
                />
                <ProductCard 
                  name={language === 'Hindi' ? "एनपीके (मिश्रित उर्वरक)" : "NPK (Complex Fertilizer)"} 
                  price={language === 'Hindi' ? "₹29.50 प्रति किलो" : "₹29.50 per kg"} 
                  img={npkImg} 
                  onView={() => setSelectedProduct({ name: "NPK (Complex Fertilizer)", priceRange: "₹29.50 per kg", image: npkImg })}
                  onBuy={() => window.open('https://www.amazon.in/Casa-Amor-Fertilizer-Water-Soluble-Flowering/dp/B0F3HRWZRF?source=ps-sl-shoppingads-lpcontext&smid=A1RA06XS0SVW3R&th=1', '_blank')}
                />
                <ProductCard 
                  name={language === 'Hindi' ? "एसएसपी (सिंगल सुपर फॉस्फेट)" : "SSP (Single Super Phosphate)"} 
                  price={language === 'Hindi' ? "₹6 - ₹9 प्रति किलो" : "₹6 - ₹9 per kg"} 
                  img={sspImg} 
                  onView={() => setSelectedProduct({ name: "SSP (Single Super Phosphate)", priceRange: "₹6 - ₹9 per kg", image: sspImg })}
                  onBuy={() => window.open('https://www.amazon.in/Erwon-Phosphate-Fertilizer-Powerful-Fungicide/dp/B097H89ZG9?source=ps-sl-shoppingads-lpcontext&smid=A1MNN90YSFIH8Q&th=1', '_blank')}
                />
              </>
            )}
          </div>
  </div>
)}

      {/* DYNAMIC PRODUCT SPECIFICATION POPUP MODAL VIEW */}
      {selectedProduct && (
        <div className="auth-modal-overlay">
          <div className="auth-card" style={{ textAlign: 'center', position: 'relative' }}>
            <button className="close-btn" style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setSelectedProduct(null)}>✕</button>
            <h3 style={{ color: '#065f46', marginBottom: '15px' }}>{selectedProduct.name}</h3>
            <img src={selectedProduct.image} alt="Spec Profile" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px' }} />
            <p style={{ fontWeight: '700', fontSize: '1.2rem', color: '#10b981' }}>{selectedProduct.priceRange}</p>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Verified standard distribution batch sample. Contact cooperative warehouse for physical logistics routing orders.</p>
            <button className="btn-main" style={{ width: '100%', marginTop: '15px' }} onClick={() => setSelectedProduct(null)}>Close Overview</button>
          </div>
        </div>
      )}

      {/* FOOTER BAR */}
      <footer className="footer-modern">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🌱 Smart Krishi</h3>
            <p>Empowering farmers across India with AI-driven insights, real-time market prices, and modern equipment rentals. Transforming traditional farming into smart agriculture.</p>
            <div className="social-icons">
              <div className="icon-circle"><i className="fab fa-facebook-f"></i></div>
              <div className="icon-circle"><i className="fab fa-twitter"></i></div>
              <div className="icon-circle"><i className="fab fa-instagram"></i></div>
              <div className="icon-circle"><i className="fab fa-youtube"></i></div>
            </div>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul className="footer-links">
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
              <li>FAQs</li>
              <li>Farmer Forum</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul className="footer-contact">
              <li><span>📍</span><span>Bhopal, Madhya Pradesh, India</span></li>
              <li><span>📞</span><span>+91 9121212121</span></li>
              <li><span>✉️</span><span>support@smartkrishi.in</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Smart Krishi Advisor. Built for the future of Indian Farming.</p>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ name, price, img, onView, onBuy }) {
  return (
    <div className="product-card">
      <div className="img-container">
        <img 
          src={img} 
          alt={name} 
          onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=Agriculture+Product"; }} 
        />
      </div>
      <div className="p-info">
        <h3>{name}</h3>
        <p style={{ color: '#065f46', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '14px' }}>{price}</p>
        
        {/* RE-STYLED ACTION BUTTON LAYOUT ROWS WITH PREMIUM CLASSES */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button className="btn-buy btn-specs-variant" style={{ flex: 1 }} onClick={onView}>
            🔍 View Specs
          </button>
          <button className="btn-buy btn-buy-variant" style={{ flex: 1 }} onClick={onBuy}>
            🛍️ Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
export default App;