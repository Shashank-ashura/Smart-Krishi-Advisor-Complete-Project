from flask import Flask, render_template, request, redirect, send_from_directory, url_for
import numpy as np
import json
import uuid
import tensorflow as tf

app = Flask(__name__)
model = tf.keras.models.load_model("models/plant_disease_recognize_model_pwp.keras")

# Alphabetic classification output dictionary indexes
label = [
 'Apple___Apple_scab',
 'Apple___Black_rot',
 'Apple___Cedar_apple_rust',
 'Apple___healthy',
 'Background_without_leaves',
 'Blueberry___healthy',
 'Cherry___Powdery_mildew',
 'Cherry___healthy',
 'Corn___Cercospora_leaf_spot Gray_leaf_spot',
 'Corn___Common_rust',
 'Corn___Northern_Leaf_Blight',
 'Corn___healthy',
 'Grape___Black_rot',
 'Grape___Esca_(Black_Measles)',
 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
 'Grape___healthy',
 'Orange___Haunglongbing_(Citrus_greening)',
 'Peach___Bacterial_spot',
 'Peach___healthy',
 'Pepper,_bell___Bacterial_spot',
 'Pepper,_bell___healthy',
 'Potato___Early_blight',
 'Potato___Late_blight',
 'Potato___healthy',
 'Raspberry___healthy',
 'Soybean___healthy',
 'Squash___Powdery_mildew',
 'Strawberry___Leaf_scorch',
 'Strawberry___healthy',
 'Tomato___Bacterial_spot',
 'Tomato___Early_blight',
 'Tomato___Late_blight',
 'Tomato___Leaf_Mold',
 'Tomato___Septoria_leaf_spot',
 'Tomato___Spider_mites Two-spotted_spider_mite',
 'Tomato___Target_Spot',
 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
 'Tomato___Tomato_mosaic_virus',
 'Tomato___healthy'
]

# Load structural JSON data dictionary parameters
with open("plant_disease.json", 'r') as file:
    plant_disease = json.load(file)

@app.route('/uploadimages/<path:filename>')
def uploaded_images(filename):
    return send_from_directory('./uploadimages', filename)

@app.route('/', methods=['GET'])
def home():
    return render_template('home.html')

def extract_features(image):
    image = tf.keras.utils.load_img(image, target_size=(160, 160))
    feature = tf.keras.utils.img_to_array(image)
    feature = np.array([feature])
    return feature

def model_predict(image):
    img = extract_features(image)
    prediction = model.predict(img)
    
    # 1. Grab the highest value index coordinate positional score
    predicted_index = int(prediction.argmax())
    
    # 2. Extract the exact matching text name label string from your array map
    predicted_string_name = label[predicted_index]
    print(f"DEBUG - Predicted Class Label Name: {predicted_string_name}")

    # 3. FIX: Safely extract information by checking if your json is structured as a dictionary or a direct list lookup match
    try:
        if isinstance(plant_disease, dict):
            # If your json handles name keys directly: {"Tomato___Early_blight": {"name": "...", "cause": "..."}}
            prediction_label = plant_disease[predicted_string_name]
        else:
            # If your json is an indexed list array of objects, find the element matching the name property
            prediction_label = next(item for item in plant_disease if item['name'] == predicted_string_name)
    except Exception as e:
        print(f"JSON Map Warning: {e}. Falling back to list placement matching.")
        # Backup fallback sequence indicator if structures are aligned 1:1
        prediction_label = plant_disease[predicted_index]
        
    return prediction_label

@app.route('/upload/', methods=['POST', 'GET'])
def uploadimage():
    if request.method == "POST":
        image = request.files['img']
        
        # Format clean filename paths to pass cleanly to home template render loops
        unique_id = uuid.uuid4().hex
        secure_filename = f"temp_{unique_id}_{image.filename}"
        save_path = f"uploadimages/{secure_filename}"
        
        image.save(save_path)
        print(f"Uploaded successfully to: {save_path}")
        
        # Run execution prediction evaluation
        prediction = model_predict(f'./{save_path}')
        
        return render_template('home.html', result=True, imagepath=f'/uploadimages/{secure_filename}', prediction=prediction)
    
    else:
        return redirect('/')

if __name__ == "__main__":
    app.run(debug=True, port=5001)