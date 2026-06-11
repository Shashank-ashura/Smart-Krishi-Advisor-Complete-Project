import streamlit as st
import pandas as pd
import pickle
import numpy as np

# Page Configuration
st.set_page_config(
    page_title="Agriculture Guide",
    page_icon="🌱",
    layout="wide"
)

# Premium UI/UX Custom CSS Injection
st.markdown("""
    <style>
    /* Import Main Project Typography */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    /* Apply Font Globally Across Streamlit Components */
    html, body, [class*="css"], .stMarkdown, p, h1, h2, h3, label {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
    }
    
    .main { 
        background-color: #fcfdfc; 
    }
    
    /* Premium Sidebar Back Button */
    .back-dashboard-link {
        display: inline-flex;
        align-items: center;
        color: #065f46;
        font-weight: 700;
        text-decoration: none;
        padding: 10px 22px;
        border-radius: 50px;
        background-color: #d1fae5;
        border: 1px solid rgba(6, 95, 70, 0.1);
        margin-bottom: 25px;
        font-size: 0.9rem;
        transition: all 0.25s ease;
    }
    
    .back-dashboard-link:hover {
        background-color: #065f46;
        color: white !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(6, 95, 70, 0.15);
    }
    
    /* Refined Layout Input Cards */
    .card {
        background-color: white;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 10px 25px rgba(6, 95, 70, 0.03);
        border: 1px solid rgba(6, 95, 70, 0.05);
        margin-bottom: 20px;
    }
    
    /* Custom Stylings for Inputs and Sliders */
    .stSlider, .stNumberInput, .stSelectbox > div {
        background: #fafdfb;
        border-radius: 12px;
        padding: 5px;
    }
    
    /* Modernized Orange Action Button Layout */
    .stButton>button {
        width: 100%;
        border-radius: 50px;
        height: 3.5em;
        background-color: #f97316 !important; /* Modern Orange Layout Color */
        color: white !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        border: none !important;
        box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .stButton>button:hover {
        background-color: #ea580c !important; /* Darker Orange Hover Tone */
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
    }
    
    /* Target Result Display Metrics */
    .result-text {
        font-size: 42px;
        color: #065f46;
        font-weight: 800;
        text-align: center;
        letter-spacing: -0.5px;
        margin-top: 10px;
    }
    </style>
    """, unsafe_allow_html=True)

st.sidebar.markdown("""
    <a href="javascript:window.close();" class="back-dashboard-link" target="_self">
        ✕ Close Guide
    </a>
""", unsafe_allow_html=True)

# Load the model
@st.cache_resource
def load_trained_model():
    with open('crop_model.pkl', 'rb') as f:
        return pickle.load(f)

try:
    model = load_trained_model()
except FileNotFoundError:
    st.error("❌ Model file not found! Please run 'python train_model.py' first.")

# Title and Description Headers
st.markdown("<h1 style='text-align: center; color: #064e3b; font-weight: 800; font-size: 2.8rem;'>🌱 Agriculture Guide</h1>", unsafe_allow_html=True)
st.markdown("<p style='text-align: center; color: #4b5563; font-size: 1.1rem; margin-bottom: 30px;'>Utilizing Machine Learning to optimize agricultural yield based on soil and environment.</p>", unsafe_allow_html=True)
st.markdown("---")

# Layout: 3 Columns
col1, col2, col3 = st.columns(3, gap="large")

with col1:
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown("<h4 style='color: #065f46; font-weight:700; margin-bottom:20px;'>🧪 Soil Composition</h4>", unsafe_allow_html=True)
    n = st.slider("Nitrogen (N)", 0, 150, 90)
    p = st.slider("Phosphorus (P)", 0, 150, 42)
    k = st.slider("Potassium (K)", 0, 250, 43)
    ph = st.slider("Soil pH Level", 0.0, 14.0, 6.5, step=0.1)
    st.markdown('</div>', unsafe_allow_html=True)

with col2:
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown("<h4 style='color: #065f46; font-weight:700; margin-bottom:20px;'>🌤️ Environmental Factors</h4>", unsafe_allow_html=True)
    temp = st.number_input("Temperature (°C)", 0.0, 50.0, 25.0)
    hum = st.number_input("Humidity (%)", 0.0, 100.0, 80.0)
    rain = st.number_input("Rainfall (mm)", 0.0, 1000.0, 200.0)
    st.markdown('</div>', unsafe_allow_html=True)

with col3:
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown("<h4 style='color: #065f46; font-weight:700; margin-bottom:20px;'>🗺️ Geographical Info</h4>", unsafe_allow_html=True)
    soil_type = st.selectbox("Select Soil Type", ["Alluvial", "Black", "Red", "Laterite", "Desert", "Clayey"])
    season = st.selectbox("Current Season", ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"])
    region = st.selectbox("Region Type", ["Tropical", "Arid", "Semi-Arid", "Coastal", "Hilly"])
    st.markdown('</div>', unsafe_allow_html=True)

# Prediction Logic
st.markdown("<br>", unsafe_allow_html=True)
if st.button("Calculate Best Crop Recommendation →"):
    with st.spinner('Analyzing soil data and weather patterns...'):
        # Prepare input for model
        input_data = np.array([[n, p, k, temp, hum, ph, rain]])
        prediction = model.predict(input_data)[0]
        
        st.markdown("---")
        st.markdown(f'<div class="card" style="border-left: 6px solid #10b981;"><p style="text-align:center; color:#4b5563; font-weight: 600; margin: 0;">Optimal Crop Selection for {soil_type} soil in {region} region:</p>', unsafe_allow_html=True)
        st.markdown(f'<p class="result-text">✨ {prediction.upper()} ✨</p>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Display context
        st.info(f"💡 Cultivation Tip: **{prediction.title()}** thrives exceptionally well during the **{season}** season under these targeted metrics.")