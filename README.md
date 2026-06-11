# Smart Krishi Advisor Ecosystem 🌾

A unified full-stack smart agriculture platform containing three individual modules that work independently but connect conceptually to optimize farming workflows:

1. **Smart Krishi Advisor:** The central React JS Frontend Dashboard. Features bilingual toggling with zero reload lag, an interactive agricultural information hub, a 33-category rental filter system, and a smart marketplace aggregator.
2. **Crop Recommendation Project:** An analytical Python & Streamlit application that evaluates soil attributes and seasonal variables to recommend high-yielding crops.
3. **Plant Disease Recognition System:** A Flask micro-backend hosting a TensorFlow/Keras Convolutional Neural Network (CNN) to instantly diagnose leaf tissue diseases from image uploads.

---

## 🛠️ Prerequisites (What to Install First)

To execute any of these individual project components locally on your machine, you must install the following core runtime software layers:

* **Node.js** (v16.0.0 or higher) -> [Download Node.js](https://nodejs.org/)
* **Python** (v3.9, v3.10, or v3.11 recommended for TensorFlow compatibility) -> [Download Python](https://www.python.org/)
* **MongoDB & MongoDB Compass** (For user registration logs and profile tokens) -> [Download MongoDB](https://www.mongodb.com/)

---

## 🚀 Step-by-Step Execution Guide

Because each project module functions as an individual environment on its own server layer, execute them by following these native command sequences:

### 📁 Module 1: The Main Workspace Dashboard (React JS)
1. Open your terminal window and change your path directory to the main web app folder:
   ```bash
   cd Smart_Krishi_Advisor
   Install all the required UI components, styling libraries, and icon packages
   npm install
   Boot up the high-speed local frontend development layout:
   npm start
   Your browser will automatically launch the interface at: http://localhost:3000
   📁 Module 2: The Crop Recommendation Engine (Streamlit)
Open a fresh terminal window and navigate into the recommendation directory:

Bash
cd Crop_Recommendation_Project
Create and initialize an isolated Python virtual execution environment:

Bash
python -m venv venv
venv\Scripts\activate
Install the primary computational data modules and layout dependencies:

Bash
pip install streamlit pandas scikit-learn
Run the data-driven presentation layer framework:

Bash
streamlit run app.py
📁 Module 3: The AI Plant Disease Scanner (Flask & TensorFlow)
Open a terminal window and enter the disease scanner project directory:

Bash
cd Plant-Disease-Recognition-System-main
Set up and activate a local backend isolation environment layer:

Bash
python -m venv venv
venv\Scripts\activate
Install the required deep learning calculation modules and routing frameworks:

Bash
pip install flask tensorflow keras numpy pillow
⚠️ CRITICAL NOTE: Due to GitHub's strict 100MB single-file size restriction, the pre-trained 203.25 MB neural network weights matrix file (plant_disease_recognize_model_pwp.keras) was excluded from this remote repository upload. Before running the script, ensure you manually copy your local model weights file back into the /models directory on your computer.

Execute the background micro-framework routing API listener:

Bash
python app.py
